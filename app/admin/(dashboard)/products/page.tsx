'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  buildAdminCategoryTree,
  getLeafCategories,
  getCategoryPath,
  getProductCategoryTreePaths,
  readStoredAdminCategories,
  type AdminCategoryNode,
  type StoredAdminCategory,
} from '../../lib/category-tree';
import { getProductsForCollection } from '@/app/lib/data/collectionMap';
import { formatPrice } from '@/app/lib/utils';
import type { Product } from '@/app/lib/types';
import ProductCategoriesModal from '../../components/ProductCategoriesModal';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [storedCategories, setStoredCategories] = useState<StoredAdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  const categoryTree = buildAdminCategoryTree(storedCategories);
  const [activeParentHandle, setActiveParentHandle] = useState<string>('all');
  const activeParent = categoryTree.find((category) => category.handle === activeParentHandle);
  const [activeGroupHandle, setActiveGroupHandle] = useState<string>('');
  const activeGroup = activeParent?.children.find((category) => category.handle === activeGroupHandle);
  const leafCategories = activeGroup
    ? activeGroup.children.length > 0
      ? getLeafCategories(activeGroup)
      : [activeGroup]
    : activeParent
      ? getLeafCategories(activeParent)
      : [];
  const [activeLeafHandle, setActiveLeafHandle] = useState<string>('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = (await res.json()) as Product[];
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleParentSelect = (parentHandle: string) => {
    setActiveParentHandle(parentHandle);
    if (parentHandle === 'all') {
      setActiveGroupHandle('');
      setActiveLeafHandle('');
      return;
    }
    const parent = categoryTree.find((c) => c.handle === parentHandle);
    const firstGroup = parent?.children[0]?.handle || '';
    setActiveGroupHandle(firstGroup);
    setActiveLeafHandle('');
  };

  const handleGroupSelect = (groupHandle: string) => {
    setActiveGroupHandle(groupHandle);
    setActiveLeafHandle('');
  };

  useEffect(() => {
    const syncCategories = () => setStoredCategories(readStoredAdminCategories());
    syncCategories();
    window.addEventListener('storage', syncCategories);
    window.addEventListener('li-ning-admin-categories-updated', syncCategories);
    fetchProducts();

    return () => {
      window.removeEventListener('storage', syncCategories);
      window.removeEventListener('li-ning-admin-categories-updated', syncCategories);
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống?')) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert('Có lỗi xảy ra khi xóa sản phẩm');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối máy chủ');
    }
  };

  // Filter products by selected category node
  const categoryScopedProducts =
    activeLeafHandle
      ? getProductsForCollection(products, activeLeafHandle)
      : activeGroupHandle
        ? getProductsForCollection(products, activeGroupHandle)
        : activeParentHandle !== 'all' && activeParentHandle
          ? getProductsForCollection(products, activeParentHandle)
          : products;

  const filteredProducts = categoryScopedProducts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.handle.toLowerCase().includes(search.toLowerCase());
    const matchesGender = genderFilter ? p.gender === genderFilter : true;
    return matchesSearch && matchesGender;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#f30d29] border border-red-200 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
            Quản Lý Sản Phẩm • lining.id.vn
          </div>
          <h1 className="text-2xl font-black text-gray-950 uppercase tracking-tight">
            QUẢN LÝ TỔNG HỢP SẢN PHẨM
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Phân bổ danh mục đa tầng theo menu chính thức và kiểm tra chi tiết các danh mục mà từng sản phẩm trực thuộc
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="bg-[#f30d29] hover:bg-[#d10b23] text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-1.5 shrink-0"
          >
            <span>+</span> Thêm sản phẩm mới
          </Link>
        </div>
      </div>

      {/* 3-Level Menu Hierarchical Filter */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f30d29]" />
              LỌC SẢN PHẨM THEO CÂY DANH MỤC MENU (3 CẤP)
            </h2>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Cấp 1: Danh mục lớn &rarr; Cấp 2: Nhóm danh mục / Môn thể thao &rarr; Cấp 3: Danh mục con
            </p>
          </div>

          {(activeParentHandle !== 'all' || activeGroupHandle || activeLeafHandle) && (
            <button
              type="button"
              onClick={() => handleParentSelect('all')}
              className="text-xs font-bold text-[#f30d29] hover:underline cursor-pointer self-start sm:self-auto"
            >
              Đặt lại (Xem tất cả sản phẩm)
            </button>
          )}
        </div>

        {/* 3 Columns for 3 Levels */}
        <div className="grid gap-3 lg:grid-cols-3">
          {/* Cấp 1: Danh mục lớn */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-3 flex flex-col">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center justify-between">
              <span>1. Danh mục lớn</span>
              <span className="text-[10px] font-mono text-gray-400">Level 1</span>
            </div>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => handleParentSelect('all')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                  activeParentHandle === 'all'
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span>TẤT CẢ DANH MỤC</span>
                <span className="text-[10px] font-mono opacity-80">{products.length}</span>
              </button>

              {categoryTree.map((parent) => {
                const isSelected = activeParentHandle === parent.handle;
                const count = getProductsForCollection(products, parent.handle).length;
                return (
                  <button
                    key={parent.handle}
                    type="button"
                    onClick={() => handleParentSelect(parent.handle)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#f30d29] text-white shadow-xs'
                        : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>{parent.title}</span>
                    <span className="text-[10px] font-mono opacity-80">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cấp 2: Nhóm danh mục */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-3 flex flex-col">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center justify-between">
              <span>2. Nhóm danh mục</span>
              <span className="text-[10px] font-mono text-gray-400">Level 2</span>
            </div>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              {activeParentHandle === 'all' ? (
                <div className="p-4 text-center text-xs text-gray-400 font-medium">
                  Chọn một Danh mục lớn ở Cấp 1 để xem các Nhóm danh mục
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleGroupSelect('')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                      activeGroupHandle === ''
                        ? 'bg-[#111111] text-white shadow-xs'
                        : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>Tất cả nhóm của {activeParent?.title}</span>
                    <span className="text-[10px] font-mono opacity-80">
                      {activeParent ? getProductsForCollection(products, activeParent.handle).length : 0}
                    </span>
                  </button>

                  {(activeParent?.children || []).map((group) => {
                    const isSelected = activeGroupHandle === group.handle;
                    const count = getProductsForCollection(products, group.handle).length;
                    return (
                      <button
                        key={group.handle}
                        type="button"
                        onClick={() => handleGroupSelect(group.handle)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-gray-900 text-white shadow-xs'
                            : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <span>{group.title}</span>
                        <span className="text-[10px] font-mono opacity-80">{count}</span>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* Cấp 3: Danh mục con */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-3 flex flex-col">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center justify-between">
              <span>3. Danh mục con chi tiết</span>
              <span className="text-[10px] font-mono text-gray-400">Level 3</span>
            </div>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              {leafCategories.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-400 font-medium">
                  Chưa có danh mục con hoặc đã chọn mục cấp cuối
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveLeafHandle('')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                      activeLeafHandle === ''
                        ? 'bg-[#111111] text-white shadow-xs'
                        : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>Tất cả mục con</span>
                    <span className="text-[10px] font-mono opacity-80">
                      {categoryScopedProducts.length}
                    </span>
                  </button>

                  {leafCategories.map((leaf) => {
                    const isSelected = activeLeafHandle === leaf.handle;
                    const count = getProductsForCollection(products, leaf.handle).length;
                    return (
                      <button
                        key={leaf.handle}
                        type="button"
                        onClick={() => setActiveLeafHandle(leaf.handle)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-red-50 text-[#f30d29] border border-[#f30d29] shadow-2xs font-black'
                            : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <span className="truncate">{leaf.title}</span>
                        <span className="text-[10px] font-mono opacity-80">{count}</span>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search & Secondary Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Tìm theo tên, SKU, mã sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#f30d29] focus:border-[#f30d29] outline-none"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-3.5 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 bg-gray-50 focus:outline-none focus:border-[#f30d29] cursor-pointer"
          >
            <option value="">Tất cả giới tính</option>
            <option value="nam">Nam</option>
            <option value="nu">Nữ</option>
            <option value="unisex">Unisex</option>
            <option value="kids">Trẻ em</option>
          </select>

          <div className="text-xs text-gray-500 font-medium">
            Hiển thị: <strong className="font-mono text-gray-900">{filteredProducts.length}</strong> sản phẩm
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-2xs border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
            <div className="w-8 h-8 border-4 border-[#f30d29] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider">Đang tải danh sách sản phẩm...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Sản phẩm</th>
                  <th className="px-5 py-3.5 font-bold">Màu sắc</th>
                  <th className="px-5 py-3.5 font-bold">SKU</th>
                  <th className="px-5 py-3.5 font-bold">Giá bán</th>
                  <th className="px-5 py-3.5 font-bold">Danh mục trực thuộc (Bấm để xem)</th>
                  <th className="px-5 py-3.5 font-bold">Trạng thái</th>
                  <th className="px-5 py-3.5 font-bold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredProducts.map((product) => {
                  const paths = getProductCategoryTreePaths(product, categoryTree);
                  const firstRoot = paths[0]?.rootTitle || 'MÔN THỂ THAO';

                  return (
                    <tr key={product.id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Product Thumbnail & Title */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
                            {product.images && product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt=""
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="text-[9px] font-mono text-gray-400">LI-NING</span>
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-gray-900 line-clamp-1 block" title={product.title}>
                                {product.title}
                              </span>
                              {product.model3dTop && product.model3dBottom ? (
                                <span className="px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[9.5px] font-bold font-mono inline-flex items-center gap-0.5 shrink-0" title="Đã có file 3D Áo + Quần">
                                  👔 3D Bộ
                                </span>
                              ) : (product.model3d || product.model3dTop || product.model3dBottom) ? (
                                <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[9.5px] font-bold font-mono inline-flex items-center gap-0.5 shrink-0" title="Đã có file mô hình 3D AR">
                                  🧊 3D
                                </span>
                              ) : null}

                            </div>
                            <span className="text-[10.5px] text-gray-400 font-mono">
                              /{product.handle}
                            </span>
                          </div>

                        </div>
                      </td>

                      {/* Color */}
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/20"
                            style={{ backgroundColor: product.colorHex || '#111' }}
                          />
                          {product.colorName || 'Mặc định'}
                        </span>
                      </td>

                      {/* SKU */}
                      <td className="px-5 py-3.5 font-mono text-gray-600 font-bold">
                        {product.sku || 'N/A'}
                      </td>

                      {/* Price */}
                      <td className="px-5 py-3.5 font-bold text-[#f30d29] font-mono">
                        {formatPrice(product.price)}
                      </td>

                      {/* Hierarchical Categories Badge Button */}
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          onClick={() => setSelectedProductForModal(product)}
                          className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all text-left cursor-pointer group"
                        >
                          <span className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-[10.5px] font-bold text-gray-800 shadow-2xs group-hover:border-[#f30d29]">
                            {firstRoot}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-md bg-[#111111] text-white text-[10px] font-mono font-bold">
                            {paths.length} danh mục ↗
                          </span>
                        </button>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                            product.available
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {product.available ? 'Hiển thị' : 'Đã ẩn'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => setSelectedProductForModal(product)}
                          className="text-gray-600 hover:text-gray-900 font-bold text-[11px] underline cursor-pointer"
                        >
                          Chi tiết mục
                        </button>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-[#f30d29] hover:underline font-bold text-[11px]"
                        >
                          Sửa
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          className="text-gray-400 hover:text-red-600 font-bold text-[11px] cursor-pointer"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-xs font-medium">
                      Không tìm thấy sản phẩm nào trong danh mục hoặc từ khóa đã chọn
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Categories Inspector Modal */}
      <ProductCategoriesModal
        product={selectedProductForModal}
        tree={categoryTree}
        onClose={() => setSelectedProductForModal(null)}
        onSelectCategory={(handle) => {
          setActiveLeafHandle(handle);
        }}
      />
    </div>
  );
}
