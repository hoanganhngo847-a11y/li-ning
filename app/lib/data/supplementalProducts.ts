import type { Product } from '../types';

type ProductSeed = {
  titleRoot: string;
  collection: string;
  parentCollections: string[];
  sport: string;
  gender: Product['gender'];
  imageKey: keyof typeof imagePools;
  basePrice: number;
  skuPrefix: string;
  colors: string[];
  sizes: string[];
  sale?: 'giam-30' | 'giam-40' | 'giam-50';
};

const imagePools = {
  shoe: [
    'https://cdn.hstatic.net/products/1000312752/ln_q3s300059_2652413500794ac78b7a1740487e709b.jpg',
    'https://cdn.hstatic.net/products/1000312752/dsc01910_b6a942ae52984ff09dcc6ed5877c7672_ab5593bd494a4e4fb9fc78c35f018ff9.jpg',
    'https://cdn.hstatic.net/products/1000312752/arbw007-8-mxk-white-1_0c3d7a172ea447a5a2286d914bb5d6cc_medium.jpg',
  ],
  footballShoe: [
    'https://cdn.hstatic.net/products/1000312752/ln_q3s300059_2652413500794ac78b7a1740487e709b.jpg',
    'https://cdn.hstatic.net/products/1000312752/-16__2b1ad1ddc9fe4ed2bbc2193ad72fc7cc_ad083a1c1e8648ae9687111c96ca38ae_cb7bee02081d420cb6078e502c3ac582.jpg',
    'https://cdn.hstatic.net/products/1000312752/dsc01858_402914ea58a24fbe9e59e81e9ac6ac07_bb35d53f40f844d7a3bb84d1ef258bfc.jpg',
  ],
  apparel: [
    'https://cdn.hstatic.net/products/1000312752/p-aplr125-10v__1__af68eb06330c47a0963f4b53b993ba3f_fa1c3956deed46ddacc847fa5edb2fad.jpg',
    'https://cdn.hstatic.net/products/1000312752/_den_538897b224a94df7a6b75b5582f31474_c547941276204780828cdbdccf27de1c_d5e65ff3833c430db58fab7e1aa83bec.png',
    'https://cdn.hstatic.net/products/1000312752/5c87_76b8b8eaf47746498ec2a44ed0570a15.jpg',
  ],
  pants: [
    'https://cdn.hstatic.net/products/1000312752/p-acpw001-161v__1__54a9a53044f24b42abddb37389bc3bb5.jpg',
    'https://cdn.hstatic.net/products/1000312752/p-acpw001-161v__2__e4a30179b2674a3492bcdea32f524bf1.jpg',
    'https://file.hstatic.net/1000312752/file/qa_nu_099e7bf720d94cbab33c139ed01c5c7c.png',
  ],
  set: [
    'https://cdn.hstatic.net/products/1000312752/p-aplr125-10v__1__af68eb06330c47a0963f4b53b993ba3f_fa1c3956deed46ddacc847fa5edb2fad.jpg',
    'https://cdn.hstatic.net/products/1000312752/5c87_76b8b8eaf47746498ec2a44ed0570a15.jpg',
    'https://file.hstatic.net/1000312752/file/qa_nu_099e7bf720d94cbab33c139ed01c5c7c.png',
  ],
  accessory: [
    'https://cdn.hstatic.net/products/1000312752/p-acpw001-161v__1__54a9a53044f24b42abddb37389bc3bb5.jpg',
    'https://product.hstatic.net/1000312752/product/agau005-12v9__3__b6cc3a16cd6b4c578d79922d5bdaba13.jpg',
    'https://cdn.hstatic.net/products/1000312752/dsc01884_d1fb604f1764425e8090b62c6d6501ac_65b8dbda43234791abdec8799fcc156b.jpg',
  ],
  kids: [
    'https://file.hstatic.net/1000312752/file/qa_nu_099e7bf720d94cbab33c139ed01c5c7c.png',
    'https://cdn.hstatic.net/products/1000312752/5c87_76b8b8eaf47746498ec2a44ed0570a15.jpg',
    'https://product.hstatic.net/1000312752/product/agau005-12v9__3__b6cc3a16cd6b4c578d79922d5bdaba13.jpg',
  ],
} as const;

const modelNames = [
  'Aeroflow Pro',
  'Ultra Light',
  'Training Max',
  'Speed Edge',
  'Comfort Plus',
  'Premium Lite',
  'Elite Motion',
];

const seeds: ProductSeed[] = [
  seed('Giày thời trang Nam', 'giay-thoi-trang-nam', ['giay-nam-2', 'nam-1', 'thoi-trang'], 'thoi-trang', 'nam', 'shoe', 1190000, 'AGLM', ['Đen', 'Trắng', 'Xám'], ['40', '41', '42', '43']),
  seed('Giày chạy bộ Nam', 'giay-chay-bo-nam', ['giay-nam-2', 'nam-1', 'chay-bo-1', 'the-thao'], 'chay-bo-1', 'nam', 'shoe', 1490000, 'ARHM', ['Đen', 'Xanh Navy', 'Trắng'], ['40', '41', '42', '43']),
  seed('Giày cầu lông Nam', 'giay-cau-long-nam', ['giay-nam-2', 'nam-1', 'cau-long-2', 'the-thao'], 'cau-long-2', 'nam', 'shoe', 1390000, 'AYTM', ['Trắng', 'Đỏ', 'Xanh'], ['40', '41', '42', '43']),
  seed('Giày bóng rổ Nam', 'giay-bong-ro-nam', ['giay-nam-2', 'nam-1', 'bong-ro-2', 'the-thao'], 'bong-ro-2', 'nam', 'shoe', 1890000, 'ABBM', ['Đen', 'Trắng', 'Cam'], ['40', '41', '42', '43']),
  seed('Giày bóng đá Nam', 'giay-bong-da-nam', ['giay-nam-2', 'nam-1', 'bong-da', 'the-thao'], 'bong-da', 'nam', 'footballShoe', 1290000, 'ASTM', ['Đen', 'Trắng', 'Xanh'], ['40', '41', '42', '43']),
  seed('Giày bóng bàn Nam', 'giay-bong-ban-nam', ['giay-nam-2', 'nam-1', 'the-thao'], 'the-thao', 'nam', 'shoe', 1250000, 'ATTN', ['Đỏ', 'Trắng', 'Xám'], ['40', '41', '42', '43']),
  seed('Dép Nam', 'dep-nam', ['giay-nam-2', 'nam-1', 'thoi-trang'], 'thoi-trang', 'nam', 'accessory', 490000, 'AGAM', ['Đen', 'Trắng', 'Xám'], ['40', '41', '42', '43']),
  seed('Áo T-Shirt Nam', 'ao-t-shirt-nam', ['ao-nam-1', 'nam-1', 'thoi-trang'], 'thoi-trang', 'nam', 'apparel', 390000, 'ATSM', ['Đen', 'Trắng', 'Xanh'], ['S', 'M', 'L', 'XL']),
  seed('Áo Polo Nam', 'ao-polo-nam', ['ao-nam-1', 'nam-1', 'thoi-trang'], 'thoi-trang', 'nam', 'apparel', 590000, 'APLM', ['Đen', 'Trắng', 'Đỏ'], ['S', 'M', 'L', 'XL']),
  seed('Áo Gió Nam', 'ao-gio-nam', ['ao-nam-1', 'nam-1', 'luyen-tap-1', 'thoi-trang'], 'luyen-tap-1', 'nam', 'apparel', 890000, 'AFDM', ['Đen', 'Xám', 'Xanh'], ['S', 'M', 'L', 'XL']),
  seed('Áo Dài Tay Nam', 'ao-dai-tay-nam', ['ao-nam-1', 'nam-1', 'chay-bo-1', 'thoi-trang'], 'chay-bo-1', 'nam', 'apparel', 690000, 'AFHM', ['Đen', 'Trắng', 'Xám'], ['S', 'M', 'L', 'XL']),
  seed('Áo Lông Vũ Nam', 'ao-long-vu-nam', ['ao-nam-1', 'nam-1', 'thoi-trang'], 'thoi-trang', 'nam', 'apparel', 1790000, 'AYMM', ['Đen', 'Xám', 'Navy'], ['S', 'M', 'L', 'XL']),
  seed('Quần Short Nam', 'quan-short-nam', ['quan-nam-2', 'nam-1', 'thoi-trang'], 'thoi-trang', 'nam', 'pants', 450000, 'AKSM', ['Đen', 'Xám', 'Navy'], ['S', 'M', 'L', 'XL']),
  seed('Quần Gió Nam', 'quan-gio-nam', ['quan-nam-2', 'nam-1', 'luyen-tap-1', 'thoi-trang'], 'luyen-tap-1', 'nam', 'pants', 790000, 'AKLM', ['Đen', 'Xám', 'Navy'], ['S', 'M', 'L', 'XL']),
  seed('Quần Nỉ Nam', 'quan-ni-nam', ['quan-nam-2', 'nam-1', 'thoi-trang'], 'thoi-trang', 'nam', 'pants', 740000, 'AKNM', ['Đen', 'Xám', 'Navy'], ['S', 'M', 'L', 'XL']),
  seed('Bộ quần áo pickleball Nam', 'bo-quan-ao-pickleball-nam', ['bo-quan-ao-nam', 'nam-1', 'pickleball', 'the-thao'], 'pickleball', 'nam', 'set', 990000, 'BPKM', ['Trắng', 'Đen', 'Xanh'], ['S', 'M', 'L', 'XL']),
  seed('Bộ Quần Áo Cầu Lông Nam', 'bo-quan-ao-cau-long-nam', ['bo-quan-ao-nam', 'nam-1', 'cau-long-2', 'the-thao'], 'cau-long-2', 'nam', 'set', 990000, 'BCLM', ['Trắng', 'Đen', 'Đỏ'], ['S', 'M', 'L', 'XL']),
  seed('Bộ quần áo bóng đá Nam', 'bo-quan-ao-bong-da-nam', ['bo-quan-ao-nam', 'nam-1', 'bong-da', 'the-thao'], 'bong-da', 'nam', 'set', 890000, 'BBDM', ['Đỏ', 'Trắng', 'Xanh'], ['S', 'M', 'L', 'XL']),
  seed('Bộ Quần Áo Bóng Rổ Nam', 'bo-quan-ao-bong-ro-nam', ['bo-quan-ao-nam', 'nam-1', 'bong-ro-2', 'the-thao'], 'bong-ro-2', 'nam', 'set', 1090000, 'BBRM', ['Đen', 'Trắng', 'Cam'], ['S', 'M', 'L', 'XL']),
  seed('Mũ Nam', 'mu-nam', ['phu-kien-nam', 'nam-1', 'thoi-trang'], 'thoi-trang', 'nam', 'accessory', 290000, 'AHAM', ['Đen', 'Trắng', 'Xám'], ['F']),
  seed('Tất Nam', 'tat-nam', ['phu-kien-nam', 'nam-1', 'thoi-trang'], 'thoi-trang', 'nam', 'accessory', 120000, 'ATTM', ['Đen', 'Trắng', 'Xám'], ['F']),
  seed('Balo Nam', 'balo-tui-xach-nam', ['phu-kien-nam', 'nam-1', 'phu-kien-the-thao-nam', 'the-thao'], 'the-thao', 'nam', 'accessory', 590000, 'ABLM', ['Đen', 'Xám', 'Navy'], ['F']),
  seed('Bình nước Nam', 'binh-nuoc-nam', ['phu-kien-nam', 'nam-1', 'phu-kien-the-thao-nam', 'the-thao'], 'the-thao', 'nam', 'accessory', 190000, 'ABNM', ['Đen', 'Trắng', 'Đỏ'], ['F']),
  seed('Giày thời trang Nữ', 'giay-thoi-trang-nu', ['giay-nu-2', 'nu-21', 'thoi-trang'], 'thoi-trang', 'nu', 'shoe', 1190000, 'AGLW', ['Trắng', 'Hồng', 'Kem'], ['36', '37', '38', '39']),
  seed('Giày chạy bộ Nữ', 'giay-chay-bo-nu', ['giay-nu-2', 'nu-21', 'chay-bo-1', 'the-thao'], 'chay-bo-1', 'nu', 'shoe', 1490000, 'ARHW', ['Trắng', 'Hồng', 'Xanh'], ['36', '37', '38', '39']),
  seed('Giày cầu lông Nữ', 'giay-cau-long-nu', ['giay-nu-2', 'nu-21', 'cau-long-2', 'the-thao'], 'cau-long-2', 'nu', 'shoe', 1390000, 'AYTW', ['Trắng', 'Hồng', 'Tím'], ['36', '37', '38', '39']),
  seed('Giày bóng rổ Nữ', 'giay-bong-ro-nu', ['giay-nu-2', 'nu-21', 'bong-ro-2', 'the-thao'], 'bong-ro-2', 'nu', 'shoe', 1790000, 'ABBW', ['Trắng', 'Hồng', 'Tím'], ['36', '37', '38', '39']),
  seed('Dép Nữ', 'dep-nu', ['giay-nu-2', 'nu-21', 'thoi-trang'], 'thoi-trang', 'nu', 'accessory', 450000, 'AGAW', ['Trắng', 'Hồng', 'Đen'], ['36', '37', '38', '39']),
  seed('Áo T-Shirt Nữ', 'ao-t-shirt-nu', ['ao-nu-2', 'nu-21', 'thoi-trang'], 'thoi-trang', 'nu', 'apparel', 390000, 'ATSW', ['Trắng', 'Hồng', 'Tím'], ['S', 'M', 'L', 'XL']),
  seed('Áo Polo Nữ', 'ao-polo-nu', ['ao-nu-2', 'nu-21', 'thoi-trang'], 'thoi-trang', 'nu', 'apparel', 590000, 'APLW', ['Trắng', 'Hồng', 'Đen'], ['S', 'M', 'L', 'XL']),
  seed('Áo Bra Nữ', 'ao-bra', ['ao-nu-2', 'nu-21', 'luyen-tap-1', 'thoi-trang'], 'luyen-tap-1', 'nu', 'apparel', 520000, 'ABRW', ['Đen', 'Hồng', 'Tím'], ['S', 'M', 'L']),
  seed('Áo Gió Nữ', 'ao-gio-nu', ['ao-nu-2', 'nu-21', 'luyen-tap-1', 'thoi-trang'], 'luyen-tap-1', 'nu', 'apparel', 890000, 'AFDW', ['Trắng', 'Hồng', 'Xám'], ['S', 'M', 'L', 'XL']),
  seed('Áo Dài Tay Nữ', 'ao-dai-tay-nu', ['ao-nu-2', 'nu-21', 'chay-bo-1', 'thoi-trang'], 'chay-bo-1', 'nu', 'apparel', 590000, 'AFHW', ['Trắng', 'Hồng', 'Tím'], ['S', 'M', 'L', 'XL']),
  seed('Áo Lông Vũ Nữ', 'ao-long-vu-nu', ['ao-nu-2', 'nu-21', 'thoi-trang'], 'thoi-trang', 'nu', 'apparel', 1790000, 'AYMW', ['Trắng', 'Hồng', 'Đen'], ['S', 'M', 'L', 'XL']),
  seed('Quần Short Nữ', 'quan-short-nu', ['quan-nu-2', 'nu-21', 'thoi-trang'], 'thoi-trang', 'nu', 'pants', 420000, 'AKSW', ['Đen', 'Trắng', 'Hồng'], ['S', 'M', 'L', 'XL']),
  seed('Quần Gió Nữ', 'quan-gio-nu', ['quan-nu-2', 'nu-21', 'luyen-tap-1', 'thoi-trang'], 'luyen-tap-1', 'nu', 'pants', 760000, 'AKLW', ['Đen', 'Xám', 'Hồng'], ['S', 'M', 'L', 'XL']),
  seed('Quần Nỉ Nữ', 'quan-ni-nu', ['quan-nu-2', 'nu-21', 'thoi-trang'], 'thoi-trang', 'nu', 'pants', 740000, 'AKNW', ['Đen', 'Xám', 'Hồng'], ['S', 'M', 'L', 'XL']),
  seed('Váy Nữ', 'vay-chan-vay', ['nu-21', 'thoi-trang'], 'thoi-trang', 'nu', 'apparel', 540000, 'ASKW', ['Trắng', 'Đen', 'Hồng'], ['S', 'M', 'L', 'XL']),
  seed('Bộ quần áo pickleball Nữ', 'bo-quan-ao-pickleball-nu', ['bo-quan-ao-nu', 'nu-21', 'pickleball', 'the-thao'], 'pickleball', 'nu', 'set', 990000, 'BPKW', ['Trắng', 'Hồng', 'Xanh'], ['S', 'M', 'L', 'XL']),
  seed('Bộ Quần Áo Cầu Lông Nữ', 'bo-quan-ao-cau-long-nu', ['bo-quan-ao-nu', 'nu-21', 'cau-long-2', 'the-thao'], 'cau-long-2', 'nu', 'set', 990000, 'BCLW', ['Trắng', 'Hồng', 'Tím'], ['S', 'M', 'L', 'XL']),
  seed('Mũ Nữ', 'mu-nu', ['phu-kien-nu', 'nu-21', 'thoi-trang'], 'thoi-trang', 'nu', 'accessory', 290000, 'AHAW', ['Trắng', 'Hồng', 'Đen'], ['F']),
  seed('Tất Nữ', 'tat-nu', ['phu-kien-nu', 'nu-21', 'thoi-trang'], 'thoi-trang', 'nu', 'accessory', 120000, 'ATTW', ['Trắng', 'Hồng', 'Đen'], ['F']),
  seed('Balo Nữ', 'balo-tui-xach-nu', ['phu-kien-nu', 'nu-21', 'phu-kien-the-thao-nu', 'the-thao'], 'the-thao', 'nu', 'accessory', 590000, 'ABLW', ['Trắng', 'Hồng', 'Đen'], ['F']),
  seed('Bé trai', 'be-trai-7-14-tuoi', ['kids-1', 'thoi-trang'], 'thoi-trang', 'kids', 'kids', 390000, 'AKDB', ['Đen', 'Xanh', 'Trắng'], ['120', '130', '140', '150']),
  seed('Bé gái', 'be-gai-7-14-tuoi', ['kids-1', 'thoi-trang'], 'thoi-trang', 'kids', 'kids', 390000, 'AKDG', ['Hồng', 'Trắng', 'Tím'], ['120', '130', '140', '150']),
  seed('Giày golf Nam', 'golf-1', ['the-thao', 'nam-1'], 'golf-1', 'nam', 'shoe', 2190000, 'AGFM', ['Trắng', 'Đen', 'Xanh'], ['40', '41', '42', '43']),
  seed('Sản phẩm giảm 40%', 'giam-40', ['khuyen-mai-sale', 'thoi-trang'], 'thoi-trang', 'unisex', 'apparel', 790000, 'SALE40', ['Đen', 'Trắng', 'Đỏ'], ['S', 'M', 'L', 'XL'], 'giam-40'),
  seed('Sản phẩm giảm 50%', 'giam-50', ['khuyen-mai-sale', 'the-thao'], 'the-thao', 'unisex', 'shoe', 1290000, 'SALE50', ['Đen', 'Trắng', 'Xanh'], ['39', '40', '41', '42'], 'giam-50'),
];

export const supplementalProducts: Product[] = seeds.flatMap((item, seedIndex) =>
  modelNames.map((modelName, productIndex) => {
    const numericId = 1000 + seedIndex * modelNames.length + productIndex + 1;
    const color = item.colors[productIndex % item.colors.length];
    const price = item.basePrice + productIndex * 60000;
    const compareAtPrice = getCompareAtPrice(price, item.sale, productIndex);
    const saleCollections = compareAtPrice ? getSaleCollections(price, compareAtPrice) : [];
    const title = `${item.titleRoot} ${modelName} ${color}`;

    return {
      id: String(numericId),
      handle: `${slugify(title)}-${numericId}`,
      title,
      price,
      compareAtPrice,
      images: [
        itemImage(item.imageKey, productIndex),
        itemImage(item.imageKey, productIndex + 1),
      ],
      variants: item.sizes.map((size, sizeIndex) => ({
        id: `${numericId}-${sizeIndex + 1}`,
        title: `${size} / ${color}`,
        size,
        color,
        available: sizeIndex !== item.sizes.length - 1 || productIndex % 4 !== 0,
        price,
        compareAtPrice,
      })),
      collections: unique([item.collection, ...item.parentCollections, ...saleCollections]),
      sport: item.sport,
      gender: item.gender,
      description: `<p>${title} chính hãng Li-Ning, thiết kế thể thao, chất liệu bền đẹp và phù hợp sử dụng hằng ngày.</p>`,
      sku: `${item.skuPrefix}${String(productIndex + 1).padStart(3, '0')}`,
      available: productIndex % 5 !== 0,
    };
  })
);

function seed(
  titleRoot: string,
  collection: string,
  parentCollections: string[],
  sport: string,
  gender: Product['gender'],
  imageKey: keyof typeof imagePools,
  basePrice: number,
  skuPrefix: string,
  colors: string[],
  sizes: string[],
  sale?: ProductSeed['sale']
): ProductSeed {
  return { titleRoot, collection, parentCollections, sport, gender, imageKey, basePrice, skuPrefix, colors, sizes, sale };
}

function getCompareAtPrice(price: number, sale: ProductSeed['sale'], index: number): number | null {
  if (sale === 'giam-40') return Math.round(price / 0.6);
  if (sale === 'giam-50') return price * 2;
  if (sale === 'giam-30' || index % 4 === 0) return Math.round(price / 0.7);
  return null;
}

function getSaleCollections(price: number, compareAtPrice: number): string[] {
  const discount = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  if (discount >= 45) return ['khuyen-mai-sale', 'giam-50'];
  if (discount >= 35) return ['khuyen-mai-sale', 'giam-40'];
  if (discount >= 25) return ['khuyen-mai-sale', 'giam-30'];
  return ['khuyen-mai-sale'];
}

function itemImage(imageKey: keyof typeof imagePools, index: number): string {
  const images = imagePools[imageKey];
  return images[index % images.length];
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
