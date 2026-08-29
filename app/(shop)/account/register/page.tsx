import Link from 'next/link'
import Breadcrumb from '@/app/components/Breadcrumb'

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Tạo tài khoản', href: '/account/register' }]} />
      
      <div className="max-w-md mx-auto mt-8 mb-16">
        <h1 className="text-2xl font-bold text-center mb-8 uppercase">TẠO TÀI KHOẢN</h1>
        
        <form className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#f30d29]"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#f30d29]"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input 
              type="tel" 
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#f30d29]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#f30d29]"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input 
              type="password" 
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#f30d29]"
              required
            />
          </div>
          
          <div className="flex items-start gap-2 mt-4">
            <input type="checkbox" id="newsletter" className="mt-1" />
            <label htmlFor="newsletter" className="text-sm text-gray-600">
              Đăng ký nhận tin khuyến mãi qua email
            </label>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-[#111111] text-white font-bold py-3 rounded hover:bg-gray-800 transition-colors uppercase mt-4"
          >
            TẠO TÀI KHOẢN
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-gray-200 pt-6">
          <p className="text-gray-600">Đã có tài khoản?</p>
          <Link href="/account/login" className="inline-block mt-2 text-[#f30d29] font-bold hover:underline">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  )
}
