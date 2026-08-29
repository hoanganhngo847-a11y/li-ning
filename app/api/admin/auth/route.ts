import { NextRequest, NextResponse } from 'next/server';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'lining@2024';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json() as any;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin-token', 'authenticated', {
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });
    return response;
  }
  return NextResponse.json({ success: false, error: 'Sai tài khoản hoặc mật khẩu' }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin-token');
  return response;
}
