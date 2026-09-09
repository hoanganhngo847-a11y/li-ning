import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { uploadImageToTripo, submitTripoImageToModel } from '@/app/lib/tripo/client';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as any;
    const imageUrl = body.imageUrl || body.fitroomResultUrl || body.image;
    const imageBase64 = body.imageBase64;

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

    // 1. Upload to Tripo S3
    const fileToken = await uploadImageToTripo(buffer, format);

    // 2. Submit Tripo generation task
    const { taskId } = await submitTripoImageToModel(fileToken);

    return NextResponse.json({
      success: true,
      taskId,
      jobId: taskId,
      status: 'queued',
      message: 'Đã gửi ảnh thành công tới Tripo 3D. Đang khởi tạo mô hình 3D...',
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
