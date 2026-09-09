import { NextRequest, NextResponse } from 'next/server';
import { checkClothesImage } from '@/app/lib/fitroom/client';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    let imageBlob: Blob | null = null;
    let filename = 'clothes.jpg';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('input_image') || formData.get('image');
      const imageUrl = formData.get('imageUrl');

      if (file && file instanceof Blob) {
        imageBlob = file;
        filename = (file as any).name || 'clothes.jpg';
      } else if (typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
        const fetchRes = await fetch(imageUrl);
        if (!fetchRes.ok) {
          return NextResponse.json(
            { error: `Không thể tải ảnh sản phẩm từ URL (${fetchRes.status})` },
            { status: 400 }
          );
        }
        imageBlob = await fetchRes.blob();
      }
    } else if (contentType.includes('application/json')) {
      const body = (await req.json()) as { imageUrl?: string };
      const { imageUrl } = body;
      if (!imageUrl || typeof imageUrl !== 'string') {
        return NextResponse.json(
          { error: 'Vui lòng cung cấp imageUrl hoặc file ảnh.' },
          { status: 400 }
        );
      }
      const fetchRes = await fetch(imageUrl);
      if (!fetchRes.ok) {
        return NextResponse.json(
          { error: `Không thể tải ảnh sản phẩm từ URL (${fetchRes.status})` },
          { status: 400 }
        );
      }
      imageBlob = await fetchRes.blob();
    }

    if (!imageBlob) {
      return NextResponse.json(
        { error: 'Không tìm thấy ảnh sản phẩm hợp lệ để kiểm tra.' },
        { status: 400 }
      );
    }

    const result = await checkClothesImage(imageBlob, filename);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API check-clothes error]:', error.message || error);
    if (error.message === 'FITROOM_API_KEY_MISSING') {
      return NextResponse.json(
        { error: 'Hệ thống chưa cấu hình FITROOM_API_KEY ở máy chủ.' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Lỗi kiểm tra ảnh trang phục.' },
      { status: 500 }
    );
  }
}
