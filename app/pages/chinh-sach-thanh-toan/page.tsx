import Breadcrumb from '@/app/components/Breadcrumb'
import { policies } from '@/app/lib/data/policies'

export default function PaymentPolicyPage() {
  const policy = policies['chinh-sach-thanh-toan']

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[
        { label: 'Chính sách', href: '/pages/chinh-sach-thanh-toan' },
        { label: policy.title, href: '/pages/chinh-sach-thanh-toan' }
      ]} />
      
      <div className="max-w-4xl mx-auto mt-8 bg-white p-8 border border-gray-100 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-4 uppercase">{policy.title}</h1>
        <div 
          className="prose max-w-none text-gray-700 leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: policy.content }} 
        />
      </div>
    </div>
  )
}
