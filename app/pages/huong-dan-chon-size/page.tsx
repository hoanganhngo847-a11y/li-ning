import Breadcrumb from '@/app/components/Breadcrumb'

export default function SizeGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[
        { label: 'Hướng dẫn', href: '/pages/huong-dan-chon-size' },
        { label: 'Hướng dẫn chọn size', href: '/pages/huong-dan-chon-size' }
      ]} />
      
      <div className="max-w-4xl mx-auto mt-8 bg-white p-8 border border-gray-100 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-4 uppercase">Bảng Hướng Dẫn Chọn Size Li-Ning</h1>
        
        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-[#f30d29]">1. BẢNG SIZE GIÀY THỂ THAO NAM / NỮ</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 text-center">
                <thead>
                  <tr className="bg-gray-100 font-bold">
                    <th className="border border-gray-300 p-2">Size Li-Ning</th>
                    <th className="border border-gray-300 p-2">Size EU</th>
                    <th className="border border-gray-300 p-2">Size US (Nam)</th>
                    <th className="border border-gray-300 p-2">Chiều dài chân (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 p-2">39</td><td className="border border-gray-300 p-2">39.5</td><td className="border border-gray-300 p-2">6.5</td><td className="border border-gray-300 p-2">24.5</td></tr>
                  <tr><td className="border border-gray-300 p-2">40</td><td className="border border-gray-300 p-2">40</td><td className="border border-gray-300 p-2">7.0</td><td className="border border-gray-300 p-2">25.0</td></tr>
                  <tr><td className="border border-gray-300 p-2">41</td><td className="border border-gray-300 p-2">41</td><td className="border border-gray-300 p-2">8.0</td><td className="border border-gray-300 p-2">25.5</td></tr>
                  <tr><td className="border border-gray-300 p-2">42</td><td className="border border-gray-300 p-2">42</td><td className="border border-gray-300 p-2">8.5</td><td className="border border-gray-300 p-2">26.0</td></tr>
                  <tr><td className="border border-gray-300 p-2">43</td><td className="border border-gray-300 p-2">43</td><td className="border border-gray-300 p-2">9.5</td><td className="border border-gray-300 p-2">26.5</td></tr>
                  <tr><td className="border border-gray-300 p-2">44</td><td className="border border-gray-300 p-2">44</td><td className="border border-gray-300 p-2">10.0</td><td className="border border-gray-300 p-2">27.0</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-[#f30d29]">2. BẢNG SIZE QUẦN ÁO THỂ THAO</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 text-center">
                <thead>
                  <tr className="bg-gray-100 font-bold">
                    <th className="border border-gray-300 p-2">Size</th>
                    <th className="border border-gray-300 p-2">Chiều cao (cm)</th>
                    <th className="border border-gray-300 p-2">Cân nặng (kg)</th>
                    <th className="border border-gray-300 p-2">Vòng ngực (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 p-2 font-bold">S</td><td className="border border-gray-300 p-2">160 - 165</td><td className="border border-gray-300 p-2">50 - 58</td><td className="border border-gray-300 p-2">84 - 88</td></tr>
                  <tr><td className="border border-gray-300 p-2 font-bold">M</td><td className="border border-gray-300 p-2">165 - 170</td><td className="border border-gray-300 p-2">58 - 66</td><td className="border border-gray-300 p-2">88 - 92</td></tr>
                  <tr><td className="border border-gray-300 p-2 font-bold">L</td><td className="border border-gray-300 p-2">170 - 175</td><td className="border border-gray-300 p-2">66 - 74</td><td className="border border-gray-300 p-2">92 - 96</td></tr>
                  <tr><td className="border border-gray-300 p-2 font-bold">XL</td><td className="border border-gray-300 p-2">175 - 180</td><td className="border border-gray-300 p-2">74 - 82</td><td className="border border-gray-300 p-2">96 - 100</td></tr>
                  <tr><td className="border border-gray-300 p-2 font-bold">2XL</td><td className="border border-gray-300 p-2">180 - 185</td><td className="border border-gray-300 p-2">82 - 90</td><td className="border border-gray-300 p-2">100 - 104</td></tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
