import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { AvatarGenerationParams, computeBodyMetrics } from '../fitroom/avatar-generator';
import { SKIN_TONE_CONFIGS } from '../fitroom/color-advisor';
import { getProviderApiKey, getCloudflareAccountId } from '../api-keys/resolver';

export interface CloudflareAiImageResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
  provider?: string;
}

/**
 * Builds an anatomical photorealistic prompt matching Li-Ning studio aesthetic
 * strictly calibrated to the user's exact height, weight, 3 measurements (V1, V2, V3), and skin tone.
 */
export function buildLiNingModelPrompt(params: AvatarGenerationParams): string {
  const { gender, height, weight, bust, waist, hips, skinTone } = params;
  const isFemale = gender === 'nu';
  const age = isFemale ? '24-year-old' : '26-year-old';
  const genderDesc = isFemale ? 'Vietnamese woman' : 'Vietnamese athletic man';

  const hMeters = height / 100;
  const bmi = Number((weight / (hMeters * hMeters)).toFixed(1));
  const bwr = Number((bust / (waist || 1)).toFixed(2));
  const hwr = Number((hips / (waist || 1)).toFixed(2));
  const drop = bust - waist;

  let bodyDesc = '';
  if (isFemale) {
    // 1. Overall Body Volume & Weight Impression
    let weightDesc = '';
    if (bmi >= 28.0) {
      weightDesc = `visibly plus-size sturdy full-figured heavy build, soft rounded silhouette, thick sturdy frame, solid ${weight}kg weight on a ${height}cm frame, thick arms and legs, absolutely not skinny, not thin`;
    } else if (bmi >= 25.0) {
      weightDesc = `visibly voluptuous curvy full-figured build, noticeably thick and curvy body, thick thighs, full curves, solid ${weight}kg weight on a ${height}cm frame, absolutely not skinny, not lean`;
    } else if (bmi >= 22.0) {
      weightDesc = `shapely feminine athletic build, toned healthy volume, ${weight}kg weight on a ${height}cm frame`;
    } else if (bmi < 18.5) {
      weightDesc = `very slim skinny petite delicate build, slender thin frame, lean thin limbs, ${weight}kg weight on a ${height}cm frame`;
    } else {
      weightDesc = `balanced standard healthy athletic build, ${weight}kg weight on a ${height}cm frame`;
    }

    // 2. Bust (V1)
    let bustDesc = '';
    if (bwr >= 1.30 || bust >= 94) {
      bustDesc = `very large full prominent bust (D-cup), pronounced feminine chest volume`;
    } else if (bwr >= 1.20 || bust >= 88) {
      bustDesc = `full well-developed feminine bust, distinct feminine bustline`;
    } else if (bust <= 80 || bwr <= 1.10) {
      bustDesc = `modest petite bust, flatter chest`;
    } else {
      bustDesc = `natural proportional feminine bust`;
    }

    // 3. Waist (V2)
    let waistDesc = '';
    if (waist >= 85) {
      waistDesc = `thick broad midsection, soft fuller waist, visible belly fullness`;
    } else if (waist >= 75) {
      waistDesc = `solid natural midsection, gentle waist curve`;
    } else if (drop >= 20 || bwr >= 1.25) {
      waistDesc = `visibly cinched narrow wasp waist, dramatically tapered hourglass midsection`;
    } else {
      waistDesc = `trim toned flat midsection, smooth natural waistline`;
    }

    // 4. Hips (V3)
    let hipsDesc = '';
    if (hwr >= 1.45 || hips >= 100) {
      hipsDesc = `exceptionally wide voluptuous hips, heavy prominent glutes, very full thick rounded thighs`;
    } else if (hwr >= 1.35 || hips >= 94) {
      hipsDesc = `wide shapely curvy hips, pronounced feminine curves, full rounded thighs`;
    } else if (hips <= 84) {
      hipsDesc = `narrow lean hips, slender thighs, straight silhouette`;
    } else {
      hipsDesc = `balanced proportional athletic hips, toned thighs`;
    }

    bodyDesc = `${weightDesc}. Torso: ${bustDesc}, with ${waistDesc}. Lower body: ${hipsDesc}.`;
  } else {
    // MALE BODY DESCRIPTION
    let weightDesc = '';
    if (bmi >= 28.0) {
      weightDesc = `heavyset bulky powerhouse frame, solid ${weight}kg weight on a ${height}cm frame, thick torso, heavy arms`;
    } else if (bmi >= 25.0) {
      weightDesc = `broad athletic muscular build, solid athletic ${weight}kg frame`;
    } else if (bmi < 19.0) {
      weightDesc = `lean wiry runner build, slender ${weight}kg frame`;
    } else {
      weightDesc = `athletic sports build, well-proportioned ${weight}kg frame`;
    }

    let chestDesc = bust >= 102 ? `broad muscular chest, prominent pectorals` : `firm athletic chest`;
    let waistDesc = waist >= 86 ? `sturdy solid waistline` : `flat tight athletic abdomen, V-taper`;
    let hipsDesc = hips >= 98 ? `powerful athletic glutes and quads` : `lean athletic legs`;

    bodyDesc = `${weightDesc}. Upper body: ${chestDesc}, ${waistDesc}. Lower body: ${hipsDesc}.`;
  }

  // Skin tone (English descriptions)
  let skinDesc = 'warm Asian golden skin';
  if (skinTone === 'fair') skinDesc = 'fair luminous porcelain Asian skin';
  else if (skinTone === 'tan') skinDesc = 'sun-kissed golden bronze tan skin';
  else if (skinTone === 'deep') skinDesc = 'deep rich bronze skin';

  const outfitDesc = isFemale
    ? 'wearing minimal premium black microfiber sports bra and high-waisted black athletic shorts'
    : 'wearing minimal premium black microfiber athletic tank top and black compression shorts';

  const poseDesc =
    'standing straight upright facing directly at camera, full body from head to toe in frame, arms held straight down slightly away from torso with clear visible space between arms and waist, hands relaxed beside thighs, feet planted shoulder-width apart on a glowing red circular neon ring on reflective dark studio floor';

  const studioDesc =
    'dark futuristic sports science studio with subtle red and cyan ambient rim lighting, 8k resolution, photorealistic, sharp focus, clean symmetrical composition';

  return `Full-length studio photograph of a ${age} ${genderDesc}. ${bodyDesc} Complexion is ${skinDesc}. Posing: ${poseDesc}. Outfit: ${outfitDesc}. Environment: ${studioDesc}.`;
}

/**
 * Generates an image using Cloudflare Workers AI
 */
export async function generateAvatarWithCloudflareAI(
  params: AvatarGenerationParams,
  forceRegenerate: boolean = false
): Promise<CloudflareAiImageResult> {
  const token = await getProviderApiKey('cloudflare');
  const accountId = (await getCloudflareAccountId()) || process.env.CLOUDFLARE_ACCOUNT_ID;
  const model = process.env.CLOUDFLARE_AI_MODEL || '@cf/black-forest-labs/flux-1-schnell';

  if (!token || !accountId) {
    return { success: false, error: 'CLOUDFLARE_CONFIG_MISSING' };
  }

  const hashKey = `cf_v3_${params.gender}_${params.height}_${params.weight}_${params.bust}_${params.waist}_${params.hips}_${params.skinTone}`;
  const avatarHash = crypto.createHash('sha256').update(hashKey).digest('hex').slice(0, 16);
  const outputFileName = `avatar_cf_${params.gender}_${avatarHash}.jpg`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const filePath = path.join(uploadDir, outputFileName);

  // Return cached file if it already exists and not force-regenerating
  if (!forceRegenerate && fs.existsSync(filePath)) {
    return {
      success: true,
      imageUrl: `/uploads/avatars/${outputFileName}?v=${avatarHash}`,
      provider: 'cloudflare_workers_ai',
    };
  }

  const prompt = buildLiNingModelPrompt(params);
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId.trim()}/ai/run/${model.trim()}`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { success: false, error: `Cloudflare AI HTTP ${res.status}: ${errorText}` };
    }

    const contentType = res.headers.get('content-type') || '';
    let imageBuffer: Buffer;

    if (contentType.includes('application/json')) {
      const data = (await res.json()) as any;
      if (!data.success && data.errors?.length) {
        return { success: false, error: data.errors[0]?.message || 'Lỗi xử lý Cloudflare AI' };
      }
      const base64Str = data.result?.image || data.result;
      if (!base64Str) {
        return { success: false, error: 'Không nhận được dữ liệu ảnh từ Cloudflare AI' };
      }
      imageBuffer = Buffer.from(base64Str, 'base64');
    } else {
      const arrayBuffer = await res.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    }

    await sharp(imageBuffer)
      .resize(896, 1200, { fit: 'cover' })
      .jpeg({ quality: 92 })
      .toFile(filePath);

    return {
      success: true,
      imageUrl: `/uploads/avatars/${outputFileName}?v=${avatarHash}`,
      provider: 'cloudflare_workers_ai',
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi kết nối Cloudflare Workers AI' };
  }
}
