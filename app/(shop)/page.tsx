import { products } from '@/app/lib/data/products'
import { collections } from '@/app/lib/data/collections'
import { banners as heroBanners, sportCategories } from '@/app/lib/data/banners'
import ProductCard from '@/app/components/ProductCard'
import HeroSlider from '@/app/components/HeroSlider'
import SportCategories from '@/app/components/SportCategories'
import HomeTabSection from '@/app/components/HomeTabSection'
import TrustBar from '@/app/components/TrustBar'
import VideoSection from '@/app/components/VideoSection'

export default function Home() {
  const summerCollectionTabs = [
    { label: 'ÁO', collectionHandle: 'ao-he' },
    { label: 'QUẦN', collectionHandle: 'quan-he' },
    { label: 'BỘ QUẦN ÁO', collectionHandle: 'bo-quan-ao-he' },
    { label: 'VÁY - CHÂN VÁY', collectionHandle: 'vay' }
  ]

  const pickleballTabs = [
    { label: 'VỢT', collectionHandle: 'vot-pick' },
    { label: 'GIÀY', collectionHandle: 'giay-pickleball' },
    { label: 'PHỤ KIỆN', collectionHandle: 'phu-kien-pickleball' }
  ]

  const collectionsData = collections.map(c => ({ handle: c.handle, productHandles: c.productHandles }))

  const badmintonProducts = products.filter(p => p.collections?.includes('cau-long-2')).slice(0, 10)
  const latestProducts = [...products].reverse().slice(0, 10)

  return (
    <main>
      <HeroSlider banners={heroBanners} />
      <SportCategories categories={sportCategories} />
      
      <HomeTabSection 
        title="SUMMER COLLECTION"
        titleHref="/collections/ao-he"
        tabs={summerCollectionTabs}
        allProducts={products}
        collections={collectionsData}
      />

      <HomeTabSection 
        title="VỢT PICKLEBALL"
        titleHref="/collections/vot-pick"
        tabs={pickleballTabs}
        allProducts={products}
        collections={collectionsData}
      />

      <VideoSection videoId="Peeahrymsc0" />

      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 uppercase">BADMINTON COLLECTION</h2>
          <a href="/collections/cau-long-2" className="text-[#f30d29] hover:underline">Xem tất cả</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {badmintonProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 bg-[#f7f7f7]">
        <h2 className="text-2xl font-bold text-center text-gray-900 uppercase mb-8">SẢN PHẨM MỚI</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {latestProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <TrustBar />
    </main>
  )
}
