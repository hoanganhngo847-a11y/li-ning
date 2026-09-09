import { NextRequest, NextResponse } from 'next/server';
import { getAdminProviderStatuses, ApiProvider } from '@/app/lib/api-keys/resolver';
import { encryptSecret, maskSecret } from '@/app/lib/crypto/secret-encryption';
import { upsertDbCredential } from '@/app/lib/db/credentials';

export const dynamic = 'force-dynamic';

function checkAdminAuth(req: NextRequest): boolean {
  const token = req.cookies.get('admin-token')?.value;
  if (token === 'authenticated') return true;
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearer = authHeader.substring(7);
    if (bearer === 'authenticated') return true;
  }
  return false;
}

const VALID_PROVIDERS: ApiProvider[] = ['gemini', 'fitroom', 'tripo', 'cloudflare', 'alibaba'];

export async function GET(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Vui lòng đăng nhập quyền quản trị' },
        { status: 401 }
      );
    }

    const providers = await getAdminProviderStatuses();

    return NextResponse.json({
      success: true,
      providers: providers.map((p) => ({
        provider: p.provider,
        name: p.name,
        configured: p.configured,
        maskedKey: p.maskedKey,
        source: p.source,
        updatedAt: p.updatedAt,
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Không thể lấy cấu hình API keys' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Vui lòng đăng nhập quyền quản trị' },
        { status: 401 }
      );
    }

    const body = (await req.json()) as any;
    const provider = String(body.provider || '').trim().toLowerCase() as ApiProvider;
    const newApiKey = String(body.newApiKey || '').trim();

    if (!VALID_PROVIDERS.includes(provider)) {
      return NextResponse.json(
        { success: false, error: `Nhà cung cấp không hợp lệ. Hỗ trợ: ${VALID_PROVIDERS.join(', ')}` },
        { status: 400 }
      );
    }

    if (!newApiKey || newApiKey.length < 4) {
      return NextResponse.json(
        { success: false, error: 'Khóa API mới không hợp lệ hoặc quá ngắn (tối thiểu 4 ký tự)' },
        { status: 400 }
      );
    }

    // 1. Encrypt with AES-256-GCM
    const encryptedValue = encryptSecret(newApiKey);
    const lastFour = newApiKey.slice(-4);

    // 2. Persist to Database table api_credentials
    const saved = await upsertDbCredential(provider, encryptedValue, lastFour, true);

    // 3. Return only masked response, never raw key
    return NextResponse.json({
      success: true,
      message: `Đã lưu và mã hóa khóa API cho ${provider} thành công`,
      data: {
        provider: saved.provider,
        configured: true,
        maskedKey: maskSecret(lastFour),
        updatedAt: saved.updated_at.toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Không thể lưu khóa API' },
      { status: 500 }
    );
  }
}
