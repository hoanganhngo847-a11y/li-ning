// Server-side client for Tripo3D API (v3)
// https://developers.tripo3d.ai/
// NEVER import this file in client-side ('use client') code!

import { getProviderApiKey } from '../api-keys/resolver';

async function resolveTripoApiKey(): Promise<string> {
  const key = await getProviderApiKey('tripo');
  if (!key) throw new Error('TRIPO_API_KEY_MISSING: Chưa cấu hình TRIPO_API_KEY');
  return key;
}

export interface TripoSubmitResult {
  taskId: string;
  status: string;
}

export interface TripoQueryResult {
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  taskId: string;
  progress?: number;
  glbUrl?: string;
  previewImageUrl?: string;
  error?: string;
}

const TRIPO_BASE_URL = 'https://openapi.tripo3d.ai/v3';

/**
 * Uploads an image buffer to Tripo S3 storage using a presigned upload URL.
 * Returns the file_token needed for image-to-model generation.
 */
export async function uploadImageToTripo(
  imageBuffer: Buffer,
  format: 'jpg' | 'jpeg' | 'png' | 'webp' = 'jpg'
): Promise<string> {
  const apiKey = await resolveTripoApiKey();

  // Normalize format
  const normalizedFormat = format === 'jpeg' ? 'jpg' : format;
  const filename = `tryon_image.${normalizedFormat}`;

  // 1. Request presigned upload URL
  const presignRes = await fetch(`${TRIPO_BASE_URL}/files/presign`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      format: normalizedFormat,
      filename,
    }),
  });

  const presignData = (await presignRes.json()) as any;
  if (!presignRes.ok || presignData.code !== 0) {
    if (presignData.code === 2010 || String(presignData.message).includes('credit')) {
      throw new Error(
        'TRIPO_INSUFFICIENT_CREDIT: Tài khoản Tripo 3D hiện không đủ credit. Vui lòng kiểm tra lại số dư tại https://platform.tripo3d.ai/billing'
      );
    }
    throw new Error(
      `TRIPO_PRESIGN_FAILED [${presignData.code || presignRes.status}]: ${
        presignData.message || 'Lỗi chuẩn bị tải ảnh lên Tripo'
      }`
    );
  }

  const { presigned_url, file_token } = presignData.data;

  // 2. Upload image binary to presigned S3 URL
  const contentType =
    normalizedFormat === 'png'
      ? 'image/png'
      : normalizedFormat === 'webp'
      ? 'image/webp'
      : 'image/jpeg';

  const uploadRes = await fetch(presigned_url, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
    },
    body: new Uint8Array(imageBuffer),
  });

  if (!uploadRes.ok) {
    throw new Error(`TRIPO_S3_UPLOAD_FAILED: HTTP ${uploadRes.status} ${uploadRes.statusText}`);
  }

  return file_token;
}

export interface TripoModelOptions {
  faceLimit?: number;
  texture?: 'no' | 'standard' | 'HD';
  pbr?: boolean;
  mode?: 'turbo' | 'hd';
}

/**
 * Submits an image file_token to Tripo 3D for mesh reconstruction.
 * Optimized with face_limit & turbo parameters to dramatically accelerate generation.
 */
export async function submitTripoImageToModel(
  fileToken: string,
  modelName?: string,
  options?: TripoModelOptions
): Promise<TripoSubmitResult> {
  const apiKey = await resolveTripoApiKey();
  const model = modelName || process.env.TRIPO_MODEL || 'v3.1-20260211';

  // Build payload
  const payload: any = {
    model,
    file: {
      file_token: fileToken,
    },
  };

  // Turbo optimization: 25,000 polygon limit cuts generation time & GLB size dramatically
  if (options?.faceLimit) {
    payload.face_limit = options.faceLimit;
  } else if (options?.mode === 'turbo') {
    payload.face_limit = 25000;
  }

  if (options?.texture) {
    payload.texture = options.texture;
  } else if (options?.mode === 'turbo') {
    payload.texture = 'standard';
  }

  if (typeof options?.pbr === 'boolean') {
    payload.pbr = options.pbr;
  }

  let taskRes = await fetch(`${TRIPO_BASE_URL}/generation/image-to-model`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let taskData = (await taskRes.json()) as any;

  // Resilient fallback: if custom parameters are rejected by specific Tripo model, retry with minimal baseline
  if ((!taskRes.ok || taskData.code !== 0) && (payload.face_limit || payload.texture)) {
    console.warn('[Tripo] Fast parameters rejected, falling back to standard payload:', taskData?.message);
    taskRes = await fetch(`${TRIPO_BASE_URL}/generation/image-to-model`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        file: {
          file_token: fileToken,
        },
      }),
    });
    taskData = (await taskRes.json()) as any;
  }

  if (!taskRes.ok || taskData.code !== 0) {
    if (taskData.code === 2010 || String(taskData.message).includes('credit')) {
      throw new Error(
        'TRIPO_INSUFFICIENT_CREDIT: Tài khoản Tripo 3D hiện không đủ credit. Vui lòng kiểm tra lại số dư tại https://platform.tripo3d.ai/billing'
      );
    }
    throw new Error(
      `TRIPO_TASK_FAILED [${taskData.code || taskRes.status}]: ${
        taskData.message || 'Lỗi khởi tạo tác vụ 3D Tripo'
      }`
    );
  }

  const taskId = taskData.data?.task_id;
  if (!taskId) {
    throw new Error('TRIPO_TASK_FAILED: Không nhận được task_id từ Tripo');
  }

  return {
    taskId: String(taskId),
    status: 'queued',
  };
}

/**
 * Queries the progress and status of a Tripo 3D task.
 */
export async function queryTripoTask(taskId: string): Promise<TripoQueryResult> {
  const apiKey = await resolveTripoApiKey();

  const res = await fetch(`${TRIPO_BASE_URL}/tasks/${taskId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    cache: 'no-store',
  });

  const json = (await res.json()) as any;
  if (!res.ok || json.code !== 0) {
    throw new Error(
      `TRIPO_QUERY_FAILED [${json.code || res.status}]: ${
        json.message || 'Lỗi kiểm tra tiến độ tác vụ Tripo'
      }`
    );
  }

  const d = json.data || {};
  const rawStatus = String(d.status || '').toLowerCase();
  let status: 'queued' | 'in_progress' | 'completed' | 'failed' = 'in_progress';
  if (rawStatus === 'queued' || rawStatus === 'pending') status = 'queued';
  else if (rawStatus === 'running') status = 'in_progress';
  else if (rawStatus === 'success') status = 'completed';
  else if (rawStatus === 'failed' || rawStatus === 'cancelled') status = 'failed';

  const glbUrl = d.output?.model_url || d.output?.pbr_model || d.output?.model;
  const previewImageUrl = d.output?.rendered_image_url || d.output?.rendered_image;
  const progress = typeof d.progress === 'number' ? d.progress : undefined;

  return {
    status,
    taskId,
    progress,
    glbUrl,
    previewImageUrl,
    error: status === 'failed' ? (d.fail_reason || 'Tác vụ dựng 3D Tripo thất bại') : undefined,
  };
}

/**
 * Downloads the GLB file stream from Tripo CDN server-side to prevent CORS issues.
 */
export async function fetchGlbStream(glbUrl: string): Promise<{
  arrayBuffer: ArrayBuffer;
  contentType: string;
  contentLength: number;
}> {
  const parsed = new URL(glbUrl);
  if (parsed.protocol !== 'https:') {
    throw new Error('SSRF_GUARD: Chỉ hỗ trợ tải GLB qua giao thức HTTPS');
  }

  const res = await fetch(glbUrl, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`GLB_DOWNLOAD_FAILED: HTTP ${res.status} ${res.statusText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const contentType = res.headers.get('content-type') || 'model/gltf-binary';
  const contentLength = arrayBuffer.byteLength;

  return {
    arrayBuffer,
    contentType,
    contentLength,
  };
}
