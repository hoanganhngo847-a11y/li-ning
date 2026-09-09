import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateBodyModelImage } from '@/app/lib/ai/gemini';
import type { GenerateModelImageInput } from '@/app/lib/ai/types';

export const dynamic = 'force-dynamic';

const GarmentItemSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().min(1, 'Tên sản phẩm không được rỗng'),
    category: z.string().optional(),
    color: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    price: z.number().optional(),
  })
  .optional();

const GenerateModelImageSchema = z.object({
  gender: z.enum(['nam', 'nu', 'male', 'female'] as const, {
    message: 'Giới tính phải là nam hoặc nu',
  }),
  age: z.coerce.number().min(14).max(85).optional(),
  ethnicity: z.string().optional(),
  skinTone: z.string().optional(),
  heightCm: z.coerce.number().min(120).max(230).optional(),
  weightKg: z.coerce.number().min(35).max(180).optional(),
  bustCm: z.coerce.number().min(50).max(160).optional(),
  waistCm: z.coerce.number().min(40).max(150).optional(),
  hipsCm: z.coerce.number().min(50).max(170).optional(),
  bodyType: z.string().optional(),
  pose: z.string().optional(),
  selectedTop: GarmentItemSchema,
  selectedBottom: GarmentItemSchema,
  selectedShoes: GarmentItemSchema,
  selectedOutfitName: z.string().optional(),
  brandStyle: z.string().optional(),
  useCache: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    // 1. Input validation using Zod
    const parseResult = GenerateModelImageSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const errorDetails = (parseResult.error.issues || []).map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return NextResponse.json(
        {
          success: false,
          error: `Dữ liệu số đo hoặc sản phẩm không hợp lệ: ${errorDetails}`,
        },
        { status: 400 }
      );
    }

    const validatedInput: GenerateModelImageInput = parseResult.data;

    // 2. Call Gemini service (server-side only, no key leak)
    const result = await generateBodyModelImage(validatedInput);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Không thể tạo hình ảnh người mẫu từ Google Gemini.',
          prompt: result.promptUsed,
          provider: result.provider,
        },
        { status: 422 }
      );
    }

    // 3. Return standardized JSON response
    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
      imageBase64: result.imageBase64,
      mimeType: result.mimeType,
      prompt: result.promptUsed,
      cached: result.cached || false,
      provider: result.provider,
      metadata: result.metadata,
    });
  } catch (err: any) {
    console.error('API /generate-model-image error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Lỗi xử lý yêu cầu tạo ảnh người mẫu.',
      },
      { status: 500 }
    );
  }
}
