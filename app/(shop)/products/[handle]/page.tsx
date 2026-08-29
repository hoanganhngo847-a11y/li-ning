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

export default function ProductDetailPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = use(params)
  const { products: allProducts, isLoaded } = useProductsWithAdminProducts(products)
  const product = allProducts.find(p => p.handle === handle)
  const { addItem } = useCart()
  
  const [mainImage, setMainImage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0])
  const [activeTab, setActiveTab] = useState<'desc'|'details'>('desc')

  useEffect(() => {
    if (!product) return
    setMainImage(product.images[0] || '')
    setSelectedVariant(product.variants[0])
    setQuantity(1)
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
            <div className="aspect-square bg-gray-50 mb-4 rounded-lg overflow-hidden border border-gray-100 group">
              <img 
                src={mainImage || product.images[0]} 
                alt={product.title} 
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 flex-shrink-0 border rounded-md overflow-hidden transition-all duration-200 ${
                    mainImage === img ? 'border-[#f30d29] shadow-md scale-105' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </ScrollAnimate>
        </div>
        
        <div className="w-full md:w-1/2">
          <ScrollAnimate animation="fade-left" duration={500}>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#111111]">{product.title}</h1>
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
            
            {product.variants.length > 1 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-sm text-gray-800">Tùy chọn kích thước:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 border rounded-md font-medium text-sm transition-all duration-200 ${
                        selectedVariant?.id === variant.id 
                          ? 'border-[#f30d29] text-[#f30d29] bg-red-50/50 shadow-sm' 
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }`}
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-sm text-gray-800">Số lượng:</h3>
              <div className="flex items-center border border-gray-300 rounded-md w-max overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100 transition-colors font-bold text-gray-600">-</button>
                <input type="number" value={quantity} readOnly className="w-16 text-center border-l border-r border-gray-300 py-2 focus:outline-none font-semibold text-gray-800" />
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-gray-100 transition-colors font-bold text-gray-600">+</button>
              </div>
            </div>
            
            <div className="flex gap-4 mb-8">
              <button 
                onClick={handleAddToCart}
                className="flex-1 border-2 border-[#f30d29] text-[#f30d29] font-bold py-3 px-6 rounded-md hover:bg-red-50 transition-all duration-200 uppercase text-sm tracking-wider"
              >
                THÊM VÀO GIỎ
              </button>
              <Link 
                href="/cart"
                onClick={handleAddToCart}
                className="flex-1 bg-[#f30d29] hover:bg-[#d10b23] text-white font-bold py-3 px-6 rounded-md shadow-md hover:shadow-lg transition-all duration-200 uppercase text-center flex items-center justify-center text-sm tracking-wider"
              >
                MUA NGAY
              </Link>
            </div>
          </ScrollAnimate>
        </div>
      </div>
      
      <ScrollAnimate animation="fade-up" duration={500}>
        <div className="mt-16 mb-12">
          <div className="flex border-b border-gray-200">
            <button 
              className={`py-4 px-8 font-bold uppercase transition-colors ${activeTab === 'desc' ? 'border-b-2 border-[#f30d29] text-[#f30d29]' : 'text-gray-500 hover:text-gray-800'}`}
              onClick={() => setActiveTab('desc')}
            >
              MÔ TẢ SẢN PHẨM
            </button>
            <button 
              className={`py-4 px-8 font-bold uppercase transition-colors ${activeTab === 'details' ? 'border-b-2 border-[#f30d29] text-[#f30d29]' : 'text-gray-500 hover:text-gray-800'}`}
              onClick={() => setActiveTab('details')}
            >
              THÔNG TIN CHI TIẾT
            </button>
          </div>
          <div className="py-8 text-gray-700 leading-relaxed max-w-4xl">
            {activeTab === 'desc' ? (
              <div dangerouslySetInnerHTML={{ __html: product.description || 'Chưa có mô tả cho sản phẩm này.' }} />
            ) : (
              <div>
                <table className="w-full max-w-lg border-collapse border border-gray-200">
                  <tbody>
                    <tr><td className="border border-gray-200 py-2 px-4 font-semibold bg-gray-50 w-1/3">SKU</td><td className="border border-gray-200 py-2 px-4">{product.sku}</td></tr>
                    <tr><td className="border border-gray-200 py-2 px-4 font-semibold bg-gray-50">Thương hiệu</td><td className="border border-gray-200 py-2 px-4">Li-Ning</td></tr>
                    <tr><td className="border border-gray-200 py-2 px-4 font-semibold bg-gray-50">Giới tính</td><td className="border border-gray-200 py-2 px-4 capitalize">{product.gender}</td></tr>
                    <tr><td className="border border-gray-200 py-2 px-4 font-semibold bg-gray-50">Môn thể thao</td><td className="border border-gray-200 py-2 px-4 capitalize">{product.sport}</td></tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </ScrollAnimate>
      
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <ScrollAnimate animation="fade-up" duration={500}>
            <h2 className="text-2xl font-bold text-center mb-8 uppercase text-[#111111]">SẢN PHẨM LIÊN QUAN</h2>
          </ScrollAnimate>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <StaggerChildren animation="fade-up" staggerDelay={70} duration={450}>
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </StaggerChildren>
          </div>
        </div>
      )}
    </div>
  )
}
