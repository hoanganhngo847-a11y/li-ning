import { NextRequest, NextResponse } from 'next/server';
import { checkModelImage } from '@/app/lib/fitroom/client';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('input_image') || formData.get('image');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp file ảnh của bạn (input_image).' },
        { status: 400 }
      );
    }

    // Validate mime type
    const mimeType = file.type || '';
    if (!mimeType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File tải lên không phải định dạng ảnh hợp lệ (chỉ chấp nhận JPG, PNG, WEBP).' },
        { status: 400 }
      );
    }

    // Validate size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Kích thước ảnh quá lớn (tối đa 15MB).' },
        { status: 400 }
      );
    }

    const filename = (file as any).name || 'customer_photo.jpg';
    const result = await checkModelImage(file, filename);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API check-model error]:', error.message || error);
    if (error.message === 'FITROOM_API_KEY_MISSING') {
      return NextResponse.json(
        { error: 'Hệ thống chưa cấu hình FITROOM_API_KEY ở máy chủ.' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Lỗi kiểm tra ảnh người mẫu.' },
      { status: 500 }
    );
  }
}
