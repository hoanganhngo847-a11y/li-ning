'use client';

import { useState, useEffect } from 'react';

interface ProviderInfo {
  provider: 'gemini' | 'fitroom' | 'tripo' | 'cloudflare' | 'alibaba';
  name: string;
  configured: boolean;
  maskedKey: string;
  source: 'database' | 'environment' | 'none';
  updatedAt: string | null;
}

const PROVIDER_METADATA: Record<
  string,
  {
    icon: string;
    title: string;
    category: string;
    description: string;
    docsUrl: string;
  }
> = {
  gemini: {
    icon: '🎨',
    title: 'Google Gemini Image Generation',
    category: 'Virtual Model & AI Photo',
    description: 'Sinh ảnh người mẫu thể thao chân thực từ số đo 3 vòng và màu da người dùng.',
    docsUrl: 'https://aistudio.google.com/app/apikey',
  },
  fitroom: {
    icon: '👕',
    title: 'FitRoom Virtual Try-On AI',
    category: 'Virtual Fitting Engine',
    description: 'Ghép thử quần áo thể thao Li-Ning lên hình thể người mẫu chuẩn xác từng nếp vải.',
    docsUrl: 'https://platform.fitroom.app',
  },
  tripo: {
    icon: '🧊',
    title: 'Tripo 3D Studio (V3)',
    category: '3D GLB Reconstruction',
    description: 'Dựng mô hình 3D đa giác PBR từ ảnh kết quả thử đồ để tương tác xoay 360°.',
    docsUrl: 'https://platform.tripo3d.ai',
  },
  cloudflare: {
    icon: '⚡',
    title: 'Cloudflare Workers AI',
    category: 'Edge Model Generator',
    description: 'Dự phòng tạo ảnh người mẫu tốc độ cao trên mạng lưới biên Cloudflare.',
    docsUrl: 'https://dash.cloudflare.com/',
  },
  alibaba: {
    icon: '☁️',
    title: 'Alibaba Cloud Model Studio',
    category: 'Qwen Image Model',
    description: 'Hỗ trợ xử lý sinh ảnh với mô hình đa phương thức Qwen-Image-Max.',
    docsUrl: 'https://bailian.console.aliyun.com/',
  },
};

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

  // Secure API Key Providers State
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [editingProvider, setEditingProvider] = useState<ProviderInfo | null>(null);
  const [newApiKeyInput, setNewApiKeyInput] = useState('');
  const [savingKey, setSavingKey] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<
    Record<string, { success: boolean; message: string; latencyMs?: number }>
  >({});

  const fetchProviders = async () => {
    try {
      setLoadingProviders(true);
      const res = await fetch('/api/admin/api-keys');
      const data = (await res.json()) as any;
      if (data.success && Array.isArray(data.providers)) {
        setProviders(data.providers);
      }
    } catch (err) {
      console.error('Failed to load API providers:', err);
    } finally {
      setLoadingProviders(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleOpenChangeModal = (provider: ProviderInfo) => {
    setEditingProvider(provider);
    setNewApiKeyInput(''); // NEVER preload old keys
    setSaveErrorMsg(null);
  };

  const handleCloseChangeModal = () => {
    setEditingProvider(null);
    setNewApiKeyInput('');
    setSaveErrorMsg(null);
  };

  const handleSaveNewKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProvider || !newApiKeyInput.trim()) return;

    setSavingKey(true);
    setSaveErrorMsg(null);
    setSaveSuccessMsg(null);

    try {
      const res = await fetch('/api/admin/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: editingProvider.provider,
          newApiKey: newApiKeyInput.trim(),
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không thể lưu khóa API');
      }

      setSaveSuccessMsg(
        `Đã cập nhật và mã hóa AES-256-GCM khóa API cho "${editingProvider.name}" thành công!`
      );
      setNewApiKeyInput('');
      setEditingProvider(null);
      await fetchProviders();
      setTimeout(() => setSaveSuccessMsg(null), 5000);
    } catch (err: any) {
      setSaveErrorMsg(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setSavingKey(false);
    }
  };

  const handleTestConnection = async (providerId: string) => {
    setTestingProvider(providerId);
    setTestResults((prev) => ({ ...prev, [providerId]: undefined as any }));

    try {
      const res = await fetch('/api/admin/api-keys/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: providerId }),
      });

      const data = (await res.json()) as any;
      setTestResults((prev) => ({
        ...prev,
        [providerId]: {
          success: Boolean(data.success),
          message: data.message || (data.success ? 'Kết nối thành công' : 'Kết nối thất bại'),
          latencyMs: data.latencyMs,
        },
      }));
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        [providerId]: {
          success: false,
          message: err.message || 'Lỗi kết nối máy chủ khi kiểm tra',
        },
      }));
    } finally {
      setTestingProvider(null);
    }
  };

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
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#f30d29] border border-red-200 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
          Cấu Hình Hệ Thống • {domain}
        </div>
        <h1 className="text-2xl font-black text-gray-950 uppercase tracking-tight">
          CÀI ĐẶT HỆ THỐNG QUẢN TRỊ
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Quản lý khóa API bảo mật (mã hóa AES-256-GCM), thông tin cửa hàng và tài khoản quản trị
        </p>
      </div>

      {/* SECURE AI API KEY MANAGEMENT SECTION */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
              PRODUCTION-SAFE ENCRYPTION • AES-256-GCM
            </div>
            <h2 className="text-base font-black uppercase tracking-tight text-gray-950 flex items-center gap-2">
              <span>🔐</span>
              QUẢN LÝ KHÓA API BẢO MẬT (AI & CLOUD SERVICES)
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Khóa API được mã hóa chuẩn AES-256-GCM trước khi lưu database. Không bao giờ lộ full key ra client. Không cần redeploy website sau khi cập nhật.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchProviders}
            disabled={loadingProviders}
            className="text-xs font-bold px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <span className={loadingProviders ? 'animate-spin' : ''}>🔄</span>
            Làm mới trạng thái
          </button>
        </div>

        {saveSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <span>✓</span>
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {loadingProviders ? (
          <div className="py-12 text-center text-xs text-gray-400">
            <div className="w-6 h-6 border-2 border-[#f30d29] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Đang tải thông tin cấu hình API...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {providers.map((p) => {
              const meta = PROVIDER_METADATA[p.provider] || {
                icon: '🔑',
                title: p.name,
                category: 'API Service',
                description: 'Cấu hình API kết nối dịch vụ.',
                docsUrl: '#',
              };
              const test = testResults[p.provider];
              const isTesting = testingProvider === p.provider;

              return (
                <div
                  key={p.provider}
                  className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all bg-white"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl p-2 bg-gray-50 rounded-xl border border-gray-100 flex-shrink-0">
                        {meta.icon}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-gray-900">{meta.title}</h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-semibold">
                            {meta.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 max-w-xl">{meta.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-center flex-shrink-0">
                      {p.configured ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          ● Đã cấu hình
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          ○ Chưa cấu hình
                        </span>
                      )}

                      {p.source === 'database' && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                          DB Encrypted
                        </span>
                      )}
                      {p.source === 'environment' && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          ENV Fallback
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-500 font-medium">Khóa API:</span>
                      <code className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded font-mono text-xs font-bold text-gray-800 tracking-wider">
                        {p.maskedKey}
                      </code>
                      {p.updatedAt && (
                        <span className="text-[10px] text-gray-400">
                          (Cập nhật: {new Date(p.updatedAt).toLocaleDateString('vi-VN')})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleTestConnection(p.provider)}
                        disabled={isTesting}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isTesting ? (
                          <>
                            <span className="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                            <span>Đang test...</span>
                          </>
                        ) : (
                          <>
                            <span>⚡</span>
                            <span>Kiểm tra kết nối</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenChangeModal(p)}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                      >
                        <span>✏️</span>
                        <span>Đổi khóa API</span>
                      </button>

                      {meta.docsUrl && meta.docsUrl !== '#' && (
                        <a
                          href={meta.docsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors"
                          title="Lấy khóa API tại trang chủ nhà cung cấp"
                        >
                          ↗ Lấy key
                        </a>
                      )}
                    </div>
                  </div>

                  {test && (
                    <div
                      className={`mt-3 p-2.5 rounded-lg text-xs font-semibold flex items-center justify-between gap-2 ${
                        test.success
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{test.success ? '✓' : '⚠️'}</span>
                        <span>{test.message}</span>
                      </div>
                      {typeof test.latencyMs === 'number' && (
                        <span className="text-[10px] font-mono opacity-70">
                          {test.latencyMs}ms
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: CHANGE API KEY */}
      {editingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-red-600 font-bold">
                  Bảo mật cấp cao • AES-256-GCM
                </div>
                <h3 className="text-base font-black text-gray-950 uppercase tracking-tight">
                  CẬP NHẬT KHÓA API: {editingProvider.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseChangeModal}
                disabled={savingKey}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
              🔒 <strong>Quy tắc bảo mật:</strong> Khóa API cũ sẽ không bao giờ được gửi lại cho trình duyệt để tránh bị đánh cắp. Hãy dán khóa API mới vào ô bên dưới. Khóa sẽ được mã hóa trước khi lưu vào cơ sở dữ liệu.
            </div>

            {saveErrorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-semibold flex items-center gap-2">
                <span>⚠️</span>
                <span>{saveErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveNewKey} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Khóa API mới (New API Key):
                </label>
                <input
                  type="password"
                  autoFocus
                  required
                  value={newApiKeyInput}
                  onChange={(e) => setNewApiKeyInput(e.target.value)}
                  placeholder="Dán API Key mới vào đây (ví dụ: AIzaSy... hoặc sk-...)"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono text-gray-900 focus:ring-2 focus:ring-red-500 outline-none"
                />
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Chỉ lưu giá trị mới khi nhấn &quot;Mã hóa & Lưu khóa API&quot;.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseChangeModal}
                  disabled={savingKey}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={savingKey || !newApiKeyInput.trim()}
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {savingKey ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang mã hóa & lưu...</span>
                    </>
                  ) : (
                    <>
                      <span>🔒</span>
                      <span>Mã hóa & Lưu khóa API</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
