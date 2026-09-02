'use client';

import { useState, useEffect } from 'react';

interface Product3DUploaderProps {
  title?: string;
  collections?: string[];
  model3d: string;
  model3dTop?: string;
  model3dBottom?: string;
  onChange: (models: { model3d: string; model3dTop: string; model3dBottom: string }) => void;
}

interface SingleUploadZoneProps {
  label: string;
  sublabel: string;
  icon: string;
  value: string;
  onChange: (url: string) => void;
  accentColor?: 'red' | 'blue' | 'emerald';
}

// Chunk size 2.5MB (Safely beneath Vercel's 4.5MB serverless limit)
const CHUNK_SIZE = 2.5 * 1024 * 1024;

function SingleUploadZone({
  label,
  sublabel,
  icon,
  value,
  onChange,
  accentColor = 'blue',
}: SingleUploadZoneProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const getFormatBadge = (url: string) => {
    const ext = url.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'glb':
        return { label: 'GLB 3D (Khuyên dùng)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'gltf':
        return { label: 'GLTF 3D', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'usdz':
        return { label: 'USDZ (iOS AR)', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'obj':
        return { label: 'OBJ 3D Model', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'fbx':
        return { label: 'FBX 3D Model', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      default:
        return { label: 'File 3D', color: 'bg-gray-50 text-gray-700 border-gray-200' };
    }
  };

  const handleFileUpload = async (file: File) => {
    setError('');
    setUploading(true);
    setUploadPercent(0);

    const totalSizeMb = (file.size / (1024 * 1024)).toFixed(1);
    const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));
    const uploadId = `up-${Date.now()}-${Math.round(Math.random() * 1e6)}`;

    setUploadStatusText(`Chuẩn bị tải ${file.name} (${totalSizeMb} MB, ${totalChunks} phần)...`);

    try {
      let finalUrl = '';

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(file.size, start + CHUNK_SIZE);
        const chunkBlob = file.slice(start, end);

        const currentUploadedMb = (end / (1024 * 1024)).toFixed(1);
        const percent = Math.round(((chunkIndex + 1) / totalChunks) * 100);
        setUploadPercent(percent);
        setUploadStatusText(
          `Đang tải phần ${chunkIndex + 1}/${totalChunks} (${currentUploadedMb} MB / ${totalSizeMb} MB) • ${percent}%`
        );

        const res = await fetch('/api/admin/upload-chunk', {
          method: 'POST',
          headers: {
            'content-type': 'application/octet-stream',
            'x-upload-id': uploadId,
            'x-chunk-index': chunkIndex.toString(),
            'x-total-chunks': totalChunks.toString(),
            'x-filename': encodeURIComponent(file.name),
          },
          body: chunkBlob,
        });

        const rawText = await res.text();
        let resJson: any;
        try {
          resJson = JSON.parse(rawText);
        } catch {
          resJson = { error: rawText.slice(0, 150) };
        }

        if (!res.ok) {
          throw new Error(resJson.error || `Lỗi tải phần ${chunkIndex + 1} (HTTP ${res.status})`);
        }

        if (resJson.done && resJson.url) {
          finalUrl = resJson.url;
        }
      }

      if (finalUrl) {
        onChange(finalUrl);
        setUploadStatusText('✓ Tải lên và ghép file 3D thành công!');
      } else {
        throw new Error('Chưa nhận được URL file sau khi hoàn tất');
      }
    } catch (err: any) {
      console.error('Upload Error:', err);
      setError(
        err?.message || 'Có lỗi xảy ra khi tải file 3D lên máy chủ. Bạn cũng có thể dùng nút "Link URL" để gắn link trực tiếp.'
      );
    } finally {
      setUploading(false);
      setTimeout(() => {
        setUploadPercent(0);
        setUploadProgressText('');
      }, 3000);
    }
  };

  const setUploadProgressText = (text: string) => {
    setUploadStatusText(text);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onChange(customUrl.trim());
      setShowUrlInput(false);
    }
  };

  const fileName = value ? value.split('/').pop() : '';
  const badge = value ? getFormatBadge(value) : null;

  return (
    <div className="flex-1 p-4 rounded-2xl bg-gray-50/70 border border-gray-200 flex flex-col justify-between gap-3">
      {/* Zone Header */}
      <div className="flex items-center justify-between gap-2 border-b border-gray-200/80 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xl shrink-0">{icon}</span>
          <div>
            <div className="text-xs font-black uppercase text-gray-900 tracking-wider flex items-center gap-1.5">
              <span>{label}</span>
              {value && <span className="text-emerald-600 text-[11px]">✓</span>}
            </div>
            <div className="text-[10.5px] text-gray-500 font-medium">{sublabel}</div>
          </div>
        </div>

        {value ? (
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
            Đã có file 3D
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-[10px] font-medium">
            Chưa có file
          </span>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-start justify-between gap-2">
          <span>✕ {error}</span>
          <button
            type="button"
            onClick={() => setError('')}
            className="text-red-400 hover:text-red-700 font-bold px-1 text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* Value State */}
      {value ? (
        <div className="p-3.5 bg-white rounded-xl border border-gray-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="font-bold text-gray-900 text-xs truncate max-w-[220px]" title={fileName}>
                {fileName}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                {badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold border ${badge.color}`}>
                    {badge.label}
                  </span>
                )}
                <span className="text-[10px] text-gray-400 font-mono truncate max-w-[140px]" title={value}>
                  {value}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold"
              >
                Tải ↗
              </a>
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-bold cursor-pointer"
              >
                Gỡ
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Drag Drop or Upload */
        <div className="space-y-2">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`p-5 border-2 border-dashed rounded-xl text-center transition-all flex flex-col items-center justify-center gap-2 ${
              dragOver
                ? 'border-[#f30d29] bg-red-50/50 scale-[0.99]'
                : 'border-gray-300 hover:border-gray-400 bg-white'
            }`}
          >
            <span className="text-2xl opacity-85">{icon}</span>

            {/* Upload Progress Bar if Uploading */}
            {uploading ? (
              <div className="w-full max-w-xs space-y-2 py-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-800">
                  <span className="truncate max-w-[180px]">{uploadStatusText}</span>
                  <span className="font-mono text-[#f30d29]">{uploadPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#f30d29] h-2 rounded-full transition-all duration-200"
                    style={{ width: `${uploadPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div>
                <div className="text-xs font-bold text-gray-900">
                  Kéo thả file 3D (.glb, .gltf, .obj...)
                </div>
                <div className="text-[10.5px] text-gray-400 mt-0.5">
                  Tự động cắt nhỏ upload phân đoạn (Hỗ trợ file dung lượng lớn 50MB - 100MB+)
                </div>
              </div>
            )}

            {!uploading && (
              <div className="flex items-center gap-2 pt-1">
                <label className="px-3.5 py-1.5 bg-[#111111] hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs transition-all flex items-center gap-1.5">
                  <span>Chọn file từ máy</span>
                  <input
                    type="file"
                    accept=".glb,.gltf,.usdz,.obj,.fbx,.stl,.zip"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {showUrlInput ? 'Ẩn URL' : 'Link URL'}
                </button>
              </div>
            )}
          </div>

          {showUrlInput && (
            <form onSubmit={handleApplyUrl} className="flex gap-1.5 p-2 bg-white rounded-xl border border-gray-200 shadow-2xs">
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://.../model.glb hoặc link Cloud 3D..."
                className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-900 outline-none focus:border-[#f30d29]"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-bold cursor-pointer shrink-0"
              >
                Áp dụng
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default function Product3DUploader({
  title = '',
  collections = [],
  model3d,
  model3dTop = '',
  model3dBottom = '',
  onChange,
}: Product3DUploaderProps) {
  // Auto-detect if product is a Suit/Set (Bộ quần áo)
  const isSuitAuto =
    title.toLowerCase().includes('bộ quần áo') ||
    title.toLowerCase().includes('bộ cầu lông') ||
    title.toLowerCase().includes('bộ pickleball') ||
    title.toLowerCase().includes('bộ bóng đá') ||
    title.toLowerCase().includes('bộ bóng rổ') ||
    title.toLowerCase().includes('set quần áo') ||
    title.toLowerCase().includes('bộ đồ') ||
    collections.some((c) => c.startsWith('bo-quan-ao'));

  const [mode, setMode] = useState<'single' | 'suit'>(() => {
    if (model3dTop || model3dBottom || isSuitAuto) return 'suit';
    return 'single';
  });

  useEffect(() => {
    if (isSuitAuto && mode === 'single' && !model3d) {
      setMode('suit');
    }
  }, [isSuitAuto]);

  const handleSingleChange = (url: string) => {
    onChange({
      model3d: url,
      model3dTop: '',
      model3dBottom: '',
    });
  };

  const handleTopChange = (url: string) => {
    onChange({
      model3d: url || model3dBottom || '',
      model3dTop: url,
      model3dBottom: model3dBottom || '',
    });
  };

  const handleBottomChange = (url: string) => {
    onChange({
      model3d: model3dTop || url || '',
      model3dTop: model3dTop || '',
      model3dBottom: url,
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-2xs border border-gray-200 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-950">
              MÔ HÌNH 3D SẢN PHẨM (3D MODEL / AR 360°)
            </h2>
            {isSuitAuto && (
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold font-mono">
                ⚡ Nhận diện: Bộ quần áo
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Hỗ trợ upload file 3D dung lượng lớn (50MB - 100MB+) với công nghệ cắt nhỏ phân đoạn (Chunked Upload) tự động
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMode('single')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'single'
                ? 'bg-white text-gray-900 shadow-2xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>👟</span> 1 File 3D (Đơn)
          </button>
          <button
            type="button"
            onClick={() => setMode('suit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'suit'
                ? 'bg-[#111111] text-white shadow-2xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>👔</span> 2 File 3D (Áo + Quần)
          </button>
        </div>
      </div>

      {/* Upload Zone Render */}
      {mode === 'suit' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. 3D Model for Shirt / Top */}
          <SingleUploadZone
            label="Mô hình 3D của ÁO"
            sublabel="Áo thun, Polo, Áo thi đấu, Áo gió..."
            icon="🧥"
            value={model3dTop}
            onChange={handleTopChange}
            accentColor="blue"
          />

          {/* 2. 3D Model for Pants / Bottom */}
          <SingleUploadZone
            label="Mô hình 3D của QUẦN"
            sublabel="Quần short, Quần nỉ, Quần thi đấu, Váy..."
            icon="🩳"
            value={model3dBottom}
            onChange={handleBottomChange}
            accentColor="emerald"
          />
        </div>
      ) : (
        /* Single Model Zone */
        <SingleUploadZone
          label="Mô hình 3D sản phẩm"
          sublabel="File 3D tổng thể (Giày, Vợt, Áo đơn, Quần đơn, Phụ kiện...)"
          icon="🧊"
          value={model3d}
          onChange={handleSingleChange}
          accentColor="blue"
        />
      )}

      {/* Info footer */}
      <div className="pt-2 flex items-center justify-between text-[11px] text-gray-400">
        <span>* Định dạng khuyên dùng: .glb hoặc .gltf • Tự động vượt giới hạn Vercel 4.5MB bằng Chunked Stream</span>
        {(model3d || model3dTop || model3dBottom) && (
          <span className="font-bold text-emerald-600 flex items-center gap-1">
            <span>●</span> Đã sẵn sàng hiển thị chế độ 3D trên website
          </span>
        )}
      </div>
    </div>
  );
}
