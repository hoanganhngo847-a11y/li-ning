import Breadcrumb from '@/app/components/Breadcrumb'
import { policies } from '@/app/lib/data/policies'

export default function ChinhSachBaoHanhPage() {
  const policy = policies['chinh-sach-bao-hanh']

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: policy.title, href: '/pages/chinh-sach-bao-hanh' }]} />
      
      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold text-center mb-8 uppercase">{policy.title}</h1>
        <div className="prose max-w-none text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: policy.content }} />
      </div>
    </div>
  )
}
