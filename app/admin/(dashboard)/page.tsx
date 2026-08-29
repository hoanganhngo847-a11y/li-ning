'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/admin/products');
        if (res.ok) {
          const data: any[] = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const totalProducts = products.length;
  const outOfStock = products.filter(p => !p.available).length;
  const onSale = products.filter(p => p.compareAtPrice && p.compareAtPrice > p.price).length;
  
  // Get unique categories (simplified)
  const categories = new Set(products.flatMap(p => p.collections || [])).size;

  if (loading) return <div className="text-center py-10">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="space-x-3">
          <Link href="/admin/products/new" className="bg-[#f30d29] text-white px-4 py-2 rounded shadow hover:bg-red-700">
            + Thêm sản phẩm
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Tổng sản phẩm</div>
          <div className="text-3xl font-bold text-gray-900">{totalProducts}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Đang sale</div>
          <div className="text-3xl font-bold text-[#f30d29]">{onSale}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Hết hàng / Ẩn</div>
          <div className="text-3xl font-bold text-yellow-600">{outOfStock}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Danh mục</div>
          <div className="text-3xl font-bold text-blue-600">{categories}</div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Quản trị cây danh mục</h2>
            <p className="mt-1 text-sm text-gray-500">
              Kiểm tra danh mục cha, nhóm danh mục, danh mục con và toàn bộ sản phẩm đang nằm trong từng mục.
            </p>
          </div>
          <Link
            href="/admin/categories"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Mở trang danh mục
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Sản phẩm mới nhất</h2>
          <Link href="/admin/products" className="text-sm text-[#f30d29] hover:underline">Xem tất cả</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="px-6 py-3 font-medium">Sản phẩm</th>
                <th className="px-6 py-3 font-medium">SKU</th>
                <th className="px-6 py-3 font-medium">Giá</th>
                <th className="px-6 py-3 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.slice(0, 10).map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.images && product.images[0] && (
                        <img src={product.images[0]} alt="" className="w-10 h-10 object-cover rounded" />
                      )}
                      <span className="font-medium text-gray-900 line-clamp-1">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.sku}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {new Intl.NumberFormat('vi-VN').format(product.price)}₫
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${product.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {product.available ? 'Hiển thị' : 'Đã ẩn'}
                    </span>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Chưa có sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
