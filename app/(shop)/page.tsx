import { products } from '@/app/lib/data/products'
import { collections } from '@/app/lib/data/collections'
import { banners as heroBanners, sportCategories } from '@/app/lib/data/banners'
import HeroSlider from '@/app/components/HeroSlider'
import SportCategories from '@/app/components/SportCategories'
import HomeTabSection from '@/app/components/HomeTabSection'
import TrustBar from '@/app/components/TrustBar'
import VideoSection from '@/app/components/VideoSection'
import AnimatedProductSection from '@/app/components/AnimatedProductSection'
import AiSportsStylist from '@/app/components/AiSportsStylist'

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
      
      {/* Product section wrapper with trigger ID for AI Sports Stylist */}
      <div id="home-product-section">
        <HomeTabSection 
          title="SUMMER COLLECTION"
          titleHref="/collections/ao-he"
          tabs={summerCollectionTabs}
          allProducts={products}
          collections={collectionsData}
        />
      </div>

      <HomeTabSection 
        title="VỢT PICKLEBALL"
        titleHref="/collections/vot-pick"
        tabs={pickleballTabs}
        allProducts={products}
        collections={collectionsData}
      />

      <VideoSection videoId="Peeahrymsc0" />

      <AnimatedProductSection
        title="BADMINTON COLLECTION"
        titleHref="/collections/cau-long-2"
        products={badmintonProducts}
        animation="fade-up"
      />

      <AnimatedProductSection
        title="SẢN PHẨM MỚI"
        products={latestProducts}
        animation="fade-up"
        bgClass="bg-[#f7f7f7]"
      />

      <TrustBar />

      {/* LI-NING AI Sports Stylist Floating Card & Drawer */}
      <AiSportsStylist targetId="home-product-section" />
    </main>
  )
}
