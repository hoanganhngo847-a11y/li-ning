import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { uploadImageToTripo, submitTripoImageToModel } from '@/app/lib/tripo/client';
import {
  computeImageHash,
  getCachedGlbUrl,
  getActiveTaskId,
  registerActiveTask,
} from '@/app/lib/tripo/cache';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as any;
    const imageUrl = body.imageUrl || body.fitroomResultUrl || body.image;
    const imageBase64 = body.imageBase64;
    const mode: 'turbo' | 'hd' = body.mode === 'hd' ? 'hd' : 'turbo';

    let buffer: Buffer | null = null;
    let format: 'jpg' | 'png' | 'webp' = 'jpg';

    if (imageBase64 && typeof imageBase64 === 'string') {
      const match = imageBase64.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
      if (match) {
        const ext = match[1].toLowerCase();
        format = ext === 'png' ? 'png' : ext === 'webp' ? 'webp' : 'jpg';
        buffer = Buffer.from(match[2], 'base64');
      } else {
        buffer = Buffer.from(imageBase64, 'base64');
      }
    } else if (imageUrl && typeof imageUrl === 'string') {
      if (imageUrl.startsWith('data:image/')) {
        const match = imageUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
        if (match) {
          const ext = match[1].toLowerCase();
          format = ext === 'png' ? 'png' : ext === 'webp' ? 'webp' : 'jpg';
          buffer = Buffer.from(match[2], 'base64');
        }
      } else if (imageUrl.startsWith('/') && !imageUrl.startsWith('//')) {
        // Local public file
        const localPath = path.join(process.cwd(), 'public', imageUrl);
        if (fs.existsSync(localPath)) {
          buffer = fs.readFileSync(localPath);
          const ext = path.extname(localPath).replace('.', '').toLowerCase();
          format = ext === 'png' ? 'png' : ext === 'webp' ? 'webp' : 'jpg';
        }
      } else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        const fetchRes = await fetch(imageUrl);
        if (!fetchRes.ok) {
          throw new Error(`Không thể tải ảnh từ URL: HTTP ${fetchRes.status}`);
        }
        const arrayBuf = await fetchRes.arrayBuffer();
        buffer = Buffer.from(arrayBuf);
        const ct = fetchRes.headers.get('content-type') || '';
        if (ct.includes('png')) format = 'png';
        else if (ct.includes('webp')) format = 'webp';
      }
    }

    if (!buffer || buffer.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng cung cấp ảnh hợp lệ để dựng mô hình 3D' },
        { status: 400 }
      );
    }

    // 1. FAST HASH CACHE CHECK (0.05s Instant Return!)
    const imageHash = computeImageHash(buffer);
    const cachedGlbUrl = getCachedGlbUrl(imageHash);

    if (cachedGlbUrl) {
      return NextResponse.json({
        success: true,
        taskId: `cached_${imageHash}`,
        jobId: `cached_${imageHash}`,
        status: 'completed',
        cached: true,
        glbUrl: cachedGlbUrl,
        progress: 100,
        message: 'Mô hình 3D đã sẵn sàng tức thì từ bộ nhớ đệm (0.1s)',
      });
    }

    // 2. ACTIVE TASK DEDUPLICATION (Avoid duplicate generation of identical image)
    const existingTaskId = getActiveTaskId(imageHash);
    if (existingTaskId) {
      return NextResponse.json({
        success: true,
        taskId: existingTaskId,
        jobId: existingTaskId,
        status: 'in_progress',
        cached: false,
        message: 'Tác vụ 3D tương ứng đang được xử lý trên Tripo Cloud...',
      });
    }

    // 3. Upload to Tripo S3
    const fileToken = await uploadImageToTripo(buffer, format);

    // 4. Submit Tripo generation task with Turbo optimization (25,000 faces, standard texture)
    const { taskId } = await submitTripoImageToModel(fileToken, undefined, {
      mode,
      faceLimit: mode === 'hd' ? 60000 : 25000,
      texture: mode === 'hd' ? 'HD' : 'standard',
      pbr: true,
    });

    // Register active task mapping
    registerActiveTask(imageHash, taskId);

    return NextResponse.json({
      success: true,
      taskId,
      jobId: taskId,
      status: 'queued',
      cached: false,
      mode,
      message: `Đã gửi ảnh thành công tới Tripo 3D (${mode === 'turbo' ? 'Chế độ Siêu Tốc' : 'Chế độ HD'}). Đang khởi tạo mô hình 3D...`,
    });
  } catch (err: any) {
    console.error('Tripo create task error:', err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Lỗi khởi tạo tác vụ Tripo 3D',
        error: err.message,
      },
      { status: 500 }
    );
  }
}
