'use client';

import { useEffect, useState } from 'react';
import { adminCategoryTree, getLeafCategories, getCategoryPath, getPrimaryLeafHandle, type AdminCategoryNode } from '../../lib/category-tree';
import { getProductsForCollection } from '@/app/lib/data/collectionMap';
import type { Product } from '@/app/lib/types';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [activeParentHandle, setActiveParentHandle] = useState(adminCategoryTree[0]?.handle || '');
  const activeParent = adminCategoryTree.find((category) => category.handle === activeParentHandle) || adminCategoryTree[0];
  const [activeGroupHandle, setActiveGroupHandle] = useState(activeParent?.children[0]?.handle || activeParent?.handle || '');
  const activeGroup = activeParent?.children.find((category) => category.handle === activeGroupHandle) || activeParent?.children[0] || activeParent;
  const leafCategories = activeGroup ? (activeGroup.children.length > 0 ? getLeafCategories(activeGroup) : getLeafCategories(activeParent)) : [];
  const [activeLeafHandle, setActiveLeafHandle] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json() as Product[];
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleParentSelect = (parent: AdminCategoryNode) => {
    setActiveParentHandle(parent.handle);
    const nextGroup = parent.children[0] || parent;
    setActiveGroupHandle(nextGroup.handle);
    setActiveLeafHandle('');
  };

  const handleGroupSelect = (group: AdminCategoryNode) => {
    setActiveGroupHandle(group.handle);
    setActiveLeafHandle('');
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        alert('Có lỗi xảy ra khi xóa');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối');
    }
  };

  const categoryScopedProducts = activeLeafHandle
    ? getProductsForCollection(products, activeLeafHandle)
    : activeGroup
      ? getProductsForCollection(products, activeGroup.handle)
      : products;

  const filteredProducts = categoryScopedProducts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesGender = genderFilter ? p.gender === genderFilter : true;
    return matchesSearch && matchesGender;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
        <a href="/admin/products/new" className="bg-[#f30d29] text-white px-4 py-2 rounded shadow hover:bg-red-700">
          + Thêm sản phẩm
        </a>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Lọc theo cây danh mục</h2>
            <p className="text-sm text-gray-500">Chọn danh mục cha, nhóm danh mục rồi danh mục con để xem đúng sản phẩm.</p>
          </div>
          {activeLeafHandle && (
            <button
              type="button"
              onClick={() => setActiveLeafHandle('')}
              className="text-sm font-semibold text-[#f30d29] hover:underline"
            >
              Xem cả nhóm
            </button>
          )}
        </div>

        <div className="grid gap-3 xl:grid-cols-[220px_260px_1fr]">
          <div className="rounded-md border border-gray-200">
            <div className="border-b border-gray-200 px-3 py-2 text-xs font-bold uppercase tracking-wide text-gray-500">Danh mục cha</div>
            <div className="max-h-64 overflow-auto p-2">
              {adminCategoryTree.map((parent) => (
                <button
                  key={parent.handle}
                  type="button"
                  onClick={() => handleParentSelect(parent)}
                  className={`mb-1 w-full rounded-md px-3 py-2 text-left text-sm transition ${
                    activeParent?.handle === parent.handle
                      ? 'bg-[#f30d29] font-semibold text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {parent.title}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-gray-200">
            <div className="border-b border-gray-200 px-3 py-2 text-xs font-bold uppercase tracking-wide text-gray-500">Nhóm danh mục</div>
            <div className="max-h-64 overflow-auto p-2">
              {(activeParent?.children.length ? activeParent.children : activeParent ? [activeParent] : []).map((group) => (
                <button
                  key={group.handle}
                  type="button"
                  onClick={() => handleGroupSelect(group)}
                  className={`mb-1 w-full rounded-md px-3 py-2 text-left text-sm transition ${
                    activeGroup?.handle === group.handle
                      ? 'bg-gray-950 font-semibold text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {group.title}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-gray-200">
            <div className="border-b border-gray-200 px-3 py-2 text-xs font-bold uppercase tracking-wide text-gray-500">Danh mục con</div>
            <div className="grid max-h-64 gap-2 overflow-auto p-2 sm:grid-cols-2 lg:grid-cols-3">
              {leafCategories.map((leaf) => (
                <button
                  key={leaf.handle}
                  type="button"
                  onClick={() => setActiveLeafHandle(leaf.handle)}
                  className={`rounded-md border px-3 py-2 text-left text-sm transition ${
                    activeLeafHandle === leaf.handle
                      ? 'border-[#f30d29] bg-red-50 font-semibold text-[#f30d29]'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="block truncate">{leaf.title}</span>
                  <span className="block text-xs font-normal text-gray-500">{getProductsForCollection(products, leaf.handle).length} sản phẩm</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4">
        <input 
          type="text" 
          placeholder="Tìm theo tên hoặc SKU..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#f30d29]"
        />
        <select 
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#f30d29] bg-white"
        >
          <option value="">Tất cả giới tính</option>
          <option value="nam">Nam</option>
          <option value="nu">Nữ</option>
          <option value="unisex">Unisex</option>
          <option value="kids">Trẻ em</option>
        </select>
      </div>

      <div className="text-sm text-gray-500">
        Đang xem: {activeLeafHandle ? getCategoryPath(activeLeafHandle) : activeGroup ? getCategoryPath(activeGroup.handle) : 'Tất cả sản phẩm'} · {filteredProducts.length} sản phẩm
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="px-6 py-3 font-medium">Ảnh</th>
                  <th className="px-6 py-3 font-medium">Tên sản phẩm</th>
                  <th className="px-6 py-3 font-medium">Danh mục</th>
                  <th className="px-6 py-3 font-medium">SKU</th>
                  <th className="px-6 py-3 font-medium">Giá</th>
                  <th className="px-6 py-3 font-medium">Trạng thái</th>
                  <th className="px-6 py-3 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {product.images && product.images[0] ? (
                        <img src={product.images[0]} alt="" className="w-10 h-10 object-cover rounded border" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-400">No img</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate" title={product.title}>
                      {product.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={getCategoryPath(getPrimaryLeafHandle(product.collections || []))}>
                      {getCategoryPath(getPrimaryLeafHandle(product.collections || []))}
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
                    <td className="px-6 py-4 text-right space-x-3">
                      <a href={`/admin/products/${product.id}/edit`} className="text-blue-600 hover:underline text-sm">
                        Sửa
                      </a>
                      <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline text-sm">
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Không tìm thấy sản phẩm nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
