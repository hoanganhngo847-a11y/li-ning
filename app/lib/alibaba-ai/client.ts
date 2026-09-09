import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { AvatarGenerationParams } from '../fitroom/avatar-generator';
import { buildLiNingModelPrompt } from '../cloudflare-ai/client';
import { getProviderApiKey } from '../api-keys/resolver';

export interface AlibabaAiImageResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
  provider?: string;
}

export const DEFAULT_ALIBABA_ENDPOINT =
  'https://ws-6s5co6pbqw3f1aoe.ap-southeast-1.maas.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';

/**
 * Generates an avatar image using Alibaba Cloud Model Studio (Qwen-Image-Max)
 */
export async function generateAvatarWithAlibabaAI(
  params: AvatarGenerationParams,
  forceRegenerate: boolean = false
): Promise<AlibabaAiImageResult> {
  const apiKey = await getProviderApiKey('alibaba');
  const endpoint = process.env.ALIBABA_ENDPOINT || DEFAULT_ALIBABA_ENDPOINT;
  const model = process.env.ALIBABA_MODEL || 'qwen-image-max';

  if (!apiKey) {
    return { success: false, error: 'ALIBABA_API_KEY_MISSING' };
  }

  const hashKey = `ali_v1_${params.gender}_${params.height}_${params.weight}_${params.bust}_${params.waist}_${params.hips}_${params.skinTone}`;
  const avatarHash = crypto.createHash('sha256').update(hashKey).digest('hex').slice(0, 16);
  const outputFileName = `avatar_ali_${params.gender}_${avatarHash}.jpg`;
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
      provider: 'alibaba_cloud_model_studio',
    };
  }

  const prompt = buildLiNingModelPrompt(params);

  try {
    const res = await fetch(endpoint.trim(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model.trim(),
        input: {
          messages: [
            {
              role: 'user',
              content: [{ text: prompt }],
            },
          ],
        },
        parameters: {
          size: '1024*1024',
        },
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { success: false, error: `Alibaba Cloud HTTP ${res.status}: ${errorText}` };
    }

    const data = (await res.json()) as any;
    const remoteImageUrl = data.output?.choices?.[0]?.message?.content?.[0]?.image;

    if (!remoteImageUrl) {
      return {
        success: false,
        error: data.message || data.code || 'Không nhận được ảnh từ Alibaba Cloud Model Studio',
      };
    }

    // Download generated image and resize to 896x1200 JPEG
    const imgRes = await fetch(remoteImageUrl);
    if (!imgRes.ok) {
      return { success: false, error: `Không thể tải ảnh từ Alibaba Cloud: HTTP ${imgRes.status}` };
    }

    const arrayBuffer = await imgRes.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    await sharp(imageBuffer)
      .resize(896, 1200, { fit: 'cover' })
      .jpeg({ quality: 92 })
      .toFile(filePath);

    return {
      success: true,
      imageUrl: `/uploads/avatars/${outputFileName}?v=${avatarHash}`,
      provider: 'alibaba_cloud_model_studio',
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi kết nối Alibaba Cloud Model Studio' };
  }
}
