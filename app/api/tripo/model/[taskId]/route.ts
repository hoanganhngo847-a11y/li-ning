import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { queryTripoTask, fetchGlbStream } from '@/app/lib/tripo/client';
import { saveGlbToCache } from '@/app/lib/tripo/cache';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const cleanId = taskId.replace(/^cached_/, '');

    if (cleanId.includes('default') || cleanId.includes('fallback')) {
      return NextResponse.redirect(new URL('/uploads/models/lining-3d-0b801dbe-e8cf-4480-83fd-e317625881a4.glb', req.url));
    }

    // 1. FAST DISK CACHE CHECK: If already saved locally, serve directly!
    const modelsDir = path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'uploads', 'models');
    const directFileCandidates = [
      path.join(modelsDir, `tripo_${cleanId}.glb`),
      path.join(modelsDir, `tripo_${taskId}.glb`),
      path.join(modelsDir, `lining-3d-${cleanId}.glb`),
    ];

    for (const candidate of directFileCandidates) {
      if (fs.existsSync(candidate)) {
        const fileStat = fs.statSync(candidate);
        if (fileStat.size > 1024) {
          const fileBuffer = fs.readFileSync(candidate);
          return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
              'Content-Type': 'model/gltf-binary',
              'Content-Length': fileStat.size.toString(),
              'Cache-Control': 'public, max-age=31536000, immutable',
              'Content-Disposition': `inline; filename="tripo_${cleanId}.glb"`,
              'Access-Control-Allow-Origin': '*',
            },
          });
        }
      }
    }

    // 2. Otherwise query Tripo task / proxy
    const url = new URL(req.url);
    let sourceUrl = url.searchParams.get('source');

    if (!sourceUrl) {
      const task = await queryTripoTask(cleanId);
      if (!task.glbUrl) {
        return NextResponse.json(
          { error: 'Mô hình 3D chưa sẵn sàng hoặc không tồn tại' },
          { status: 404 }
        );
      }
      sourceUrl = task.glbUrl;
    }

    const { arrayBuffer, contentType, contentLength } = await fetchGlbStream(sourceUrl);
    const buffer = Buffer.from(arrayBuffer);

    // Save to cache asynchronously
    try {
      saveGlbToCache(cleanId, buffer);
    } catch {}

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType && contentType.includes('gltf') ? contentType : 'model/gltf-binary',
        'Content-Length': contentLength.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Disposition': `inline; filename="tripo_${cleanId}.glb"`,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    console.error('Tripo GLB proxy error:', err);
    return NextResponse.redirect(
      new URL('/uploads/models/lining-3d-0b801dbe-e8cf-4480-83fd-e317625881a4.glb', req.url)
    );
  }
}
