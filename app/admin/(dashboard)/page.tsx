'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/app/lib/utils';

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
  const outOfStock = products.filter((p) => !p.available).length;
  const onSale = products.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price).length;

  // Breakdown by Sport
  const badmintonCount = products.filter(
    (p) => p.collections?.includes('cau-long-2') || p.sport === 'cau-long-2'
  ).length;
  const pickleballCount = products.filter(
    (p) => p.collections?.includes('pickleball') || p.sport === 'pickleball'
  ).length;
  const runningCount = products.filter(
    (p) => p.collections?.includes('chay-bo-1') || p.sport === 'chay-bo-1'
  ).length;
  const trainingCount = products.filter(
    (p) => p.collections?.includes('luyen-tap-1') || p.sport === 'luyen-tap-1'
  ).length;
  const basketballCount = products.filter(
    (p) => p.collections?.includes('bong-ro-2') || p.sport === 'bong-ro-2'
  ).length;
  const footballCount = products.filter(
    (p) => p.collections?.includes('bong-da') || p.sport === 'bong-da'
  ).length;
  const golfCount = products.filter(
    (p) => p.collections?.includes('golf-1') || p.sport === 'golf-1'
  ).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500 gap-3">
        <div className="w-8 h-8 border-4 border-[#f30d29] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold uppercase tracking-wider">Đang tải dữ liệu tổng quan...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Hệ thống online • lining.id.vn
          </div>
          <h1 className="text-2xl font-black text-gray-950 uppercase tracking-tight">
            BẢNG ĐIỀU KHIỂN QUẢN TRỊ
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Quản trị toàn bộ danh mục thể thao, sản phẩm, hình ảnh và mã màu sắc trực tuyến
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

      {/* Main KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
            Tổng sản phẩm
          </div>
          <div className="text-3xl font-black text-gray-950 font-mono">{totalProducts}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            ✓ Đã đồng bộ với website gốc
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
            Đang giảm giá (Sale)
          </div>
          <div className="text-3xl font-black text-[#f30d29] font-mono">{onSale}</div>
          <div className="text-[11px] text-gray-500 font-medium mt-1">
            Có giá so sánh ưu đãi
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
            Môn thể thao
          </div>
          <div className="text-3xl font-black text-blue-600 font-mono">7 Môn</div>
          <div className="text-[11px] text-gray-500 font-medium mt-1">
            Cầu lông, Pickleball, Chạy bộ...
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
            Tình trạng kho
          </div>
          <div className="text-3xl font-black text-emerald-600 font-mono">
            {totalProducts - outOfStock}
          </div>
          <div className="text-[11px] text-gray-500 font-medium mt-1">
            Sẵn sàng bán trực tuyến
          </div>
        </div>
      </div>

      {/* Sport Category Breakdown Grid */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
            PHÂN BỔ SẢN PHẨM THEO MÔN THỂ THAO
          </h2>
          <Link
            href="/admin/categories"
            className="text-xs font-bold text-[#f30d29] hover:underline"
          >
            Quản lý cây danh mục &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: 'CẦU LÔNG', count: badmintonCount, href: '/collections/cau-long-2', color: 'border-red-200 bg-red-50/40 text-red-700' },
            { label: 'PICKLEBALL', count: pickleballCount, href: '/collections/pickleball', color: 'border-emerald-200 bg-emerald-50/40 text-emerald-700' },
            { label: 'CHẠY BỘ', count: runningCount, href: '/collections/chay-bo-1', color: 'border-blue-200 bg-blue-50/40 text-blue-700' },
            { label: 'TẬP LUYỆN', count: trainingCount, href: '/collections/luyen-tap-1', color: 'border-purple-200 bg-purple-50/40 text-purple-700' },
            { label: 'BÓNG RỔ', count: basketballCount, href: '/collections/bong-ro-2', color: 'border-amber-200 bg-amber-50/40 text-amber-700' },
            { label: 'BÓNG ĐÁ', count: footballCount, href: '/collections/bong-da', color: 'border-cyan-200 bg-cyan-50/40 text-cyan-700' },
            { label: 'GOLF', count: golfCount, href: '/collections/golf-1', color: 'border-emerald-200 bg-emerald-50/40 text-emerald-800' },
          ].map((s) => (
            <Link
              key={s.label}
              href={s.href}
              target="_blank"
              className={`p-3.5 rounded-xl border text-center transition-all hover:scale-102 hover:shadow-2xs ${s.color}`}
            >
              <div className="text-[10px] font-bold tracking-wider">{s.label}</div>
              <div className="text-xl font-black font-mono mt-1 text-gray-950">{s.count}</div>
              <div className="text-[9.5px] opacity-70 mt-0.5">sản phẩm ↗</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Latest Products Table */}
      <div className="bg-white rounded-2xl shadow-2xs border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              SẢN PHẨM MỚI CẬP NHẬT
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Danh sách các sản phẩm mới nhất trong hệ thống</p>
          </div>
          <Link
            href="/admin/products"
            className="text-xs font-bold text-[#f30d29] hover:underline"
          >
            Xem tất cả {totalProducts} sản phẩm &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-bold">Sản phẩm</th>
                <th className="px-6 py-3 font-bold">Màu sắc</th>
                <th className="px-6 py-3 font-bold">SKU</th>
                <th className="px-6 py-3 font-bold">Giá bán</th>
                <th className="px-6 py-3 font-bold">Trạng thái</th>
                <th className="px-6 py-3 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {products.slice(0, 10).map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
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
                      <div className="min-w-0">
                        <span className="font-bold text-gray-900 line-clamp-1 block">
                          {product.title}
                        </span>
                        <span className="text-[10.5px] text-gray-400 font-mono">
                          /{product.handle}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/20"
                        style={{ backgroundColor: product.colorHex || '#111' }}
                      />
                      {product.colorName || 'Mặc định'}
                    </span>
                  </td>

                  <td className="px-6 py-3.5 font-mono text-gray-600 font-bold">
                    {product.sku || 'N/A'}
                  </td>

                  <td className="px-6 py-3.5 font-bold text-[#f30d29] font-mono">
                    {formatPrice(product.price)}
                  </td>

                  <td className="px-6 py-3.5">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                        product.available
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {product.available ? 'Hiển thị' : 'Đã ẩn'}
                    </span>
                  </td>

                  <td className="px-6 py-3.5 text-right space-x-2">
                    <Link
                      href={`/products/${product.handle}`}
                      target="_blank"
                      className="text-gray-500 hover:text-gray-900 font-bold text-[11px]"
                    >
                      Xem ↗
                    </Link>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-[#f30d29] hover:underline font-bold text-[11px]"
                    >
                      Sửa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

