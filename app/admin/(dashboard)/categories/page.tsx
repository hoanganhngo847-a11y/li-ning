'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  buildAdminCategoryTree,
  flattenCategories,
  getFirstLeaf,
  getLeafCategories,
  readStoredAdminCategories,
  slugifyCategoryTitle,
  writeStoredAdminCategories,
  type AdminCategoryNode,
  type StoredAdminCategory,
} from '../../lib/category-tree';
import { getProductsForCollection } from '@/app/lib/data/collectionMap';
import { formatPrice } from '@/app/lib/utils';
import type { Product } from '@/app/lib/types';

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
  const categoryTree = useMemo(() => buildAdminCategoryTree(storedCategories), [storedCategories]);
  const [activeParentHandle, setActiveParentHandle] = useState(categoryTree[0]?.handle || '');
  const activeParent = categoryTree.find((category) => category.handle === activeParentHandle) || categoryTree[0];
  const [activeGroupHandle, setActiveGroupHandle] = useState(activeParent?.children[0]?.handle || activeParent?.handle || '');
  const activeGroup = activeParent?.children.find((category) => category.handle === activeGroupHandle) || activeParent?.children[0] || activeParent;
  const leafCategories = activeGroup ? (activeGroup.children.length > 0 ? getLeafCategories(activeGroup) : getLeafCategories(activeParent)) : [];
  const [activeLeafHandle, setActiveLeafHandle] = useState(getFirstLeaf(activeGroup || activeParent)?.handle || '');
  const activeLeaf = leafCategories.find((category) => category.handle === activeLeafHandle) || leafCategories[0] || activeGroup;

  useEffect(() => {
    setStoredCategories(readStoredAdminCategories());

    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/admin/products');
        if (res.ok) {
          const data = await res.json() as Product[];
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

  const selectedProducts = activeLeaf ? getProductsForCollection(products, activeLeaf.handle) : [];

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
    const existingHandles = new Set(flattenCategories(categoryTree).map((category) => category.handle));

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

    const parentHandle = createType === 'parent' ? null : createType === 'group' ? activeParent?.handle : activeGroup?.handle;
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
    const nextCategories = [...storedCategories, nextCategory];
    setStoredCategories(nextCategories);
    writeStoredAdminCategories(nextCategories);
    setCategoryTitle('');
    setCategoryHandle('');
    setFormMessage(`Đã thêm ${createType === 'parent' ? 'danh mục cha' : createType === 'group' ? 'nhóm danh mục' : 'danh mục con'} "${title}".`);

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

  const createContextLabel = createType === 'parent'
    ? 'Tạo ở cấp cao nhất'
    : createType === 'group'
      ? `Nằm trong danh mục cha: ${activeParent?.title || ''}`
      : `Nằm trong nhóm danh mục: ${activeGroup?.title || ''}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#f30d29]">Sơ đồ danh mục</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-950">Danh mục cha, danh mục con và sản phẩm</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            Chọn từng lớp danh mục để kiểm tra sản phẩm đang nằm trong danh mục con nào trên website.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">Danh mục cha</div>
          <div className="mt-1 text-3xl font-bold text-gray-950">{summary.parentCount}</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">Nhóm danh mục</div>
          <div className="mt-1 text-3xl font-bold text-gray-950">{summary.groupCount}</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">Danh mục con</div>
          <div className="mt-1 text-3xl font-bold text-gray-950">{summary.leafCount}</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">Sản phẩm</div>
          <div className="mt-1 text-3xl font-bold text-[#f30d29]">{products.length}</div>
        </div>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-950">Thêm danh mục mới</h2>
            <p className="mt-1 text-sm text-gray-500">
              Chọn cấp cần tạo, nhập tên danh mục, hệ thống sẽ tự tạo handle để dùng cho trang collection.
            </p>
          </div>
          <div className="flex rounded-md border border-gray-200 bg-gray-50 p-1">
            {[
              { value: 'parent', label: 'Danh mục cha' },
              { value: 'group', label: 'Nhóm danh mục' },
              { value: 'child', label: 'Danh mục con' },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setCreateType(item.value as 'parent' | 'group' | 'child')}
                className={`rounded px-3 py-2 text-sm font-semibold transition ${
                  createType === item.value ? 'bg-[#f30d29] text-white shadow-sm' : 'text-gray-600 hover:bg-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleCreateCategory} className="grid gap-4 xl:grid-cols-[1fr_1fr_auto]">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Tên danh mục</span>
            <input
              type="text"
              value={categoryTitle}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="Ví dụ: Giày tennis"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#f30d29]"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Handle</span>
            <input
              type="text"
              value={categoryHandle}
              onChange={(event) => setCategoryHandle(slugifyCategoryTitle(event.target.value))}
              placeholder="giay-tennis"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#f30d29]"
            />
          </label>
          <div className="flex flex-col justify-end gap-2">
            <div className="text-xs font-medium text-gray-500">{createContextLabel}</div>
            <button
              type="submit"
              className="rounded-md bg-gray-950 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Thêm danh mục
            </button>
          </div>
        </form>

        {formError && <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</div>}
        {formMessage && <div className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{formMessage}</div>}
      </section>

      <div className="grid gap-5 xl:grid-cols-[220px_260px_360px_1fr]">
        <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
            Danh mục cha
          </div>
          <div className="max-h-[620px] overflow-auto p-2">
            {categoryTree.map((parent) => (
              <button
                key={parent.handle}
                type="button"
                onClick={() => handleParentSelect(parent)}
                className={`mb-1 flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition ${
                  activeParent?.handle === parent.handle
                    ? 'bg-[#f30d29] font-semibold text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{parent.title}</span>
                <span className={activeParent?.handle === parent.handle ? 'text-white/80' : 'text-gray-400'}>
                  {getProductCount(products, parent.handle)}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
            Nhóm danh mục
          </div>
          <div className="max-h-[620px] overflow-auto p-2">
            {(activeParent?.children.length ? activeParent.children : activeParent ? [activeParent] : []).map((group) => (
              <button
                key={group.handle}
                type="button"
                onClick={() => handleGroupSelect(group)}
                className={`mb-1 flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition ${
                  activeGroup?.handle === group.handle
                    ? 'bg-gray-950 font-semibold text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{group.title}</span>
                <span className={activeGroup?.handle === group.handle ? 'text-white/70' : 'text-gray-400'}>
                  {getProductCount(products, group.handle)}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-4 py-3">
            <div className="text-xs font-bold uppercase tracking-wide text-gray-500">Danh mục con</div>
            <div className="mt-1 text-sm font-semibold text-gray-950">{activeGroup?.title}</div>
          </div>
          <div className="max-h-[620px] overflow-auto p-2">
            {leafCategories.map((leaf) => {
              const count = getProductCount(products, leaf.handle);
              return (
                <button
                  key={leaf.handle}
                  type="button"
                  onClick={() => setActiveLeafHandle(leaf.handle)}
                  className={`mb-2 w-full rounded-md border px-3 py-3 text-left transition ${
                    activeLeaf?.handle === leaf.handle
                      ? 'border-[#f30d29] bg-red-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="block text-sm font-semibold text-gray-950">{leaf.title}</span>
                  <span className="mt-1 flex items-center justify-between text-xs text-gray-500">
                    <span>{leaf.handle}</span>
                    <span>{count} sản phẩm</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-gray-500">Sản phẩm trong danh mục con</div>
              <div className="mt-1 text-lg font-semibold text-gray-950">{activeLeaf?.title}</div>
            </div>
            {activeLeaf && (
              <a
                href={`/collections/${activeLeaf.handle}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-[#f30d29] hover:underline"
              >
                Xem ngoài website
              </a>
            )}
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-gray-500">Đang tải sản phẩm...</div>
          ) : selectedProducts.length > 0 ? (
            <div className="max-h-[620px] overflow-auto divide-y divide-gray-100">
              {selectedProducts.map((product) => (
                <div key={product.id} className="flex gap-3 px-4 py-3">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt="" className="h-16 w-16 rounded-md border border-gray-200 object-cover" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-xs text-gray-400">
                      No img
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-gray-950" title={product.title}>
                      {product.title}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">SKU: {product.sku}</div>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-[#f30d29]">{formatPrice(product.price)}</span>
                      <a href={`/admin/products/${product.id}/edit`} className="text-xs font-semibold text-blue-600 hover:underline">
                        Sửa
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-16 text-center">
              <div className="text-sm font-semibold text-gray-950">Danh mục này chưa có sản phẩm</div>
              <p className="mt-1 text-sm text-gray-500">Thêm sản phẩm và chọn đúng danh mục con này trong form.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
