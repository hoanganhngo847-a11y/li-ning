'use client'

import Link from 'next/link'
import { useCart } from '@/app/lib/cart-context'
import Breadcrumb from '@/app/components/Breadcrumb'
import { formatPrice } from '@/app/lib/utils'

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart()

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Giỏ hàng', href: '/cart' }]} />
      
      <h1 className="text-3xl font-bold mb-8 uppercase text-center mt-4">GIỎ HÀNG CỦA BẠN</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="text-gray-500 mb-6 text-lg">Giỏ hàng của bạn đang trống</div>
          <Link href="/collections" className="inline-block bg-[#f30d29] text-white px-8 py-3 font-bold rounded hover:bg-red-700 transition-colors">
            TIẾP TỤC MUA SẮM
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-4 font-bold text-gray-700 uppercase">Sản phẩm</th>
                    <th className="py-4 font-bold text-gray-700 uppercase">Đơn giá</th>
                    <th className="py-4 font-bold text-gray-700 uppercase text-center">Số lượng</th>
                    <th className="py-4 font-bold text-gray-700 uppercase text-right">Thành tiền</th>
                    <th className="py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.variantId} className="border-b border-gray-200">
                      <td className="py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-gray-50 rounded border flex-shrink-0">
                            {item.product.images[0] && (
                              <img src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-contain" />
                            )}
                          </div>
                          <div>
                            <Link href={`/products/${item.product.handle}`} className="font-bold hover:text-[#f30d29] line-clamp-2">{item.product.title}</Link>
                            <div className="text-sm text-gray-500 mt-1">
                              {item.product.variants.find(v => v.id === item.variantId)?.title || ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 font-semibold">{formatPrice(item.product.price)}</td>
                      <td className="py-4">
                        <div className="flex items-center justify-center border border-gray-300 rounded w-max mx-auto">
                          <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100">-</button>
                          <input type="number" value={item.quantity} readOnly className="w-12 text-center border-l border-r border-gray-300 py-1 focus:outline-none bg-transparent" />
                          <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-100">+</button>
                        </div>
                      </td>
                      <td className="py-4 text-right font-bold text-[#f30d29]">{formatPrice(item.product.price * item.quantity)}</td>
                      <td className="py-4 text-right">
                        <button onClick={() => removeItem(item.variantId)} className="text-gray-400 hover:text-red-500 p-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="w-full lg:w-1/3">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-4 uppercase border-b pb-4">Thông tin đơn hàng</h2>
              
              <div className="flex justify-between mb-4 text-lg">
                <span className="font-semibold">Tạm tính:</span>
                <span className="font-bold text-[#f30d29] text-xl">{formatPrice(totalPrice)}</span>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú đơn hàng</label>
                <textarea 
                  className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[#f30d29]" 
                  rows={3} 
                  placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                ></textarea>
              </div>
              
              <p className="text-sm text-gray-500 mb-6 italic">
                Phí vận chuyển sẽ được tính ở trang thanh toán.
              </p>
              
              <button className="w-full bg-[#f30d29] text-white font-bold py-4 rounded hover:bg-red-700 transition-colors uppercase mb-4">
                TIẾN HÀNH THANH TOÁN
              </button>
              
              <Link href="/collections" className="block text-center text-gray-600 hover:text-[#f30d29] transition-colors">
                <span className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Tiếp tục mua hàng
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
