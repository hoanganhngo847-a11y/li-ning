import { NextRequest, NextResponse } from 'next/server';
import { createTryOnTask } from '@/app/lib/fitroom/client';
import { FitRoomClothType } from '@/app/lib/fitroom/types';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

async function fetchRemoteImageBlob(url: string, label: string): Promise<Blob> {
  if (!url || typeof url !== 'string') {
    throw new Error(`URL ảnh ${label} không hợp lệ: ${url}`);
  }

  // 1. Data URI
  if (url.startsWith('data:image/')) {
    const matches = url.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const type = matches[1];
      const buffer = Buffer.from(matches[2], 'base64');
      return new Blob([buffer], { type });
    }
  }

  // 2. Local public file or localhost URL
  let pathname = url;
  if (url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) {
    try {
      pathname = new URL(url).pathname;
    } catch {}
  }

  if (pathname.startsWith('/') || !pathname.startsWith('http')) {
    const cleanPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
    const localPath = path.join(process.cwd(), 'public', cleanPath);
    if (fs.existsSync(localPath)) {
      const buffer = fs.readFileSync(localPath);
      const ext = path.extname(localPath).toLowerCase();
      const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
      return new Blob([buffer], { type: mime });
    }
  }

  // 3. Remote HTTP URL
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'LiNing-VirtualTryOn/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Không thể tải ảnh ${label} (mã lỗi ${response.status})`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType && !contentType.startsWith('image/')) {
    throw new Error(`Nội dung trả về của ${label} không phải định dạng ảnh (${contentType})`);
  }

  const blob = await response.blob();
  if (blob.size === 0) {
    throw new Error(`Ảnh ${label} rỗng (0 bytes)`);
  }

  return blob;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // 1. Customer / Model Image (from file or URL)
    let modelFile: Blob | FormDataEntryValue | null = formData.get('model_image') || formData.get('image');
    const modelImageUrl = formData.get('model_image_url') as string | null;

    if ((!modelFile || !(modelFile instanceof Blob) || modelFile.size === 0) && modelImageUrl) {
      try {
        modelFile = await fetchRemoteImageBlob(modelImageUrl, 'người mẫu');
      } catch (err: any) {
        console.warn('Failed to fetch model_image_url:', err.message);
      }
    }

    if (!modelFile || !(modelFile instanceof Blob)) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp ảnh người mẫu/khách hàng (model_image hoặc model_image_url).' },
        { status: 400 }
      );
    }

    if (modelFile.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Kích thước ảnh người mẫu vượt quá giới hạn cho phép (tối đa 15MB).' },
        { status: 400 }
      );
    }

    // 2. Cloth Type & HD Mode
    let clothTypeRaw = formData.get('cloth_type') as string;
    let clothType: FitRoomClothType = ['upper', 'lower', 'combo', 'full_set'].includes(clothTypeRaw)
      ? (clothTypeRaw as FitRoomClothType)
      : 'upper';

    const hdMode = formData.get('hd_mode') === 'true';

    // 3. Garment Images (either passed as Blob or fetched from remote URL)
    let clothImage: Blob | null = null;
    let clothFilename = 'cloth_upper.jpg';

    const clothFile = formData.get('cloth_image');
    const clothUrl = formData.get('cloth_image_url') as string | null;

    if (clothFile && clothFile instanceof Blob) {
      clothImage = clothFile;
      clothFilename = (clothFile as any).name || 'cloth_upper.jpg';
    } else if (clothUrl) {
      clothImage = await fetchRemoteImageBlob(clothUrl, 'chính');
      clothFilename = 'cloth_upper.jpg';
    }

    if (!clothImage) {
      return NextResponse.json(
        { error: 'Thiếu ảnh sản phẩm (cloth_image hoặc cloth_image_url).' },
        { status: 400 }
      );
    }

    // 4. Lower Garment Image for Combo
    let lowerClothImage: Blob | undefined = undefined;
    let lowerClothFilename = 'cloth_lower.jpg';

    if (clothType === 'combo') {
      const lowerClothFile = formData.get('lower_cloth_image');
      const lowerClothUrl = formData.get('lower_cloth_image_url') as string | null;

      if (lowerClothFile && lowerClothFile instanceof Blob) {
        lowerClothImage = lowerClothFile;
        lowerClothFilename = (lowerClothFile as any).name || 'cloth_lower.jpg';
      } else if (lowerClothUrl) {
        try {
          lowerClothImage = await fetchRemoteImageBlob(lowerClothUrl, 'quần');
        } catch (err: any) {
          console.warn('Could not load lower garment image for combo, falling back to upper only:', err.message);
        }
      }

      // If lower cloth cannot be loaded, gracefully switch to single upper item instead of failing
      if (!lowerClothImage) {
        clothType = 'upper';
      }
    }

    // 5. Call FitRoom Create Task
    const taskResult = await createTryOnTask({
      modelImage: modelFile,
      modelFilename: (modelFile as any).name || 'customer_photo.jpg',
      clothImage,
      clothFilename,
      lowerClothImage,
      lowerClothFilename,
      clothType,
      hdMode,
    });

    return NextResponse.json({
      success: true,
      task_id: taskResult.task_id,
      status: taskResult.status,
      cloth_type: clothType,
      hd_mode: hdMode,
    });
  } catch (error: any) {
    console.error('[API tryon error]:', error.message || error);

    const msg = error.message || '';
    if (msg === 'FITROOM_API_KEY_MISSING') {
      return NextResponse.json(
        { error: 'Hệ thống chưa cấu hình FITROOM_API_KEY ở máy chủ.' },
        { status: 500 }
      );
    }

    if (msg.includes('401')) {
      return NextResponse.json(
        { error: 'Khóa FitRoom API không hợp lệ hoặc đã hết hạn.' },
        { status: 401 }
      );
    }

    if (msg.includes('402')) {
      return NextResponse.json(
        { error: 'Tài khoản FitRoom đã hết số lượt thử (insufficient credits).' },
        { status: 402 }
      );
    }

    if (msg.includes('429')) {
      return NextResponse.json(
        { error: 'Hệ thống đang quá tải, vui lòng chờ giây lát rồi thử lại (Rate Limit 429).' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Lỗi xử lý tạo tác vụ thử đồ AI.' },
      { status: 500 }
    );
  }
}
