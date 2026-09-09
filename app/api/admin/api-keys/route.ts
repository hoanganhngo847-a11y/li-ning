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
        hasAccountId: p.hasAccountId,
        maskedAccountId: p.maskedAccountId,
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
    const newApiKey = body.newApiKey !== undefined ? String(body.newApiKey).trim() : '';
    const accountId = body.accountId !== undefined ? String(body.accountId).trim() : undefined;

    if (!VALID_PROVIDERS.includes(provider) && provider !== ('cloudflare_account_id' as any)) {
      return NextResponse.json(
        { success: false, error: `Nhà cung cấp không hợp lệ. Hỗ trợ: ${VALID_PROVIDERS.join(', ')}` },
        { status: 400 }
      );
    }

    let savedKey = false;
    let savedAccountId = false;

    // 1. Update API Key if provided
    if (newApiKey) {
      if (newApiKey.length < 4) {
        return NextResponse.json(
          { success: false, error: 'Khóa API mới không hợp lệ hoặc quá ngắn (tối thiểu 4 ký tự)' },
          { status: 400 }
        );
      }
      const encryptedValue = encryptSecret(newApiKey);
      const lastFour = newApiKey.slice(-4);
      await upsertDbCredential(provider, encryptedValue, lastFour, true);
      savedKey = true;
    }

    // 2. Update Cloudflare Account ID if provided
    if (provider === 'cloudflare' && accountId !== undefined) {
      if (accountId.length > 0) {
        if (accountId.length < 6) {
          return NextResponse.json(
            { success: false, error: 'Account ID không hợp lệ hoặc quá ngắn' },
            { status: 400 }
          );
        }
        const encAccountId = encryptSecret(accountId);
        const lastFourAcc = accountId.slice(-4);
        await upsertDbCredential('cloudflare_account_id', encAccountId, lastFourAcc, true);
        savedAccountId = true;
      }
    }

    if (!savedKey && !savedAccountId) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng cung cấp khóa API mới hoặc Account ID để cập nhật' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Đã lưu và mã hóa cấu hình an toàn cho ${provider} thành công`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Không thể lưu khóa API' },
      { status: 500 }
    );
  }
}
