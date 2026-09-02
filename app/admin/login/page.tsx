'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        window.location.href = '/admin';
      } else {
        const data: any = await res.json();
        setError(data.error || 'Tài khoản hoặc mật khẩu không chính xác');
      }
    } catch (err) {
      setError('Đã có lỗi xảy ra khi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-radial from-gray-900 via-gray-950 to-black px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#f30d29]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Box */}
      <div className="max-w-md w-full bg-gray-900/90 backdrop-blur-md rounded-3xl border border-gray-800 shadow-2xl p-8 sm:p-10 relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-[#f30d29] text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-[#f30d29] animate-pulse" />
            lining.id.vn • Portal Quản Trị
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            LI-NING <span className="text-[#f30d29]">ADMIN</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Hệ thống Quản trị & Điều hành Website chính thức
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-2">
            <svg className="w-4 h-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              Tên đăng nhập
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-[#f30d29] focus:border-[#f30d29] outline-none transition-all placeholder:text-gray-500 font-medium"
              placeholder="admin hoặc admin@lining.id.vn"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                Mật khẩu
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-gray-400 hover:text-gray-200 cursor-pointer"
              >
                {showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-[#f30d29] focus:border-[#f30d29] outline-none transition-all placeholder:text-gray-500 font-medium"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f30d29] hover:bg-[#d10b23] text-white py-3.5 px-4 rounded-xl shadow-[0_4px_20px_rgba(243,13,41,0.35)] hover:shadow-[0_6px_25px_rgba(243,13,41,0.5)] transition-all duration-200 font-bold text-sm tracking-wider uppercase mt-2 disabled:opacity-70 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Đang xác thực...
              </span>
            ) : (
              'ĐĂNG NHẬP HỆ THỐNG'
            )}
          </button>
        </form>

        {/* Quick Demo Fill Box */}
        <div className="mt-6 pt-5 border-t border-gray-800 text-center">
          <p className="text-[11px] text-gray-400 mb-2">Tài khoản quản trị mặc định:</p>
          <div className="inline-flex items-center gap-2 bg-gray-800/60 px-3 py-1.5 rounded-lg border border-gray-700 text-xs text-gray-300 font-mono">
            <span>admin</span>
            <span className="text-gray-600">/</span>
            <span>lining@2026</span>
            <button
              type="button"
              onClick={() => handleQuickFill('admin', 'lining@2026')}
              className="ml-2 text-[#f30d29] hover:underline font-sans font-bold text-[11px] cursor-pointer"
            >
              (Điền nhanh)
            </button>
          </div>
        </div>
      </div>

      {/* Footer Back Link */}
      <div className="mt-8 text-center relative z-10">
        <Link
          href="/"
          className="text-xs text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1.5 font-medium"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại website khách hàng (lining.id.vn)
        </Link>
      </div>
    </div>
  );
}

