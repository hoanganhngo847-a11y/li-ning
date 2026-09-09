import { NextRequest, NextResponse } from 'next/server';
import { queryTripoTask, fetchGlbStream } from '@/app/lib/tripo/client';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const url = new URL(req.url);
    let sourceUrl = url.searchParams.get('source');

    if (!sourceUrl) {
      const task = await queryTripoTask(taskId);
      if (!task.glbUrl) {
        return NextResponse.json(
          { error: 'Mô hình 3D chưa sẵn sàng hoặc không tồn tại' },
          { status: 404 }
        );
      }
      sourceUrl = task.glbUrl;
    }

    const { arrayBuffer, contentType, contentLength } = await fetchGlbStream(sourceUrl);

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType && contentType.includes('gltf') ? contentType : 'model/gltf-binary',
        'Content-Length': contentLength.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Disposition': `inline; filename="tripo_${taskId}.glb"`,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    console.error('Tripo GLB proxy error:', err);
    return NextResponse.json(
      { error: err.message || 'Lỗi tải mô hình 3D từ Tripo' },
      { status: 500 }
    );
  }
}
