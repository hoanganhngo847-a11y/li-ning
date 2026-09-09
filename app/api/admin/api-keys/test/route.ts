import { NextRequest, NextResponse } from 'next/server';
import { getProviderApiKey, getCloudflareAccountId } from '@/app/lib/api-keys/resolver';
import {
  testFitRoomConnection,
  testTripoConnection,
  testCloudflareConnection,
  testAlibabaConnection,
  testGeminiConnection,
} from '@/app/lib/config-api-keys';

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

export async function POST(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Vui lòng đăng nhập quyền quản trị' },
        { status: 401 }
      );
    }

    const body = (await req.json()) as any;
    const provider = String(body.provider || body.type || '').trim().toLowerCase();
    const accountId = body.accountId || (await getCloudflareAccountId()) || process.env.CLOUDFLARE_ACCOUNT_ID;
    const endpoint = body.endpoint || process.env.ALIBABA_ENDPOINT;
    let apiKey = body.apiKey;

    // If no explicit test key provided, resolve from database / environment via Central Resolver
    if (!apiKey || !apiKey.trim()) {
      apiKey = await getProviderApiKey(provider);
    }

    if (!apiKey || !apiKey.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: `Chưa có khóa API cho "${provider}". Vui lòng nhập và lưu khóa API trước khi kiểm tra.`,
        },
        { status: 400 }
      );
    }

    if (provider === 'gemini') {
      const result = await testGeminiConnection(apiKey);
      return NextResponse.json(result);
    }

    if (provider === 'fitroom') {
      const result = await testFitRoomConnection(apiKey);
      return NextResponse.json(result);
    }

    if (provider === 'tripo') {
      const result = await testTripoConnection(apiKey);
      return NextResponse.json(result);
    }

    if (provider === 'cloudflare') {
      const result = await testCloudflareConnection(apiKey, accountId);
      return NextResponse.json(result);
    }

    if (provider === 'alibaba') {
      const result = await testAlibabaConnection(apiKey, endpoint);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, message: 'Loại API không hợp lệ (hỗ trợ gemini, fitroom, tripo, cloudflare hoặc alibaba)' },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Lỗi khi kiểm tra kết nối' },
      { status: 500 }
    );
  }
}
