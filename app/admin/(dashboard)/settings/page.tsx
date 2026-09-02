'use client';

import { useState } from 'react';

export default function AdminSettingsPage() {
  const [domain, setDomain] = useState('lining.id.vn');
  const [hotline, setHotline] = useState('1900633083');
  const [email, setEmail] = useState('cskh@lining.id.vn');
  const [address, setAddress] = useState('31 Lê Văn Lương, P. Nhân Chính, Q. Thanh Xuân, Hà Nội');
  const [saved, setSaved] = useState(false);

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState('');

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setPassMsg('Mật khẩu xác nhận không khớp!');
      return;
    }
    setPassMsg('Đã cập nhật mật khẩu quản trị thành công!');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setTimeout(() => setPassMsg(''), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#f30d29] border border-red-200 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
          Cấu Hình Hệ Thống • {domain}
        </div>
        <h1 className="text-2xl font-black text-gray-950 uppercase tracking-tight">
          CÀI ĐẶT HỆ THỐNG QUẢN TRỊ
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Quản lý tên miền, thông tin liên hệ cửa hàng và bảo mật tài khoản quản trị
        </p>
      </div>

      {/* Domain & Store Info */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#f30d29]" />
          THÔNG TIN TÊN MIỀN & CỬA HÀNG
        </h2>

        {saved && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl text-center">
            ✓ Đã lưu cài đặt thông tin hệ thống thành công!
          </div>
        )}

        <form onSubmit={handleSaveInfo} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Tên miền chính (Domain)</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-gray-900 font-bold focus:ring-2 focus:ring-[#f30d29] outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Hotline CSKH</label>
              <input
                type="text"
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-gray-900 font-bold focus:ring-2 focus:ring-[#f30d29] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Email hỗ trợ</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-[#f30d29] outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Địa chỉ trụ sở chính</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-[#f30d29] outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#111111] hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Lưu thay đổi thông tin
          </button>
        </form>
      </div>

      {/* Security & Password */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          BẢO MẬT & ĐỔI MẬT KHẨU QUẢN TRỊ
        </h2>

        {passMsg && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-xl text-center">
            {passMsg}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-md">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Mật khẩu hiện tại</label>
            <input
              type="password"
              required
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#f30d29] outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Mật khẩu mới</label>
            <input
              type="password"
              required
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#f30d29] outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              required
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#f30d29] outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-[#f30d29] hover:bg-[#d10b23] text-white px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Đổi mật khẩu Admin
          </button>
        </form>
      </div>
    </div>
  );
}
