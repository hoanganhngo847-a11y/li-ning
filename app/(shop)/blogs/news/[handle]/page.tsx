import Link from 'next/link'
import Breadcrumb from '@/app/components/Breadcrumb'
import { blogs as blogPosts } from '@/app/lib/data/blogs'

export default async function BlogDetailPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const post = blogPosts.find(p => p.handle === handle) || blogPosts[0]
  
  if (!post) {
    return <div className="container mx-auto px-4 py-12 text-center">Không tìm thấy bài viết</div>
  }

  const recentPosts = blogPosts.filter(p => p.handle !== handle).slice(0, 5)

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[
        { label: 'Tin tức', href: '/blogs/news' },
        { label: post.title, href: `/blogs/news/${post.handle}` }
      ]} />
      
      <div className="flex flex-col lg:flex-row gap-10 mt-8">
        <div className="w-full lg:w-3/4">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="text-gray-500 mb-8 border-b border-gray-200 pb-4">
            Người viết: Admin | {post.date}
          </div>
          
          <div className="prose max-w-none text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
        
        <div className="w-full lg:w-1/4">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 sticky top-4">
            <h3 className="text-xl font-bold mb-6 uppercase border-b-2 border-[#f30d29] pb-2 inline-block">BÀI VIẾT MỚI</h3>
            <div className="space-y-6">
              {recentPosts.map(rp => (
                <div key={rp.handle} className="flex gap-4">
                  <Link href={`/blogs/news/${rp.handle}`} className="w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                    <img src={rp.image} alt={rp.title} className="w-full h-full object-cover" />
                  </Link>
                  <div>
                    <h4 className="font-bold text-sm hover:text-[#f30d29] transition-colors line-clamp-2 mb-1">
                      <Link href={`/blogs/news/${rp.handle}`}>{rp.title}</Link>
                    </h4>
                    <div className="text-xs text-gray-500">{rp.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
