import { NextRequest, NextResponse } from 'next/server';
import { generateCustomAvatar, computeBodyMetrics } from '@/app/lib/fitroom/avatar-generator';
import { SkinToneId } from '@/app/lib/fitroom/color-advisor';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as any;
    const {
      gender = 'nam',
      height = 175,
      weight = 68,
      bust = 96,
      waist = 78,
      hips = 95,
      skinTone = 'medium_asian',
      forceRegenerate = false,
    } = body;

    const validatedGender: 'nam' | 'nu' = gender === 'nu' || gender === 'female' ? 'nu' : 'nam';
    const validatedSkinTone: SkinToneId = ['fair', 'medium_asian', 'tan', 'deep'].includes(skinTone)
      ? skinTone
      : 'medium_asian';

    const result = await generateCustomAvatar(
      {
        gender: validatedGender,
        height: Number(height) || (validatedGender === 'nu' ? 162 : 175),
        weight: Number(weight) || (validatedGender === 'nu' ? 50 : 68),
        bust: Number(bust) || (validatedGender === 'nu' ? 85 : 96),
        waist: Number(waist) || (validatedGender === 'nu' ? 64 : 78),
        hips: Number(hips) || (validatedGender === 'nu' ? 90 : 95),
        skinTone: validatedSkinTone,
      },
      Boolean(forceRegenerate)
    );

    return NextResponse.json({
      success: true,
      ...result,
      avatarUrl: result.avatarUrl.includes('?')
        ? result.avatarUrl
        : `${result.avatarUrl}?v=${result.avatarHash}`,
    });
  } catch (err: any) {
    console.error('Avatar generation error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Không thể tạo người mẫu theo thông số.',
      },
      { status: 500 }
    );
  }
}
