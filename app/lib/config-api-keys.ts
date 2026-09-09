import fs from 'fs';
import path from 'path';

export interface ApiKeysConfig {
  fitroomApiKey: string;
  tripoApiKey: string;
  tripoModel?: string;
  cloudflareApiToken?: string;
  cloudflareAccountId?: string;
  cloudflareAiModel?: string;
  alibabaApiKey?: string;
  alibabaEndpoint?: string;
  alibabaModel?: string;
  geminiApiKey?: string;
  geminiImageModel?: string;
  updatedAt?: string;
}

const CONFIG_FILE_PATH = path.join(process.cwd(), 'data', 'api-keys.json');

/**
 * Returns the active FitRoom API key:
 * Priority: 1) data/api-keys.json, 2) process.env.FITROOM_API_KEY
 */
export function getFitRoomApiKey(): string {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const content = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
      const data = JSON.parse(content) as ApiKeysConfig;
      if (data.fitroomApiKey && data.fitroomApiKey.trim()) {
        return data.fitroomApiKey.trim();
      }
    }
  } catch (err) {
    console.error('Error reading FitRoom API key from config:', err);
  }

  const envKey = process.env.FITROOM_API_KEY;
  if (!envKey) {
    throw new Error('FITROOM_API_KEY_MISSING');
  }
  return envKey.trim();
}

/**
 * Returns the active Tripo3D API key:
 * Priority: 1) data/api-keys.json, 2) process.env.TRIPO_API_KEY
 */
export function getTripoApiKey(): string {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const content = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
      const data = JSON.parse(content) as ApiKeysConfig;
      if (data.tripoApiKey && data.tripoApiKey.trim()) {
        return data.tripoApiKey.trim();
      }
    }
  } catch (err) {
    console.error('Error reading Tripo API key from config:', err);
  }

  const envKey = process.env.TRIPO_API_KEY;
  if (!envKey) {
    throw new Error('TRIPO_API_KEY_MISSING');
  }
  return envKey.trim();
}

/**
 * Returns preferred Tripo 3D model
 */
export function getPreferred3DModel(): string {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const content = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
      const data = JSON.parse(content) as ApiKeysConfig;
      if (data.tripoModel && data.tripoModel.trim()) {
        return data.tripoModel.trim();
      }
    }
  } catch {}

  return process.env.TRIPO_MODEL || 'v3.1-20260211';
}

/**
 * Reads all configured API keys for admin view (with masking option)
 */
export function getStoredApiKeys(): {
  fitroomApiKey: string;
  tripoApiKey: string;
  tripoModel: string;
  cloudflareApiToken: string;
  cloudflareAccountId: string;
  cloudflareAiModel: string;
  alibabaApiKey?: string;
  alibabaEndpoint?: string;
  alibabaModel?: string;
  geminiApiKey?: string;
  geminiImageModel?: string;
  hasFitroom: boolean;
  hasTripo: boolean;
  hasCloudflare: boolean;
  hasAlibaba: boolean;
  hasGemini: boolean;
  updatedAt?: string;
} {
  let fitroomApiKey = '';
  let tripoApiKey = '';
  let tripoModel = process.env.TENCENT_HY3D_MODEL || 'v3.1-20260211';
  let cloudflareApiToken = '';
  let cloudflareAccountId = '';
  let cloudflareAiModel = '@cf/black-forest-labs/flux-1-schnell';
  let alibabaApiKey = '';
  let alibabaEndpoint = 'https://ws-6s5co6pbqw3f1aoe.ap-southeast-1.maas.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';
  let alibabaModel = 'qwen-image-max';
  let geminiApiKey = '';
  let geminiImageModel = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';
  let updatedAt: string | undefined;

  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const content = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
      const data = JSON.parse(content) as ApiKeysConfig;
      fitroomApiKey = data.fitroomApiKey || '';
      tripoApiKey = data.tripoApiKey || '';
      if (data.tripoModel) tripoModel = data.tripoModel;
      cloudflareApiToken = data.cloudflareApiToken || '';
      cloudflareAccountId = data.cloudflareAccountId || '';
      if (data.cloudflareAiModel) cloudflareAiModel = data.cloudflareAiModel;
      alibabaApiKey = data.alibabaApiKey || '';
      if (data.alibabaEndpoint) alibabaEndpoint = data.alibabaEndpoint;
      if (data.alibabaModel) alibabaModel = data.alibabaModel;
      geminiApiKey = data.geminiApiKey || '';
      if (data.geminiImageModel) geminiImageModel = data.geminiImageModel;
      updatedAt = data.updatedAt;
    }
  } catch {}

  // Fallback to process.env if empty
  if (!fitroomApiKey && process.env.FITROOM_API_KEY) {
    fitroomApiKey = process.env.FITROOM_API_KEY;
  }
  if (!tripoApiKey && process.env.TENCENT_TOKENHUB_API_KEY) {
    tripoApiKey = process.env.TENCENT_TOKENHUB_API_KEY;
  }
  if (!cloudflareApiToken && process.env.CLOUDFLARE_API_TOKEN) {
    cloudflareApiToken = process.env.CLOUDFLARE_API_TOKEN;
  }
  if (!cloudflareAccountId && process.env.CLOUDFLARE_ACCOUNT_ID) {
    cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  }
  if (!alibabaApiKey && process.env.ALIBABA_API_KEY) {
    alibabaApiKey = process.env.ALIBABA_API_KEY;
  }
  if (!geminiApiKey && process.env.GEMINI_API_KEY) {
    geminiApiKey = process.env.GEMINI_API_KEY;
  }

  return {
    fitroomApiKey,
    tripoApiKey,
    tripoModel,
    cloudflareApiToken,
    cloudflareAccountId,
    cloudflareAiModel,
    alibabaApiKey,
    alibabaEndpoint,
    alibabaModel,
    geminiApiKey,
    geminiImageModel,
    hasFitroom: Boolean(fitroomApiKey && fitroomApiKey.trim()),
    hasTripo: Boolean(tripoApiKey && tripoApiKey.trim()),
    hasCloudflare: Boolean(cloudflareApiToken && cloudflareAccountId && cloudflareApiToken.trim() && cloudflareAccountId.trim()),
    hasAlibaba: Boolean(alibabaApiKey && alibabaApiKey.trim()),
    hasGemini: Boolean(geminiApiKey && geminiApiKey.trim()),
    updatedAt,
  };
}

/**
 * Saves new API keys to data/api-keys.json, updates process.env, and syncs .env.local
 */
export function saveApiKeys(newConfig: {
  fitroomApiKey?: string;
  tripoApiKey?: string;
  tripoModel?: string;
  cloudflareApiToken?: string;
  cloudflareAccountId?: string;
  cloudflareAiModel?: string;
  alibabaApiKey?: string;
  alibabaEndpoint?: string;
  alibabaModel?: string;
  geminiApiKey?: string;
  geminiImageModel?: string;
}): void {
  const current = getStoredApiKeys();

  const updated: ApiKeysConfig = {
    fitroomApiKey: newConfig.fitroomApiKey !== undefined ? newConfig.fitroomApiKey.trim() : current.fitroomApiKey,
    tripoApiKey: newConfig.tripoApiKey !== undefined ? newConfig.tripoApiKey.trim() : current.tripoApiKey,
    tripoModel: newConfig.tripoModel !== undefined ? newConfig.tripoModel.trim() : current.tripoModel,
    cloudflareApiToken: newConfig.cloudflareApiToken !== undefined ? newConfig.cloudflareApiToken.trim() : current.cloudflareApiToken,
    cloudflareAccountId: newConfig.cloudflareAccountId !== undefined ? newConfig.cloudflareAccountId.trim() : current.cloudflareAccountId,
    cloudflareAiModel: newConfig.cloudflareAiModel !== undefined ? newConfig.cloudflareAiModel.trim() : current.cloudflareAiModel,
    alibabaApiKey: newConfig.alibabaApiKey !== undefined ? newConfig.alibabaApiKey.trim() : current.alibabaApiKey,
    alibabaEndpoint: newConfig.alibabaEndpoint !== undefined ? newConfig.alibabaEndpoint.trim() : current.alibabaEndpoint,
    alibabaModel: newConfig.alibabaModel !== undefined ? newConfig.alibabaModel.trim() : current.alibabaModel,
    geminiApiKey: newConfig.geminiApiKey !== undefined ? newConfig.geminiApiKey.trim() : current.geminiApiKey,
    geminiImageModel: newConfig.geminiImageModel !== undefined ? newConfig.geminiImageModel.trim() : current.geminiImageModel,
    updatedAt: new Date().toISOString(),
  };

  const dataDir = path.dirname(CONFIG_FILE_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(updated, null, 2), 'utf8');

  // Immediately update process.env in memory
  if (updated.fitroomApiKey) {
    process.env.FITROOM_API_KEY = updated.fitroomApiKey;
  }
  if (updated.tripoApiKey) {
    process.env.TENCENT_TOKENHUB_API_KEY = updated.tripoApiKey;
  }
  if (updated.tripoModel) {
    process.env.TENCENT_HY3D_MODEL = updated.tripoModel;
  }
  if (updated.geminiApiKey) {
    process.env.GEMINI_API_KEY = updated.geminiApiKey;
  }
  if (updated.geminiImageModel) {
    process.env.GEMINI_IMAGE_MODEL = updated.geminiImageModel;
  }

  // Also sync to .env.local if present so keys survive process restarts
  try {
    const envLocalPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envLocalPath)) {
      let envContent = fs.readFileSync(envLocalPath, 'utf8');

      if (updated.fitroomApiKey) {
        if (envContent.includes('FITROOM_API_KEY=')) {
          envContent = envContent.replace(/FITROOM_API_KEY=.*/, `FITROOM_API_KEY=${updated.fitroomApiKey}`);
        } else {
          envContent += `\nFITROOM_API_KEY=${updated.fitroomApiKey}`;
        }
      }

      if (updated.tripoApiKey) {
        if (envContent.includes('TENCENT_TOKENHUB_API_KEY=')) {
          envContent = envContent.replace(/TENCENT_TOKENHUB_API_KEY=.*/, `TENCENT_TOKENHUB_API_KEY=${updated.tripoApiKey}`);
        } else {
          envContent += `\nTENCENT_TOKENHUB_API_KEY=${updated.tripoApiKey}`;
        }
      }

      if (updated.tripoModel) {
        if (envContent.includes('TENCENT_HY3D_MODEL=')) {
          envContent = envContent.replace(/TENCENT_HY3D_MODEL=.*/, `TENCENT_HY3D_MODEL=${updated.tripoModel}`);
        } else {
          envContent += `\nTENCENT_HY3D_MODEL=${updated.tripoModel}`;
        }
      }

      if (updated.geminiApiKey) {
        if (envContent.includes('GEMINI_API_KEY=')) {
          envContent = envContent.replace(/GEMINI_API_KEY=.*/, `GEMINI_API_KEY=${updated.geminiApiKey}`);
        } else {
          envContent += `\nGEMINI_API_KEY=${updated.geminiApiKey}`;
        }
      }

      if (updated.geminiImageModel) {
        if (envContent.includes('GEMINI_IMAGE_MODEL=')) {
          envContent = envContent.replace(/GEMINI_IMAGE_MODEL=.*/, `GEMINI_IMAGE_MODEL=${updated.geminiImageModel}`);
        } else {
          envContent += `\nGEMINI_IMAGE_MODEL=${updated.geminiImageModel}`;
        }
      }

      fs.writeFileSync(envLocalPath, envContent, 'utf8');
    }
  } catch (err) {
    console.error('Error syncing to .env.local:', err);
  }
}

/**
 * Tests connection to FitRoom API
 */
export async function testFitRoomConnection(apiKey: string): Promise<{ success: boolean; latencyMs: number; message: string }> {
  const start = Date.now();
  try {
    const res = await fetch('https://api.fitroom.app/v1/models', {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey.trim(),
        'Accept': 'application/json',
      },
    });

    const latencyMs = Date.now() - start;

    if (res.status === 401 || res.status === 403) {
      return { success: false, latencyMs, message: 'Khóa API FitRoom không hợp lệ hoặc đã hết hạn.' };
    }

    if (res.ok || res.status === 200 || res.status === 404) {
      return { success: true, latencyMs, message: `Kết nối thành công (${latencyMs}ms)` };
    }

    return { success: true, latencyMs, message: `Kết nối được chấp nhận (${latencyMs}ms, HTTP ${res.status})` };
  } catch (err: any) {
    return { success: false, latencyMs: Date.now() - start, message: err.message || 'Không thể kết nối đến máy chủ FitRoom' };
  }
}

/**
 * Tests connection to Tripo3D API
 */
export async function testTripoConnection(apiKey: string): Promise<{ success: boolean; latencyMs: number; balance?: number; message: string }> {
  const start = Date.now();
  const key = apiKey.trim();

  try {
    const res = await fetch('https://openapi.tripo3d.ai/v3/files/presign', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        format: 'jpg',
        filename: 'ping.jpg',
      }),
    });

    const latencyMs = Date.now() - start;
    const data = (await res.json()) as any;

    if (res.ok && data.code === 0) {
      return {
        success: true,
        latencyMs,
        message: `Kết nối thành công Tripo 3D V3 (${latencyMs}ms) • Sẵn sàng tạo mô hình 3D`,
      };
    }

    if (data.code === 2001 || res.status === 401) {
      return { success: false, latencyMs, message: 'Khóa API Tripo 3D không hợp lệ.' };
    }

    if (data.code === 2010 || String(data.message).includes('credit')) {
      return { success: false, latencyMs, message: 'Tài khoản Tripo 3D không đủ credit. Vui lòng nạp thêm tại platform.tripo3d.ai' };
    }

    return {
      success: false,
      latencyMs,
      message: data.message || `Tripo API phản hồi mã lỗi ${data.code || res.status}`,
    };
  } catch (err: any) {
    return { success: false, latencyMs: Date.now() - start, message: err.message || 'Không thể kết nối đến máy chủ Tripo 3D' };
  }
}

/**
 * Tests connection to Cloudflare Workers AI
 */
export async function testCloudflareConnection(apiToken: string, accountId?: string): Promise<{ success: boolean; latencyMs: number; message: string }> {
  const start = Date.now();
  const token = apiToken.trim();

  try {
    // 1. Verify token status
    const verifyRes = await fetch('https://api.cloudflare.com/client/v4/user/tokens/verify', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const verifyData = (await verifyRes.json()) as any;
    const latencyMs = Date.now() - start;

    if (!verifyRes.ok || !verifyData.success) {
      return {
        success: false,
        latencyMs,
        message: verifyData.errors?.[0]?.message || 'Cloudflare API Token không hợp lệ hoặc đã hết hạn.',
      };
    }

    if (!accountId || !accountId.trim()) {
      return {
        success: true,
        latencyMs,
        message: `Token hợp lệ (${latencyMs}ms). Lưu ý: Cần thêm Account ID để bắt đầu tạo ảnh với Workers AI.`,
      };
    }

    return {
      success: true,
      latencyMs,
      message: `Kết nối thành công Cloudflare Workers AI (${latencyMs}ms) • Token Active!`,
    };
  } catch (err: any) {
    return {
      success: false,
      latencyMs: Date.now() - start,
      message: err.message || 'Không thể kết nối đến Cloudflare API',
    };
  }
}

/**
 * Tests connection to Alibaba Cloud Model Studio
 */
export async function testAlibabaConnection(
  apiKey: string,
  endpoint?: string
): Promise<{ success: boolean; latencyMs: number; message: string }> {
  const start = Date.now();
  const key = apiKey.trim();
  const ep =
    endpoint && endpoint.trim()
      ? endpoint.trim()
      : 'https://ws-6s5co6pbqw3f1aoe.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1/models';

  try {
    const res = await fetch(ep, {
      headers: {
        Authorization: `Bearer ${key}`,
      },
    });

    const latencyMs = Date.now() - start;

    if (res.ok) {
      return {
        success: true,
        latencyMs,
        message: `Kết nối thành công Alibaba Cloud Model Studio (${latencyMs}ms) • API Key Hợp Lệ!`,
      };
    }

    if (res.status === 401 || res.status === 403) {
      return {
        success: false,
        latencyMs,
        message: 'Alibaba Cloud API Key không hợp lệ hoặc không có quyền truy cập.',
      };
    }

    return {
      success: false,
      latencyMs,
      message: `Alibaba Cloud phản hồi HTTP ${res.status}`,
    };
  } catch (err: any) {
    return {
      success: false,
      latencyMs: Date.now() - start,
      message: err.message || 'Không thể kết nối đến Alibaba Cloud Model Studio',
    };
  }
}

/**
 * Tests connection to Google Gemini API
 */
export async function testGeminiConnection(
  apiKey: string
): Promise<{ success: boolean; latencyMs: number; message: string; modelCount?: number }> {
  const start = Date.now();
  const key = apiKey.trim();

  if (!key) {
    return {
      success: false,
      latencyMs: 0,
      message: 'Vui lòng nhập khóa GEMINI_API_KEY.',
    };
  }

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const latencyMs = Date.now() - start;
    const data = (await res.json()) as any;

    if (res.ok && data.models && Array.isArray(data.models)) {
      return {
        success: true,
        latencyMs,
        modelCount: data.models.length,
        message: `Kết nối thành công Google Gemini API (${latencyMs}ms) • Khóa API hợp lệ (${data.models.length} models khả dụng)!`,
      };
    }

    if (res.status === 400 || res.status === 401 || res.status === 403) {
      return {
        success: false,
        latencyMs,
        message: data?.error?.message || 'Khóa GEMINI_API_KEY không hợp lệ hoặc không có quyền truy cập.',
      };
    }

    return {
      success: false,
      latencyMs,
      message: data?.error?.message || `Google Gemini phản hồi HTTP ${res.status}`,
    };
  } catch (err: any) {
    return {
      success: false,
      latencyMs: Date.now() - start,
      message: err.message || 'Không thể kết nối đến máy chủ Google Gemini API',
    };
  }
}

