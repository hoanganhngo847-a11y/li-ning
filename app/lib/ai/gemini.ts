import { buildModelImagePrompt } from './prompt-builder';
import { getCachedImage, setCachedImage, getImageCacheKey } from './cache';
import type { GenerateModelImageInput, GenerateModelImageOutput } from './types';
import { getProviderApiKey } from '@/app/lib/api-keys/resolver';

/**
 * Safely resolves the Gemini API key from database or environment
 * Server-side only! Never exposed to client.
 */
export async function getGeminiApiKey(): Promise<string | null> {
  return getProviderApiKey('gemini');
}

/**
 * Generates an athletic model image matching body profile and selected products
 * using Google Gemini / Imagen Image Generation API.
 */
export async function generateBodyModelImage(
  input: GenerateModelImageInput
): Promise<GenerateModelImageOutput> {
  const startTime = Date.now();
  const apiKey = await getGeminiApiKey();

  // 1. Validate API Key existence
  if (!apiKey) {
    return {
      success: false,
      provider: 'gemini',
      error: 'GEMINI_API_KEY chưa được cấu hình. Vui lòng thêm GEMINI_API_KEY vào .env.local hoặc trang cài đặt quản trị.',
    };
  }

  // 2. Build prompt
  const prompt = buildModelImagePrompt(input);

  // 3. Check Cache
  const cacheKey = getImageCacheKey(input);
  if (input.useCache !== false) {
    const cached = getCachedImage(cacheKey);
    if (cached) {
      return {
        success: true,
        imageUrl: cached.imageUrl || `data:${cached.mimeType};base64,${cached.imageBase64}`,
        imageBase64: cached.imageBase64,
        mimeType: cached.mimeType,
        promptUsed: cached.promptUsed,
        cached: true,
        provider: 'gemini',
        metadata: {
          model: cached.metadata?.model || 'cached',
          latencyMs: Date.now() - startTime,
          aspectRatio: cached.metadata?.aspectRatio || '3:4',
        },
      };
    }
  }

  const modelName = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';

  try {
    // 4. API Request
    let base64Image: string | null = null;
    let mimeType = 'image/jpeg';

    if (modelName.startsWith('imagen')) {
      // Imagen endpoint: predict
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:predict?key=${apiKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: '3:4',
            outputMimeType: 'image/jpeg',
            personGeneration: 'ALLOW_ADULT',
          },
        }),
      });

      const data = (await response.json()) as any;

      if (!response.ok) {
        return handleGeminiApiError(response.status, data);
      }

      if (data.predictions && data.predictions[0]?.bytesBase64Encoded) {
        base64Image = data.predictions[0].bytesBase64Encoded;
        mimeType = data.predictions[0].mimeType || 'image/jpeg';
      }
    } else {
      // Gemini multimodal image generation endpoint: generateContent
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseModalities: ['IMAGE', 'TEXT'],
          },
        }),
      });

      const data = (await response.json()) as any;

      if (!response.ok) {
        return handleGeminiApiError(response.status, data);
      }

      // Extract image part from candidates
      const parts = data.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find((p: any) => p.inlineData && p.inlineData.data);

      if (imagePart) {
        base64Image = imagePart.inlineData.data;
        mimeType = imagePart.inlineData.mimeType || 'image/jpeg';
      }
    }

    if (!base64Image) {
      return {
        success: false,
        provider: 'gemini',
        promptUsed: prompt,
        error: 'Google Gemini không trả về hình ảnh hợp lệ. Có thể do chính sách kiểm duyệt nội dung an toàn hoặc cấu hình mô hình.',
      };
    }

    const dataUri = `data:${mimeType};base64,${base64Image}`;

    // 5. Store in cache
    setCachedImage(cacheKey, {
      imageUrl: dataUri,
      imageBase64: base64Image,
      mimeType,
      promptUsed: prompt,
      createdAt: new Date().toISOString(),
      metadata: {
        model: modelName,
        aspectRatio: '3:4',
        gender: input.gender,
      },
    });

    return {
      success: true,
      imageUrl: dataUri,
      imageBase64: base64Image,
      mimeType,
      promptUsed: prompt,
      cached: false,
      provider: 'gemini',
      metadata: {
        model: modelName,
        latencyMs: Date.now() - startTime,
        aspectRatio: '3:4',
      },
    };
  } catch (err: any) {
    console.error('Gemini image generation exception:', err);
    return {
      success: false,
      provider: 'gemini',
      promptUsed: prompt,
      error: err.message || 'Không thể kết nối đến máy chủ Google Gemini API.',
    };
  }
}

/**
 * Normalizes and localizes Gemini API error responses
 */
function handleGeminiApiError(status: number, data: any): GenerateModelImageOutput {
  const errMsg = data?.error?.message || '';

  if (status === 429 || errMsg.includes('quota') || errMsg.includes('RATE_LIMIT')) {
    return {
      success: false,
      provider: 'gemini',
      error: 'Hệ thống Google Gemini đang bận hoặc tài khoản đạt giới hạn lưu lượng (Quota Exceeded). Vui lòng thử lại sau.',
    };
  }

  if (status === 401 || status === 403 || errMsg.includes('API_KEY_INVALID')) {
    return {
      success: false,
      provider: 'gemini',
      error: 'Khóa GEMINI_API_KEY không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại cấu hình.',
    };
  }

  return {
    success: false,
    provider: 'gemini',
    error: errMsg || `Google Gemini API trả về lỗi HTTP ${status}.`,
  };
}
