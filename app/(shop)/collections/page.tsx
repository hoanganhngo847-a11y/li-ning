import Link from 'next/link'
import { collections } from '@/app/lib/data/collections'
import Breadcrumb from '@/app/components/Breadcrumb'

export default function CollectionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Danh mục sản phẩm', href: '/collections' }]} />
      <h1 className="text-3xl font-bold text-center mb-8">Danh mục sản phẩm</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {collections.map(collection => (
          <Link key={collection.handle} href={`/collections/${collection.handle}`} className="group block text-center">
            <div className="aspect-[4/3] bg-gray-100 overflow-hidden rounded-lg mb-4">
              {collection.image ? (
                <img src={collection.image} alt={collection.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
              )}
            </div>
            <h2 className="font-bold text-lg group-hover:text-[#f30d29] transition-colors">{collection.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  )
}
