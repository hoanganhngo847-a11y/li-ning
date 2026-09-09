import { NextRequest, NextResponse } from 'next/server';
import { queryTripoTask } from '@/app/lib/tripo/client';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    if (!taskId) {
      return NextResponse.json({ success: false, message: 'Thiếu taskId' }, { status: 400 });
    }

    const taskResult = await queryTripoTask(taskId);

    return NextResponse.json({
      success: true,
      taskId: taskResult.taskId,
      status: taskResult.status,
      progress: taskResult.progress,
      glbUrl: taskResult.glbUrl ? `/api/tripo/model/${taskId}?source=${encodeURIComponent(taskResult.glbUrl)}` : undefined,
      directGlbUrl: taskResult.glbUrl,
      previewImageUrl: taskResult.previewImageUrl,
      error: taskResult.error,
    });
  } catch (err: any) {
    console.error('Tripo status poll error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Lỗi kiểm tra tiến độ Tripo' },
      { status: 500 }
    );
  }
}
