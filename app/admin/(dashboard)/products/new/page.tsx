'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CategoryPicker from '../../../components/CategoryPicker';
import Product3DUploader from '../../../components/Product3DUploader';

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    sku: '',
    price: '',
    compareAtPrice: '',
    description: '',
    gender: 'nam' as 'nam' | 'nu' | 'unisex' | 'kids',
    sport: 'thoi-trang',
    available: true,
    model3d: '',
    model3dTop: '',
    model3dBottom: '',
  });

  const [collections, setCollections] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>(['']);
  const [uploading, setUploading] = useState<number | null>(null);

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImageField = () => setImages([...images, '']);
  const removeImageField = (index: number) => setImages(images.filter((_, i) => i !== index));

  const handleFileUpload = async (index: number, file: File) => {
    setUploading(index);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formDataUpload });
      if (res.ok) {
        const data: any = await res.json();
        handleImageChange(index, data.url);
      } else {
        setError('Upload ảnh thất bại');
      }
    } catch {
      setError('Lỗi khi upload ảnh');
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (collections.length === 0) {
      setError('Vui lòng chọn ít nhất 1 danh mục');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
        images: images.filter((img) => img.trim() !== ''),
        collections,
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/admin/products');
      } else {
        const data: any = await res.json();
        setError(data.error || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
            Admin Portal
          </span>
          <h1 className="text-2xl font-black text-gray-950 uppercase tracking-tight mt-1">Thêm sản phẩm mới</h1>
          <p className="text-xs text-gray-500">Tạo mới sản phẩm, thiết lập ảnh, cây danh mục và tải lên file mô hình 3D AR</p>
        </div>
        <a href="/admin/products" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors">
          Quay lại danh sách
        </a>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-bold">
          ✕ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin cơ bản */}
        <div className="bg-white p-6 rounded-2xl shadow-2xs border border-gray-200 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-950 border-b pb-2">
            1. Thông tin cơ bản
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Tên sản phẩm *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Ví dụ: Giày cầu lông Nam Halbertec Pro..."
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-[#f30d29] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Mã SKU *</label>
              <input
                type="text"
                name="sku"
                required
                value={formData.sku}
                onChange={handleChange}
                placeholder="AYTT001-1"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-900 focus:ring-2 focus:ring-[#f30d29] outline-none"
              />
            </div>
            <div className="flex items-center pt-2 sm:pt-6">
              <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#f30d29] rounded"
                />
                <span className="text-xs font-bold text-gray-800">Hiển thị bán trên website (Available)</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Giá bán (VNĐ) *</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="890000"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-900 focus:ring-2 focus:ring-[#f30d29] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Giá gốc / Giá niêm yết (VNĐ)</label>
              <input
                type="number"
                name="compareAtPrice"
                min="0"
                value={formData.compareAtPrice}
                onChange={handleChange}
                placeholder="Để trống nếu không khuyến mãi"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-900 focus:ring-2 focus:ring-[#f30d29] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Mô tả sản phẩm</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả chi tiết, công nghệ và chất liệu của sản phẩm..."
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-[#f30d29] outline-none"
            />
          </div>
        </div>

        {/* Giới tính */}
        <div className="bg-white p-6 rounded-2xl shadow-2xs border border-gray-200 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-950 border-b pb-2">
            2. Giới tính phù hợp
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: 'nam', label: 'Nam' },
              { value: 'nu', label: 'Nữ' },
              { value: 'unisex', label: 'Unisex' },
              { value: 'kids', label: 'Trẻ em' },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all text-xs font-bold ${
                  formData.gender === opt.value
                    ? 'bg-red-50 border-[#f30d29] text-[#f30d29] shadow-xs'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value={opt.value}
                  checked={formData.gender === opt.value}
                  onChange={handleChange}
                  className="hidden"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Danh mục */}
        <CategoryPicker selected={collections} onChange={setCollections} />

        {/* Upload file mô hình 3D (Đơn hoặc Tách riêng Áo + Quần cho Bộ quần áo) */}
        <Product3DUploader
          title={formData.title}
          collections={collections}
          model3d={formData.model3d}
          model3dTop={formData.model3dTop}
          model3dBottom={formData.model3dBottom}
          onChange={(models) =>
            setFormData((prev) => ({
              ...prev,
              model3d: models.model3d,
              model3dTop: models.model3dTop,
              model3dBottom: models.model3dBottom,
            }))
          }
        />


        {/* Hình ảnh 2D thông thường */}
        <div className="bg-white p-6 rounded-2xl shadow-2xs border border-gray-200 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-950 border-b pb-2">
            Hình ảnh sản phẩm (2D)
          </h2>

          {images.map((img, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={img}
                  onChange={(e) => handleImageChange(idx, e.target.value)}
                  placeholder="Nhập URL ảnh hoặc upload từ máy..."
                  className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-[#f30d29] outline-none"
                />
                <label className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer text-xs font-bold whitespace-nowrap shadow-xs">
                  {uploading === idx ? 'Đang tải...' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(idx, file);
                    }}
                    disabled={uploading !== null}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeImageField(idx)}
                  className="px-3 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Xóa
                </button>
              </div>
              {img && (
                <div className="ml-2">
                  <img
                    src={img}
                    alt={`Ảnh ${idx + 1}`}
                    className="w-20 h-20 object-contain rounded-xl border border-gray-200 bg-white p-1"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
          >
            + Thêm ảnh khác
          </button>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4">
          <a
            href="/admin/products"
            className="px-6 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </a>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#f30d29] hover:bg-[#d10b23] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-md transition-all disabled:opacity-70 cursor-pointer"
          >
            {loading ? 'Đang lưu sản phẩm...' : 'Lưu sản phẩm mới'}
          </button>
        </div>
      </form>
    </div>
  );
}
