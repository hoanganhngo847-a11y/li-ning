import Link from 'next/link'
import Breadcrumb from '@/app/components/Breadcrumb'
import { blogs as blogPosts } from '@/app/lib/data/blogs'

export default function BlogListingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Tin tức', href: '/blogs/news' }]} />
      
      <h1 className="text-3xl font-bold text-center mb-10 uppercase mt-4">TIN TỨC & SỰ KIỆN</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map(post => (
          <div key={post.handle} className="flex flex-col border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <Link href={`/blogs/news/${post.handle}`} className="aspect-[4/3] block overflow-hidden bg-gray-100">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </Link>
            <div className="p-6 flex flex-col flex-1">
              <div className="text-sm text-gray-500 mb-2">{post.date}</div>
              <h2 className="text-xl font-bold mb-3 hover:text-[#f30d29] transition-colors line-clamp-2">
                <Link href={`/blogs/news/${post.handle}`}>{post.title}</Link>
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
              <Link href={`/blogs/news/${post.handle}`} className="text-[#f30d29] font-bold inline-block border-b border-[#f30d29] w-max uppercase text-sm">
                Xem tiếp
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
