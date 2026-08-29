'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo, Suspense } from 'react'
import { products } from '@/app/lib/data/products'
import ProductCard from '@/app/components/ProductCard'
import Breadcrumb from '@/app/components/Breadcrumb'
import { useProductsWithAdminProducts } from '@/app/lib/admin-products'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const { products: allProducts } = useProductsWithAdminProducts(products)
  
  const searchResults = useMemo(() => {
    if (!query.trim()) return []
    const lowerQuery = query.toLowerCase()
    return allProducts.filter(p => p.title.toLowerCase().includes(lowerQuery))
  }, [query, allProducts])

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Tìm kiếm', href: '/search' }]} />
      
      <div className="mt-8 mb-12">
        <h1 className="text-3xl font-bold text-center mb-8 uppercase">Tìm kiếm</h1>
        
        <form action="/search" method="GET" className="max-w-xl mx-auto flex">
          <input 
            type="text" 
            name="q" 
            defaultValue={query}
            placeholder="Tìm kiếm sản phẩm..." 
            className="flex-1 border border-gray-300 rounded-l px-4 py-3 focus:outline-none focus:border-[#f30d29]"
            required
          />
          <button type="submit" className="bg-[#f30d29] text-white px-6 py-3 rounded-r font-bold hover:bg-red-700 transition-colors">
            TÌM KIẾM
          </button>
        </form>
      </div>
      
      {query && (
        <div className="mb-8">
          <h2 className="text-xl mb-6 text-center">
            Có <strong>{searchResults.length}</strong> kết quả tìm kiếm cho: <strong>"{query}"</strong>
          </h2>
          
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 product-grid">
              {searchResults.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-gray-500 mb-4">Không tìm thấy sản phẩm nào khớp với tìm kiếm của bạn.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center">Đang tải...</div>}>
      <SearchContent />
    </Suspense>
  )
}
