import Breadcrumb from '@/app/components/Breadcrumb'

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Liên hệ', href: '/pages/lien-he' }]} />
      
      <h1 className="text-3xl font-bold text-center mb-10 uppercase mt-4">LIÊN HỆ VỚI CHÚNG TÔI</h1>
      
      <div className="flex flex-col md:flex-row gap-12 max-w-6xl mx-auto">
        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-bold mb-6">Thông tin liên hệ</h2>
          
          <div className="space-y-4 mb-8 text-gray-700">
            <p className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#f30d29] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span><strong>Địa chỉ:</strong> Tòa nhà Hải Long, Số 123 Đường Nguyễn Trãi, Thanh Xuân, Hà Nội</span>
            </p>
            <p className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#f30d29] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span><strong>Điện thoại:</strong> 1900 1234 (Hotline)</span>
            </p>
            <p className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#f30d29] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span><strong>Email:</strong> cskh@lining.com.vn</span>
            </p>
            <p className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#f30d29] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span><strong>Giờ làm việc:</strong> 8:30 - 21:30 (Thứ 2 - Chủ Nhật)</span>
            </p>
          </div>
          
          <h2 className="text-xl font-bold mb-6">Gửi tin nhắn cho chúng tôi</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên *</label>
              <input type="text" className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#f30d29]" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#f30d29]" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
              <input type="tel" className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#f30d29]" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung *</label>
              <textarea className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#f30d29]" rows={5} required></textarea>
            </div>
            <button type="submit" className="bg-[#111111] text-white font-bold py-3 px-8 rounded hover:bg-[#f30d29] transition-colors uppercase">
              GỬI TIN NHẮN
            </button>
          </form>
        </div>
        
        <div className="w-full md:w-1/2">
          <div className="h-full min-h-[400px] w-full bg-gray-200 rounded-lg overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.898687799042!2d105.80806491493206!3d21.00293298601243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac9a473da0e3%3A0xaee2c6e646700078!2zVmluY29tIE1lZ2EgTWFsbCBSb3lhbCBDaXR5!5e0!3m2!1svi!2s!4v1654316109988!5m2!1svi!2s" 
              width="100%" 
              height="100%" 
              style={{ border: 0, minHeight: '400px' }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}
