import { NextRequest, NextResponse } from 'next/server';
import { queryTripoTask } from '@/app/lib/tripo/client';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const cleanId = (taskId || '').replace(/^cached_/, '');

    // 1. Default Li-Ning model redirect
    if (!cleanId || cleanId.includes('default') || cleanId.includes('fallback') || cleanId.includes('lining-3d')) {
      return NextResponse.redirect(
        new URL('/uploads/models/lining-3d-0b801dbe-e8cf-4480-83fd-e317625881a4.glb', req.url),
        307
      );
    }

    // 2. Direct S3 CDN redirect from query param
    const url = new URL(req.url);
    const sourceUrl = url.searchParams.get('source');
    if (sourceUrl && (sourceUrl.startsWith('http://') || sourceUrl.startsWith('https://'))) {
      return NextResponse.redirect(new URL(sourceUrl), 307);
    }

    // 3. Query Tripo task status and redirect to S3 CDN
    const task = await queryTripoTask(cleanId);
    if (task && task.glbUrl) {
      return NextResponse.redirect(new URL(task.glbUrl), 307);
    }

    // Graceful fallback to default compatible model
    return NextResponse.redirect(
      new URL('/uploads/models/lining-3d-0b801dbe-e8cf-4480-83fd-e317625881a4.glb', req.url),
      307
    );
  } catch (err: any) {
    console.error('Tripo GLB redirect error:', err);
    return NextResponse.redirect(
      new URL('/uploads/models/lining-3d-0b801dbe-e8cf-4480-83fd-e317625881a4.glb', req.url),
      307
    );
  }
}
