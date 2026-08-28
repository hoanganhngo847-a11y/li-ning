import type { NavItem } from '../types';

export const navigation: NavItem[] = [
  {
    title: 'MÔN THỂ THAO',
    href: '/collections/the-thao',
    children: [
      { title: 'PICKLEBALL', href: '/collections/pickleball' },
      { title: 'CẦU LÔNG', href: '/collections/cau-long-2' },
      { title: 'CHẠY BỘ', href: '/collections/chay-bo-1' },
      { title: 'TẬP LUYỆN', href: '/collections/luyen-tap-1' },
      { title: 'BÓNG RỔ', href: '/collections/bong-ro-2' },
      { title: 'BÓNG ĐÁ', href: '/collections/bong-da' },
      { title: 'GOLF', href: '/collections/golf-1' },
    ]
  },
  { title: 'GIỚI THIỆU', href: '/pages/about-us' },
  {
    title: 'THỜI TRANG',
    href: '/collections/thoi-trang',
    children: [
      { title: 'SPORTLIFE', href: '/collections/sportlife' },
      { title: 'SPORTWEAR', href: '/collections/sportwear' },
      { title: 'ISAAC', href: '/collections/isaac' },
    ]
  },
  {
    title: 'YOUNG',
    href: '/collections/kids-1',
    children: [
      { title: 'BÉ TRAI (7-14 tuổi)', href: '/collections/be-trai-7-14-tuoi' },
      { title: 'BÉ GÁI (7-14 tuổi)', href: '/collections/be-gai-7-14-tuoi' },
      { title: 'PHỤ KIỆN BƠI', href: '/collections/phu-kien-boi' },
    ]
  },
  {
    title: 'NAM',
    href: '/collections/nam-1',
    children: [
      {
        title: 'GIÀY DÉP',
        href: '/collections/giay-nam-2',
        children: [
          { title: 'Giày thời trang', href: '/collections/giay-thoi-trang-nam' },
          { title: 'Giày chạy bộ', href: '/collections/giay-chay-bo-nam' },
          { title: 'Giày cầu lông', href: '/collections/giay-cau-long-nam' },
          { title: 'Giày bóng rổ', href: '/collections/giay-bong-ro-nam' },
          { title: 'Giày bóng đá', href: '/collections/giay-bong-da-nam' },
          { title: 'Giày bóng bàn', href: '/collections/giay-bong-ban-nam' },
          { title: 'Dép', href: '/collections/dep-nam' },
        ]
      },
      {
        title: 'ÁO',
        href: '/collections/ao-nam-1',
        children: [
          { title: 'Áo T-Shirt', href: '/collections/ao-t-shirt-nam' },
          { title: 'Áo Polo', href: '/collections/ao-polo-nam' },
          { title: 'Áo Gió', href: '/collections/ao-gio-nam' },
          { title: 'Áo Nỉ', href: '/collections/ao-ni-nam' },
          { title: 'Áo Dài Tay', href: '/collections/ao-dai-tay-nam' },
          { title: 'Áo Lông Vũ', href: '/collections/ao-long-vu-nam' },
        ]
      },
      {
        title: 'QUẦN',
        href: '/collections/quan-nam-2',
        children: [
          { title: 'Quần Short', href: '/collections/quan-short-nam' },
          { title: 'Quần Gió', href: '/collections/quan-gio-nam' },
          { title: 'Quần Nỉ', href: '/collections/quan-ni-nam' },
        ]
      },
      {
        title: 'BỘ QUẦN ÁO',
        href: '/collections/bo-quan-ao-nam',
        children: [
          { title: 'Bộ quần áo pickleball', href: '/collections/bo-quan-ao-pickleball-nam' },
          { title: 'Bộ Quần Áo Cầu Lông', href: '/collections/bo-quan-ao-cau-long-nam' },
          { title: 'Bộ quần áo bóng đá', href: '/collections/bo-quan-ao-bong-da-nam' },
          { title: 'Bộ Quần Áo Bóng Rổ', href: '/collections/bo-quan-ao-bong-ro-nam' },
        ]
      },
      {
        title: 'PHỤ KIỆN',
        href: '/collections/phu-kien-nam',
        children: [
          { title: 'Mũ', href: '/collections/mu-nam' },
          { title: 'Tất', href: '/collections/tat-nam' },
          { title: 'Quần lót thể thao', href: '/collections/quan-lot-the-thao-nam' },
          { title: 'Balo - Túi xách', href: '/collections/balo-tui-xach-nam' },
          { title: 'Bình nước', href: '/collections/binh-nuoc-nam' },
          { title: 'Phụ kiện thể thao', href: '/collections/phu-kien-the-thao-nam' },
        ]
      },
    ]
  },
  {
    title: 'NỮ',
    href: '/collections/nu-21',
    children: [
      {
        title: 'GIÀY DÉP',
        href: '/collections/giay-nu-2',
        children: [
          { title: 'Giày thời trang', href: '/collections/giay-thoi-trang-nu' },
          { title: 'Giày chạy bộ', href: '/collections/giay-chay-bo-nu' },
          { title: 'Giày cầu lông', href: '/collections/giay-cau-long-nu' },
          { title: 'Giày bóng rổ', href: '/collections/giay-bong-ro-nu' },
          { title: 'Dép', href: '/collections/dep-nu' },
        ]
      },
      {
        title: 'ÁO',
        href: '/collections/ao-nu-2',
        children: [
          { title: 'Áo T-Shirt', href: '/collections/ao-t-shirt-nu' },
          { title: 'Áo Polo', href: '/collections/ao-polo-nu' },
          { title: 'Áo Bra', href: '/collections/ao-bra' },
          { title: 'Áo Gió', href: '/collections/ao-gio-nu' },
          { title: 'Áo Nỉ', href: '/collections/ao-ni-nu' },
          { title: 'Áo Dài Tay', href: '/collections/ao-dai-tay-nu' },
          { title: 'Áo Lông Vũ', href: '/collections/ao-long-vu-nu' },
        ]
      },
      {
        title: 'QUẦN',
        href: '/collections/quan-nu-2',
        children: [
          { title: 'Quần Short', href: '/collections/quan-short-nu' },
          { title: 'Quần Gió', href: '/collections/quan-gio-nu' },
          { title: 'Quần Nỉ', href: '/collections/quan-ni-nu' },
        ]
      },
      {
        title: 'VÁY - CHÂN VÁY',
        href: '/collections/vay-chan-vay',
        children: []
      },
      {
        title: 'BỘ QUẦN ÁO',
        href: '/collections/bo-quan-ao-nu',
        children: [
          { title: 'Bộ quần áo pickleball', href: '/collections/bo-quan-ao-pickleball-nu' },
          { title: 'Bộ Quần Áo Cầu Lông', href: '/collections/bo-quan-ao-cau-long-nu' },
        ]
      },
      {
        title: 'PHỤ KIỆN',
        href: '/collections/phu-kien-nu',
        children: [
          { title: 'Mũ', href: '/collections/mu-nu' },
          { title: 'Tất', href: '/collections/tat-nu' },
          { title: 'Balo - Túi xách', href: '/collections/balo-tui-xach-nu' },
          { title: 'Phụ kiện thể thao', href: '/collections/phu-kien-the-thao-nu' },
        ]
      },
    ]
  },
  { title: 'MIX & MATCH', href: '/collections/lookboook' },
  {
    title: 'SALE',
    href: '/collections/khuyen-mai-sale',
    children: [
      { title: 'GIẢM 30%', href: '/collections/giam-30' },
      { title: 'GIẢM 40%', href: '/collections/giam-40' },
      { title: 'GIẢM 50%', href: '/collections/giam-50' },
    ]
  },
  { title: 'HỆ THỐNG CỬA HÀNG', href: '/pages/he-thong-cua-hang' },
  {
    title: 'TIN TỨC',
    href: '/blogs/news',
    children: [
      { title: 'TIN SỰ KIỆN', href: '/blogs/tin-su-kien' },
      { title: 'TIN KHUYẾN MẠI', href: '/blogs/tin-khuyen-mai' },
    ]
  }
];
