import Link from 'next/link'
import Breadcrumb from '@/app/components/Breadcrumb'

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Đăng nhập tài khoản', href: '/account/login' }]} />
      
      <div className="max-w-md mx-auto mt-8 mb-16">
        <h1 className="text-2xl font-bold text-center mb-8 uppercase">ĐĂNG NHẬP TÀI KHOẢN</h1>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#f30d29]"
              placeholder="Nhập địa chỉ email"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input 
              type="password" 
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#f30d29]"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          
          <div className="flex justify-end">
            <Link href="#" className="text-sm text-gray-600 hover:text-[#f30d29]">Quên mật khẩu?</Link>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-[#111111] text-white font-bold py-3 rounded hover:bg-gray-800 transition-colors uppercase mt-4"
          >
            ĐĂNG NHẬP
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-gray-200 pt-6">
          <p className="text-gray-600">Bạn chưa có tài khoản?</p>
          <Link href="/account/register" className="inline-block mt-2 text-[#f30d29] font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  )
}
