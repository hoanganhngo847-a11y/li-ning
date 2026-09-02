'use client';

import { useState } from 'react';
import { formatPrice } from '@/app/lib/utils';

type OrderStatus = 'pending' | 'shipping' | 'completed' | 'cancelled';

type OrderItem = {
  title: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
};

type Order = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  date: string;
  total: number;
  paymentMethod: 'COD' | 'VNPAY' | 'Chuyển khoản ATM';
  status: OrderStatus;
  items: OrderItem[];
};

const INITIAL_ORDERS: Order[] = [
  {
    id: 'LN-98241',
    customerName: 'Nguyễn Văn Hùng',
    phone: '0912 345 678',
    address: 'Số 18, Phố Bà Triệu, P. Hàng Bài',
    city: 'Hà Nội',
    date: '01/09/2026 10:30',
    total: 3957273,
    paymentMethod: 'COD',
    status: 'pending',
    items: [
      {
        title: 'Giày cầu lông Halbertec 9000 Nam AYTT001-1',
        sku: 'AYTT001-1',
        size: '42',
        color: 'Trắng Sứ',
        price: 1104545,
        quantity: 1,
        image: 'https://cdn.hstatic.net/products/1000312752/ln_q3s300059_2652413500794ac78b7a1740487e709b.jpg',
      },
      {
        title: 'Vợt Pickleball Hypercontrol 8C 16mm P-AAPW035-1V',
        sku: 'P-AAPW035-1V',
        size: 'One Size',
        color: 'Trắng Sứ',
        price: 2852728,
        quantity: 1,
        image: 'https://cdn.hstatic.net/products/1000312752/dsc02130_e0962453c0cb49a4a75b6324d634cbbe.jpg',
      },
    ],
  },
  {
    id: 'LN-98240',
    customerName: 'Trần Thị Mai',
    phone: '0988 765 432',
    address: 'Tòa Landmark 81, P. 22, Q. Bình Thạnh',
    city: 'TP. Hồ Chí Minh',
    date: '01/09/2026 09:15',
    total: 2444727,
    paymentMethod: 'VNPAY',
    status: 'shipping',
    items: [
      {
        title: 'Giày chạy bộ CHITU 9 PRO Nữ ARPW002-2V',
        sku: 'ARPW002-2V',
        size: '38',
        color: 'Hồng Pastel',
        price: 2444727,
        quantity: 1,
        image: 'https://cdn.hstatic.net/products/1000312752/dsc01858_402914ea58a24fbe9e59e81e9ac6ac07_bb35d53f40f844d7a3bb84d1ef258bfc.jpg',
      },
    ],
  },
  {
    id: 'LN-98239',
    customerName: 'Lê Hoàng Nam',
    phone: '0903 112 233',
    address: '45 Lê Duẩn, P. Hải Châu 1',
    city: 'Đà Nẵng',
    date: '31/08/2026 16:40',
    total: 1845636,
    paymentMethod: 'Chuyển khoản ATM',
    status: 'completed',
    items: [
      {
        title: 'Áo polo Golf Nam cao cấp APLV663-3V',
        sku: 'APLV663-3V',
        size: 'L',
        color: 'Xanh Dương',
        price: 680400,
        quantity: 1,
        image: 'https://cdn.hstatic.net/products/1000312752/lecoq11sp_bs06822_8921cccc03ee40df8e6636b63f65becd.jpg',
      },
      {
        title: 'Quần short Golf Nam co giãn AKSW763-1V',
        sku: 'AKSW763-1V',
        size: 'L',
        color: 'Trắng Sứ',
        price: 1165236,
        quantity: 1,
        image: 'https://cdn.hstatic.net/products/1000312752/dsc00018_fcc0b235614d457b9217e99ced581aba_16b3130d93a945809c5d507b02d2df2a.jpg',
      },
    ],
  },
  {
    id: 'LN-98238',
    customerName: 'Phạm Đức Anh',
    phone: '0977 889 900',
    address: '12 Võ Thị Sáu, P. Quyết Thắng',
    city: 'Biên Hòa',
    date: '31/08/2026 14:10',
    total: 1711309,
    paymentMethod: 'COD',
    status: 'completed',
    items: [
      {
        title: 'Giày bóng rổ Lining Shining V2 Nam ABPV003-3V',
        sku: 'ABPV003-3V',
        size: '43',
        color: 'Xanh Dương',
        price: 1711309,
        quantity: 1,
        image: 'https://cdn.hstatic.net/products/1000312752/27e2ad987cdffe0c643a1918d39081bbdd2fd2b72fe1ac8f2bfeb5b38624078f777ed3_7154051f0eb4415db00b31a07693ec4f.jpg',
      },
    ],
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);
    const matchStatus = statusFilter === 'all' ? true : o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            Chờ xử lý
          </span>
        );
      case 'shipping':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Đang giao hàng
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Hoàn thành
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-full bg-red-50 text-red-700 border border-red-200">
            Đã hủy
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#f30d29] border border-red-200 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
            Đơn Hàng Trực Tuyến • lining.id.vn
          </div>
          <h1 className="text-2xl font-black text-gray-950 uppercase tracking-tight">
            QUẢN LÝ ĐƠN HÀNG
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Theo dõi trạng thái đơn hàng, vận chuyển và thông tin thanh toán của khách hàng
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Tổng đơn:</span>
          <span className="text-lg font-black font-mono text-gray-900 bg-gray-100 px-3 py-1 rounded-xl border border-gray-200">
            {orders.length}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Tìm theo Mã đơn, Khách hàng, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#f30d29] focus:border-[#f30d29] outline-none"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'pending', label: 'Chờ xử lý' },
            { key: 'shipping', label: 'Đang giao' },
            { key: 'completed', label: 'Hoàn thành' },
            { key: 'cancelled', label: 'Đã hủy' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === tab.key
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-2xs border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5 font-bold">Mã Đơn</th>
                <th className="px-6 py-3.5 font-bold">Khách hàng</th>
                <th className="px-6 py-3.5 font-bold">Ngày đặt</th>
                <th className="px-6 py-3.5 font-bold">Tổng tiền</th>
                <th className="px-6 py-3.5 font-bold">Thanh toán</th>
                <th className="px-6 py-3.5 font-bold">Trạng thái</th>
                <th className="px-6 py-3.5 font-bold text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-mono font-black text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{order.customerName}</div>
                    <div className="text-gray-500 text-[11px] font-mono">{order.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-[11px]">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-[#f30d29]">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700 font-medium bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#111111] hover:text-white text-gray-800 font-bold text-[11px] transition-all cursor-pointer"
                    >
                      Xem đơn &rarr;
                    </button>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-xs font-medium">
                    Không tìm thấy đơn hàng nào phù hợp với bộ lọc
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-gray-400">
                  Chi tiết đơn hàng
                </span>
                <h3 className="text-xl font-black text-gray-900 font-mono">
                  {selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Customer Info Card */}
            <div className="my-5 p-4 rounded-2xl bg-gray-50 border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-400 block font-medium">Người nhận:</span>
                <strong className="text-gray-900 font-bold text-sm">{selectedOrder.customerName}</strong>
                <div className="text-gray-600 font-mono mt-0.5">{selectedOrder.phone}</div>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Địa chỉ giao hàng:</span>
                <span className="text-gray-800 font-medium">{selectedOrder.address}, {selectedOrder.city}</span>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Sản phẩm trong đơn ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl p-3">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="w-12 h-12 object-contain bg-gray-50 rounded-lg border border-gray-200 shrink-0" />
                      <div>
                        <div className="font-bold text-gray-900 line-clamp-1">{item.title}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          Size: <span className="font-bold">{item.size}</span> • Màu: <span className="font-bold">{item.color}</span> • SKU: <span className="font-mono">{item.sku}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 font-mono">
                      <div className="font-bold text-gray-900">{formatPrice(item.price)}</div>
                      <div className="text-[11px] text-gray-500">x {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Calculation */}
            <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
              <span className="font-bold text-gray-700">Tổng thanh toán:</span>
              <span className="text-xl font-black text-[#f30d29] font-mono">
                {formatPrice(selectedOrder.total)}
              </span>
            </div>

            {/* Change Status Controls */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Cập nhật trạng thái đơn hàng:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'pending', label: 'Chờ xử lý', color: 'hover:border-amber-400' },
                  { key: 'shipping', label: 'Đang giao hàng', color: 'hover:border-blue-400' },
                  { key: 'completed', label: 'Hoàn thành', color: 'hover:border-emerald-400' },
                  { key: 'cancelled', label: 'Hủy đơn', color: 'hover:border-red-400' },
                ].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => handleUpdateStatus(selectedOrder.id, s.key as OrderStatus)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedOrder.status === s.key
                        ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                        : `bg-gray-50 text-gray-700 border-gray-200 ${s.color}`
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
