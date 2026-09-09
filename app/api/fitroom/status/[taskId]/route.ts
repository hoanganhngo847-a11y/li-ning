import { NextRequest, NextResponse } from 'next/server';
import { getTryOnStatus } from '@/app/lib/fitroom/client';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await context.params;

    if (!taskId) {
      return NextResponse.json(
        { error: 'Thiếu mã taskId trong yêu cầu.' },
        { status: 400 }
      );
    }

    const taskData = await getTryOnStatus(taskId);

    let finalImageUrl = taskData.download_signed_url || null;

    // When try-on completes, cache image to local disk to avoid Google Cloud Storage CORS and text/plain MIME type issues
    if (taskData.status === 'COMPLETED' && taskData.download_signed_url) {
      try {
        const tryonDir = path.join(process.cwd(), 'public', 'uploads', 'tryon');
        if (!fs.existsSync(tryonDir)) {
          fs.mkdirSync(tryonDir, { recursive: true });
        }

        const localFilePath = path.join(tryonDir, `${taskId}.webp`);
        if (fs.existsSync(localFilePath) && fs.statSync(localFilePath).size > 0) {
          finalImageUrl = `/uploads/tryon/${taskId}.webp`;
        } else {
          // Download and cache
          const imgRes = await fetch(taskData.download_signed_url, {
            headers: { 'User-Agent': 'LiNing-FitRoomCache/1.0' },
          });
          if (imgRes.ok) {
            const buffer = Buffer.from(await imgRes.arrayBuffer());
            if (buffer.length > 0) {
              fs.writeFileSync(localFilePath, buffer);
              finalImageUrl = `/uploads/tryon/${taskId}.webp`;
            }
          }
        }
      } catch (cacheErr) {
        console.warn('[FitRoom Cache] Failed to cache local webp on disk, using remote url:', cacheErr);
      }
    }

    return NextResponse.json({
      success: true,
      task_id: taskData.task_id,
      status: taskData.status,
      progress: taskData.progress ?? 0,
      download_signed_url: finalImageUrl,
      error_message: taskData.error_message || null,
    });
  } catch (error: any) {
    console.error('[API status error]:', error.message || error);
    if (error.message === 'FITROOM_API_KEY_MISSING') {
      return NextResponse.json(
        { error: 'Hệ thống chưa cấu hình FITROOM_API_KEY ở máy chủ.' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Lỗi kiểm tra tiến độ tác vụ thử đồ.' },
      { status: 500 }
    );
  }
}
