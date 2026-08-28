'use client'

import { useState, useMemo, use } from 'react'
import { products } from '@/app/lib/data/products'
import { collections } from '@/app/lib/data/collections'
import Breadcrumb from '@/app/components/Breadcrumb'
import ProductCard from '@/app/components/ProductCard'
import { formatPrice, calculateDiscount } from '@/app/lib/utils'
import { useCart } from '@/app/lib/cart-context'
import Link from 'next/link'

export default function ProductDetailPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = use(params)
  const product = products.find(p => p.handle === handle) || products[0]
  const { addItem } = useCart()
  
  const [mainImage, setMainImage] = useState(product?.images[0] || '')
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0])
  const [activeTab, setActiveTab] = useState<'desc'|'details'>('desc')

  const relatedProducts = useMemo(() => {
    if (!product) return []
    const coll = product.collections?.[0]
    return products.filter(p => p.collections?.includes(coll) && p.id !== product.id).slice(0, 5)
  }, [product])

  if (!product) {
    return <div className="container mx-auto px-4 py-12 text-center">Không tìm thấy sản phẩm</div>
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
          <div className="aspect-square bg-gray-50 mb-4 rounded-lg overflow-hidden border border-gray-100">
            <img src={mainImage || product.images[0]} alt={product.title} className="w-full h-full object-contain" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 flex-shrink-0 border rounded overflow-hidden ${mainImage === img ? 'border-[#f30d29]' : 'border-gray-200'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <div className="text-sm text-gray-500 mb-4">
            SKU: {product.sku} | Tình trạng: <span className="text-[#f30d29]">{product.available ? 'Còn hàng' : 'Hết hàng'}</span>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-[#f30d29]">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
                <span className="bg-[#f30d29] text-white text-xs px-2 py-1 rounded font-bold">-{discount}%</span>
              </>
            )}
          </div>
          
          {product.variants.length > 1 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Tùy chọn:</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(variant => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 border rounded ${selectedVariant?.id === variant.id ? 'border-[#f30d29] text-[#f30d29]' : 'border-gray-300 hover:border-gray-400'}`}
                  >
                    {variant.title}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Số lượng:</h3>
            <div className="flex items-center border border-gray-300 rounded w-max">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100">-</button>
              <input type="number" value={quantity} readOnly className="w-16 text-center border-l border-r border-gray-300 py-2 focus:outline-none" />
              <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-gray-100">+</button>
            </div>
          </div>
          
          <div className="flex gap-4 mb-8">
            <button 
              onClick={handleAddToCart}
              className="flex-1 border border-[#f30d29] text-[#f30d29] font-bold py-3 px-6 rounded hover:bg-red-50 transition-colors uppercase"
            >
              THÊM VÀO GIỎ
            </button>
            <Link 
              href="/cart"
              onClick={handleAddToCart}
              className="flex-1 bg-[#f30d29] text-white font-bold py-3 px-6 rounded hover:bg-red-700 transition-colors uppercase text-center flex items-center justify-center"
            >
              MUA NGAY
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mt-16 mb-12">
        <div className="flex border-b border-gray-200">
          <button 
            className={`py-4 px-8 font-bold uppercase ${activeTab === 'desc' ? 'border-b-2 border-[#f30d29] text-[#f30d29]' : 'text-gray-500 hover:text-gray-800'}`}
            onClick={() => setActiveTab('desc')}
          >
            MÔ TẢ SẢN PHẨM
          </button>
          <button 
            className={`py-4 px-8 font-bold uppercase ${activeTab === 'details' ? 'border-b-2 border-[#f30d29] text-[#f30d29]' : 'text-gray-500 hover:text-gray-800'}`}
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
      
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8 uppercase">SẢN PHẨM LIÊN QUAN</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
