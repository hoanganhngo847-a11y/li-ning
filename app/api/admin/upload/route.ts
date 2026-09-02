import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const contentType = request.headers.get('content-type') || '';
    const rawHeaderFilename = request.headers.get('x-filename');

    // Case 1: Direct Binary Stream Upload (Highly reliable for large .glb / .gltf / .obj 3D models up to 100MB+)
    if (rawHeaderFilename || contentType.includes('application/octet-stream') || contentType.includes('model/gltf-binary')) {
      const originalName = rawHeaderFilename ? decodeURIComponent(rawHeaderFilename) : 'model.glb';
      const cleanExt = originalName.includes('.') ? originalName.split('.').pop() : 'glb';
      const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${baseName}.${cleanExt}`;
      const filePath = join(uploadDir, filename);

      if (request.body) {
        // Stream directly to file on disk with zero memory overhead
        const nodeReadable = Readable.fromWeb(request.body as any);
        const fileStream = createWriteStream(filePath);
        await pipeline(nodeReadable, fileStream);

        return NextResponse.json({
          url: `/uploads/${filename}`,
          filename: originalName,
          size: fileStream.bytesWritten,
        });
      } else {
        const bytes = await request.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        return NextResponse.json({
          url: `/uploads/${filename}`,
          filename: originalName,
          size: buffer.length,
        });
      }
    }

    // Case 2: Standard Multipart FormData Upload
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file tải lên trong yêu cầu' }, { status: 400 });
    }

    const originalName = file.name || 'uploaded_file';
    const cleanExt = originalName.includes('.') ? originalName.split('.').pop() : 'glb';
    const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${baseName}.${cleanExt}`;
    const filePath = join(uploadDir, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      filename: originalName,
      size: buffer.length,
    });
  } catch (error: any) {
    console.error('Server Upload Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Có lỗi xảy ra khi lưu file trên máy chủ' },
      { status: 500 }
    );
  }
}
