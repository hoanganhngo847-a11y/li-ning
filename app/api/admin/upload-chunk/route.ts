import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readdir, readFile, unlink, rmdir } from 'fs/promises';
import { join } from 'path';
import { existsSync, createWriteStream } from 'fs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 120;

// Resolve upload and chunk storage directory (works locally & on Vercel)
function getUploadDir() {
  const localDir = join(process.cwd(), 'public', 'uploads');
  return localDir;
}

function getTmpUploadDir() {
  return join('/tmp', 'uploads');
}

export async function POST(request: NextRequest) {
  try {
    const uploadId = request.headers.get('x-upload-id') || `up-${Date.now()}`;
    const chunkIndex = parseInt(request.headers.get('x-chunk-index') || '0', 10);
    const totalChunks = parseInt(request.headers.get('x-total-chunks') || '1', 10);
    const rawHeaderFilename = request.headers.get('x-filename') || 'model.glb';
    const originalName = decodeURIComponent(rawHeaderFilename);

    // Read binary chunk from request (typically 2MB to 3MB, well below Vercel 4.5MB limit)
    const chunkBytes = await request.arrayBuffer();
    const chunkBuffer = Buffer.from(chunkBytes);

    const baseUploadDir = getUploadDir();
    const tmpUploadDir = getTmpUploadDir();

    // Ensure directories exist
    let targetUploadDir = baseUploadDir;
    try {
      if (!existsSync(baseUploadDir)) {
        await mkdir(baseUploadDir, { recursive: true });
      }
    } catch {
      targetUploadDir = tmpUploadDir;
      if (!existsSync(tmpUploadDir)) {
        await mkdir(tmpUploadDir, { recursive: true });
      }
    }

    const chunkDir = join(targetUploadDir, '.chunks', uploadId);
    if (!existsSync(chunkDir)) {
      await mkdir(chunkDir, { recursive: true });
    }

    // Save current chunk
    const chunkFilePath = join(chunkDir, `chunk-${chunkIndex.toString().padStart(5, '0')}`);
    await writeFile(chunkFilePath, chunkBuffer);

    // Check if all chunks have arrived
    const savedChunkFiles = (await readdir(chunkDir)).filter((f) => f.startsWith('chunk-'));

    if (savedChunkFiles.length === totalChunks) {
      // Sort chunk files in ascending order
      savedChunkFiles.sort();

      const cleanExt = originalName.includes('.') ? originalName.split('.').pop() : 'glb';
      const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const finalFileName = `${uniqueSuffix}-${baseName}.${cleanExt}`;
      const finalFilePath = join(targetUploadDir, finalFileName);

      // Assemble all chunks into final file
      const writeStream = createWriteStream(finalFilePath);

      for (const chunkFile of savedChunkFiles) {
        const chunkPath = join(chunkDir, chunkFile);
        const data = await readFile(chunkPath);
        writeStream.write(data);
        // Delete chunk file immediately after writing
        await unlink(chunkPath).catch(() => {});
      }

      await new Promise<void>((resolve, reject) => {
        writeStream.end((err?: Error | null) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Cleanup chunk folder
      await rmdir(chunkDir).catch(() => {});

      // Also copy to /tmp if target was public, or vice versa for reliable serving
      try {
        if (targetUploadDir === baseUploadDir && existsSync(tmpUploadDir)) {
          const finalBuffer = await readFile(finalFilePath);
          await writeFile(join(tmpUploadDir, finalFileName), finalBuffer);
        }
      } catch {}

      return NextResponse.json({
        done: true,
        url: `/uploads/${finalFileName}`,
        filename: originalName,
        totalChunks,
      });
    }

    // Acknowledge chunk upload
    return NextResponse.json({
      done: false,
      chunkIndex,
      totalChunks,
      received: savedChunkFiles.length,
    });
  } catch (error: any) {
    console.error('Chunk upload error:', error);
    return NextResponse.json(
      { error: error?.message || 'Có lỗi khi ghép các phần của file 3D' },
      { status: 500 }
    );
  }
}
