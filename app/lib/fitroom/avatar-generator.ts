import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { SkinToneId, SKIN_TONE_CONFIGS } from './color-advisor';
import { generateAvatarWithCloudflareAI } from '../cloudflare-ai/client';
import { generateAvatarWithAlibabaAI } from '../alibaba-ai/client';
import { generateBodyModelImage, getGeminiApiKey } from '../ai/gemini';

export interface AvatarGenerationParams {
  gender: 'nam' | 'nu';
  height: number;
  weight: number;
  bust: number;
  waist: number;
  hips: number;
  skinTone: SkinToneId;
}

export interface GeneratedAvatarResult {
  avatarUrl: string;
  avatarHash: string;
  bmi: number;
  bmiCategory: string;
  bodyShape: string;
  skinToneName: string;
  templateFileName: string;
  width: number;
  height: number;
  whr: number;
  bwr: number;
  hbr: number;
}

export function computeBodyMetrics(params: AvatarGenerationParams) {
  const { gender, height, weight, bust, waist, hips, skinTone } = params;
  const hMeters = height / 100;
  const bmi = Number((weight / (hMeters * hMeters)).toFixed(1));

  let bmiCategory = 'Cân đối thể thao';
  if (bmi < 18.5) bmiCategory = 'Mảnh mai / Thon gọn';
  else if (bmi < 23) bmiCategory = 'Cân đối chuẩn vận động viên';
  else if (bmi < 26) bmiCategory = 'Cơ bắp nở nang / Đô thể thao';
  else bmiCategory = 'Đậm người / Vóc dáng lớn';

  const whr = Number((waist / (hips || 1)).toFixed(2));
  const bwr = Number((bust / (waist || 1)).toFixed(2));
  const hbr = Number(((hips || 1) / (bust || 1)).toFixed(2));

  let bodyShape = 'Vóc dáng thể thao chuẩn';
  let templateFileName = '';

  if (gender === 'nu') {
    if (bmi >= 27.5 || (bmi >= 25.5 && whr > 0.82)) {
      templateFileName = 'female-full-curve.jpg';
      bodyShape = 'Dáng Đầy Đặn (Full Curve)';
    } else if (bmi < 18.5) {
      templateFileName = 'female-petite-slim.jpg';
      bodyShape = 'Dáng Mảnh Mai / Nhỏ Nhắn (Petite Slim)';
    } else if (hbr >= 1.10 && whr <= 0.82) {
      templateFileName = 'female-pear-shape.jpg';
      bodyShape = 'Dáng Quả Lê (Pear Shape)';
    } else if (bust / (hips || 1) >= 1.08) {
      templateFileName = 'female-inverted-triangle.jpg';
      bodyShape = 'Dáng Tam Giác Ngược (Inverted Triangle)';
    } else if (bwr >= 1.20 && whr <= 0.80) {
      if (bmi >= 23.0 || weight >= 62 || bust >= 92) {
        templateFileName = 'female-hourglass-curvy.jpg';
        bodyShape = 'Dáng Đồng Hồ Cát Đầy Đặn (Curvy Hourglass)';
      } else {
        templateFileName = 'female-hourglass-fit.jpg';
        bodyShape = 'Dáng Đồng Hồ Cát Cân Đối (Fit Hourglass)';
      }
    } else {
      templateFileName = 'female-athletic-rectangle.jpg';
      bodyShape = 'Dáng Thước Kẻ Thể Thao (Athletic Rectangle)';
    }
  } else {
    if (bmi >= 26.0 || weight >= 80) {
      templateFileName = 'male-solid-heavy.jpg';
      bodyShape = 'Dáng Đô Con / Vạm Vỡ (Solid Heavy)';
    } else if (bmi < 19.5) {
      templateFileName = 'male-slim-lean.jpg';
      bodyShape = 'Dáng Mảnh Mai / Thon Gọn (Slim Lean)';
    } else if (bust / (waist || 1) >= 1.16) {
      templateFileName = 'male-v-taper.jpg';
      bodyShape = 'Dáng Chữ V Cơ Bắp (V-Taper Athletic)';
    } else {
      templateFileName = 'male-lean-athletic.jpg';
      bodyShape = 'Dáng Cân Đối Thể Thao (Lean Athletic)';
    }
  }

  const skinConfig = SKIN_TONE_CONFIGS[skinTone] || SKIN_TONE_CONFIGS.medium_asian;

  return {
    bmi,
    bmiCategory,
    bodyShape,
    templateFileName,
    whr,
    bwr,
    hbr,
    skinToneName: skinConfig.vietnameseName,
  };
}

/**
 * Generates or retrieves a calibrated avatar image tailored to the user's exact measurements and skin tone.
 */
export async function generateCustomAvatar(
  params: AvatarGenerationParams,
  forceRegenerate: boolean = false
): Promise<GeneratedAvatarResult> {
  const { gender, height, weight, bust, waist, hips, skinTone } = params;
  const metrics = computeBodyMetrics(params);

  // Compute unique hash for this combination (v3 prefix for calibrated prompt)
  const hashKey = `v3_${gender}_${height}_${weight}_${bust}_${waist}_${hips}_${skinTone}`;
  const avatarHash = crypto.createHash('sha256').update(hashKey).digest('hex').slice(0, 16);

  const publicUploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
  if (!fs.existsSync(publicUploadDir)) {
    fs.mkdirSync(publicUploadDir, { recursive: true });
  }

  const outputFileName = `avatar_${gender}_${avatarHash}.jpg`;
  const outputFilePath = path.join(publicUploadDir, outputFileName);
  const relativeAvatarUrl = `/uploads/avatars/${outputFileName}`;

  // 1. Attempt Google Gemini / Imagen Generation if configured
  if (await getGeminiApiKey()) {
    try {
      const geminiResult = await generateBodyModelImage({
        gender: params.gender,
        heightCm: params.height,
        weightKg: params.weight,
        bustCm: params.bust,
        waistCm: params.waist,
        hipsCm: params.hips,
        skinTone: params.skinTone,
        bodyType: metrics.bodyShape,
        useCache: !forceRegenerate,
      });

      if (geminiResult.success && geminiResult.imageUrl) {
        let finalImageUrl = geminiResult.imageUrl;
        if (geminiResult.imageBase64) {
          try {
            fs.writeFileSync(outputFilePath, Buffer.from(geminiResult.imageBase64, 'base64'));
            finalImageUrl = relativeAvatarUrl;
          } catch {}
        }
        return {
          avatarUrl: finalImageUrl,
          avatarHash,
          bmi: metrics.bmi,
          bmiCategory: metrics.bmiCategory,
          bodyShape: metrics.bodyShape,
          skinToneName: metrics.skinToneName,
          templateFileName: `google_gemini_${geminiResult.metadata?.model || 'image'}`,
          width: 896,
          height: 1200,
          whr: metrics.whr,
          bwr: metrics.bwr,
          hbr: metrics.hbr,
        };
      }
    } catch (geminiErr) {
      console.warn('Google Gemini avatar generation skipped/failed, trying next generator:', geminiErr);
    }
  }

  // 2. Attempt Alibaba Cloud Model Studio (Qwen-Image-Max) if configured
  try {
    const aliResult = await generateAvatarWithAlibabaAI(params, forceRegenerate);
    if (aliResult.success && aliResult.imageUrl) {
      return {
        avatarUrl: aliResult.imageUrl,
        avatarHash,
        bmi: metrics.bmi,
        bmiCategory: metrics.bmiCategory,
        bodyShape: metrics.bodyShape,
        skinToneName: metrics.skinToneName,
        templateFileName: 'alibaba_cloud_model_studio',
        width: 896,
        height: 1200,
        whr: metrics.whr,
        bwr: metrics.bwr,
        hbr: metrics.hbr,
      };
    }
  } catch (aliErr) {
    console.warn('Alibaba Cloud Model Studio generation skipped/failed, trying next generator:', aliErr);
  }

  // 2. Attempt Cloudflare Workers AI Generation if credentials configured
  try {
    const cfResult = await generateAvatarWithCloudflareAI(params, forceRegenerate);
    if (cfResult.success && cfResult.imageUrl) {
      return {
        avatarUrl: cfResult.imageUrl,
        avatarHash,
        bmi: metrics.bmi,
        bmiCategory: metrics.bmiCategory,
        bodyShape: metrics.bodyShape,
        skinToneName: metrics.skinToneName,
        templateFileName: 'cloudflare_workers_ai',
        width: 896,
        height: 1200,
        whr: metrics.whr,
        bwr: metrics.bwr,
        hbr: metrics.hbr,
      };
    }
  } catch (cfErr) {
    console.warn('Cloudflare Workers AI generation skipped/failed, falling back to calibrated template:', cfErr);
  }

  // 2. Return cached template file if it already exists and not force-regenerating
  if (!forceRegenerate && fs.existsSync(outputFilePath)) {
    return {
      avatarUrl: relativeAvatarUrl,
      avatarHash,
      bmi: metrics.bmi,
      bmiCategory: metrics.bmiCategory,
      bodyShape: metrics.bodyShape,
      skinToneName: metrics.skinToneName,
      templateFileName: metrics.templateFileName,
      width: 896,
      height: 1200,
      whr: metrics.whr,
      bwr: metrics.bwr,
      hbr: metrics.hbr,
    };
  }

  // 2. Load dedicated template according to exact body shape (Zero-latency CDN fallback)
  const cdnTemplateUrl = `/images/body-shapes/${metrics.templateFileName.replace('.jpg', '.png')}`;

  try {
    let baseImagePath = path.join(
      process.cwd(),
      'public',
      'images',
      'body-shapes',
      metrics.templateFileName
    );

    if (!fs.existsSync(baseImagePath)) {
      baseImagePath = path.join(
        process.cwd(),
        'public',
        'images',
        gender === 'nu' ? 'female-athlete-3d-preview.jpg' : 'athlete-3d-preview.jpg'
      );
    }

    if (fs.existsSync(baseImagePath)) {
      const targetW = 896;
      const targetH = 1200;
      let pipeline = sharp(baseImagePath).resize(targetW, targetH, { fit: 'cover' });

      if (skinTone === 'fair') {
        pipeline = pipeline.modulate({ brightness: 1.05, saturation: 0.98, hue: -2 });
      } else if (skinTone === 'medium_asian') {
        pipeline = pipeline.modulate({ brightness: 1.0, saturation: 1.02, hue: 0 });
      } else if (skinTone === 'tan') {
        pipeline = pipeline.modulate({ brightness: 0.93, saturation: 1.14, hue: -5 });
      } else if (skinTone === 'deep') {
        pipeline = pipeline.modulate({ brightness: 0.84, saturation: 1.10, hue: -8 });
      }

      await pipeline.jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toFile(outputFilePath);

      return {
        avatarUrl: relativeAvatarUrl,
        avatarHash,
        bmi: metrics.bmi,
        bmiCategory: metrics.bmiCategory,
        bodyShape: metrics.bodyShape,
        skinToneName: metrics.skinToneName,
        templateFileName: metrics.templateFileName,
        width: targetW,
        height: targetH,
        whr: metrics.whr,
        bwr: metrics.bwr,
        hbr: metrics.hbr,
      };
    }
  } catch (fsErr: any) {
    console.warn('[AvatarGenerator] Local sharp processing skipped, serving CDN template:', fsErr.message);
  }

  // Graceful zero-latency fallback for Vercel Serverless CDN
  return {
    avatarUrl: cdnTemplateUrl,
    avatarHash,
    bmi: metrics.bmi,
    bmiCategory: metrics.bmiCategory,
    bodyShape: metrics.bodyShape,
    skinToneName: metrics.skinToneName,
    templateFileName: metrics.templateFileName,
    width: 896,
    height: 1200,
    whr: metrics.whr,
    bwr: metrics.bwr,
    hbr: metrics.hbr,
  };
}
