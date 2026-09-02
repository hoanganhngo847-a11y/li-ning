import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '');

    const publicPath = join(process.cwd(), 'public', 'uploads', sanitized);
    const tmpPath = join('/tmp', 'uploads', sanitized);

    let filePath = '';
    if (existsSync(publicPath)) {
      filePath = publicPath;
    } else if (existsSync(tmpPath)) {
      filePath = tmpPath;
    } else {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileBuffer = await readFile(filePath);
    const ext = sanitized.split('.').pop()?.toLowerCase() || '';

    let contentType = 'application/octet-stream';
    if (ext === 'glb') contentType = 'model/gltf-binary';
    else if (ext === 'gltf') contentType = 'model/gltf+json';
    else if (ext === 'usdz') contentType = 'model/vnd.usdz+zip';
    else if (ext === 'obj') contentType = 'text/plain';
    else if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
    else if (ext === 'png') contentType = 'image/png';
    else if (ext === 'webp') contentType = 'image/webp';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error reading file' }, { status: 500 });
  }
}
