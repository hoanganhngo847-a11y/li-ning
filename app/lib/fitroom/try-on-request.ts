import type { FitRoomClothType } from './types';

export interface TryOnRequest {
  modelImageUrl: string;
  clothType: FitRoomClothType;
  clothImageUrl: string;
  lowerClothImageUrl?: string;
  hdMode: boolean;
}

export interface CompletedTryOn {
  taskId: string;
  requestKey: string;
  modelImageUrl: string;
  resultImageUrl: string;
}

export function tryOnRequestKey(request: TryOnRequest): string {
  return JSON.stringify([
    request.modelImageUrl, request.clothType, request.clothImageUrl,
    request.lowerClothImageUrl || null, request.hdMode,
  ]);
}

export function matchingTryOn(result: CompletedTryOn | null, requestKey: string) {
  return result?.requestKey === requestKey ? result : null;
}

export async function runFitRoomTryOn(
  request: TryOnRequest,
  options: {
    signal: AbortSignal;
    onProgress?: (progress: number) => void;
    pollIntervalMs?: number;
    timeoutMs?: number;
  },
): Promise<CompletedTryOn> {
  const signal = AbortSignal.any([
    options.signal,
    AbortSignal.timeout(options.timeoutMs ?? 180_000),
  ]);
  const checkActive = () => signal.throwIfAborted();
  try {
    checkActive();
    if (!request.modelImageUrl || !request.clothImageUrl ||
        (request.clothType === 'combo' && !request.lowerClothImageUrl)) {
      throw new Error('Vui lòng chọn người mẫu và đầy đủ trang phục cần thử.');
    }

    // Fetch the exact preview URL, including uploaded blob URLs. Never reuse a stale file.
    const modelResponse = await fetch(request.modelImageUrl, { signal });
    if (!modelResponse.ok) throw new Error('Không tải được ảnh người mẫu đang chọn.');
    const model = await modelResponse.blob();
    checkActive();
    if (!model.size || !model.type.startsWith('image/')) {
      throw new Error('Ảnh người mẫu không hợp lệ. Vui lòng chọn lại ảnh.');
    }
    const form = new FormData();
    form.append('model_image', model, 'runway-model.' + (model.type.split('/')[1] || 'jpg'));
    form.append('model_image_url', request.modelImageUrl);
    form.append('cloth_type', request.clothType);
    form.append('cloth_image_url', request.clothImageUrl);
    if (request.lowerClothImageUrl) form.append('lower_cloth_image_url', request.lowerClothImageUrl);
    form.append('hd_mode', String(request.hdMode));
    const response = await fetch('/api/fitroom/tryon', { method: 'POST', body: form, signal });
    const created: any = await response.json();
    checkActive();
    if (!response.ok || !created.success || !created.task_id) {
      throw new Error(created.error || 'Không thể khởi tạo tác vụ FitRoom. Vui lòng thử lại.');
    }
    options.onProgress?.(15);
    while (true) {
      await new Promise<void>((resolve, reject) => {
        const abort = () => { clearTimeout(timer); reject(signal.reason); };
        const timer = setTimeout(() => {
          signal.removeEventListener('abort', abort);
          resolve();
        }, options.pollIntervalMs ?? 2000);
        signal.addEventListener('abort', abort, { once: true });
        if (signal.aborted) abort();
      });
      checkActive();
      const response = await fetch(`/api/fitroom/status/${encodeURIComponent(created.task_id)}`, {
        signal, cache: 'no-store',
      });
      const status: any = await response.json();
      checkActive();
      if (!response.ok || status.success === false || status.status === 'FAILED') {
        throw new Error(status.error_message || status.error || 'FitRoom chưa xử lý được ảnh này. Vui lòng thử lại.');
      }
      if (status.task_id && status.task_id !== created.task_id) {
        throw new Error('FitRoom trả về kết quả không thuộc lượt thử hiện tại.');
      }
      if (status.status === 'COMPLETED') {
        if (typeof status.download_signed_url !== 'string' || !/^https?:\/\//.test(status.download_signed_url)) {
          throw new Error('FitRoom chưa trả về ảnh kết quả hợp lệ. Vui lòng thử lại.');
        }
        return {
          taskId: created.task_id,
          requestKey: tryOnRequestKey(request),
          modelImageUrl: request.modelImageUrl,
          resultImageUrl: status.download_signed_url,
        };
      }
      options.onProgress?.(Math.min(95, Math.max(15, Number(status.progress) || 15)));
    }
  } catch (error) {
    if (options.signal.aborted) throw options.signal.reason;
    if (signal.aborted) throw new Error('FitRoom xử lý quá thời gian chờ. Chưa có kết quả, vui lòng thử lại sau.');
    throw error;
  }
}
