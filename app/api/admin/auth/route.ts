import { NextRequest, NextResponse } from 'next/server';

const VALID_USERS = ['admin', 'admin@lining.id.vn', 'lining'];
const VALID_PASSWORDS = ['lining@2026', 'lining@2024', 'admin', 'admin123', 'lining123'];

export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value;
  if (token === 'authenticated') {
    return NextResponse.json({ authenticated: true, user: 'admin', domain: 'lining.id.vn' });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = (await request.json()) as any;
    const cleanUser = String(username || '').trim().toLowerCase();
    const cleanPass = String(password || '').trim();

    if (VALID_USERS.includes(cleanUser) && VALID_PASSWORDS.includes(cleanPass)) {
      const response = NextResponse.json({
        success: true,
        user: 'admin',
        domain: 'lining.id.vn',
        message: 'Đăng nhập thành công',
      });
      response.cookies.set('admin-token', 'authenticated', {
        path: '/',
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
      });
      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Tên đăng nhập hoặc mật khẩu không chính xác' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Dữ liệu yêu cầu không hợp lệ' },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Đã đăng xuất' });
  response.cookies.set('admin-token', '', {
    path: '/',
    maxAge: 0,
  });
  return response;
}

