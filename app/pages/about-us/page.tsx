import Breadcrumb from '@/app/components/Breadcrumb'

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Giới thiệu', href: '/pages/about-us' }]} />
      
      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold text-center mb-10 uppercase">VỀ LI-NING</h1>
        
        <div className="space-y-12 text-gray-800 text-lg leading-relaxed">
          <section>
            <img src="https://cdn.hstatic.net/200000642007/1001188166/14/about_banner.jpg" alt="Li-Ning About Us" className="w-full rounded-lg mb-6" />
            <p className="mb-4">
              Được thành lập vào năm 1990 bởi vận động viên thể dục dụng cụ huyền thoại Li Ning, thương hiệu thể thao Li-Ning đã không ngừng phát triển để trở thành một trong những công ty cung cấp thiết bị và trang phục thể thao hàng đầu thế giới.
            </p>
            <p>
              Với khẩu hiệu <strong>"Anything Is Possible"</strong> (Không gì là không thể), Li-Ning truyền cảm hứng cho những người yêu thể thao vượt qua giới hạn của bản thân, không ngừng nỗ lực để đạt được những thành tựu mới.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Đổi mới và Thiết kế toàn cầu</h2>
            <p className="mb-4">
              Li-Ning sở hữu các trung tâm R&D và thiết kế đẳng cấp thế giới tại Trung Quốc, Mỹ, và Hàn Quốc. Bằng việc áp dụng các công nghệ tiên tiến nhất như Li-Ning BOOM, Jiang, và Beng, các sản phẩm giày và trang phục của hãng mang lại hiệu suất vượt trội cho các vận động viên chuyên nghiệp lẫn nghiệp dư.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Hai trụ cột: Thể thao chuyên nghiệp và Phong cách sống</h2>
            <p className="mb-4">
              Li-Ning tập trung phát triển song song hai dòng sản phẩm cốt lõi:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Thể thao chuyên nghiệp (Professional Sports):</strong> Tài trợ cho nhiều đội tuyển quốc gia và vận động viên hàng đầu trong các môn Cầu lông, Bóng rổ, Chạy bộ và Bóng bàn.</li>
              <li><strong>Phong cách sống (Lifestyle / WADE / COUNTERFLOW):</strong> Kết hợp giữa di sản văn hóa, thời trang đường phố và công nghệ, tạo ra những bộ sưu tập đậm chất cá tính được giới trẻ yêu thích, tiêu biểu là dòng sản phẩm hợp tác với Dwyane Wade.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Li-Ning tại Việt Nam</h2>
            <p>
              Tại thị trường Việt Nam, Li-Ning được phân phối độc quyền bởi Công ty TNHH Đầu tư và Thương mại Hải Long. Chúng tôi cam kết mang đến những sản phẩm chính hãng, chất lượng cao nhất cùng dịch vụ khách hàng chuyên nghiệp, đồng hành cùng sự phát triển của phong trào thể thao nước nhà.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
