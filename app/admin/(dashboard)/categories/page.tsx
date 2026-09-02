'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  buildAdminCategoryTree,
  flattenCategories,
  getFirstLeaf,
  getLeafCategories,
  getProductCategoryTreePaths,
  readStoredAdminCategories,
  slugifyCategoryTitle,
  writeStoredAdminCategories,
  type AdminCategoryNode,
  type StoredAdminCategory,
} from '../../lib/category-tree';
import { getProductsForCollection } from '@/app/lib/data/collectionMap';
import { formatPrice } from '@/app/lib/utils';
import type { Product } from '@/app/lib/types';
import ProductCategoriesModal from '../../components/ProductCategoriesModal';

function getProductCount(products: Product[], handle: string) {
  return getProductsForCollection(products, handle).length;
}

export default function AdminCategoriesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [storedCategories, setStoredCategories] = useState<StoredAdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [createType, setCreateType] = useState<'parent' | 'group' | 'child'>('parent');
  const [categoryTitle, setCategoryTitle] = useState('');
  const [categoryHandle, setCategoryHandle] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  const categoryTree = useMemo(() => buildAdminCategoryTree(storedCategories), [storedCategories]);
  const [activeParentHandle, setActiveParentHandle] = useState<string>(categoryTree[0]?.handle || 'the-thao');
  const activeParent = categoryTree.find((category) => category.handle === activeParentHandle) || categoryTree[0];
  const [activeGroupHandle, setActiveGroupHandle] = useState<string>(
    activeParent?.children[0]?.handle || activeParent?.handle || ''
  );
  const activeGroup =
    activeParent?.children.find((category) => category.handle === activeGroupHandle) ||
    activeParent?.children[0] ||
    activeParent;

  const leafCategories = activeGroup
    ? activeGroup.children.length > 0
      ? getLeafCategories(activeGroup)
      : [activeGroup]
    : activeParent
      ? getLeafCategories(activeParent)
      : [];

  const [activeLeafHandle, setActiveLeafHandle] = useState<string>(
    getFirstLeaf(activeGroup || activeParent)?.handle || ''
  );
  const activeLeaf =
    leafCategories.find((category) => category.handle === activeLeafHandle) ||
    leafCategories[0] ||
    activeGroup;

  useEffect(() => {
    setStoredCategories(readStoredAdminCategories());

    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/admin/products');
        if (res.ok) {
          const data = (await res.json()) as Product[];
          setProducts(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const summary = useMemo(() => {
    const parentCount = categoryTree.length;
    const groupCount = categoryTree.reduce((total, parent) => total + parent.children.length, 0);
    const leafCount = categoryTree.reduce((total, parent) => total + getLeafCategories(parent).length, 0);
    return { parentCount, groupCount, leafCount };
  }, [categoryTree]);

  // Current products in active node
  const activeHandle = activeLeaf?.handle || activeGroup?.handle || activeParent?.handle;
  const selectedProducts = activeHandle ? getProductsForCollection(products, activeHandle) : [];


  const handleParentSelect = (parent: AdminCategoryNode) => {
    setActiveParentHandle(parent.handle);
    const nextGroup = parent.children[0] || parent;
    setActiveGroupHandle(nextGroup.handle);
    setActiveLeafHandle(getFirstLeaf(nextGroup).handle);
  };

  const handleGroupSelect = (group: AdminCategoryNode) => {
    setActiveGroupHandle(group.handle);
    setActiveLeafHandle(getFirstLeaf(group).handle);
  };

  const handleTitleChange = (value: string) => {
    setCategoryTitle(value);
    setCategoryHandle(slugifyCategoryTitle(value));
  };

  const handleCreateCategory = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');
    setFormMessage('');

    const title = categoryTitle.trim();
    const handle = slugifyCategoryTitle(categoryHandle || title);
    const existingHandles = new Set(
      flattenCategories(categoryTree).map((category) => category.handle)
    );

    if (!title) {
      setFormError('Vui lòng nhập tên danh mục.');
      return;
    }

    if (!handle) {
      setFormError('Vui lòng nhập handle hợp lệ.');
      return;
    }

    if (existingHandles.has(handle)) {
      setFormError('Handle này đã tồn tại. Hãy đổi tên hoặc chỉnh handle khác.');
      return;
    }

    const parentHandle =
      createType === 'parent'
        ? null
        : createType === 'group'
          ? activeParent?.handle
          : activeGroup?.handle;

    if (createType !== 'parent' && !parentHandle) {
      setFormError('Vui lòng chọn danh mục cha hoặc nhóm danh mục trước.');
      return;
    }

    const nextCategory: StoredAdminCategory = {
      id: `${Date.now()}`,
      handle,
      title,
      parentHandle: parentHandle || null,
      createdAt: Date.now(),
    };

    const nextList = [...storedCategories, nextCategory];
    setStoredCategories(nextList);
    writeStoredAdminCategories(nextList);

    setCategoryTitle('');
    setCategoryHandle('');
    setFormMessage(`Đã thêm danh mục "${title}" thành công!`);

    if (createType === 'parent') {
      setActiveParentHandle(handle);
      setActiveGroupHandle(handle);
      setActiveLeafHandle(handle);
    } else if (createType === 'group') {
      setActiveGroupHandle(handle);
      setActiveLeafHandle(handle);
    } else {
      setActiveLeafHandle(handle);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
            Cây Phân Cấp Menu • lining.id.vn
          </div>
          <h1 className="text-2xl font-black text-gray-950 uppercase tracking-tight">
            QUẢN TRỊ CÂY DANH MỤC (3 CẤP)
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Cấu trúc danh mục menu chuẩn: Môn Thể Thao, Thời Trang, Young, Nam, Nữ, Sale &amp; Tra cứu chi tiết phân bổ danh mục của từng sản phẩm
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
          >
            Quản lý sản phẩm &rarr;
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">1. Danh mục lớn</div>
          <div className="text-2xl font-black text-gray-900 font-mono mt-1">{summary.parentCount}</div>
          <div className="text-[10.5px] text-gray-500 mt-0.5">Môn Thể Thao, Nam, Nữ...</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">2. Nhóm danh mục</div>
          <div className="text-2xl font-black text-blue-600 font-mono mt-1">{summary.groupCount}</div>
          <div className="text-[10.5px] text-gray-500 mt-0.5">Cầu lông, Pickleball, Giày...</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">3. Danh mục con</div>
          <div className="text-2xl font-black text-emerald-600 font-mono mt-1">{summary.leafCount}</div>
          <div className="text-[10.5px] text-gray-500 mt-0.5">Phân loại chi tiết</div>
        </div>
      </div>

      {/* 3-Column Interactive Category Navigator */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f30d29]" />
            ĐIỀU HƯỚNG CÂY DANH MỤC MENU
          </h2>
          <div className="text-xs font-bold text-gray-600">
            Mục đang chọn: <span className="text-[#f30d29] font-mono">{activeLeaf?.title}</span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Level 1 */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-3 flex flex-col">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center justify-between">
              <span>Cấp 1: Danh mục lớn</span>
              <span className="text-[10px] font-mono text-gray-400">Parent</span>
            </div>
            <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
              {categoryTree.map((parent) => {
                const isSelected = activeParent?.handle === parent.handle;
                const count = getProductCount(products, parent.handle);
                return (
                  <button
                    key={parent.handle}
                    type="button"
                    onClick={() => handleParentSelect(parent)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#f30d29] text-white shadow-xs'
                        : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>{parent.title}</span>
                    <span className="text-[10px] font-mono opacity-80">{count} SP</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level 2 */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-3 flex flex-col">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center justify-between">
              <span>Cấp 2: Nhóm thuộc {activeParent?.title}</span>
              <span className="text-[10px] font-mono text-gray-400">Group</span>
            </div>
            <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
              {(activeParent?.children || []).map((group) => {
                const isSelected = activeGroup?.handle === group.handle;
                const count = getProductCount(products, group.handle);
                return (
                  <button
                    key={group.handle}
                    type="button"
                    onClick={() => handleGroupSelect(group)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-gray-950 text-white shadow-xs'
                        : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>{group.title}</span>
                    <span className="text-[10px] font-mono opacity-80">{count} SP</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level 3 */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-3 flex flex-col">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center justify-between">
              <span>Cấp 3: Danh mục con chi tiết</span>
              <span className="text-[10px] font-mono text-gray-400">Child</span>
            </div>
            <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
              {leafCategories.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-400 font-medium">
                  Không có danh mục con riêng
                </div>
              ) : (
                leafCategories.map((leaf) => {
                  const isSelected = activeLeaf?.handle === leaf.handle;
                  const count = getProductCount(products, leaf.handle);
                  return (
                    <button
                      key={leaf.handle}
                      type="button"
                      onClick={() => setActiveLeafHandle(leaf.handle)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-red-50 text-[#f30d29] border border-[#f30d29] shadow-2xs font-black'
                          : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <span className="truncate">{leaf.title}</span>
                      <span className="text-[10px] font-mono opacity-80">{count} SP</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product List In Selected Category with Multi-Category Inspector Tags */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              SẢN PHẨM THUỘC MỤC: {activeLeaf?.title}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Đường dẫn menu: <strong className="text-gray-800">{[...activeLeaf.parentTitles, activeLeaf.title].join(' → ')}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Tổng sản phẩm:</span>
            <span className="text-sm font-black font-mono text-gray-900 bg-gray-100 px-3 py-1 rounded-xl border border-gray-200">
              {selectedProducts.length}
            </span>
          </div>
        </div>

        {selectedProducts.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400 font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            Chưa có sản phẩm nào thuộc danh mục này
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {selectedProducts.map((product) => {
              const allPaths = getProductCategoryTreePaths(product, categoryTree);
              const otherPaths = allPaths.filter((p) => p.leafHandle !== activeLeaf.handle);

              return (
                <div
                  key={product.id}
                  className="p-4 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 transition-all flex flex-col justify-between gap-3 shadow-2xs group"
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
                      {product.images && product.images[0] ? (
                        <img src={product.images[0]} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-[10px] font-mono text-gray-400">LI-NING</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-gray-900 text-xs line-clamp-2" title={product.title}>
                        {product.title}
                      </div>
                      <div className="text-[11px] font-mono text-gray-500 mt-0.5">
                        SKU: <strong className="text-gray-700">{product.sku}</strong>
                      </div>
                      <div className="text-xs font-bold text-[#f30d29] font-mono mt-0.5">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                  </div>

                  {/* Multi-category cross tags */}
                  <div className="pt-2.5 border-t border-gray-100 space-y-1.5">
                    <div className="text-[10.5px] font-bold text-gray-500 flex items-center justify-between">
                      <span>Phân bổ danh mục ({allPaths.length} mục):</span>
                      <button
                        type="button"
                        onClick={() => setSelectedProductForModal(product)}
                        className="text-[#f30d29] hover:underline font-bold text-[10.5px] cursor-pointer"
                      >
                        Xem chi tiết ↗
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {otherPaths.slice(0, 3).map((op, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-[10px] font-medium border border-gray-200 truncate max-w-[200px]"
                          title={op.fullPathString}
                        >
                          {op.rootTitle} → {op.leafTitle}
                        </span>
                      ))}
                      {otherPaths.length > 3 && (
                        <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded text-[10px] font-bold font-mono">
                          +{otherPaths.length - 3} mục
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Custom Category Form */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#111111]" />
          THÊM DANH MỤC MỚI VÀO CÂY MENU
        </h2>

        {formMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl text-center">
            ✓ {formMessage}
          </div>
        )}
        {formError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl text-center">
            ✕ {formError}
          </div>
        )}

        <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1.5">Vị trí cấp bậc tạo mới:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'parent', label: '1. Danh mục lớn (Cấp 1)' },
                { type: 'group', label: `2. Nhóm thuộc ${activeParent?.title}` },
                { type: 'child', label: `3. Danh mục con thuộc ${activeGroup?.title}` },
              ].map((opt) => (
                <label
                  key={opt.type}
                  className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                    createType === opt.type
                      ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="createType"
                    checked={createType === opt.type}
                    onChange={() => setCreateType(opt.type as any)}
                    className="hidden"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Tên danh mục mới *</label>
              <input
                type="text"
                required
                value={categoryTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ví dụ: Vợt Pickleball Pro Series..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#f30d29] outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Handle / Đường dẫn URL *</label>
              <input
                type="text"
                required
                value={categoryHandle}
                onChange={(e) => setCategoryHandle(e.target.value)}
                placeholder="vot-pickleball-pro-series"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-gray-900 focus:ring-2 focus:ring-[#f30d29] outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#f30d29] hover:bg-[#d10b23] text-white px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            + Tạo danh mục ngay
          </button>
        </form>
      </div>

      {/* Product Categories Inspector Modal */}
      <ProductCategoriesModal
        product={selectedProductForModal}
        tree={categoryTree}
        onClose={() => setSelectedProductForModal(null)}
      />
    </div>
  );
}
