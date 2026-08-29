const fs = require('fs');
const path = require('path');

const libDir = path.join(__dirname, 'app', 'lib');
const dataDir = path.join(libDir, 'data');

if (!fs.existsSync(libDir)) fs.mkdirSync(libDir, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// 1. types.ts
const typesContent = `export interface ProductVariant {
  id: string;
  title: string;
  size: string;
  color: string;
  available: boolean;
  price: number;
  compareAtPrice: number | null;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  variants: ProductVariant[];
  collections: string[];
  sport: string;
  gender: 'nam' | 'nu' | 'unisex' | 'kids';
  description: string;
  sku: string;
  available: boolean;
}

export interface Collection {
  handle: string;
  title: string;
  description: string;
  image: string;
  productHandles: string[];
}

export interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
}

export interface BlogPost {
  handle: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  phone: string;
  hours: string;
  mapUrl: string;
}

export interface Banner {
  id: string;
  image: string;
  imageMobile: string;
  link: string;
  alt: string;
}

export interface CartItem {
  product: Product;
  variantId: string;
  quantity: number;
}

export interface PolicyPage {
  title: string;
  content: string;
}
`;
fs.writeFileSync(path.join(libDir, 'types.ts'), typesContent);

// 2. utils.ts
const utilsContent = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

export function calculateDiscount(price: number, compareAtPrice: number): number {
  if (compareAtPrice <= price || compareAtPrice === 0) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
fs.writeFileSync(path.join(libDir, 'utils.ts'), utilsContent);

// 3. navigation.ts
const navContent = `import { NavItem } from '../types';

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
  { title: 'HỆ THỐNG CỬA HÀNG', href: '/pages/he-thong-cua-hang-2' },
  {
    title: 'TIN TỨC',
    href: '/blogs/news',
    children: [
      { title: 'TIN SỰ KIỆN', href: '/blogs/tin-su-kien' },
      { title: 'TIN KHUYẾN MẠI', href: '/blogs/tin-khuyen-mai' },
    ]
  }
];
`;
fs.writeFileSync(path.join(dataDir, 'navigation.ts'), navContent);

// 4. products.ts
const productsData = [
  { id: '1', handle: 'ao-polo-nam-p-aplr125-10v', title: 'Áo Polo Nam P-APLR125-10V', sku: 'P-APLR125-10V', price: 579273, compareAtPrice: null, image: 'https://cdn.hstatic.net/products/1000312752/p-aplr125-10v__1__af68eb06330c47a0963f4b53b993ba3f_fa1c3956deed46ddacc847fa5edb2fad.jpg', sport: 'thoi-trang', gender: 'nam', collections: ['ao-nam-1', 'ao-polo-nam', 'nam-1', 'thoi-trang'] },
  { id: '2', handle: 'ao-polo-nam-p-aplr125-9v-den', title: 'Áo Polo Nam P-APLR125-9V (đen)', sku: 'P-APLR125-9V', price: 579273, compareAtPrice: null, image: 'https://cdn.hstatic.net/products/1000312752/_den_538897b224a94df7a6b75b5582f31474_c547941276204780828cdbdccf27de1c_d5e65ff3833c430db58fab7e1aa83bec.png', sport: 'thoi-trang', gender: 'nam', collections: ['ao-nam-1', 'ao-polo-nam', 'nam-1', 'thoi-trang'] },
  { id: '3', handle: 'giay-cau-long-nam-aytt001-1', title: 'Giày cầu lông Nam AYTT001-1', sku: 'AYTT001-1', price: 824727, compareAtPrice: 1178182, image: 'https://cdn.hstatic.net/products/1000312752/2efb_6646451cb2824e3699d741dd31dc9f86_07e55fc63f3644bfbfa971b0a84d6c79_71aee0aa7b42437ea64d8fcab903b4a0.jpg', sport: 'cau-long-2', gender: 'nam', collections: ['giay-nam-2', 'giay-cau-long-nam', 'nam-1', 'cau-long-2', 'khuyen-mai-sale'] },
  { id: '4', handle: 'giay-cau-long-nam-aytt001-3', title: 'Giày cầu lông Nam AYTT001-3', sku: 'AYTT001-3', price: 824727, compareAtPrice: 1178182, image: 'https://cdn.hstatic.net/products/1000312752/giay_cau_long_nam_aytt001-3_1.jpg', sport: 'cau-long-2', gender: 'nam', collections: ['giay-nam-2', 'giay-cau-long-nam', 'nam-1', 'cau-long-2', 'khuyen-mai-sale'] },
  { id: '5', handle: 'giay-cau-long-nam-p-aytv015-3', title: 'Giày cầu lông Nam P-AYTV015-3', sku: 'P-AYTV015-3', price: 613637, compareAtPrice: null, image: 'https://cdn.hstatic.net/products/1000312752/giay_cau_long_nam_p-aytv015-3_1.jpg', sport: 'cau-long-2', gender: 'nam', collections: ['giay-nam-2', 'giay-cau-long-nam', 'nam-1', 'cau-long-2'], available: false },
  { id: '6', handle: 'giay-cau-long-feiying-nam-aytu001-1', title: 'Giày cầu lông Feiying Nam AYTU001-1', sku: 'AYTU001-1', price: 1178182, compareAtPrice: null, image: 'https://cdn.hstatic.net/products/1000312752/giay_cau_long_feiying_nam_aytu001-1_1.jpg', sport: 'cau-long-2', gender: 'nam', collections: ['giay-nam-2', 'giay-cau-long-nam', 'nam-1', 'cau-long-2'] },
  { id: '7', handle: 'vot-pickleball-hypercontrol-4-white', title: 'Vợt Pickleball HyperControl 4 White', sku: 'HC4-W', price: 1104545, compareAtPrice: 1472727, image: 'https://cdn.hstatic.net/products/1000312752/vot_pickleball_hypercontrol_4_white_1.jpg', sport: 'pickleball', gender: 'unisex', collections: ['pickleball', 'phu-kien-the-thao-nam', 'phu-kien-the-thao-nu', 'the-thao', 'khuyen-mai-sale'] },
  { id: '8', handle: 'vot-pickleball-hypercontrol-8c-16mm', title: 'Vợt Pickleball Hypercontrol 8C 16mm', sku: 'HC8C-16', price: 2852182, compareAtPrice: 4074545, image: 'https://cdn.hstatic.net/products/1000312752/vot_pickleball_hypercontrol_8c_16mm_1.jpg', sport: 'pickleball', gender: 'unisex', collections: ['pickleball', 'phu-kien-the-thao-nam', 'phu-kien-the-thao-nu', 'the-thao', 'khuyen-mai-sale'] },
  { id: '9', handle: 'quan-short-nam-p-aapw037-4v', title: 'Quần short Nam P-AAPW037-4V', sku: 'P-AAPW037-4V', price: 461454, compareAtPrice: null, image: 'https://cdn.hstatic.net/products/1000312752/quan_short_nam_p-aapw037-4v_1.jpg', sport: 'thoi-trang', gender: 'nam', collections: ['quan-nam-2', 'quan-short-nam', 'nam-1', 'thoi-trang'] },
  { id: '10', handle: 'ao-t-shirt-nam-p-atsv731-2v', title: 'Áo T-Shirt Nam P-ATSV731-2V', sku: 'P-ATSV731-2V', price: 395000, compareAtPrice: null, image: 'https://cdn.hstatic.net/products/1000312752/ao_t-shirt_nam_p-atsv731-2v_1.jpg', sport: 'thoi-trang', gender: 'nam', collections: ['ao-nam-1', 'ao-t-shirt-nam', 'nam-1', 'thoi-trang'] }
];

const categories = [
  { sport: 'chay-bo-1', col: 'giay-chay-bo', p: 'Giày chạy bộ' },
  { sport: 'bong-ro-2', col: 'giay-bong-ro', p: 'Giày bóng rổ' },
  { sport: 'thoi-trang', col: 'ao-gio', p: 'Áo gió' },
  { sport: 'thoi-trang', col: 'ao-ni', p: 'Áo nỉ' },
  { sport: 'the-thao', col: 'balo-tui-xach', p: 'Balo thể thao' },
  { sport: 'cau-long-2', col: 'phu-kien-the-thao', p: 'Vợt cầu lông' },
];
let idCounter = 11;
for (let i = 0; i < 30; i++) {
  const gender = i % 2 === 0 ? 'nam' : 'nu';
  const cat = categories[i % categories.length];
  const price = Math.floor(Math.random() * 4000000) + 300000;
  const compareAtPrice = Math.random() > 0.5 ? price + Math.floor(Math.random() * 1000000) + 100000 : null;
  const title = `${cat.p} ${gender === 'nam' ? 'Nam' : 'Nữ'} Li-Ning ${idCounter}`;
  
  productsData.push({
    id: idCounter.toString(),
    handle: title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
    title: title,
    sku: `LN-${idCounter}`,
    price: price,
    compareAtPrice: compareAtPrice,
    image: `https://cdn.hstatic.net/products/1000312752/${title.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '')}_1.jpg`,
    sport: cat.sport,
    gender: gender,
    collections: [`${cat.col}-${gender}`, `${gender === 'nam' ? 'nam-1' : 'nu-21'}`, cat.sport, compareAtPrice ? 'khuyen-mai-sale' : 'thoi-trang'].filter(Boolean)
  });
  idCounter++;
}

let productsContent = `import { Product } from '../types';

export const products: Product[] = [
`;

productsData.forEach(p => {
  productsContent += `  {
    id: '${p.id}',
    handle: '${p.handle}',
    title: '${p.title}',
    price: ${p.price},
    compareAtPrice: ${p.compareAtPrice},
    images: ['${p.image}', '${p.image.replace('_1.jpg', '_2.jpg')}'],
    variants: [
      { id: '${p.id}-1', title: 'S / ${p.gender === 'nam' ? 'Đen' : 'Trắng'}', size: 'S', color: '${p.gender === 'nam' ? 'Đen' : 'Trắng'}', available: true, price: ${p.price}, compareAtPrice: ${p.compareAtPrice} },
      { id: '${p.id}-2', title: 'M / ${p.gender === 'nam' ? 'Đen' : 'Trắng'}', size: 'M', color: '${p.gender === 'nam' ? 'Đen' : 'Trắng'}', available: ${p.available !== false}, price: ${p.price}, compareAtPrice: ${p.compareAtPrice} },
      { id: '${p.id}-3', title: 'L / ${p.gender === 'nam' ? 'Đen' : 'Trắng'}', size: 'L', color: '${p.gender === 'nam' ? 'Đen' : 'Trắng'}', available: true, price: ${p.price}, compareAtPrice: ${p.compareAtPrice} }
    ],
    collections: ${JSON.stringify(p.collections)},
    sport: '${p.sport}',
    gender: '${p.gender}',
    description: '<p>${p.title} chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: '${p.sku}',
    available: ${p.available !== false}
  },
`;
});
productsContent += `];\n`;
fs.writeFileSync(path.join(dataDir, 'products.ts'), productsContent);

// 5. collections.ts
const collectionsData = [
  { handle: 'the-thao', title: 'MÔN THỂ THAO', desc: 'Các sản phẩm thể thao chuyên dụng', img: 'groupbuy_1_img' },
  { handle: 'pickleball', title: 'PICKLEBALL', desc: 'Trang phục và phụ kiện Pickleball', img: 'groupbuy_1_img' },
  { handle: 'cau-long-2', title: 'CẦU LÔNG', desc: 'Sản phẩm cầu lông chuyên nghiệp', img: 'groupbuy_2_img' },
  { handle: 'chay-bo-1', title: 'CHẠY BỘ', desc: 'Giày và trang phục chạy bộ', img: 'groupbuy_4_img' },
  { handle: 'luyen-tap-1', title: 'TẬP LUYỆN', desc: 'Đồ tập gym và fitness', img: 'groupbuy_6_img' },
  { handle: 'bong-ro-2', title: 'BÓNG RỔ', desc: 'Giày và trang phục bóng rổ', img: 'groupbuy_7_img' },
  { handle: 'bong-da', title: 'BÓNG ĐÁ', desc: 'Trang phục và phụ kiện bóng đá', img: 'groupbuy_10_img' },
  { handle: 'golf-1', title: 'GOLF', desc: 'Thời trang Golf cao cấp', img: 'groupbuy_9_img' },
  { handle: 'nam-1', title: 'NAM', desc: 'Thời trang thể thao Nam', img: 'groupbuy_1_img' },
  { handle: 'nu-21', title: 'NỮ', desc: 'Thời trang thể thao Nữ', img: 'groupbuy_2_img' },
  { handle: 'giay-nam-2', title: 'GIÀY NAM', desc: 'Giày thể thao nam', img: 'groupbuy_4_img' },
  { handle: 'ao-nam-1', title: 'ÁO NAM', desc: 'Áo thể thao nam', img: 'groupbuy_1_img' },
  { handle: 'quan-nam-2', title: 'QUẦN NAM', desc: 'Quần thể thao nam', img: 'groupbuy_1_img' },
  { handle: 'giay-nu-2', title: 'GIÀY NỮ', desc: 'Giày thể thao nữ', img: 'groupbuy_4_img' },
  { handle: 'ao-nu-2', title: 'ÁO NỮ', desc: 'Áo thể thao nữ', img: 'groupbuy_2_img' },
  { handle: 'khuyen-mai-sale', title: 'SALE', desc: 'Các sản phẩm khuyến mãi', img: 'groupbuy_6_img' },
  { handle: 'thoi-trang', title: 'THỜI TRANG', desc: 'Thời trang Sportlife', img: 'groupbuy_1_img' },
  { handle: 'kids-1', title: 'YOUNG', desc: 'Thời trang thể thao trẻ em', img: 'groupbuy_2_img' },
  { handle: 'ao-he', title: 'Áo Hè', desc: 'Bộ sưu tập áo hè', img: 'groupbuy_1_img' },
  { handle: 'quan-he', title: 'Quần Hè', desc: 'Bộ sưu tập quần hè', img: 'groupbuy_1_img' }
];

let collectionsContent = `import { Collection } from '../types';

export const collections: Collection[] = [
`;
collectionsData.forEach(c => {
  collectionsContent += `  {
    handle: '${c.handle}',
    title: '${c.title}',
    description: '${c.desc}',
    image: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/${c.img}.jpg',
    productHandles: [] // In a real app, we would populate this or filter the products array by collection
  },
`;
});
collectionsContent += `];\n`;
fs.writeFileSync(path.join(dataDir, 'collections.ts'), collectionsContent);

// 6. banners.ts
const bannersContent = `import { Banner } from '../types';

export const banners: Banner[] = [
  { id: '1', image: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/slideshow_1.jpg?v=165', imageMobile: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/slideshow_mb_1.jpg', link: '/collections/chuong-trinh-khuyen-mai', alt: 'Khuyến mãi' },
  { id: '2', image: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/slideshow_3.jpg', imageMobile: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/slideshow_mb_3.jpg', link: '/collections/running-series-2026', alt: 'Running Series 2026' },
  { id: '3', image: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/slideshow_4.jpg', imageMobile: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/slideshow_mb_4.jpg', link: '/collections/uu-dai-dac-biet-only-online-1', alt: 'Ưu đãi Only Online' },
  { id: '4', image: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/slideshow_6.jpg', imageMobile: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/slideshow_mb_6.jpg', link: '/collections/pickleball', alt: 'Pickleball' },
  { id: '5', image: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/slideshow_7.jpg', imageMobile: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/slideshow_mb_7.jpg', link: '/collections/shida', alt: 'Shida' }
];

export const sportCategories = [
  { id: 'pickleball', image: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/groupbuy_1_img.jpg', title: 'PICKLEBALL' },
  { id: 'cau-long', image: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/groupbuy_2_img.jpg', title: 'CẦU LÔNG' },
  { id: 'chay-bo', image: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/groupbuy_4_img.jpg', title: 'CHẠY BỘ' },
  { id: 'tap-luyen', image: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/groupbuy_6_img.jpg', title: 'TẬP LUYỆN' },
  { id: 'bong-ro', image: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/groupbuy_7_img.jpg', title: 'BÓNG RỔ' },
  { id: 'golf', image: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/groupbuy_9_img.jpg', title: 'GOLF' },
  { id: 'bong-da', image: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/groupbuy_10_img.jpg', title: 'BÓNG ĐÁ' },
  { id: 'bong-ban', image: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/groupbuy_11_img.jpg', title: 'BÓNG BÀN' },
];
`;
fs.writeFileSync(path.join(dataDir, 'banners.ts'), bannersContent);

// 7. blogs.ts
const blogsContent = `import { BlogPost } from '../types';

export const blogs: BlogPost[] = [
  { handle: 'ky-thuat-danh-cau-long-co-ban', title: 'Kỹ thuật đánh cầu lông cơ bản cho người mới', excerpt: 'Hướng dẫn chi tiết các kỹ thuật đánh cầu lông cơ bản nhất dành cho người mới bắt đầu...', content: '<p>Cầu lông là môn thể thao phổ biến...</p><p>Để chơi tốt, bạn cần nắm vững các kỹ thuật cầm vợt, di chuyển và phông cầu...</p>', image: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/blog_1.jpg', date: '2026-08-01', category: 'Tin sự kiện' },
  { handle: 'huong-dan-chon-giay-chay-bo', title: 'Hướng dẫn chọn giày chạy bộ phù hợp', excerpt: 'Một đôi giày chạy bộ tốt sẽ giúp bạn tránh chấn thương và cải thiện thành tích...', content: '<p>Việc chọn giày chạy bộ vô cùng quan trọng...</p>', image: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/blog_2.jpg', date: '2026-08-05', category: 'Tin tức' },
  { handle: 'meo-choi-pickleball-hieu-qua', title: 'Mẹo chơi Pickleball hiệu quả để luôn giành chiến thắng', excerpt: 'Pickleball đang là môn thể thao xu hướng. Khám phá ngay các mẹo chơi hiệu quả...', content: '<p>Pickleball kết hợp giữa tennis, bóng bàn và cầu lông...</p>', image: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/blog_3.jpg', date: '2026-08-10', category: 'Tin tức' },
  { handle: 'bo-suu-tap-thu-dong-2026', title: 'Ra mắt bộ sưu tập Thu Đông 2026 của Li-Ning', excerpt: 'Sự kiện ra mắt bộ sưu tập mới với các công nghệ giữ ấm vượt trội...', content: '<p>Li-Ning hân hạnh giới thiệu bộ sưu tập Thu Đông 2026...</p>', image: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/blog_4.jpg', date: '2026-08-12', category: 'Tin sự kiện' },
  { handle: 'chuong-trinh-khuyen-mai-thang-8', title: 'Chương trình khuyến mãi tháng 8: Giảm tới 50%', excerpt: 'Cơ hội sở hữu các sản phẩm thể thao cao cấp với mức giá cực kỳ ưu đãi...', content: '<p>Khuyến mãi lớn nhất mùa hè từ Li-Ning...</p>', image: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/blog_5.jpg', date: '2026-08-15', category: 'Tin khuyến mại' },
  { handle: 'cach-bao-quan-vot-cau-long', title: 'Cách bảo quản vợt cầu lông để kéo dài tuổi thọ', excerpt: 'Những lưu ý quan trọng giúp vợt cầu lông của bạn luôn bền bỉ theo thời gian...', content: '<p>Tránh để vợt ở nơi quá nóng, hãy để trong bao vợt...</p>', image: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/blog_6.jpg', date: '2026-08-18', category: 'Tin tức' },
  { handle: 'li-ning-tai-tro-giai-chay-marathon', title: 'Li-Ning đồng hành cùng giải chạy Marathon Quốc Tế', excerpt: 'Li-Ning tiếp tục là nhà tài trợ trang phục chính thức cho giải chạy lớn nhất năm...', content: '<p>Với mục tiêu thúc đẩy phong trào thể thao...</p>', image: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/blog_7.jpg', date: '2026-08-20', category: 'Tin sự kiện' },
  { handle: 'flash-sale-cuoi-tuan', title: 'Flash Sale cuối tuần: Ưu đãi độc quyền online', excerpt: 'Chỉ diễn ra trong 2 ngày cuối tuần, mua ngay các sản phẩm hot...', content: '<p>Duy nhất thứ 7 và Chủ nhật, giảm giá sâu...</p>', image: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/blog_8.jpg', date: '2026-08-25', category: 'Tin khuyến mại' }
];
`;
fs.writeFileSync(path.join(dataDir, 'blogs.ts'), blogsContent);

// 8. stores.ts
const storesContent = `import { Store } from '../types';

export const stores: Store[] = [
  { id: '1', name: 'Li-Ning Vincom Bà Triệu', address: 'Tầng 3, Vincom Center, 191 Bà Triệu', city: 'Hà Nội', district: 'Hai Bà Trưng', phone: '024 3974 0000', hours: '09:00 - 22:00', mapUrl: 'https://maps.google.com/?q=Vincom+Ba+Trieu' },
  { id: '2', name: 'Li-Ning Aeon Mall Long Biên', address: 'Tầng 2, Aeon Mall Long Biên', city: 'Hà Nội', district: 'Long Biên', phone: '024 3200 0000', hours: '09:00 - 22:00', mapUrl: 'https://maps.google.com/?q=Aeon+Mall+Long+Bien' },
  { id: '3', name: 'Li-Ning Royal City', address: 'B1-R4, Vincom Mega Mall Royal City', city: 'Hà Nội', district: 'Thanh Xuân', phone: '024 6664 0000', hours: '09:00 - 22:00', mapUrl: 'https://maps.google.com/?q=Royal+City' },
  { id: '4', name: 'Li-Ning Times City', address: 'Tầng B1, Vincom Mega Mall Times City', city: 'Hà Nội', district: 'Hai Bà Trưng', phone: '024 3200 1111', hours: '09:00 - 22:00', mapUrl: 'https://maps.google.com/?q=Times+City' },
  { id: '5', name: 'Li-Ning Lotte Center', address: 'Tầng 4, Lotte Center, 54 Liễu Giai', city: 'Hà Nội', district: 'Ba Đình', phone: '024 3333 2222', hours: '09:00 - 22:00', mapUrl: 'https://maps.google.com/?q=Lotte+Center+Hanoi' },
  { id: '6', name: 'Li-Ning Vincom Đồng Khởi', address: 'Tầng B1, Vincom Center Đồng Khởi', city: 'TP.HCM', district: 'Quận 1', phone: '028 3993 0000', hours: '09:00 - 22:00', mapUrl: 'https://maps.google.com/?q=Vincom+Dong+Khoi' },
  { id: '7', name: 'Li-Ning Aeon Mall Tân Phú', address: 'Tầng 1, Aeon Mall Tân Phú', city: 'TP.HCM', district: 'Tân Phú', phone: '028 3888 1111', hours: '09:00 - 22:00', mapUrl: 'https://maps.google.com/?q=Aeon+Mall+Tan+Phu' },
  { id: '8', name: 'Li-Ning Crescent Mall', address: 'Tầng 3, Crescent Mall', city: 'TP.HCM', district: 'Quận 7', phone: '028 5413 0000', hours: '09:00 - 22:00', mapUrl: 'https://maps.google.com/?q=Crescent+Mall' },
  { id: '9', name: 'Li-Ning Vạn Hạnh Mall', address: 'Tầng 2, Vạn Hạnh Mall', city: 'TP.HCM', district: 'Quận 10', phone: '028 3862 0000', hours: '09:00 - 22:00', mapUrl: 'https://maps.google.com/?q=Van+Hanh+Mall' },
  { id: '10', name: 'Li-Ning Vincom Đà Nẵng', address: 'Tầng 2, Vincom Plaza Ngô Quyền', city: 'Đà Nẵng', district: 'Sơn Trà', phone: '0236 3666 000', hours: '09:00 - 22:00', mapUrl: 'https://maps.google.com/?q=Vincom+Da+Nang' },
  { id: '11', name: 'Li-Ning Aeon Mall Hải Phòng', address: 'Tầng 2, Aeon Mall Hải Phòng Lê Chân', city: 'Hải Phòng', district: 'Lê Chân', phone: '0225 3888 000', hours: '09:00 - 22:00', mapUrl: 'https://maps.google.com/?q=Aeon+Mall+Hai+Phong' },
  { id: '12', name: 'Li-Ning Vincom Hùng Vương', address: 'Tầng 1, Vincom Plaza Hùng Vương', city: 'Cần Thơ', district: 'Ninh Kiều', phone: '0292 3888 000', hours: '09:00 - 22:00', mapUrl: 'https://maps.google.com/?q=Vincom+Hung+Vuong+Can+Tho' }
];
`;
fs.writeFileSync(path.join(dataDir, 'stores.ts'), storesContent);

// 9. policies.ts
const policiesContent = `import { PolicyPage } from '../types';

export const policies: Record<string, PolicyPage> = {
  'chinh-sach-bao-hanh': {
    title: 'Chính sách bảo hành',
    content: '<p><strong>1. Thời gian bảo hành:</strong><br/>- Vợt cầu lông/Pickleball: Bảo hành 60 ngày kể từ ngày mua hàng.<br/>- Giày và quần áo: Bảo hành 30 ngày đối với các lỗi từ nhà sản xuất.</p><p><strong>2. Điều kiện bảo hành:</strong><br/>- Sản phẩm còn giữ nguyên hóa đơn mua hàng.<br/>- Lỗi do nhà sản xuất (bung keo, đứt chỉ, gãy thân vợt khi đánh đúng kỹ thuật).</p><p><strong>3. Các trường hợp không được bảo hành:</strong><br/>- Sản phẩm hao mòn do sử dụng.<br/>- Hư hỏng do sử dụng sai cách, va đập mạnh, để nơi nhiệt độ cao.</p><p><strong>4. Quy trình bảo hành:</strong><br/>Mang sản phẩm kèm hóa đơn đến cửa hàng Li-Ning gần nhất hoặc gửi về trung tâm bảo hành. Thời gian xử lý từ 7-14 ngày làm việc.</p>'
  },
  'chinh-sach-doi-tra': {
    title: 'Chính sách đổi trả',
    content: '<p><strong>1. Mua hàng Online:</strong><br/>Khách hàng được quyền đổi trả sản phẩm trong vòng 3 ngày kể từ ngày nhận hàng (căn cứ theo dấu bưu điện hoặc xác nhận giao hàng).</p><p><strong>2. Mua hàng tại cửa hàng:</strong><br/>Khách hàng có thể đổi trả trong vòng 7 ngày kể từ ngày mua hàng ghi trên hóa đơn.</p><p><strong>3. Điều kiện đổi trả:</strong><br/>- Sản phẩm chưa qua sử dụng, còn nguyên tem mác, hộp đựng.<br/>- Phải có hóa đơn mua hàng kèm theo.<br/>- Sản phẩm giảm giá trên 30% không áp dụng chính sách đổi trả.</p>'
  },
  'chinh-sach-van-chuyen': {
    title: 'Chính sách vận chuyển',
    content: '<p><strong>1. Thời gian giao hàng:</strong><br/>- Nội thành Hà Nội và TP.HCM: 1-2 ngày làm việc.<br/>- Các tỉnh thành khác: 3-7 ngày làm việc.</p><p><strong>2. Phí vận chuyển:</strong><br/>- Miễn phí vận chuyển cho đơn hàng từ 1.000.000 VNĐ.<br/>- Các đơn hàng dưới 1.000.000 VNĐ áp dụng mức phí 30.000 VNĐ trên toàn quốc.</p><p><strong>3. Nhận hàng và kiểm tra:</strong><br/>Khách hàng thanh toán COD được quyền mở bưu kiện kiểm tra sản phẩm trước khi thanh toán cho nhân viên giao hàng.</p>'
  },
  'chinh-sach-thanh-toan': {
    title: 'Chính sách thanh toán',
    content: '<p>Li-Ning hỗ trợ các phương thức thanh toán sau:</p><p><strong>1. Thanh toán tiền mặt khi nhận hàng (COD):</strong><br/>Áp dụng cho mọi đơn hàng trên toàn quốc.</p><p><strong>2. Thanh toán qua cổng VNPAY:</strong><br/>Quét mã QR qua ứng dụng Mobile Banking của các ngân hàng.</p><p><strong>3. Thanh toán bằng thẻ ATM nội địa / Thẻ tín dụng (Visa, MasterCard):</strong><br/>Thanh toán an toàn qua cổng thanh toán trực tuyến.</p>'
  },
  'huong-dan-mua-hang': {
    title: 'Hướng dẫn mua hàng',
    content: '<p>Quy trình mua hàng trực tuyến tại Li-Ning gồm 7 bước đơn giản:</p><p><strong>Bước 1:</strong> Truy cập website và tìm kiếm sản phẩm.<br/><strong>Bước 2:</strong> Chọn sản phẩm, kích cỡ và màu sắc ưng ý.<br/><strong>Bước 3:</strong> Thêm vào giỏ hàng.<br/><strong>Bước 4:</strong> Kiểm tra giỏ hàng và chọn "Thanh toán".<br/><strong>Bước 5:</strong> Điền thông tin giao hàng chi tiết.<br/><strong>Bước 6:</strong> Chọn phương thức thanh toán phù hợp.<br/><strong>Bước 7:</strong> Xác nhận đơn hàng. Li-Ning sẽ gửi email và tin nhắn xác nhận đơn hàng thành công.</p>'
  }
};
`;
fs.writeFileSync(path.join(dataDir, 'policies.ts'), policiesContent);

console.log('All files generated successfully.');
