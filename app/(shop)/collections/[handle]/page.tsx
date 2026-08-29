'use client'

import { useEffect, useMemo, useState, use } from 'react'
import { products } from '@/app/lib/data/products'
import { collections } from '@/app/lib/data/collections'
import { canonicalizeCollectionHandle, getProductsForCollection } from '@/app/lib/data/collectionMap'
import ProductCard from '@/app/components/ProductCard'
import Breadcrumb from '@/app/components/Breadcrumb'
import FilterSidebar from '@/app/components/FilterSidebar'
import type { FilterState } from '@/app/components/FilterSidebar'
import SortDropdown from '@/app/components/SortDropdown'
import Pagination from '@/app/components/Pagination'
import ScrollAnimate, { StaggerChildren } from '@/app/components/ScrollAnimate'
import { useProductsWithAdminProducts } from '@/app/lib/admin-products'

export default function CollectionDetailPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = use(params)
  const canonicalHandle = canonicalizeCollectionHandle(handle)
  
  const collection = collections.find(c => c.handle === canonicalHandle) || {
    handle: canonicalHandle,
    title: handle.replace(/-/g, ' ').replace(/\d+$/,'').trim().toUpperCase(),
    description: `Danh mục sản phẩm ${handle.replace(/-/g, ' ')} chính hãng Li-Ning`,
    image: '',
    productHandles: []
  }

  const [currentPage, setCurrentPage] = useState(1)
  const [sortValue, setSortValue] = useState('manual')
  const [filters, setFilters] = useState<FilterState>({})
  const { products: allProducts } = useProductsWithAdminProducts(products)
  const productsPerPage = 12

  useEffect(() => {
    setCurrentPage(1)
  }, [handle, sortValue])

  const collectionProducts = useMemo(() => {
    let filtered = getProductsForCollection(allProducts, canonicalHandle)

    // Apply sidebar filters
    if (filters.gender && filters.gender.length > 0) {
      filtered = filtered.filter(p => filters.gender!.includes(p.gender))
    }
    if (filters.sport && filters.sport.length > 0) {
      filtered = filtered.filter(p => filters.sport!.includes(p.sport))
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange
      filtered = filtered.filter(p => p.price >= min && p.price <= max)
    }

    // Apply sort
    switch (sortValue) {
      case 'price-ascending':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-descending':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'title-ascending':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'title-descending':
        filtered.sort((a, b) => b.title.localeCompare(a.title))
        break
    }

    return filtered
  }, [canonicalHandle, sortValue, filters, allProducts])

  const paginatedProducts = collectionProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
  const totalPages = Math.max(1, Math.ceil(collectionProducts.length / productsPerPage))

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: collection.title, href: `/collections/${handle}` }]} />
      
      <ScrollAnimate animation="fade-up" duration={500}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 uppercase text-[#111111]">{collection.title}</h1>
          {collection.description && <p className="text-gray-600 max-w-3xl">{collection.description}</p>}
        </div>
      </ScrollAnimate>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <ScrollAnimate animation="fade-left" duration={500}>
            <FilterSidebar onFilterChange={handleFilterChange} />
          </ScrollAnimate>
        </div>
        
        <div className="w-full md:w-3/4">
          <ScrollAnimate animation="fade-up" duration={400}>
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
              <div className="text-sm text-gray-500 font-medium">
                Hiển thị <span className="text-[#111111] font-bold">{collectionProducts.length}</span> sản phẩm
              </div>
              <SortDropdown value={sortValue} onChange={setSortValue} />
            </div>
          </ScrollAnimate>

          {collectionProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <StaggerChildren animation="fade-up" staggerDelay={60} duration={450}>
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </StaggerChildren>
              </div>
              
              {totalPages > 1 && (
                <ScrollAnimate animation="fade-up" duration={400}>
                  <div className="mt-8">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                  </div>
                </ScrollAnimate>
              )}
            </>
          ) : (
            <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-lg">
              <p className="text-base font-medium">Không có sản phẩm nào trong danh mục này.</p>
              <p className="text-sm text-gray-400 mt-1">Hãy thử chọn lại bộ lọc khác.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
