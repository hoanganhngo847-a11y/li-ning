'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CategoryPicker from '../../../../components/CategoryPicker';

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
  });

  const [collections, setCollections] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState<number | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        if (res.ok) {
          const data: any = await res.json();
          setFormData({
            title: data.title || '',
            sku: data.sku || '',
            price: data.price?.toString() || '',
            compareAtPrice: data.compareAtPrice?.toString() || '',
            description: data.description || '',
            gender: data.gender || 'nam',
            sport: data.sport || 'thoi-trang',
            available: data.available !== false,
          });
          setCollections(data.collections || []);
          setImages(data.images?.length ? data.images : ['']);
        } else {
          setError('Không tìm thấy sản phẩm');
        }
      } catch (err) {
        setError('Lỗi kết nối');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

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
    setSaving(true);
    setError('');

    if (collections.length === 0) {
      setError('Vui lòng chọn ít nhất 1 danh mục');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
        images: images.filter(img => img.trim() !== ''),
        collections,
      };

      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
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
      setError('Lỗi kết nối');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/products');
      }
    } catch (err) {
      setError('Lỗi khi xóa sản phẩm');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-gray-500">Đang tải sản phẩm...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Sửa sản phẩm</h1>
        <div className="flex gap-3">
          <button onClick={handleDelete} className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium">
            Xóa sản phẩm
          </button>
          <a href="/admin/products" className="text-gray-600 hover:underline py-2">
            Quay lại
          </a>
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin cơ bản */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Thông tin cơ bản</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Tên sản phẩm *</label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full p-2 border rounded focus:border-[#f30d29] outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">SKU *</label>
              <input type="text" name="sku" required value={formData.sku} onChange={handleChange} className="w-full p-2 border rounded focus:border-[#f30d29] outline-none" />
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} className="w-5 h-5 text-[#f30d29]" />
                <span className="font-medium">Hiển thị (Available)</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Giá bán (VNĐ) *</label>
              <input type="number" name="price" required min="0" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded focus:border-[#f30d29] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Giá gốc (VNĐ) - Tùy chọn</label>
              <input type="number" name="compareAtPrice" min="0" value={formData.compareAtPrice} onChange={handleChange} className="w-full p-2 border rounded focus:border-[#f30d29] outline-none" placeholder="Để trống nếu không sale" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full p-2 border rounded focus:border-[#f30d29] outline-none" />
          </div>
        </div>

        {/* Giới tính */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Giới tính</h2>
          <div className="flex gap-4">
            {[
              { value: 'nam', label: 'Nam' },
              { value: 'nu', label: 'Nữ' },
              { value: 'unisex', label: 'Unisex' },
              { value: 'kids', label: 'Trẻ em' },
            ].map(opt => (
              <label key={opt.value} className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-colors ${formData.gender === opt.value ? 'bg-red-50 border-[#f30d29] text-[#f30d29] font-semibold' : 'hover:bg-gray-50'}`}>
                <input type="radio" name="gender" value={opt.value} checked={formData.gender === opt.value} onChange={handleChange} className="hidden" />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Danh mục */}
        <CategoryPicker selected={collections} onChange={setCollections} />

        {/* Hình ảnh */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Hình ảnh sản phẩm</h2>

          {images.map((img, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={img}
                  onChange={(e) => handleImageChange(idx, e.target.value)}
                  placeholder="Nhập URL ảnh hoặc upload từ máy..."
                  className="flex-1 p-2 border rounded focus:border-[#f30d29] outline-none"
                />
                <label className="px-3 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 text-sm whitespace-nowrap">
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
                <button type="button" onClick={() => removeImageField(idx)} className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm">
                  Xóa
                </button>
              </div>
              {img && (
                <div className="ml-2">
                  <img src={img} alt={`Ảnh ${idx + 1}`} className="w-20 h-20 object-cover rounded border" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>
          ))}
          <button type="button" onClick={addImageField} className="text-sm text-blue-600 hover:underline">
            + Thêm ảnh
          </button>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <a href="/admin/products" className="px-6 py-2 border rounded hover:bg-gray-50 font-medium">
            Hủy
          </a>
          <button type="submit" disabled={saving} className="px-6 py-2 bg-[#f30d29] text-white rounded hover:bg-red-700 font-medium disabled:opacity-70">
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
}
