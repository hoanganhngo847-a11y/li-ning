import { NextRequest, NextResponse } from 'next/server';
import { queryTripoTask, fetchGlbStream } from '@/app/lib/tripo/client';
import {
  getCachedGlbUrl,
  saveGlbToCache,
  getImageHashFromTaskId,
  clearActiveTask,
} from '@/app/lib/tripo/cache';

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

    // Handle cached task IDs immediately
    if (taskId.startsWith('cached_')) {
      const hash = taskId.replace('cached_', '');
      const cachedUrl = getCachedGlbUrl(hash);
      return NextResponse.json({
        success: true,
        taskId,
        status: 'completed',
        progress: 100,
        cached: true,
        glbUrl: cachedUrl || `/api/tripo/model/${taskId}`,
      });
    }

    // Check if task already has a local cached GLB
    const cachedByTaskId = getCachedGlbUrl(taskId);
    if (cachedByTaskId) {
      return NextResponse.json({
        success: true,
        taskId,
        status: 'completed',
        progress: 100,
        cached: true,
        glbUrl: cachedByTaskId,
      });
    }

    const taskResult = await queryTripoTask(taskId);

    // If completed and has a glbUrl, cache locally in the background
    if (taskResult.status === 'completed') {
      const imageHash = getImageHashFromTaskId(taskId);
      clearActiveTask(taskId);

      if (taskResult.glbUrl) {
        // Fire and forget caching to local disk
        fetchGlbStream(taskResult.glbUrl)
          .then(({ arrayBuffer }) => {
            const buf = Buffer.from(arrayBuffer);
            saveGlbToCache(taskId, buf);
            if (imageHash) {
              saveGlbToCache(imageHash, buf);
            }
          })
          .catch((err) => {
            console.warn('[TripoStatus] Background cache download error:', err.message);
          });
      }
    } else if (taskResult.status === 'failed') {
      clearActiveTask(taskId);
    }

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
