'use client'

import { useState } from 'react'
import Breadcrumb from '@/app/components/Breadcrumb'
import { stores } from '@/app/lib/data/stores'

export default function StoreLocatorPage() {
  const [selectedCity, setSelectedCity] = useState('all')
  
  const cities = Array.from(new Set(stores.map(store => store.city)))
  
  const filteredStores = selectedCity === 'all' 
    ? stores 
    : stores.filter(store => store.city === selectedCity)

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Hệ thống cửa hàng', href: '/pages/he-thong-cua-hang' }]} />
      
      <h1 className="text-3xl font-bold text-center mb-8 uppercase mt-4">HỆ THỐNG CỬA HÀNG</h1>
      
      <div className="max-w-xl mx-auto mb-10">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tỉnh / Thành phố:</label>
        <select 
          value={selectedCity} 
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-[#f30d29]"
        >
          <option value="all">Tất cả tỉnh thành</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map(store => (
          <div key={store.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
            <h2 className="text-lg font-bold mb-3 text-[#f30d29]">{store.name}</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{store.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{store.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{store.hours}</span>
              </p>
            </div>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm text-[#f30d29] font-semibold hover:underline">
              Chỉ đường
            </a>
          </div>
        ))}
      </div>
      
      {filteredStores.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Không tìm thấy cửa hàng nào tại khu vực này.
        </div>
      )}
    </div>
  )
}
