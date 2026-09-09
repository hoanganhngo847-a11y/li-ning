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

    // Return signed URL directly with high availability
    if (taskData.status === 'COMPLETED' && taskData.download_signed_url) {
      finalImageUrl = taskData.download_signed_url;
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
