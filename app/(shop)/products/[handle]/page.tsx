'use client'

import { useEffect, useState, useMemo, use } from 'react'
import { products } from '@/app/lib/data/products'
import { collections } from '@/app/lib/data/collections'
import Breadcrumb from '@/app/components/Breadcrumb'
import ProductCard from '@/app/components/ProductCard'
import ScrollAnimate, { StaggerChildren } from '@/app/components/ScrollAnimate'
import { formatPrice, calculateDiscount } from '@/app/lib/utils'
import { useCart } from '@/app/lib/cart-context'
import Link from 'next/link'
import { useProductsWithAdminProducts } from '@/app/lib/admin-products'
import Product3DViewer from '@/app/components/Product3DViewer'

export default function ProductDetailPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = use(params)
  const { products: allProducts, isLoaded } = useProductsWithAdminProducts(products)
  const product = allProducts.find(p => p.handle === handle)
  const { addItem } = useCart()
  
  const [mainImage, setMainImage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0])
  const [activeTab, setActiveTab] = useState<'desc'|'details'>('desc')
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d')
  const [activeSuitPart, setActiveSuitPart] = useState<'top' | 'bottom'>('top')

  const has3D = Boolean(product?.model3d || product?.model3dTop || product?.model3dBottom)
  const isSuitDual3D = Boolean(product?.model3dTop && product?.model3dBottom)

  const current3DModelUrl = useMemo(() => {
    if (!product) return ''
    if (isSuitDual3D) {
      return activeSuitPart === 'top' ? product.model3dTop! : product.model3dBottom!
    }
    return product.model3d || product.model3dTop || product.model3dBottom || ''
  }, [product, isSuitDual3D, activeSuitPart])

  useEffect(() => {
    if (!product) return
    setMainImage(product.images[0] || '')
    setSelectedVariant(product.variants[0])
    setQuantity(1)
    setViewMode('2d')
    setActiveSuitPart('top')
  }, [product])


  const relatedProducts = useMemo(() => {
    if (!product) return []
    const coll = product.collections?.[0]
    return allProducts.filter(p => p.collections?.includes(coll) && p.id !== product.id).slice(0, 5)
  }, [product, allProducts])

  if (!product) {
    return <div className="container mx-auto px-4 py-12 text-center">{isLoaded ? 'Không tìm thấy sản phẩm' : 'Đang tải sản phẩm...'}</div>
  }

  const collection = collections.find(c => c.handle === product.collections[0])
  const breadcrumbItems = []
  if (collection) {
    breadcrumbItems.push({ label: collection.title, href: `/collections/${collection.handle}` })
  }
  breadcrumbItems.push({ label: product.title, href: `/products/${product.handle}` })

  const handleAddToCart = () => {
    if (!selectedVariant) return
    addItem(product, selectedVariant.id, quantity)
    alert('Đã thêm vào giỏ hàng')
  }

  const discount = product.compareAtPrice ? calculateDiscount(product.price, product.compareAtPrice) : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="flex flex-col md:flex-row gap-10 mt-8">
        <div className="w-full md:w-1/2">
          <ScrollAnimate animation="fade-right" duration={500}>
            {/* 2D / 3D Mode Switcher */}
            {has3D && (
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between bg-gray-100 p-1 rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('2d')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      viewMode === '2d'
                        ? 'bg-white text-gray-900 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span>🖼️</span> Ảnh 2D
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('3d')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      viewMode === '3d'
                        ? 'bg-[#111111] text-white shadow-xs'
                        : 'text-blue-600 hover:text-blue-700 font-extrabold'
                    }`}
                  >
                    <span>🧊</span> Xem 3D xoay 360°
                  </button>
                </div>

                {/* Sub-switcher for Suits (Bộ quần áo: Áo vs Quần) */}
                {viewMode === '3d' && isSuitDual3D && (
                  <div className="flex items-center justify-center gap-2 bg-blue-50/80 p-1.5 rounded-xl border border-blue-200">
                    <span className="text-[11px] font-bold text-blue-900 mr-1">Bộ quần áo:</span>
                    <button
                      type="button"
                      onClick={() => setActiveSuitPart('top')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        activeSuitPart === 'top'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-white text-blue-800 border border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      <span>🧥</span> Mô hình 3D Áo
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSuitPart('bottom')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        activeSuitPart === 'bottom'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      <span>🩳</span> Mô hình 3D Quần
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Main Visual: 3D Viewer or 2D Gallery */}
            {viewMode === '3d' && current3DModelUrl ? (
              <div className="aspect-square mb-4">
                <Product3DViewer
                  modelUrl={current3DModelUrl}
                  posterImage={product.images[0]}
                  productTitle={`${product.title} ${isSuitDual3D ? (activeSuitPart === 'top' ? '(Áo)' : '(Quần)') : ''}`}
                />
              </div>
            ) : (
              <div className="aspect-square bg-gray-50 mb-4 rounded-lg overflow-hidden border border-gray-100 group relative">
                <img 
                  src={mainImage || product.images[0]} 
                  alt={product.title} 
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" 
                />
                {has3D && (
                  <button
                    type="button"
                    onClick={() => setViewMode('3d')}
                    className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-gray-200 text-xs font-bold text-gray-900 hover:bg-black hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>🧊</span> Xem 3D 360°
                  </button>
                )}
              </div>
            )}

            {/* Thumbnail Row */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => {
                    setMainImage(img)
                    setViewMode('2d')
                  }}
                  className={`w-20 h-20 flex-shrink-0 border rounded-md overflow-hidden transition-all duration-200 ${
                    mainImage === img && viewMode === '2d' ? 'border-[#f30d29] shadow-md scale-105' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}

              {/* 3D Model Thumbnails */}
              {isSuitDual3D ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('3d')
                      setActiveSuitPart('top')
                    }}
                    className={`w-20 h-20 flex-shrink-0 border rounded-md overflow-hidden transition-all duration-200 flex flex-col items-center justify-center gap-0.5 bg-blue-50 text-blue-700 cursor-pointer ${
                      viewMode === '3d' && activeSuitPart === 'top'
                        ? 'border-blue-600 shadow-md scale-105 ring-2 ring-blue-500'
                        : 'border-blue-200 hover:border-blue-400'
                    }`}
                  >
                    <span className="text-base">🧥</span>
                    <span className="text-[9px] font-bold uppercase font-mono">3D Áo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('3d')
                      setActiveSuitPart('bottom')
                    }}
                    className={`w-20 h-20 flex-shrink-0 border rounded-md overflow-hidden transition-all duration-200 flex flex-col items-center justify-center gap-0.5 bg-emerald-50 text-emerald-700 cursor-pointer ${
                      viewMode === '3d' && activeSuitPart === 'bottom'
                        ? 'border-emerald-600 shadow-md scale-105 ring-2 ring-emerald-500'
                        : 'border-emerald-200 hover:border-emerald-400'
                    }`}
                  >
                    <span className="text-base">🩳</span>
                    <span className="text-[9px] font-bold uppercase font-mono">3D Quần</span>
                  </button>
                </>
              ) : has3D ? (
                <button
                  type="button"
                  onClick={() => setViewMode('3d')}
                  className={`w-20 h-20 flex-shrink-0 border rounded-md overflow-hidden transition-all duration-200 flex flex-col items-center justify-center gap-1 bg-blue-50 text-blue-700 cursor-pointer ${
                    viewMode === '3d' ? 'border-blue-600 shadow-md scale-105 ring-2 ring-blue-500' : 'border-blue-200 hover:border-blue-400'
                  }`}
                >
                  <span className="text-xl">🧊</span>
                  <span className="text-[10px] font-bold uppercase font-mono">3D Model</span>
                </button>
              ) : null}
            </div>
          </ScrollAnimate>
        </div>
        
        <div className="w-full md:w-1/2">
          <ScrollAnimate animation="fade-left" duration={500}>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-[#111111]">{product.title}</h1>
              {has3D && (
                <button
                  type="button"
                  onClick={() => setViewMode('3d')}
                  className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold font-mono inline-flex items-center gap-1 hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <span>🧊</span> {isSuitDual3D ? '3D Áo + Quần' : '3D AR Ready'}
                </button>
              )}
            </div>


            <div className="text-sm text-gray-500 mb-4">
              SKU: <span className="font-mono text-gray-700">{product.sku}</span> | Tình trạng: <span className="text-[#f30d29] font-medium">{product.available ? 'Còn hàng' : 'Hết hàng'}</span>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-[#f30d29]">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
                  <span className="bg-[#f30d29] text-white text-xs px-2.5 py-1 rounded-md font-bold shadow-sm">-{discount}%</span>
                </>
              )}
            </div>
            
            {/* Màu sắc sản phẩm */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-sm font-semibold text-gray-800">Màu sắc:</span>
                <span className="text-sm font-bold text-[#111111] flex items-center gap-1.5">
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-black/20 inline-block shadow-inner"
                    style={{ backgroundColor: product.colorHex || '#111111' }}
                  />
                  {product.colorName || 'Mặc định'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg border-2 border-[#f30d29] bg-red-50/40 text-xs font-bold text-gray-950 shadow-xs ring-1 ring-[#f30d29]">
                  <span 
                    className="w-4 h-4 rounded-full border border-black/20 shadow-inner shrink-0" 
                    style={{ backgroundColor: product.colorHex || '#111111' }}
                  />
                  <span>{product.colorName || 'Tiêu chuẩn'}</span>
                  <svg className="w-3.5 h-3.5 text-[#f30d29] ml-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Kích thước sản phẩm */}
            {product.variants.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-sm font-semibold text-gray-800">
                    Kích thước: <strong className="text-gray-950 font-mono">{selectedVariant?.size || selectedVariant?.title}</strong>
                  </span>
                  <Link href="/pages/huong-dan-chon-size" className="text-xs text-[#f30d29] font-medium hover:underline flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Bảng quy đổi size
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    const displaySize = variant.size || variant.title.split('/')[0].trim();
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`min-w-[48px] h-10 px-3.5 py-1.5 border rounded-lg font-mono font-bold text-xs md:text-sm transition-all duration-200 cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? 'border-[#f30d29] text-[#f30d29] bg-red-50/60 shadow-xs ring-1.5 ring-[#f30d29]'
                            : 'border-gray-300 hover:border-gray-500 text-gray-800 bg-white hover:bg-gray-50'
                        }`}
                      >
                        {displaySize}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Số lượng */}
            <div className="mb-8">
              <span className="text-sm font-semibold text-gray-800 block mb-2.5">Số lượng:</span>
              <div className="flex items-center border border-gray-300 rounded-lg w-32 bg-white overflow-hidden shadow-2xs">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-bold text-base cursor-pointer"
                >
                  -
                </button>
                <input 
                  type="text" 
                  value={quantity} 
                  readOnly 
                  className="w-12 text-center border-none focus:outline-none font-mono font-bold text-gray-900"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-bold text-base cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={handleAddToCart}
                disabled={!product.available}
                className="flex-1 bg-white border-2 border-[#f30d29] text-[#f30d29] hover:bg-red-50 font-bold py-3.5 px-6 rounded-lg uppercase tracking-wider transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Thêm vào giỏ hàng
              </button>
              <Link 
                href="/cart"
                onClick={handleAddToCart}
                className="flex-1 bg-[#f30d29] hover:bg-[#d10b23] text-white font-bold py-3.5 px-6 rounded-lg text-center uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
              >
                Mua ngay
              </Link>
            </div>

            {/* Cam kết */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-3">
              <div className="flex items-center gap-3 text-xs text-gray-700">
                <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Cam kết 100% hàng chính hãng Li-Ning</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-700">
                <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>Miễn phí vận chuyển cho đơn hàng từ 1.000.000₫</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-700">
                <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Đổi trả linh hoạt trong vòng 7 ngày</span>
              </div>
            </div>
          </ScrollAnimate>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12 border-t pt-8">
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab('desc')}
            className={`py-3 px-6 font-bold text-sm tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
              activeTab === 'desc' ? 'border-[#f30d29] text-[#f30d29]' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Mô tả sản phẩm
          </button>
          <button 
            onClick={() => setActiveTab('details')}
            className={`py-3 px-6 font-bold text-sm tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
              activeTab === 'details' ? 'border-[#f30d29] text-[#f30d29]' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Thông tin chi tiết
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-2xs">
          {activeTab === 'desc' ? (
            <div className="prose max-w-none text-gray-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
          ) : (
            <div className="text-sm space-y-3">
              <div className="grid grid-cols-3 py-2 border-b">
                <span className="text-gray-500 font-medium">Mã sản phẩm</span>
                <span className="col-span-2 font-mono font-bold text-gray-900">{product.sku}</span>
              </div>
              <div className="grid grid-cols-3 py-2 border-b">
                <span className="text-gray-500 font-medium">Thương hiệu</span>
                <span className="col-span-2 font-bold text-gray-900">Li-Ning</span>
              </div>
              <div className="grid grid-cols-3 py-2 border-b">
                <span className="text-gray-500 font-medium">Màu sắc chủ đạo</span>
                <span className="col-span-2 text-gray-900 flex items-center gap-1.5 font-bold">
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-black/20 inline-block"
                    style={{ backgroundColor: product.colorHex || '#111111' }}
                  />
                  {product.colorName || 'Mặc định'}
                </span>
              </div>
              <div className="grid grid-cols-3 py-2 border-b">
                <span className="text-gray-500 font-medium">Mô hình 3D AR</span>
                <span className="col-span-2 text-gray-900 font-medium">
                  {product.model3d ? '✓ Có hỗ trợ xoay 360°' : 'Đang cập nhật'}
                </span>
              </div>
              <div className="grid grid-cols-3 py-2">
                <span className="text-gray-500 font-medium">Xuất xứ</span>
                <span className="col-span-2 text-gray-900">Chính hãng Li-Ning</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-6 text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f30d29]" />
            Sản phẩm liên quan
          </h2>
          <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </StaggerChildren>
        </div>
      )}
    </div>
  )
}
