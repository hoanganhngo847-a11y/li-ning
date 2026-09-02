'use client';

import Link from 'next/link';
import type { Product } from '@/app/lib/types';
import { getProductCategoryTreePaths, type AdminCategoryNode } from '../lib/category-tree';
import { formatPrice } from '@/app/lib/utils';

interface ProductCategoriesModalProps {
  product: Product | null;
  tree?: AdminCategoryNode[];
  onClose: () => void;
  onSelectCategory?: (handle: string) => void;
}

export default function ProductCategoriesModal({
  product,
  tree,
  onClose,
  onSelectCategory,
}: ProductCategoriesModalProps) {
  if (!product) return null;

  const paths = getProductCategoryTreePaths(product, tree);

  // Group paths by Root Category
  const groupedByRoot: Record<string, typeof paths> = {};
  paths.forEach((p) => {
    if (!groupedByRoot[p.rootTitle]) {
      groupedByRoot[p.rootTitle] = [];
    }
    groupedByRoot[p.rootTitle].push(p);
  });

  const getRootBadgeColor = (title: string) => {
    switch (title) {
      case 'MÔN THỂ THAO':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'THỜI TRANG':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'YOUNG':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'NAM':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'NỮ':
        return 'bg-pink-50 text-pink-800 border-pink-200';
      case 'SALE':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
              Chi tiết phân bổ danh mục menu
            </span>
            <h3 className="text-xl font-black text-gray-900 line-clamp-1">
              {product.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Product Quick Profile */}
        <div className="my-5 p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
            {product.images && product.images[0] ? (
              <img src={product.images[0]} alt="" className="w-full h-full object-contain" />
            ) : (
              <span className="text-xs font-bold text-gray-400">LI-NING</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-gray-900 text-sm line-clamp-1">{product.title}</div>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
              <span className="font-mono text-gray-500 font-bold">SKU: {product.sku || 'N/A'}</span>
              <span className="text-gray-300">•</span>
              <span className="font-mono font-bold text-[#f30d29]">{formatPrice(product.price)}</span>
              <span className="text-gray-300">•</span>
              <span className="inline-flex items-center gap-1 font-medium text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200 text-[11px]">
                <span
                  className="w-2 h-2 rounded-full border border-black/20"
                  style={{ backgroundColor: product.colorHex || '#111' }}
                />
                {product.colorName || 'Mặc định'}
              </span>
            </div>
          </div>
        </div>

        {/* Categories Analysis */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f30d29]" />
              Sản phẩm này xuất hiện tại ({paths.length}) nhánh danh mục:
            </h4>
            <span className="text-[11px] text-gray-400 font-medium">
              Tự động phân bổ theo thuộc tính & bộ môn
            </span>
          </div>

          {paths.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              Sản phẩm này hiện chưa được gán vào danh mục cụ thể nào.
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(groupedByRoot).map(([rootTitle, rootPaths]) => (
                <div
                  key={rootTitle}
                  className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${getRootBadgeColor(
                        rootTitle
                      )}`}
                    >
                      Danh mục lớn: {rootTitle}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {rootPaths.length} vị trí
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {rootPaths.map((p, idx) => (
                      <div
                        key={idx}
                        className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-1.5 font-medium text-gray-800">
                          <span className="text-gray-400">↳</span>
                          <span>{p.fullPathString}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                          {onSelectCategory && (
                            <button
                              type="button"
                              onClick={() => {
                                onSelectCategory(p.leafHandle);
                                onClose();
                              }}
                              className="text-[11px] font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded cursor-pointer"
                            >
                              Lọc mục này
                            </button>
                          )}
                          <Link
                            href={p.href}
                            target="_blank"
                            className="text-[11px] font-bold text-[#f30d29] hover:underline px-1 py-0.5 inline-flex items-center gap-0.5"
                          >
                            Xem trên web ↗
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="font-bold text-[#f30d29] hover:underline"
          >
            Chỉnh sửa sản phẩm này &rarr;
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
