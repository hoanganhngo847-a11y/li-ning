import type { Product } from '../types';
import { pickleballProducts } from './pickleballProducts';
import { badmintonProducts } from './badmintonProducts';
import { runningProducts } from './runningProducts';
import { trainingProducts } from './trainingProducts';
import { basketballProducts } from './basketballProducts';
import { footballProducts } from './footballProducts';
import { golfProducts } from './golfProducts';
import { sportlifeProducts } from './sportlifeProducts';
import { sportwearProducts } from './sportwearProducts';

const baseProducts: Product[] = [
  {
    id: '1',
    handle: 'ao-polo-nam-p-aplr125-10v',
    title: 'Áo Polo Nam P-APLR125-10V',
    price: 579273,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/p-aplr125-10v__1__af68eb06330c47a0963f4b53b993ba3f_fa1c3956deed46ddacc847fa5edb2fad.jpg', 'https://cdn.hstatic.net/products/1000312752/p-aplr125-10v__2__699e6ed7de44480284dc0d68f371c788_0d37cb41267e49a695dc63b8b4556b09.jpg'],
    variants: [
      { id: '1-1', title: 'S / Đen', size: 'S', color: 'Đen', available: true, price: 579273, compareAtPrice: null },
      { id: '1-2', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 579273, compareAtPrice: null },
      { id: '1-3', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 579273, compareAtPrice: null }
    ],
    collections: ["ao-nam-1", "ao-polo-nam", "nam-1", "thoi-trang"],
    sport: 'thoi-trang',
    gender: 'nam',
    description: '<p>Áo Polo Nam P-APLR125-10V chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'P-APLR125-10V',
    available: true
  },
  {
    id: '2',
    handle: 'ao-polo-nam-p-aplr125-9v-den',
    title: 'Áo Polo Nam P-APLR125-9V (đen)',
    price: 579273,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/_den_538897b224a94df7a6b75b5582f31474_c547941276204780828cdbdccf27de1c_d5e65ff3833c430db58fab7e1aa83bec.png', 'https://cdn.hstatic.net/products/1000312752/0903_714844a8d0af49e396775acae2358e6c_bb7e54eaa90945ceb051c7b0537eba55_8905927fa31e4d04b581bb9f207ada33.jpg'],
    variants: [
      { id: '2-1', title: 'S / Đen', size: 'S', color: 'Đen', available: true, price: 579273, compareAtPrice: null },
      { id: '2-2', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 579273, compareAtPrice: null },
      { id: '2-3', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 579273, compareAtPrice: null }
    ],
    collections: ["ao-nam-1", "ao-polo-nam", "nam-1", "thoi-trang"],
    sport: 'thoi-trang',
    gender: 'nam',
    description: '<p>Áo Polo Nam P-APLR125-9V (đen) chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'P-APLR125-9V',
    available: true
  },
  {
    id: '3',
    handle: 'giay-cau-long-nam-aytt001-1',
    title: 'Giày cầu lông Nam AYTT001-1',
    price: 824727,
    compareAtPrice: 1178182,
    images: ['https://cdn.hstatic.net/products/1000312752/ln_q3s300059_2652413500794ac78b7a1740487e709b.jpg', 'https://cdn.hstatic.net/products/1000312752/ln_q3s300068_e163b927f58747ada506ed3bf7a8639e.jpg'],
    variants: [
      { id: '3-1', title: 'S / Đen', size: 'S', color: 'Đen', available: true, price: 824727, compareAtPrice: 1178182 },
      { id: '3-2', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 824727, compareAtPrice: 1178182 },
      { id: '3-3', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 824727, compareAtPrice: 1178182 }
    ],
    collections: ["giay-nam-2", "giay-cau-long-nam", "nam-1", "cau-long-2", "khuyen-mai-sale", "the-thao"],
    sport: 'cau-long-2',
    gender: 'nam',
    description: '<p>Giày cầu lông Nam AYTT001-1 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'AYTT001-1',
    available: true
  },
  {
    id: '4',
    handle: 'giay-cau-long-nam-aytt001-3',
    title: 'Giày cầu lông Nam AYTT001-3',
    price: 824727,
    compareAtPrice: 1178182,
    images: ['https://cdn.hstatic.net/products/1000312752/-16__2b1ad1ddc9fe4ed2bbc2193ad72fc7cc_ad083a1c1e8648ae9687111c96ca38ae_cb7bee02081d420cb6078e502c3ac582.jpg', 'https://cdn.hstatic.net/products/1000312752/-16__c90e58cde1324759a32127c4026ade98_2e121e685b9544a89e839e4808a40afe_4a4e3f7f68ee4114ab3c5bb5a7d16b78.jpg'],
    variants: [
      { id: '4-1', title: 'S / Đen', size: 'S', color: 'Đen', available: true, price: 824727, compareAtPrice: 1178182 },
      { id: '4-2', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 824727, compareAtPrice: 1178182 },
      { id: '4-3', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 824727, compareAtPrice: 1178182 }
    ],
    collections: ["giay-nam-2", "giay-cau-long-nam", "nam-1", "cau-long-2", "khuyen-mai-sale", "the-thao"],
    sport: 'cau-long-2',
    gender: 'nam',
    description: '<p>Giày cầu lông Nam AYTT001-3 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'AYTT001-3',
    available: true
  },
  {
    id: '5',
    handle: 'giay-cau-long-nam-p-aytv015-3',
    title: 'Giày cầu lông Nam P-AYTV015-3',
    price: 613637,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/dsc01858_402914ea58a24fbe9e59e81e9ac6ac07_bb35d53f40f844d7a3bb84d1ef258bfc.jpg', 'https://cdn.hstatic.net/products/1000312752/dsc01860_79ef905026de4583830136cbf40bed28_33dc63076c7240e19b30591c663f559c.jpg'],
    variants: [
      { id: '5-1', title: 'S / Đen', size: 'S', color: 'Đen', available: true, price: 613637, compareAtPrice: null },
      { id: '5-2', title: 'M / Đen', size: 'M', color: 'Đen', available: false, price: 613637, compareAtPrice: null },
      { id: '5-3', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 613637, compareAtPrice: null }
    ],
    collections: ["giay-nam-2", "giay-cau-long-nam", "nam-1", "cau-long-2", "the-thao"],
    sport: 'cau-long-2',
    gender: 'nam',
    description: '<p>Giày cầu lông Nam P-AYTV015-3 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'P-AYTV015-3',
    available: false
  },
  {
    id: '6',
    handle: 'giay-cau-long-feiying-nam-aytu001-1',
    title: 'Giày cầu lông Feiying Nam AYTU001-1',
    price: 1178182,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/dsc01910_b6a942ae52984ff09dcc6ed5877c7672_ab5593bd494a4e4fb9fc78c35f018ff9.jpg', 'https://cdn.hstatic.net/products/1000312752/dsc01912_006e816eb14c4ad4bbd166b421d77dc1_a2e05eb7db3640ebafc2f734d099e3c2.jpg'],
    variants: [
      { id: '6-1', title: 'S / Đen', size: 'S', color: 'Đen', available: true, price: 1178182, compareAtPrice: null },
      { id: '6-2', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 1178182, compareAtPrice: null },
      { id: '6-3', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 1178182, compareAtPrice: null }
    ],
    collections: ["giay-nam-2", "giay-cau-long-nam", "nam-1", "cau-long-2", "the-thao"],
    sport: 'cau-long-2',
    gender: 'nam',
    description: '<p>Giày cầu lông Feiying Nam AYTU001-1 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'AYTU001-1',
    available: true
  },
  {
    id: '7',
    handle: 'vot-pickleball-hypercontrol-4-white',
    title: 'Vợt Pickleball HyperControl 4 White',
    price: 1104545,
    compareAtPrice: 1472727,
    images: ['https://cdn.hstatic.net/products/1000312752/dsc01884_d1fb604f1764425e8090b62c6d6501ac_65b8dbda43234791abdec8799fcc156b.jpg', 'https://cdn.hstatic.net/products/1000312752/dsc01886_0eac6c3025514529b99973fe690ebf60_ab8776065d394845a6a5469b2f9c4335.jpg'],
    variants: [
      { id: '7-1', title: 'S / Trắng', size: 'S', color: 'Trắng', available: true, price: 1104545, compareAtPrice: 1472727 },
      { id: '7-2', title: 'M / Trắng', size: 'M', color: 'Trắng', available: true, price: 1104545, compareAtPrice: 1472727 },
      { id: '7-3', title: 'L / Trắng', size: 'L', color: 'Trắng', available: true, price: 1104545, compareAtPrice: 1472727 }
    ],
    collections: ["pickleball", "phu-kien-the-thao-nam", "phu-kien-the-thao-nu", "the-thao", "khuyen-mai-sale", "phu-kien-nam", "phu-kien-nu"],
    sport: 'pickleball',
    gender: 'unisex',
    description: '<p>Vợt Pickleball HyperControl 4 White chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'HC4-W',
    available: true
  },
  {
    id: '8',
    handle: 'vot-pickleball-hypercontrol-8c-16mm',
    title: 'Vợt Pickleball Hypercontrol 8C 16mm',
    price: 2852182,
    compareAtPrice: 4074545,
    images: ['https://cdn.hstatic.net/products/1000312752/-16__2ea8fc7954214a2695990ed189b502c0_107368e002fc433ea3313180bed09186_3f5354f2abf441b4a7a3f0b0732155b7.jpg', 'https://cdn.hstatic.net/products/1000312752/-16__d5ca64aebc5840bb889f76e82c7e24b7_fb11d1311e314558995eb522e9576447_b66f899e35424a948dedc6304fb450a5.jpg'],
    variants: [
      { id: '8-1', title: 'S / Trắng', size: 'S', color: 'Trắng', available: true, price: 2852182, compareAtPrice: 4074545 },
      { id: '8-2', title: 'M / Trắng', size: 'M', color: 'Trắng', available: true, price: 2852182, compareAtPrice: 4074545 },
      { id: '8-3', title: 'L / Trắng', size: 'L', color: 'Trắng', available: true, price: 2852182, compareAtPrice: 4074545 }
    ],
    collections: ["pickleball", "phu-kien-the-thao-nam", "phu-kien-the-thao-nu", "the-thao", "khuyen-mai-sale", "phu-kien-nam", "phu-kien-nu"],
    sport: 'pickleball',
    gender: 'unisex',
    description: '<p>Vợt Pickleball Hypercontrol 8C 16mm chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'HC8C-16',
    available: true
  },
  {
    id: '9',
    handle: 'quan-short-nam-p-aapw037-4v',
    title: 'Quần short Nam P-AAPW037-4V',
    price: 461454,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/p-acpw001-161v__1__54a9a53044f24b42abddb37389bc3bb5.jpg', 'https://cdn.hstatic.net/products/1000312752/p-acpw001-161v__2__e4a30179b2674a3492bcdea32f524bf1.jpg'],
    variants: [
      { id: '9-1', title: 'S / Đen', size: 'S', color: 'Đen', available: true, price: 461454, compareAtPrice: null },
      { id: '9-2', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 461454, compareAtPrice: null },
      { id: '9-3', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 461454, compareAtPrice: null }
    ],
    collections: ["quan-nam-2", "quan-short-nam", "nam-1", "thoi-trang"],
    sport: 'thoi-trang',
    gender: 'nam',
    description: '<p>Quần short Nam P-AAPW037-4V chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'P-AAPW037-4V',
    available: true
  },
  {
    id: '10',
    handle: 'ao-t-shirt-nam-p-atsv731-2v',
    title: 'Áo T-Shirt Nam P-ATSV731-2V',
    price: 395000,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/p-acpw011-161v__1__867f25d931274da6aa0a8cf09cfcc10e_9259b55f9cd64a2ab3af66daa418e944.jpg', 'https://cdn.hstatic.net/products/1000312752/p-acpw011-161v__2__56b3da2c2313476c860a79eafc3c0a0a_db24193e27c84f56a92803b409648570.jpg'],
    variants: [
      { id: '10-1', title: 'S / Đen', size: 'S', color: 'Đen', available: true, price: 395000, compareAtPrice: null },
      { id: '10-2', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 395000, compareAtPrice: null },
      { id: '10-3', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 395000, compareAtPrice: null }
    ],
    collections: ["ao-nam-1", "ao-t-shirt-nam", "nam-1", "thoi-trang"],
    sport: 'thoi-trang',
    gender: 'nam',
    description: '<p>Áo T-Shirt Nam P-ATSV731-2V chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'P-ATSV731-2V',
    available: true
  },
  {
    id: '11',
    handle: 'giy-chy-b-nam-li-ning-11',
    title: 'Giày chạy bộ Nam Li-Ning 11',
    price: 362625,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/dsc01893_e44de5cb48fd4a26a1cef919fae7b31e_0cd31ca591f548539443626cbdf8ea21.jpg', 'https://cdn.hstatic.net/products/1000312752/dsc01894_bee0c0196b8e41f59f23dae48eb4225e_80fcbfc09f89451c9f85bcafe5119ce6.jpg'],
    variants: [
      { id: '11-1', title: 'S / Đen', size: 'S', color: 'Đen', available: true, price: 362625, compareAtPrice: null },
      { id: '11-2', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 362625, compareAtPrice: null },
      { id: '11-3', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 362625, compareAtPrice: null }
    ],
    collections: ["giay-chay-bo-nam", "nam-1", "chay-bo-1", "thoi-trang", "giay-nam-2", "the-thao"],
    sport: 'chay-bo-1',
    gender: 'nam',
    description: '<p>Giày chạy bộ Nam Li-Ning 11 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-11',
    available: true
  },
  {
    id: '12',
    handle: 'giy-bng-r-n-li-ning-12',
    title: 'Giày bóng rổ Nữ Li-Ning 12',
    price: 2783542,
    compareAtPrice: 3591506,
    images: ['https://cdn.hstatic.net/products/1000312752/dsc01875_918e59abcdd04243bb63a7d6244316ba_da7d57bb2e864763bae748c005440bc1.jpg', 'https://cdn.hstatic.net/products/1000312752/dsc01876_b3f138b08672411abbb576e375ee453b_fb58c4e20b254548a7a51cfe53640d46.jpg'],
    variants: [
      { id: '12-1', title: 'S / Trắng', size: 'S', color: 'Trắng', available: true, price: 2783542, compareAtPrice: 3591506 },
      { id: '12-2', title: 'M / Trắng', size: 'M', color: 'Trắng', available: true, price: 2783542, compareAtPrice: 3591506 },
      { id: '12-3', title: 'L / Trắng', size: 'L', color: 'Trắng', available: true, price: 2783542, compareAtPrice: 3591506 }
    ],
    collections: ["giay-bong-ro-nu", "nu-21", "bong-ro-2", "khuyen-mai-sale", "giay-nu-2", "the-thao"],
    sport: 'bong-ro-2',
    gender: 'nu',
    description: '<p>Giày bóng rổ Nữ Li-Ning 12 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-12',
    available: true
  },
  {
    id: '13',
    handle: 'o-gi-nam-li-ning-13',
    title: 'Áo gió Nam Li-Ning 13',
    price: 1468950,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/-16__2bb9fcaaed844a2da33bdc21893d2b97_9f933b4fffe341f2b3cec5f80be48a3c_47967be07127415a97df5c6d0b21391c.jpg', 'https://cdn.hstatic.net/products/1000312752/16___709395c2a08349f7b13428fc8e1e88bb_b6172db8d7444f90a7bcd9f7f5766bf6_d8e6e3eb55ef4dda944526b1b5032fca.jpg'],
    variants: [
      { id: '13-1', title: 'S / Đen', size: 'S', color: 'Đen', available: true, price: 1468950, compareAtPrice: null },
      { id: '13-2', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 1468950, compareAtPrice: null },
      { id: '13-3', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 1468950, compareAtPrice: null }
    ],
    collections: ["ao-gio-nam", "nam-1", "thoi-trang", "ao-nam-1"],
    sport: 'thoi-trang',
    gender: 'nam',
    description: '<p>Áo gió Nam Li-Ning 13 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-13',
    available: true
  },
  {
    id: '14',
    handle: 'o-n-n-li-ning-14',
    title: 'Áo nỉ Nữ Li-Ning 14',
    price: 2640052,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/2efb_6646451cb2824e3699d741dd31dc9f86_07e55fc63f3644bfbfa971b0a84d6c79_71aee0aa7b42437ea64d8fcab903b4a0.jpg', 'https://cdn.hstatic.net/products/1000312752/e3bc_341a8bc8381748e6a9dd76757a246aec_aec683c1021048b2acea4373b95ed186_3a679ba1da72409388e65a471409c539.jpg'],
    variants: [
      { id: '14-1', title: 'S / Trắng', size: 'S', color: 'Trắng', available: true, price: 2640052, compareAtPrice: null },
      { id: '14-2', title: 'M / Trắng', size: 'M', color: 'Trắng', available: true, price: 2640052, compareAtPrice: null },
      { id: '14-3', title: 'L / Trắng', size: 'L', color: 'Trắng', available: true, price: 2640052, compareAtPrice: null }
    ],
    collections: ["ao-ni-nu", "nu-21", "thoi-trang", "ao-nu-2"],
    sport: 'thoi-trang',
    gender: 'nu',
    description: '<p>Áo nỉ Nữ Li-Ning 14 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-14',
    available: true
  },
  {
    id: '15',
    handle: 'balo-th-thao-nam-li-ning-15',
    title: 'Balo thể thao Nam Li-Ning 15',
    price: 1795468,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/8dc3_3506fc6c8d1d46b1ae64757df29be0d2_fb65ffe9cd5e4514b1f150ae18d06c76_c2e2831f77d749b69bc060834c08c3af.jpg', 'https://cdn.hstatic.net/products/1000312752/faeb_7a579f3952af454bb4490d427b15c6aa_f7fb1cf119094a6da7a166d7403fbe9a_596734fdfbb24c8aa86e960d1f91cd1f.jpg'],
    variants: [
      { id: '15-1', title: 'S / Đen', size: 'S', color: 'Đen', available: true, price: 1795468, compareAtPrice: null },
      { id: '15-2', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 1795468, compareAtPrice: null },
      { id: '15-3', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 1795468, compareAtPrice: null }
    ],
    collections: ["balo-tui-xach-nam", "nam-1", "the-thao", "thoi-trang", "phu-kien-nam"],
    sport: 'the-thao',
    gender: 'nam',
    description: '<p>Balo thể thao Nam Li-Ning 15 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-15',
    available: true
  },
  {
    id: '16',
    handle: 'vt-cu-lng-n-li-ning-16',
    title: 'Vợt cầu lông Nữ Li-Ning 16',
    price: 1094465,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/2_176f7e88ce58462fb361bd9ef72c1958_d4aac91c71154d5495d52e72eef5a89b_bd3a4383550e44fdbd2f716790928f90.png', 'https://cdn.hstatic.net/products/1000312752/1l-1_102783a144a54bb9946fb8f363ea86d6_a26dd790ebbf40e8b419425330e7cad6_73137a4870d54080945173136965aa6d.jpg'],
    variants: [
      { id: '16-1', title: 'S / Trắng', size: 'S', color: 'Trắng', available: true, price: 1094465, compareAtPrice: null },
      { id: '16-2', title: 'M / Trắng', size: 'M', color: 'Trắng', available: true, price: 1094465, compareAtPrice: null },
      { id: '16-3', title: 'L / Trắng', size: 'L', color: 'Trắng', available: true, price: 1094465, compareAtPrice: null }
    ],
    collections: ["phu-kien-the-thao-nu", "nu-21", "cau-long-2", "thoi-trang", "phu-kien-nu"],
    sport: 'cau-long-2',
    gender: 'nu',
    description: '<p>Vợt cầu lông Nữ Li-Ning 16 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-16',
    available: true
  },
  {
    id: '17',
    handle: 'giy-chy-b-nam-li-ning-17',
    title: 'Giày chạy bộ Nam Li-Ning 17',
    price: 2126718,
    compareAtPrice: 2650872,
    images: ['https://cdn.hstatic.net/products/1000312752/0792_37abceed586d4c718d21df155d0df4e8_f82c2209786d4deb9b08435698d709a9_9d23522a475a4de5a2cb59642c1911be.jpg', 'https://cdn.hstatic.net/products/1000312752/0798_070920f0b7f8485686de37bae1e600ee_684c4cc71ab84f1cbd9b87dbee75c3dc_d3b4a3cb1c374ec2b2f9f3047776bde4.jpg'],
    variants: [
      { id: '17-1', title: 'S / Đen', size: 'S', color: 'Đen', available: true, price: 2126718, compareAtPrice: 2650872 },
      { id: '17-2', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 2126718, compareAtPrice: 2650872 },
      { id: '17-3', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 2126718, compareAtPrice: 2650872 }
    ],
    collections: ["giay-chay-bo-nam", "nam-1", "chay-bo-1", "khuyen-mai-sale", "giay-nam-2", "the-thao"],
    sport: 'chay-bo-1',
    gender: 'nam',
    description: '<p>Giày chạy bộ Nam Li-Ning 17 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-17',
    available: true
  },
  {
    id: '18',
    handle: 'giy-bng-r-n-li-ning-18',
    title: 'Giày bóng rổ Nữ Li-Ning 18',
    price: 3746425,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/dsc00803_12f0af9ff033484ebb81b38068bf5c10_3cd5cd4bf2234ab58c61779edc7314a1.jpg', 'https://cdn.hstatic.net/products/1000312752/dsc00808_94efaed4c4924d8aa96c14fbdc44cfd4_704d29d03cf3406696d2945fb8259ab8.jpg'],
    variants: [
      { id: '18-1', title: 'S / Trắng', size: 'S', color: 'Trắng', available: true, price: 3746425, compareAtPrice: null },
      { id: '18-2', title: 'M / Trắng', size: 'M', color: 'Trắng', available: true, price: 3746425, compareAtPrice: null },
      { id: '18-3', title: 'L / Trắng', size: 'L', color: 'Trắng', available: true, price: 3746425, compareAtPrice: null }
    ],
    collections: ["giay-bong-ro-nu", "nu-21", "bong-ro-2", "thoi-trang", "giay-nu-2", "the-thao"],
    sport: 'bong-ro-2',
    gender: 'nu',
    description: '<p>Giày bóng rổ Nữ Li-Ning 18 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-18',
    available: true
  },
  {
    id: '19',
    handle: 'o-gi-nam-li-ning-19',
    title: 'Áo gió Nam Li-Ning 19',
    price: 3152234,
    compareAtPrice: 3950113,
    images: ['https://cdn.hstatic.net/products/1000312752/dsc00847_b020ef3331aa45d486681c5ac41c072c_4b48baa6d71c46bcabee8b83d4d25a92.jpg', 'https://cdn.hstatic.net/products/1000312752/dsc00853_4b033312d966465cae32403ea6556930_8feb16ca12844c74a9ca8db12e3a813d.jpg'],
    variants: [
      { id: '19-1', title: 'S / Đen', size: 'S', color: 'Đen', available: true, price: 3152234, compareAtPrice: 3950113 },
      { id: '19-2', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 3152234, compareAtPrice: 3950113 },
      { id: '19-3', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 3152234, compareAtPrice: 3950113 }
    ],
    collections: ["ao-gio-nam", "nam-1", "thoi-trang", "khuyen-mai-sale", "ao-nam-1"],
    sport: 'thoi-trang',
    gender: 'nam',
    description: '<p>Áo gió Nam Li-Ning 19 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-19',
    available: true
  },
  {
    id: '20',
    handle: 'o-n-n-li-ning-20',
    title: 'Áo nỉ Nữ Li-Ning 20',
    price: 3734417,
    compareAtPrice: 4743188,
    images: ['https://cdn.hstatic.net/products/1000312752/dsc00814_701e89c73c564554bb35714b6609df40_c53e39d4175f4c2e91b94a4739491737.jpg', 'https://cdn.hstatic.net/products/1000312752/dsc00819_9b6f4c69fcd948b0aad86b2b8da50b91_78e28655dcf746cfa09afb51ffc50224.jpg'],
    variants: [
      { id: '20-1', title: 'S / Trắng', size: 'S', color: 'Trắng', available: true, price: 3734417, compareAtPrice: 4743188 },
      { id: '20-2', title: 'M / Trắng', size: 'M', color: 'Trắng', available: true, price: 3734417, compareAtPrice: 4743188 },
      { id: '20-3', title: 'L / Trắng', size: 'L', color: 'Trắng', available: true, price: 3734417, compareAtPrice: 4743188 }
    ],
    collections: ["ao-ni-nu", "nu-21", "thoi-trang", "khuyen-mai-sale", "ao-nu-2"],
    sport: 'thoi-trang',
    gender: 'nu',
    description: '<p>Áo nỉ Nữ Li-Ning 20 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-20',
    available: true
  },
  {
    id: '21',
    handle: 'balo-th-thao-nam-li-ning-21',
    title: 'Balo thể thao Nam Li-Ning 21',
    price: 1568762,
    compareAtPrice: 1676427,
    images: ['https://cdn.hstatic.net/products/1000312752/4c70_24abfab2d7684a1caf9c34e32e89636b_c3006620ae09469090cf2a8c7242bdb6_05bd5c4b044641608008c8cd18c371be.jpeg', 'https://cdn.hstatic.net/products/1000312752/4c70_143ff7183ce54ec59da88ef4a597a706_4e26e7e2e87540349d5d5941d36d4d1f_6b2735754df6421f8e1e71807a6f8ac8.jpeg'],
    variants: [
      { id: '21-1', title: 'S / Đen', size: 'S', color: 'Đen', available: true, price: 1568762, compareAtPrice: 1676427 },
      { id: '21-2', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 1568762, compareAtPrice: 1676427 },
      { id: '21-3', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 1568762, compareAtPrice: 1676427 }
    ],
    collections: ["balo-tui-xach-nam", "nam-1", "the-thao", "khuyen-mai-sale", "phu-kien-nam"],
    sport: 'the-thao',
    gender: 'nam',
    description: '<p>Balo thể thao Nam Li-Ning 21 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-21',
    available: true
  },
  {
    id: '22',
    handle: 'vt-cu-lng-n-li-ning-22',
    title: 'Vợt cầu lông Nữ Li-Ning 22',
    price: 2612284,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/6c24_976dbeeba20a4b31a38fa0f0113b28b8_1204a8d192574c9fa11a16ffe87822ad_22fdcb1f754b481da95ca652a74a221d.jpg', 'https://cdn.hstatic.net/products/1000312752/d7f3_ba96afbf4aa2497285eba3f2259052c2_1f86e473d5ec4d17a3537d9329fa722a_f2817f90c0474fea9ef6204b68f28426.jpg'],
    variants: [
      { id: '22-1', title: 'S / Trắng', size: 'S', color: 'Trắng', available: true, price: 2612284, compareAtPrice: null },
      { id: '22-2', title: 'M / Trắng', size: 'M', color: 'Trắng', available: true, price: 2612284, compareAtPrice: null },
      { id: '22-3', title: 'L / Trắng', size: 'L', color: 'Trắng', available: true, price: 2612284, compareAtPrice: null }
    ],
    collections: ["phu-kien-the-thao-nu", "nu-21", "cau-long-2", "thoi-trang", "phu-kien-nu"],
    sport: 'cau-long-2',
    gender: 'nu',
    description: '<p>Vợt cầu lông Nữ Li-Ning 22 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-22',
    available: true
  },
  {
    id: '23',
    handle: 'giy-chy-b-nam-li-ning-23',
    title: 'Giày chạy bộ Nam Li-Ning 23',
    price: 2674946,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/5334_e83f723b417f42afac80e2c35b265a81_ab67eec4eecf485fb085cdb0ef60e528_cbd90cf5a4bd47f1bc465fc6538c1e65.jpg', 'https://cdn.hstatic.net/products/1000312752/5343_ad19ab49172c4e28a6b5ee4155643671_f43d7a1326dc4918956c2fa383257419_a9cfc81807ba4f8cad52f03edb7c4700.jpg'],
    variants: [
      { id: '23-1', title: 'S / Đen', size: 'S', color: 'Đen', available: true, price: 2674946, compareAtPrice: null },
      { id: '23-2', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 2674946, compareAtPrice: null },
      { id: '23-3', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 2674946, compareAtPrice: null }
    ],
    collections: ["giay-chay-bo-nam", "nam-1", "chay-bo-1", "thoi-trang", "giay-nam-2", "the-thao"],
    sport: 'chay-bo-1',
    gender: 'nam',
    description: '<p>Giày chạy bộ Nam Li-Ning 23 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-23',
    available: true
  },
  {
    id: '24',
    handle: 'giy-bng-r-n-li-ning-24',
    title: 'Giày bóng rổ Nữ Li-Ning 24',
    price: 3870007,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/p-aplr125-10v__1__af68eb06330c47a0963f4b53b993ba3f_fa1c3956deed46ddacc847fa5edb2fad.jpg', 'https://cdn.hstatic.net/products/1000312752/p-aplr125-10v__2__699e6ed7de44480284dc0d68f371c788_0d37cb41267e49a695dc63b8b4556b09.jpg'],
    variants: [
      { id: '24-1', title: 'S / Trắng', size: 'S', color: 'Trắng', available: true, price: 3870007, compareAtPrice: null },
      { id: '24-2', title: 'M / Trắng', size: 'M', color: 'Trắng', available: true, price: 3870007, compareAtPrice: null },
      { id: '24-3', title: 'L / Trắng', size: 'L', color: 'Trắng', available: true, price: 3870007, compareAtPrice: null }
    ],
    collections: ["giay-bong-ro-nu", "nu-21", "bong-ro-2", "thoi-trang", "giay-nu-2", "the-thao"],
    sport: 'bong-ro-2',
    gender: 'nu',
    description: '<p>Giày bóng rổ Nữ Li-Ning 24 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-24',
    available: true
  },
  {
    id: '25',
    handle: 'o-gi-nam-li-ning-25',
    title: 'Áo gió Nam Li-Ning 25',
    price: 2619597,
    compareAtPrice: 3711987,
    images: ['https://cdn.hstatic.net/products/1000312752/_den_538897b224a94df7a6b75b5582f31474_c547941276204780828cdbdccf27de1c_d5e65ff3833c430db58fab7e1aa83bec.png', 'https://cdn.hstatic.net/products/1000312752/0903_714844a8d0af49e396775acae2358e6c_bb7e54eaa90945ceb051c7b0537eba55_8905927fa31e4d04b581bb9f207ada33.jpg'],
    variants: [
      { id: '25-1', title: 'S / Đen', size: 'S', color: 'Đen', available: true, price: 2619597, compareAtPrice: 3711987 },
      { id: '25-2', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 2619597, compareAtPrice: 3711987 },
      { id: '25-3', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 2619597, compareAtPrice: 3711987 }
    ],
    collections: ["ao-gio-nam", "nam-1", "thoi-trang", "khuyen-mai-sale", "ao-nam-1"],
    sport: 'thoi-trang',
    gender: 'nam',
    description: '<p>Áo gió Nam Li-Ning 25 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-25',
    available: true
  },
  {
    id: '26',
    handle: 'o-n-n-li-ning-26',
    title: 'Áo nỉ Nữ Li-Ning 26',
    price: 3743219,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/ln_q3s300059_2652413500794ac78b7a1740487e709b.jpg', 'https://cdn.hstatic.net/products/1000312752/ln_q3s300068_e163b927f58747ada506ed3bf7a8639e.jpg'],
    variants: [
      { id: '26-1', title: 'S / Trắng', size: 'S', color: 'Trắng', available: true, price: 3743219, compareAtPrice: null },
      { id: '26-2', title: 'M / Trắng', size: 'M', color: 'Trắng', available: true, price: 3743219, compareAtPrice: null },
      { id: '26-3', title: 'L / Trắng', size: 'L', color: 'Trắng', available: true, price: 3743219, compareAtPrice: null }
    ],
    collections: ["ao-ni-nu", "nu-21", "thoi-trang", "ao-nu-2"],
    sport: 'thoi-trang',
    gender: 'nu',
    description: '<p>Áo nỉ Nữ Li-Ning 26 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-26',
    available: true
  },
  {
    id: '27',
    handle: 'balo-th-thao-nam-li-ning-27',
    title: 'Balo thể thao Nam Li-Ning 27',
    price: 1997963,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/-16__2b1ad1ddc9fe4ed2bbc2193ad72fc7cc_ad083a1c1e8648ae9687111c96ca38ae_cb7bee02081d420cb6078e502c3ac582.jpg', 'https://cdn.hstatic.net/products/1000312752/-16__c90e58cde1324759a32127c4026ade98_2e121e685b9544a89e839e4808a40afe_4a4e3f7f68ee4114ab3c5bb5a7d16b78.jpg'],
    variants: [
      { id: '27-1', title: 'S / Đen', size: 'S', color: 'Đen', available: true, price: 1997963, compareAtPrice: null },
      { id: '27-2', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 1997963, compareAtPrice: null },
      { id: '27-3', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 1997963, compareAtPrice: null }
    ],
    collections: ["balo-tui-xach-nam", "nam-1", "the-thao", "thoi-trang", "phu-kien-nam"],
    sport: 'the-thao',
    gender: 'nam',
    description: '<p>Balo thể thao Nam Li-Ning 27 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-27',
    available: true
  },
  {
    id: '28',
    handle: 'vt-cu-lng-n-li-ning-28',
    title: 'Vợt cầu lông Nữ Li-Ning 28',
    price: 3771468,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/dsc01858_402914ea58a24fbe9e59e81e9ac6ac07_bb35d53f40f844d7a3bb84d1ef258bfc.jpg', 'https://cdn.hstatic.net/products/1000312752/dsc01860_79ef905026de4583830136cbf40bed28_33dc63076c7240e19b30591c663f559c.jpg'],
    variants: [
      { id: '28-1', title: 'S / Trắng', size: 'S', color: 'Trắng', available: true, price: 3771468, compareAtPrice: null },
      { id: '28-2', title: 'M / Trắng', size: 'M', color: 'Trắng', available: true, price: 3771468, compareAtPrice: null },
      { id: '28-3', title: 'L / Trắng', size: 'L', color: 'Trắng', available: true, price: 3771468, compareAtPrice: null }
    ],
    collections: ["phu-kien-the-thao-nu", "nu-21", "cau-long-2", "thoi-trang", "phu-kien-nu"],
    sport: 'cau-long-2',
    gender: 'nu',
    description: '<p>Vợt cầu lông Nữ Li-Ning 28 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-28',
    available: true
  },
  {
    id: '29',
    handle: 'giy-chy-b-nam-li-ning-29',
    title: 'Giày chạy bộ Nam Li-Ning 29',
    price: 3348005,
    compareAtPrice: 3572636,
    images: ['https://cdn.hstatic.net/products/1000312752/dsc01910_b6a942ae52984ff09dcc6ed5877c7672_ab5593bd494a4e4fb9fc78c35f018ff9.jpg', 'https://cdn.hstatic.net/products/1000312752/dsc01912_006e816eb14c4ad4bbd166b421d77dc1_a2e05eb7db3640ebafc2f734d099e3c2.jpg'],
    variants: [
      { id: '29-1', title: 'S / Đen', size: 'S', color: 'Đen', available: true, price: 3348005, compareAtPrice: 3572636 },
      { id: '29-2', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 3348005, compareAtPrice: 3572636 },
      { id: '29-3', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 3348005, compareAtPrice: 3572636 }
    ],
    collections: ["giay-chay-bo-nam", "nam-1", "chay-bo-1", "khuyen-mai-sale", "giay-nam-2", "the-thao"],
    sport: 'chay-bo-1',
    gender: 'nam',
    description: '<p>Giày chạy bộ Nam Li-Ning 29 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-29',
    available: true
  },
  {
    id: '30',
    handle: 'giy-bng-r-n-li-ning-30',
    title: 'Giày bóng rổ Nữ Li-Ning 30',
    price: 2910542,
    compareAtPrice: 3972538,
    images: ['https://cdn.hstatic.net/products/1000312752/dsc01884_d1fb604f1764425e8090b62c6d6501ac_65b8dbda43234791abdec8799fcc156b.jpg', 'https://cdn.hstatic.net/products/1000312752/dsc01886_0eac6c3025514529b99973fe690ebf60_ab8776065d394845a6a5469b2f9c4335.jpg'],
    variants: [
      { id: '30-1', title: 'S / Trắng', size: 'S', color: 'Trắng', available: true, price: 2910542, compareAtPrice: 3972538 },
      { id: '30-2', title: 'M / Trắng', size: 'M', color: 'Trắng', available: true, price: 2910542, compareAtPrice: 3972538 },
      { id: '30-3', title: 'L / Trắng', size: 'L', color: 'Trắng', available: true, price: 2910542, compareAtPrice: 3972538 }
    ],
    collections: ["giay-bong-ro-nu", "nu-21", "bong-ro-2", "khuyen-mai-sale", "giay-nu-2", "the-thao"],
    sport: 'bong-ro-2',
    gender: 'nu',
    description: '<p>Giày bóng rổ Nữ Li-Ning 30 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-30',
    available: true
  },
  {
    id: '31',
    handle: 'o-gi-nam-li-ning-31',
    title: 'Áo gió Nam Li-Ning 31',
    price: 3946127,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/-16__2ea8fc7954214a2695990ed189b502c0_107368e002fc433ea3313180bed09186_3f5354f2abf441b4a7a3f0b0732155b7.jpg', 'https://cdn.hstatic.net/products/1000312752/-16__d5ca64aebc5840bb889f76e82c7e24b7_fb11d1311e314558995eb522e9576447_b66f899e35424a948dedc6304fb450a5.jpg'],
    variants: [
      { id: '31-1', title: 'S / Đen', size: 'S', color: 'Đen', available: true, price: 3946127, compareAtPrice: null },
      { id: '31-2', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 3946127, compareAtPrice: null },
      { id: '31-3', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 3946127, compareAtPrice: null }
    ],
    collections: ["ao-gio-nam", "nam-1", "thoi-trang", "ao-nam-1"],
    sport: 'thoi-trang',
    gender: 'nam',
    description: '<p>Áo gió Nam Li-Ning 31 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-31',
    available: true
  },
  {
    id: '32',
    handle: 'o-n-n-li-ning-32',
    title: 'Áo nỉ Nữ Li-Ning 32',
    price: 3837784,
    compareAtPrice: 4428735,
    images: ['https://cdn.hstatic.net/products/1000312752/p-acpw001-161v__1__54a9a53044f24b42abddb37389bc3bb5.jpg', 'https://cdn.hstatic.net/products/1000312752/p-acpw001-161v__2__e4a30179b2674a3492bcdea32f524bf1.jpg'],
    variants: [
      { id: '32-1', title: 'S / Trắng', size: 'S', color: 'Trắng', available: true, price: 3837784, compareAtPrice: 4428735 },
      { id: '32-2', title: 'M / Trắng', size: 'M', color: 'Trắng', available: true, price: 3837784, compareAtPrice: 4428735 },
      { id: '32-3', title: 'L / Trắng', size: 'L', color: 'Trắng', available: true, price: 3837784, compareAtPrice: 4428735 }
    ],
    collections: ["ao-ni-nu", "nu-21", "thoi-trang", "khuyen-mai-sale", "ao-nu-2"],
    sport: 'thoi-trang',
    gender: 'nu',
    description: '<p>Áo nỉ Nữ Li-Ning 32 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-32',
    available: true
  },
  {
    id: '33',
    handle: 'balo-th-thao-nam-li-ning-33',
    title: 'Balo thể thao Nam Li-Ning 33',
    price: 1124785,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/p-acpw011-161v__1__867f25d931274da6aa0a8cf09cfcc10e_9259b55f9cd64a2ab3af66daa418e944.jpg', 'https://cdn.hstatic.net/products/1000312752/p-acpw011-161v__2__56b3da2c2313476c860a79eafc3c0a0a_db24193e27c84f56a92803b409648570.jpg'],
    variants: [
      { id: '33-1', title: 'S / Đen', size: 'S', color: 'Đen', available: true, price: 1124785, compareAtPrice: null },
      { id: '33-2', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 1124785, compareAtPrice: null },
      { id: '33-3', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 1124785, compareAtPrice: null }
    ],
    collections: ["balo-tui-xach-nam", "nam-1", "the-thao", "thoi-trang", "phu-kien-nam"],
    sport: 'the-thao',
    gender: 'nam',
    description: '<p>Balo thể thao Nam Li-Ning 33 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-33',
    available: true
  },
  {
    id: '34',
    handle: 'vt-cu-lng-n-li-ning-34',
    title: 'Vợt cầu lông Nữ Li-Ning 34',
    price: 2478946,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/dsc01893_e44de5cb48fd4a26a1cef919fae7b31e_0cd31ca591f548539443626cbdf8ea21.jpg', 'https://cdn.hstatic.net/products/1000312752/dsc01894_bee0c0196b8e41f59f23dae48eb4225e_80fcbfc09f89451c9f85bcafe5119ce6.jpg'],
    variants: [
      { id: '34-1', title: 'S / Trắng', size: 'S', color: 'Trắng', available: true, price: 2478946, compareAtPrice: null },
      { id: '34-2', title: 'M / Trắng', size: 'M', color: 'Trắng', available: true, price: 2478946, compareAtPrice: null },
      { id: '34-3', title: 'L / Trắng', size: 'L', color: 'Trắng', available: true, price: 2478946, compareAtPrice: null }
    ],
    collections: ["phu-kien-the-thao-nu", "nu-21", "cau-long-2", "thoi-trang", "phu-kien-nu"],
    sport: 'cau-long-2',
    gender: 'nu',
    description: '<p>Vợt cầu lông Nữ Li-Ning 34 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-34',
    available: true
  },
  {
    id: '35',
    handle: 'giy-chy-b-nam-li-ning-35',
    title: 'Giày chạy bộ Nam Li-Ning 35',
    price: 873897,
    compareAtPrice: 1627319,
    images: ['https://cdn.hstatic.net/products/1000312752/dsc01875_918e59abcdd04243bb63a7d6244316ba_da7d57bb2e864763bae748c005440bc1.jpg', 'https://cdn.hstatic.net/products/1000312752/dsc01876_b3f138b08672411abbb576e375ee453b_fb58c4e20b254548a7a51cfe53640d46.jpg'],
    variants: [
      { id: '35-1', title: 'S / Đen', size: 'S', color: 'Đen', available: true, price: 873897, compareAtPrice: 1627319 },
      { id: '35-2', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 873897, compareAtPrice: 1627319 },
      { id: '35-3', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 873897, compareAtPrice: 1627319 }
    ],
    collections: ["giay-chay-bo-nam", "nam-1", "chay-bo-1", "khuyen-mai-sale", "giay-nam-2", "the-thao"],
    sport: 'chay-bo-1',
    gender: 'nam',
    description: '<p>Giày chạy bộ Nam Li-Ning 35 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-35',
    available: true
  },
  {
    id: '36',
    handle: 'giy-bng-r-n-li-ning-36',
    title: 'Giày bóng rổ Nữ Li-Ning 36',
    price: 3178816,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/-16__2bb9fcaaed844a2da33bdc21893d2b97_9f933b4fffe341f2b3cec5f80be48a3c_47967be07127415a97df5c6d0b21391c.jpg', 'https://cdn.hstatic.net/products/1000312752/16___709395c2a08349f7b13428fc8e1e88bb_b6172db8d7444f90a7bcd9f7f5766bf6_d8e6e3eb55ef4dda944526b1b5032fca.jpg'],
    variants: [
      { id: '36-1', title: 'S / Trắng', size: 'S', color: 'Trắng', available: true, price: 3178816, compareAtPrice: null },
      { id: '36-2', title: 'M / Trắng', size: 'M', color: 'Trắng', available: true, price: 3178816, compareAtPrice: null },
      { id: '36-3', title: 'L / Trắng', size: 'L', color: 'Trắng', available: true, price: 3178816, compareAtPrice: null }
    ],
    collections: ["giay-bong-ro-nu", "nu-21", "bong-ro-2", "thoi-trang", "giay-nu-2", "the-thao"],
    sport: 'bong-ro-2',
    gender: 'nu',
    description: '<p>Giày bóng rổ Nữ Li-Ning 36 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-36',
    available: true
  },
  {
    id: '37',
    handle: 'o-gi-nam-li-ning-37',
    title: 'Áo gió Nam Li-Ning 37',
    price: 3619773,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/2efb_6646451cb2824e3699d741dd31dc9f86_07e55fc63f3644bfbfa971b0a84d6c79_71aee0aa7b42437ea64d8fcab903b4a0.jpg', 'https://cdn.hstatic.net/products/1000312752/e3bc_341a8bc8381748e6a9dd76757a246aec_aec683c1021048b2acea4373b95ed186_3a679ba1da72409388e65a471409c539.jpg'],
    variants: [
      { id: '37-1', title: 'S / Đen', size: 'S', color: 'Đen', available: true, price: 3619773, compareAtPrice: null },
      { id: '37-2', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 3619773, compareAtPrice: null },
      { id: '37-3', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 3619773, compareAtPrice: null }
    ],
    collections: ["ao-gio-nam", "nam-1", "thoi-trang", "ao-nam-1"],
    sport: 'thoi-trang',
    gender: 'nam',
    description: '<p>Áo gió Nam Li-Ning 37 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-37',
    available: true
  },
  {
    id: '38',
    handle: 'o-n-n-li-ning-38',
    title: 'Áo nỉ Nữ Li-Ning 38',
    price: 641231,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/8dc3_3506fc6c8d1d46b1ae64757df29be0d2_fb65ffe9cd5e4514b1f150ae18d06c76_c2e2831f77d749b69bc060834c08c3af.jpg', 'https://cdn.hstatic.net/products/1000312752/faeb_7a579f3952af454bb4490d427b15c6aa_f7fb1cf119094a6da7a166d7403fbe9a_596734fdfbb24c8aa86e960d1f91cd1f.jpg'],
    variants: [
      { id: '38-1', title: 'S / Trắng', size: 'S', color: 'Trắng', available: true, price: 641231, compareAtPrice: null },
      { id: '38-2', title: 'M / Trắng', size: 'M', color: 'Trắng', available: true, price: 641231, compareAtPrice: null },
      { id: '38-3', title: 'L / Trắng', size: 'L', color: 'Trắng', available: true, price: 641231, compareAtPrice: null }
    ],
    collections: ["ao-ni-nu", "nu-21", "thoi-trang", "ao-nu-2"],
    sport: 'thoi-trang',
    gender: 'nu',
    description: '<p>Áo nỉ Nữ Li-Ning 38 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-38',
    available: true
  },
  {
    id: '39',
    handle: 'balo-th-thao-nam-li-ning-39',
    title: 'Balo thể thao Nam Li-Ning 39',
    price: 3525252,
    compareAtPrice: 3697535,
    images: ['https://cdn.hstatic.net/products/1000312752/2_176f7e88ce58462fb361bd9ef72c1958_d4aac91c71154d5495d52e72eef5a89b_bd3a4383550e44fdbd2f716790928f90.png', 'https://cdn.hstatic.net/products/1000312752/1l-1_102783a144a54bb9946fb8f363ea86d6_a26dd790ebbf40e8b419425330e7cad6_73137a4870d54080945173136965aa6d.jpg'],
    variants: [
      { id: '39-1', title: 'S / Đen', size: 'S', color: 'Đen', available: true, price: 3525252, compareAtPrice: 3697535 },
      { id: '39-2', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 3525252, compareAtPrice: 3697535 },
      { id: '39-3', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 3525252, compareAtPrice: 3697535 }
    ],
    collections: ["balo-tui-xach-nam", "nam-1", "the-thao", "khuyen-mai-sale", "phu-kien-nam"],
    sport: 'the-thao',
    gender: 'nam',
    description: '<p>Balo thể thao Nam Li-Ning 39 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-39',
    available: true
  },
  {
    id: '40',
    handle: 'vt-cu-lng-n-li-ning-40',
    title: 'Vợt cầu lông Nữ Li-Ning 40',
    price: 2348389,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/0792_37abceed586d4c718d21df155d0df4e8_f82c2209786d4deb9b08435698d709a9_9d23522a475a4de5a2cb59642c1911be.jpg', 'https://cdn.hstatic.net/products/1000312752/0798_070920f0b7f8485686de37bae1e600ee_684c4cc71ab84f1cbd9b87dbee75c3dc_d3b4a3cb1c374ec2b2f9f3047776bde4.jpg'],
    variants: [
      { id: '40-1', title: 'S / Trắng', size: 'S', color: 'Trắng', available: true, price: 2348389, compareAtPrice: null },
      { id: '40-2', title: 'M / Trắng', size: 'M', color: 'Trắng', available: true, price: 2348389, compareAtPrice: null },
      { id: '40-3', title: 'L / Trắng', size: 'L', color: 'Trắng', available: true, price: 2348389, compareAtPrice: null }
    ],
    collections: ["phu-kien-the-thao-nu", "nu-21", "cau-long-2", "thoi-trang", "phu-kien-nu"],
    sport: 'cau-long-2',
    gender: 'nu',
    description: '<p>Vợt cầu lông Nữ Li-Ning 40 chính hãng từ Li-Ning mang đến trải nghiệm tuyệt vời cho người dùng. Thiết kế tinh tế, chất liệu cao cấp, độ bền cao.</p>',
    sku: 'LN-40',
    available: true
  },
  {
    id: '41',
    handle: 'giay-thoi-trang-nam-cloud-lite',
    title: 'Giày thời trang Nam Cloud Lite P-AGLT041-1V',
    price: 1289000,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/dsc08674_d6a079d990a14a58b59fe1242b6df1e0.jpg', 'https://cdn.hstatic.net/products/1000312752/arbw007-8-mxk-white-1_0c3d7a172ea447a5a2286d914bb5d6cc.jpg'],
    variants: [
      { id: '41-1', title: '40 / Trắng', size: '40', color: 'Trắng', available: true, price: 1289000, compareAtPrice: null },
      { id: '41-2', title: '41 / Trắng', size: '41', color: 'Trắng', available: true, price: 1289000, compareAtPrice: null },
      { id: '41-3', title: '42 / Trắng', size: '42', color: 'Trắng', available: true, price: 1289000, compareAtPrice: null }
    ],
    collections: ['giay-thoi-trang-nam', 'giay-nam-2', 'nam-1', 'thoi-trang'],
    sport: 'thoi-trang',
    gender: 'nam',
    description: '<p>Giày thời trang nam Li-Ning phối màu dễ mang, đệm nhẹ và phù hợp di chuyển hằng ngày.</p>',
    sku: 'P-AGLT041-1V',
    available: true
  },
  {
    id: '42',
    handle: 'giay-bong-ro-nam-sonic-speed',
    title: 'Giày bóng rổ Nam Sonic Speed P-ABAT042-2V',
    price: 2490000,
    compareAtPrice: 3320000,
    images: ['https://cdn.hstatic.net/products/1000312752/27e2ad987cdffe0c643a1918d39081bbdd2fd2b72fe1ac8f2bfeb5b38624078f777ed3_7154051f0eb4415db00b31a07693ec4f.jpg', 'https://cdn.hstatic.net/products/1000312752/dsc01875_918e59abcdd04243bb63a7d6244316ba_da7d57bb2e864763bae748c005440bc1.jpg'],
    variants: [
      { id: '42-1', title: '41 / Đen', size: '41', color: 'Đen', available: true, price: 2490000, compareAtPrice: 3320000 },
      { id: '42-2', title: '42 / Đen', size: '42', color: 'Đen', available: true, price: 2490000, compareAtPrice: 3320000 },
      { id: '42-3', title: '43 / Đen', size: '43', color: 'Đen', available: true, price: 2490000, compareAtPrice: 3320000 }
    ],
    collections: ['giay-bong-ro-nam', 'giay-nam-2', 'nam-1', 'bong-ro-2', 'the-thao', 'khuyen-mai-sale', 'giam-30'],
    sport: 'bong-ro-2',
    gender: 'nam',
    description: '<p>Giày bóng rổ nam với cổ giày chắc chắn, đế bám sân và form hỗ trợ đổi hướng nhanh.</p>',
    sku: 'P-ABAT042-2V',
    available: true
  },
  {
    id: '43',
    handle: 'giay-bong-da-nam-strike-firm-ground',
    title: 'Giày bóng đá Nam Strike Firm Ground P-ASTF043-3V',
    price: 1190000,
    compareAtPrice: null,
    images: ['https://product.hstatic.net/1000312752/product/xx_05167_2a30501094524af9a706471282532ea1.jpg', 'https://cdn.hstatic.net/products/1000312752/4987_3f1444edf15c48b396b1ae078cdb4c31_e85f366742c4415e9db26af67bde50e8_f3c59008ff05498bac734bbd0b6f13cc.jpg'],
    variants: [
      { id: '43-1', title: '40 / Cam', size: '40', color: 'Cam', available: true, price: 1190000, compareAtPrice: null },
      { id: '43-2', title: '41 / Cam', size: '41', color: 'Cam', available: true, price: 1190000, compareAtPrice: null },
      { id: '43-3', title: '42 / Cam', size: '42', color: 'Cam', available: true, price: 1190000, compareAtPrice: null }
    ],
    collections: ['giay-bong-da-nam', 'giay-nam-2', 'nam-1', 'bong-da', 'the-thao'],
    sport: 'bong-da',
    gender: 'nam',
    description: '<p>Giày bóng đá nam Li-Ning cho sân cỏ nhân tạo, thân giày ôm chân và bề mặt kiểm soát bóng tốt.</p>',
    sku: 'P-ASTF043-3V',
    available: true
  },
  {
    id: '44',
    handle: 'giay-bong-ban-unisex-table-pro',
    title: 'Giày bóng bàn Unisex Table Pro P-AYTT044-1C',
    price: 1390000,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/gi_3_vn-11134201-7ra0g-m9b4xgbbdsucf7_5b2f462f0f21444e9df689ee45154253_cee3010aaf834b05965de4e2ba9e90f0.jpg', 'https://cdn.hstatic.net/products/1000312752/5289_67591bcd9bbe4c98b9fd058a4df11ace_af646d358b424293b32c4d6d3433f05b_fcb65d425dfa4ee0a39b946917527c40.jpg'],
    variants: [
      { id: '44-1', title: '39 / Xanh', size: '39', color: 'Xanh', available: true, price: 1390000, compareAtPrice: null },
      { id: '44-2', title: '40 / Xanh', size: '40', color: 'Xanh', available: true, price: 1390000, compareAtPrice: null },
      { id: '44-3', title: '41 / Xanh', size: '41', color: 'Xanh', available: true, price: 1390000, compareAtPrice: null }
    ],
    collections: ['giay-bong-ban-nam', 'giay-nam-2', 'nam-1', 'the-thao'],
    sport: 'the-thao',
    gender: 'unisex',
    description: '<p>Giày bóng bàn unisex có trọng lượng nhẹ, đế ma sát tốt và thân giày linh hoạt.</p>',
    sku: 'P-AYTT044-1C',
    available: true
  },
  {
    id: '45',
    handle: 'dep-nam-recovery-slide',
    title: 'Dép Nam Recovery Slide P-AGAU045-12V',
    price: 490000,
    compareAtPrice: null,
    images: ['https://product.hstatic.net/1000312752/product/agau005-12v9__3__b6cc3a16cd6b4c578d79922d5bdaba13.jpg', 'https://product.hstatic.net/1000312752/product/agau005-12v9__3__b6cc3a16cd6b4c578d79922d5bdaba13_medium.jpg'],
    variants: [
      { id: '45-1', title: '40 / Đen', size: '40', color: 'Đen', available: true, price: 490000, compareAtPrice: null },
      { id: '45-2', title: '41 / Đen', size: '41', color: 'Đen', available: true, price: 490000, compareAtPrice: null },
      { id: '45-3', title: '42 / Đen', size: '42', color: 'Đen', available: true, price: 490000, compareAtPrice: null }
    ],
    collections: ['dep-nam', 'giay-nam-2', 'nam-1', 'thoi-trang'],
    sport: 'thoi-trang',
    gender: 'nam',
    description: '<p>Dép nam đế êm, phù hợp phục hồi sau tập luyện và sử dụng hằng ngày.</p>',
    sku: 'P-AGAU045-12V',
    available: true
  },
  {
    id: '46',
    handle: 'ao-dai-tay-nam-training',
    title: 'Áo dài tay Nam Training P-AFDU046-1V',
    price: 690000,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/p-acpw011-161v__1__867f25d931274da6aa0a8cf09cfcc10e_9259b55f9cd64a2ab3af66daa418e944.jpg', 'https://cdn.hstatic.net/products/1000312752/p-acpw011-161v__2__56b3da2c2313476c860a79eafc3c0a0a_db24193e27c84f56a92803b409648570.jpg'],
    variants: [
      { id: '46-1', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 690000, compareAtPrice: null },
      { id: '46-2', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 690000, compareAtPrice: null },
      { id: '46-3', title: 'XL / Đen', size: 'XL', color: 'Đen', available: true, price: 690000, compareAtPrice: null }
    ],
    collections: ['ao-dai-tay-nam', 'ao-nam-1', 'nam-1', 'luyen-tap-1', 'thoi-trang'],
    sport: 'luyen-tap-1',
    gender: 'nam',
    description: '<p>Áo dài tay nam chất liệu co giãn, thoáng khí cho tập luyện trong nhà và ngoài trời.</p>',
    sku: 'P-AFDU046-1V',
    available: true
  },
  {
    id: '47',
    handle: 'quan-gio-nam-regular-fit',
    title: 'Quần gió Nam Regular Fit P-AKLU047-1V',
    price: 890000,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/p-acpw001-161v__1__54a9a53044f24b42abddb37389bc3bb5.jpg', 'https://cdn.hstatic.net/products/1000312752/p-acpw001-161v__2__e4a30179b2674a3492bcdea32f524bf1.jpg'],
    variants: [
      { id: '47-1', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 890000, compareAtPrice: null },
      { id: '47-2', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 890000, compareAtPrice: null },
      { id: '47-3', title: 'XL / Đen', size: 'XL', color: 'Đen', available: true, price: 890000, compareAtPrice: null }
    ],
    collections: ['quan-gio-nam', 'quan-nam-2', 'nam-1', 'luyen-tap-1', 'thoi-trang'],
    sport: 'luyen-tap-1',
    gender: 'nam',
    description: '<p>Quần gió nam dáng suông, nhẹ, dễ phối cùng áo khoác hoặc áo polo thể thao.</p>',
    sku: 'P-AKLU047-1V',
    available: true
  },
  {
    id: '48',
    handle: 'mu-nam-logo-cap',
    title: 'Mũ Nam Logo Cap P-AMYU048-1V',
    price: 320000,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/2_176f7e88ce58462fb361bd9ef72c1958_d4aac91c71154d5495d52e72eef5a89b_bd3a4383550e44fdbd2f716790928f90.png', 'https://cdn.hstatic.net/products/1000312752/1l-1_102783a144a54bb9946fb8f363ea86d6_a26dd790ebbf40e8b419425330e7cad6_73137a4870d54080945173136965aa6d.jpg'],
    variants: [
      { id: '48-1', title: 'F / Đen', size: 'F', color: 'Đen', available: true, price: 320000, compareAtPrice: null }
    ],
    collections: ['mu-nam', 'phu-kien-nam', 'nam-1', 'the-thao'],
    sport: 'the-thao',
    gender: 'nam',
    description: '<p>Mũ nam Li-Ning form thể thao, che nắng tốt và có logo thêu phía trước.</p>',
    sku: 'P-AMYU048-1V',
    available: true
  },
  {
    id: '49',
    handle: 'tat-the-thao-unisex-coolmax',
    title: 'Tất thể thao Unisex Coolmax P-AWSU049-3C',
    price: 174000,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/0792_37abceed586d4c718d21df155d0df4e8_f82c2209786d4deb9b08435698d709a9_9d23522a475a4de5a2cb59642c1911be.jpg', 'https://cdn.hstatic.net/products/1000312752/0798_070920f0b7f8485686de37bae1e600ee_684c4cc71ab84f1cbd9b87dbee75c3dc_d3b4a3cb1c374ec2b2f9f3047776bde4.jpg'],
    variants: [
      { id: '49-1', title: 'F / Trắng', size: 'F', color: 'Trắng', available: true, price: 174000, compareAtPrice: null }
    ],
    collections: ['tat-nam', 'tat-nu', 'phu-kien-nam', 'phu-kien-nu', 'the-thao'],
    sport: 'the-thao',
    gender: 'unisex',
    description: '<p>Tất thể thao cổ ngắn, chất liệu thấm hút tốt, phù hợp cầu lông, chạy bộ và tập luyện.</p>',
    sku: 'P-AWSU049-3C',
    available: true
  },
  {
    id: '50',
    handle: 'binh-nuoc-the-thao-aqtw121',
    title: 'Bình nước thể thao AQTW121',
    price: 250000,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/themes/1000312752/1001500748/14/payment_4_img.png?v=165', 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/payment_3_img.png?v=165'],
    variants: [
      { id: '50-1', title: '650ml / Xanh', size: '650ml', color: 'Xanh', available: true, price: 250000, compareAtPrice: null }
    ],
    collections: ['binh-nuoc-nam', 'binh-nuoc-nu', 'phu-kien-nam', 'phu-kien-nu', 'the-thao'],
    sport: 'the-thao',
    gender: 'unisex',
    description: '<p>Bình nước thể thao Li-Ning dung tích tiện dụng, nắp kín và dễ vệ sinh sau mỗi buổi tập.</p>',
    sku: 'AQTW121',
    available: true
  },
  {
    id: '51',
    handle: 'ao-the-thao-be-trai-junior',
    title: 'Áo thể thao Bé Trai Junior P-ATKU051-1V',
    price: 430000,
    compareAtPrice: null,
    images: ['https://file.hstatic.net/1000312752/file/ao_kid_512b95ce662247269b1d9da3e4727cf1.png', 'https://file.hstatic.net/1000312752/file/quan_kid_5e3c428790a24cbaa2a3c5b2b835f4ca.png'],
    variants: [
      { id: '51-1', title: '130 / Xanh', size: '130', color: 'Xanh', available: true, price: 430000, compareAtPrice: null },
      { id: '51-2', title: '140 / Xanh', size: '140', color: 'Xanh', available: true, price: 430000, compareAtPrice: null }
    ],
    collections: ['be-trai-7-14-tuoi', 'kids-1', 'ao-nam-1', 'the-thao'],
    sport: 'the-thao',
    gender: 'kids',
    description: '<p>Áo thể thao trẻ em cho bé trai, chất vải mềm nhẹ và dễ vận động.</p>',
    sku: 'P-ATKU051-1V',
    available: true
  },
  {
    id: '52',
    handle: 'vay-be-gai-sport-dress',
    title: 'Váy thể thao Bé Gái Sport Dress P-ASLU052-2V',
    price: 520000,
    compareAtPrice: 740000,
    images: ['https://file.hstatic.net/1000312752/file/vay_be_gai_fda47cc2b5ca41ecbfc0058eaa3d0404.png', 'https://file.hstatic.net/1000312752/file/qa_nu_099e7bf720d94cbab33c139ed01c5c7c.png'],
    variants: [
      { id: '52-1', title: '130 / Hồng', size: '130', color: 'Hồng', available: true, price: 520000, compareAtPrice: 740000 },
      { id: '52-2', title: '140 / Hồng', size: '140', color: 'Hồng', available: true, price: 520000, compareAtPrice: 740000 }
    ],
    collections: ['be-gai-7-14-tuoi', 'kids-1', 'vay-chan-vay', 'khuyen-mai-sale', 'giam-30'],
    sport: 'the-thao',
    gender: 'kids',
    description: '<p>Váy thể thao bé gái dáng năng động, phù hợp mặc đi học, đi chơi và luyện tập nhẹ.</p>',
    sku: 'P-ASLU052-2V',
    available: true
  },
  {
    id: '53',
    handle: 'ao-polo-nu-sportlife',
    title: 'Áo Polo Nữ Sportlife P-APLU053-4V',
    price: 620000,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/5c87_76b8b8eaf47746498ec2a44ed0570a15.jpg', 'https://product.hstatic.net/1000312752/product/aplv659-2v__2__ef3591c9c35141f5968ae10c35bc8d0d.jpg'],
    variants: [
      { id: '53-1', title: 'S / Hồng', size: 'S', color: 'Hồng', available: true, price: 620000, compareAtPrice: null },
      { id: '53-2', title: 'M / Hồng', size: 'M', color: 'Hồng', available: true, price: 620000, compareAtPrice: null }
    ],
    collections: ['ao-polo-nu', 'ao-nu-2', 'nu-21', 'sportlife', 'thoi-trang'],
    sport: 'thoi-trang',
    gender: 'nu',
    description: '<p>Áo polo nữ Sportlife phom gọn, phối màu trẻ trung và dễ mặc hằng ngày.</p>',
    sku: 'P-APLU053-4V',
    available: true
  },
  {
    id: '54',
    handle: 'giay-golf-nam-fairway',
    title: 'Giày golf Nam Fairway P-AGLF054-1V',
    price: 2690000,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/arbw007-8-mxk-white-1_0c3d7a172ea447a5a2286d914bb5d6cc_medium.jpg', 'https://cdn.hstatic.net/products/1000312752/dsc08674_d6a079d990a14a58b59fe1242b6df1e0_medium.jpg'],
    variants: [
      { id: '54-1', title: '40 / Trắng', size: '40', color: 'Trắng', available: true, price: 2690000, compareAtPrice: null },
      { id: '54-2', title: '41 / Trắng', size: '41', color: 'Trắng', available: true, price: 2690000, compareAtPrice: null }
    ],
    collections: ['golf-1', 'giay-nam-2', 'nam-1', 'the-thao'],
    sport: 'golf-1',
    gender: 'nam',
    description: '<p>Giày golf nam đế ổn định, bề mặt chống thấm nhẹ và phong cách lịch sự trên sân.</p>',
    sku: 'P-AGLF054-1V',
    available: true
  },
  {
    id: '55',
    handle: 'set-bo-quan-ao-cau-long-nam',
    title: 'Bộ quần áo cầu lông Nam Team Set P-AATL055-1V',
    price: 980000,
    compareAtPrice: 1400000,
    images: ['https://cdn.hstatic.net/products/1000312752/p-aplr125-10v__1__af68eb06330c47a0963f4b53b993ba3f_fa1c3956deed46ddacc847fa5edb2fad.jpg', 'https://cdn.hstatic.net/products/1000312752/p-acpw001-161v__1__54a9a53044f24b42abddb37389bc3bb5.jpg'],
    variants: [
      { id: '55-1', title: 'M / Trắng', size: 'M', color: 'Trắng', available: true, price: 980000, compareAtPrice: 1400000 },
      { id: '55-2', title: 'L / Trắng', size: 'L', color: 'Trắng', available: true, price: 980000, compareAtPrice: 1400000 }
    ],
    collections: ['bo-quan-ao-cau-long-nam', 'bo-quan-ao-nam', 'nam-1', 'cau-long-2', 'khuyen-mai-sale', 'giam-30'],
    sport: 'cau-long-2',
    gender: 'nam',
    description: '<p>Bộ quần áo cầu lông nam gồm áo thoáng khí và quần short linh hoạt cho thi đấu.</p>',
    sku: 'P-AATL055-1V',
    available: true
  },
  {
    id: '56',
    handle: 'giay-pickleball-unisex-hypercourt',
    title: 'Giày Pickleball Unisex HyperCourt P-AYPU056-1C',
    price: 1590000,
    compareAtPrice: 2120000,
    images: ['https://cdn.hstatic.net/products/1000312752/4989_1abbc82ea7da4ec78d5dd54e298a0cdf_81bc204d07dc45bcbe9dee0a23ec81b7_fc725c724bef4ebda3ea4730b98864e8.jpg', 'https://cdn.hstatic.net/products/1000312752/4987_3f1444edf15c48b396b1ae078cdb4c31_e85f366742c4415e9db26af67bde50e8_f3c59008ff05498bac734bbd0b6f13cc.jpg'],
    variants: [
      { id: '56-1', title: '39 / Trắng', size: '39', color: 'Trắng', available: true, price: 1590000, compareAtPrice: 2120000 },
      { id: '56-2', title: '40 / Trắng', size: '40', color: 'Trắng', available: true, price: 1590000, compareAtPrice: 2120000 },
      { id: '56-3', title: '41 / Trắng', size: '41', color: 'Trắng', available: true, price: 1590000, compareAtPrice: 2120000 }
    ],
    collections: ['giay-pickleball', 'pickleball', 'the-thao', 'khuyen-mai-sale', 'giam-30'],
    sport: 'pickleball',
    gender: 'unisex',
    description: '<p>Giày pickleball unisex với đế bám sân, thân giày ổn định và trọng lượng nhẹ cho di chuyển ngang liên tục.</p>',
    sku: 'P-AYPU056-1C',
    available: true
  },
  {
    id: '57',
    handle: 'phu-kien-pickleball-ball-pack',
    title: 'Phụ kiện Pickleball Ball Pack P-ACPU057-3C',
    price: 190000,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/-16__2ea8fc7954214a2695990ed189b502c0_107368e002fc433ea3313180bed09186_3f5354f2abf441b4a7a3f0b0732155b7.jpg', 'https://cdn.hstatic.net/products/1000312752/dsc01884_d1fb604f1764425e8090b62c6d6501ac_65b8dbda43234791abdec8799fcc156b.jpg'],
    variants: [
      { id: '57-1', title: '3 bóng / Vàng', size: '3 bóng', color: 'Vàng', available: true, price: 190000, compareAtPrice: null }
    ],
    collections: ['phu-kien-pickleball', 'pickleball', 'phu-kien-nam', 'phu-kien-nu', 'the-thao'],
    sport: 'pickleball',
    gender: 'unisex',
    description: '<p>Bộ bóng pickleball dùng cho luyện tập, độ nảy ổn định và màu sắc dễ quan sát.</p>',
    sku: 'P-ACPU057-3C',
    available: true
  },
  {
    id: '58',
    handle: 'giay-cau-long-nu-feiying-lite',
    title: 'Giày cầu lông Nữ Feiying Lite P-AYTU058-4V',
    price: 1178182,
    compareAtPrice: 1683000,
    images: ['https://cdn.hstatic.net/products/1000312752/8dc3_3506fc6c8d1d46b1ae64757df29be0d2_fb65ffe9cd5e4514b1f150ae18d06c76_c2e2831f77d749b69bc060834c08c3af.jpg', 'https://cdn.hstatic.net/products/1000312752/faeb_7a579f3952af454bb4490d427b15c6aa_f7fb1cf119094a6da7a166d7403fbe9a_596734fdfbb24c8aa86e960d1f91cd1f.jpg'],
    variants: [
      { id: '58-1', title: '36 / Trắng', size: '36', color: 'Trắng', available: true, price: 1178182, compareAtPrice: 1683000 },
      { id: '58-2', title: '37 / Trắng', size: '37', color: 'Trắng', available: true, price: 1178182, compareAtPrice: 1683000 },
      { id: '58-3', title: '38 / Trắng', size: '38', color: 'Trắng', available: true, price: 1178182, compareAtPrice: 1683000 }
    ],
    collections: ['giay-cau-long-nu', 'giay-nu-2', 'nu-21', 'cau-long-2', 'the-thao', 'khuyen-mai-sale', 'giam-30'],
    sport: 'cau-long-2',
    gender: 'nu',
    description: '<p>Giày cầu lông nữ Feiying Lite có phần upper mềm, đế cao su chống trượt và hỗ trợ đổi hướng linh hoạt.</p>',
    sku: 'P-AYTU058-4V',
    available: true
  },
  {
    id: '59',
    handle: 'set-bo-quan-ao-pickleball-nu',
    title: 'Bộ quần áo Pickleball Nữ Court Set P-AATL059-2V',
    price: 1040000,
    compareAtPrice: null,
    images: ['https://file.hstatic.net/1000312752/file/qa_nu_099e7bf720d94cbab33c139ed01c5c7c.png', 'https://file.hstatic.net/1000312752/file/vay_be_gai_fda47cc2b5ca41ecbfc0058eaa3d0404.png'],
    variants: [
      { id: '59-1', title: 'S / Hồng', size: 'S', color: 'Hồng', available: true, price: 1040000, compareAtPrice: null },
      { id: '59-2', title: 'M / Hồng', size: 'M', color: 'Hồng', available: true, price: 1040000, compareAtPrice: null }
    ],
    collections: ['bo-quan-ao-pickleball-nu', 'bo-quan-ao-nu', 'bo-quan-ao-he', 'nu-21', 'pickleball', 'thoi-trang'],
    sport: 'pickleball',
    gender: 'nu',
    description: '<p>Bộ quần áo pickleball nữ gồm áo và chân váy thể thao, nhẹ, thoáng và phù hợp vận động ngoài trời.</p>',
    sku: 'P-AATL059-2V',
    available: true
  },
  {
    id: '60',
    handle: 'ao-long-vu-nam-warm-pro',
    title: 'Áo lông vũ Nam Warm Pro P-AYMU060-1V',
    price: 1890000,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/-16__2bb9fcaaed844a2da33bdc21893d2b97_9f933b4fffe341f2b3cec5f80be48a3c_47967be07127415a97df5c6d0b21391c.jpg', 'https://cdn.hstatic.net/products/1000312752/16___709395c2a08349f7b13428fc8e1e88bb_b6172db8d7444f90a7bcd9f7f5766bf6_d8e6e3eb55ef4dda944526b1b5032fca.jpg'],
    variants: [{ id: '60-1', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 1890000, compareAtPrice: null }],
    collections: ['ao-long-vu-nam', 'ao-nam-1', 'nam-1', 'thoi-trang'],
    sport: 'thoi-trang',
    gender: 'nam',
    description: '<p>Áo lông vũ nam giữ ấm nhẹ, dễ gấp gọn và phù hợp di chuyển mùa lạnh.</p>',
    sku: 'P-AYMU060-1V',
    available: true
  },
  {
    id: '61',
    handle: 'quan-ni-nam-classic-jogger',
    title: 'Quần nỉ Nam Classic Jogger P-AKLU061-1V',
    price: 790000,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/p-acpw001-161v__1__54a9a53044f24b42abddb37389bc3bb5.jpg', 'https://cdn.hstatic.net/products/1000312752/p-acpw001-161v__2__e4a30179b2674a3492bcdea32f524bf1.jpg'],
    variants: [{ id: '61-1', title: 'L / Đen', size: 'L', color: 'Đen', available: true, price: 790000, compareAtPrice: null }],
    collections: ['quan-ni-nam', 'quan-nam-2', 'nam-1', 'thoi-trang'],
    sport: 'thoi-trang',
    gender: 'nam',
    description: '<p>Quần nỉ nam dáng jogger, chất vải mềm và giữ phom tốt.</p>',
    sku: 'P-AKLU061-1V',
    available: true
  },
  {
    id: '62',
    handle: 'giay-thoi-trang-nu-cloud-dance',
    title: 'Giày thời trang Nữ Cloud Dance P-AGLT062-2V',
    price: 1290000,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/dsc08674_d6a079d990a14a58b59fe1242b6df1e0.jpg', 'https://cdn.hstatic.net/products/1000312752/arbw007-8-mxk-white-1_0c3d7a172ea447a5a2286d914bb5d6cc.jpg'],
    variants: [{ id: '62-1', title: '37 / Trắng', size: '37', color: 'Trắng', available: true, price: 1290000, compareAtPrice: null }],
    collections: ['giay-thoi-trang-nu', 'giay-nu-2', 'nu-21', 'thoi-trang'],
    sport: 'thoi-trang',
    gender: 'nu',
    description: '<p>Giày thời trang nữ phối màu sáng, nhẹ và dễ kết hợp trang phục Sportlife.</p>',
    sku: 'P-AGLT062-2V',
    available: true
  },
  {
    id: '63',
    handle: 'giay-chay-bo-nu-feather-run',
    title: 'Giày chạy bộ Nữ Feather Run P-ARHT063-1V',
    price: 1490000,
    compareAtPrice: 1990000,
    images: ['https://cdn.hstatic.net/products/1000312752/arbw007-8-mxk-white-1_0c3d7a172ea447a5a2286d914bb5d6cc_medium.jpg', 'https://cdn.hstatic.net/products/1000312752/dsc01893_e44de5cb48fd4a26a1cef919fae7b31e_0cd31ca591f548539443626cbdf8ea21.jpg'],
    variants: [{ id: '63-1', title: '37 / Trắng', size: '37', color: 'Trắng', available: true, price: 1490000, compareAtPrice: 1990000 }],
    collections: ['giay-chay-bo-nu', 'giay-nu-2', 'nu-21', 'chay-bo-1', 'the-thao', 'khuyen-mai-sale', 'giam-30'],
    sport: 'chay-bo-1',
    gender: 'nu',
    description: '<p>Giày chạy bộ nữ đệm nhẹ, thân thoáng khí và phù hợp chạy bộ hằng ngày.</p>',
    sku: 'P-ARHT063-1V',
    available: true
  },
  {
    id: '64',
    handle: 'dep-nu-soft-slide',
    title: 'Dép Nữ Soft Slide P-AGAU064-2V',
    price: 450000,
    compareAtPrice: null,
    images: ['https://product.hstatic.net/1000312752/product/agau005-12v9__3__b6cc3a16cd6b4c578d79922d5bdaba13.jpg', 'https://product.hstatic.net/1000312752/product/agau005-12v9__3__b6cc3a16cd6b4c578d79922d5bdaba13_medium.jpg'],
    variants: [{ id: '64-1', title: '37 / Trắng', size: '37', color: 'Trắng', available: true, price: 450000, compareAtPrice: null }],
    collections: ['dep-nu', 'giay-nu-2', 'nu-21', 'thoi-trang'],
    sport: 'thoi-trang',
    gender: 'nu',
    description: '<p>Dép nữ đế mềm, nhẹ và tiện dùng sau tập luyện.</p>',
    sku: 'P-AGAU064-2V',
    available: true
  },
  {
    id: '65',
    handle: 'ao-t-shirt-nu-active',
    title: 'Áo T-Shirt Nữ Active P-ATSU065-3V',
    price: 390000,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/5c87_76b8b8eaf47746498ec2a44ed0570a15.jpg', 'https://product.hstatic.net/1000312752/product/aplv659-2v__2__ef3591c9c35141f5968ae10c35bc8d0d.jpg'],
    variants: [{ id: '65-1', title: 'M / Hồng', size: 'M', color: 'Hồng', available: true, price: 390000, compareAtPrice: null }],
    collections: ['ao-t-shirt-nu', 'ao-nu-2', 'nu-21', 'thoi-trang'],
    sport: 'thoi-trang',
    gender: 'nu',
    description: '<p>Áo T-Shirt nữ chất liệu mềm, thoáng và dễ phối cùng quần short hoặc chân váy.</p>',
    sku: 'P-ATSU065-3V',
    available: true
  },
  {
    id: '66',
    handle: 'ao-bra-nu-training-fit',
    title: 'Áo Bra Nữ Training Fit P-ABRU066-1V',
    price: 520000,
    compareAtPrice: null,
    images: ['https://file.hstatic.net/1000312752/file/qa_nu_099e7bf720d94cbab33c139ed01c5c7c.png', 'https://cdn.hstatic.net/products/1000312752/5c87_76b8b8eaf47746498ec2a44ed0570a15.jpg'],
    variants: [{ id: '66-1', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 520000, compareAtPrice: null }],
    collections: ['ao-bra', 'ao-nu-2', 'nu-21', 'luyen-tap-1', 'thoi-trang'],
    sport: 'luyen-tap-1',
    gender: 'nu',
    description: '<p>Áo bra nữ hỗ trợ vừa vặn cho tập luyện cường độ trung bình.</p>',
    sku: 'P-ABRU066-1V',
    available: true
  },
  {
    id: '67',
    handle: 'ao-gio-nu-light-jacket',
    title: 'Áo gió Nữ Light Jacket P-AFDU067-2V',
    price: 890000,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/-16__2bb9fcaaed844a2da33bdc21893d2b97_9f933b4fffe341f2b3cec5f80be48a3c_47967be07127415a97df5c6d0b21391c.jpg', 'https://cdn.hstatic.net/products/1000312752/16___709395c2a08349f7b13428fc8e1e88bb_b6172db8d7444f90a7bcd9f7f5766bf6_d8e6e3eb55ef4dda944526b1b5032fca.jpg'],
    variants: [{ id: '67-1', title: 'M / Trắng', size: 'M', color: 'Trắng', available: true, price: 890000, compareAtPrice: null }],
    collections: ['ao-gio-nu', 'ao-nu-2', 'nu-21', 'luyen-tap-1', 'thoi-trang'],
    sport: 'luyen-tap-1',
    gender: 'nu',
    description: '<p>Áo gió nữ nhẹ, chống gió nhẹ và có form thể thao gọn gàng.</p>',
    sku: 'P-AFDU067-2V',
    available: true
  },
  {
    id: '68',
    handle: 'ao-dai-tay-nu-running',
    title: 'Áo dài tay Nữ Running P-AFDU068-4V',
    price: 590000,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/5c87_76b8b8eaf47746498ec2a44ed0570a15.jpg', 'https://file.hstatic.net/1000312752/file/qa_nu_099e7bf720d94cbab33c139ed01c5c7c.png'],
    variants: [{ id: '68-1', title: 'M / Tím', size: 'M', color: 'Tím', available: true, price: 590000, compareAtPrice: null }],
    collections: ['ao-dai-tay-nu', 'ao-nu-2', 'nu-21', 'chay-bo-1', 'thoi-trang'],
    sport: 'chay-bo-1',
    gender: 'nu',
    description: '<p>Áo dài tay nữ cho chạy bộ, chất vải co giãn và thấm hút tốt.</p>',
    sku: 'P-AFDU068-4V',
    available: true
  },
  {
    id: '69',
    handle: 'ao-long-vu-nu-warm-lite',
    title: 'Áo lông vũ Nữ Warm Lite P-AYMU069-3V',
    price: 1790000,
    compareAtPrice: null,
    images: ['https://file.hstatic.net/1000312752/file/qa_nu_099e7bf720d94cbab33c139ed01c5c7c.png', 'https://cdn.hstatic.net/products/1000312752/-16__2bb9fcaaed844a2da33bdc21893d2b97_9f933b4fffe341f2b3cec5f80be48a3c_47967be07127415a97df5c6d0b21391c.jpg'],
    variants: [{ id: '69-1', title: 'M / Hồng', size: 'M', color: 'Hồng', available: true, price: 1790000, compareAtPrice: null }],
    collections: ['ao-long-vu-nu', 'ao-nu-2', 'nu-21', 'thoi-trang'],
    sport: 'thoi-trang',
    gender: 'nu',
    description: '<p>Áo lông vũ nữ giữ ấm nhẹ, bề mặt mềm và phù hợp thời tiết se lạnh.</p>',
    sku: 'P-AYMU069-3V',
    available: true
  },
  {
    id: '70',
    handle: 'quan-short-nu-court',
    title: 'Quần short Nữ Court P-AKSU070-1V',
    price: 420000,
    compareAtPrice: null,
    images: ['https://file.hstatic.net/1000312752/file/qa_nu_099e7bf720d94cbab33c139ed01c5c7c.png', 'https://cdn.hstatic.net/products/1000312752/p-acpw001-161v__1__54a9a53044f24b42abddb37389bc3bb5.jpg'],
    variants: [{ id: '70-1', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 420000, compareAtPrice: null }],
    collections: ['quan-short-nu', 'quan-nu-2', 'nu-21', 'thoi-trang'],
    sport: 'thoi-trang',
    gender: 'nu',
    description: '<p>Quần short nữ dáng thể thao, nhẹ và dễ phối khi tập luyện.</p>',
    sku: 'P-AKSU070-1V',
    available: true
  },
  {
    id: '71',
    handle: 'quan-gio-nu-light-pants',
    title: 'Quần gió Nữ Light Pants P-AKLU071-2V',
    price: 760000,
    compareAtPrice: null,
    images: ['https://cdn.hstatic.net/products/1000312752/p-acpw001-161v__1__54a9a53044f24b42abddb37389bc3bb5.jpg', 'https://cdn.hstatic.net/products/1000312752/p-acpw001-161v__2__e4a30179b2674a3492bcdea32f524bf1.jpg'],
    variants: [{ id: '71-1', title: 'M / Đen', size: 'M', color: 'Đen', available: true, price: 760000, compareAtPrice: null }],
    collections: ['quan-gio-nu', 'quan-nu-2', 'nu-21', 'luyen-tap-1', 'thoi-trang'],
    sport: 'luyen-tap-1',
    gender: 'nu',
    description: '<p>Quần gió nữ dáng suông, nhẹ và thoải mái khi di chuyển.</p>',
    sku: 'P-AKLU071-2V',
    available: true
  },
  {
    id: '72',
    handle: 'quan-ni-nu-relax-jogger',
    title: 'Quần nỉ Nữ Relax Jogger P-AKLU072-4V',
    price: 740000,
    compareAtPrice: null,
    images: ['https://file.hstatic.net/1000312752/file/qa_nu_099e7bf720d94cbab33c139ed01c5c7c.png', 'https://cdn.hstatic.net/products/1000312752/p-acpw001-161v__2__e4a30179b2674a3492bcdea32f524bf1.jpg'],
    variants: [{ id: '72-1', title: 'M / Xám', size: 'M', color: 'Xám', available: true, price: 740000, compareAtPrice: null }],
    collections: ['quan-ni-nu', 'quan-nu-2', 'nu-21', 'thoi-trang'],
    sport: 'thoi-trang',
    gender: 'nu',
    description: '<p>Quần nỉ nữ dáng jogger, chất vải mềm và dễ mặc hằng ngày.</p>',
    sku: 'P-AKLU072-4V',
    available: true
  },
];

// Filter baseProducts to ensure no duplicate badminton or pickleball products and no placeholder images exist
const cleanBaseProducts = baseProducts.filter(p => {
  const isBadminton = p.collections.includes("cau-long-2") || p.sport === "cau-long-2" || p.title.toLowerCase().includes("cầu lông");
  const isPickleball = p.collections.includes("pickleball") || p.sport === "pickleball" || p.title.toLowerCase().includes("pickleball");
  const isRunning = p.collections.includes("chay-bo-1") || p.sport === "chay-bo-1" || p.title.toLowerCase().includes("chạy bộ");
  const isTraining = p.collections.includes("luyen-tap-1") || p.sport === "luyen-tap-1" || p.title.toLowerCase().includes("tập luyện");
  const isBasketball = p.collections.includes("bong-ro-2") || p.sport === "bong-ro-2" || p.title.toLowerCase().includes("bóng rổ");
  const isFootball = p.collections.includes("bong-da") || p.sport === "bong-da" || p.title.toLowerCase().includes("bóng đá");
  const isGolf = p.collections.includes("golf-1") || p.sport === "golf-1" || p.title.toLowerCase().includes("golf");
  const isSportlife = p.collections.includes("sportlife");
  const isSportwear = p.collections.includes("sportwear");
  // Badminton and Pickleball are exclusively sourced from badmintonProducts and pickleballProducts
  if (isBadminton || isPickleball || isRunning || isTraining || isBasketball || isFootball || isGolf || isSportlife || isSportwear) return false;

  const hasPlaceholderPickleImage = p.images.some(img => img.includes("acpw") || img.includes("acpv"));
  if (hasPlaceholderPickleImage) return false;

  return true;
});

// Authoritative merged products: Real Badminton + Real Pickleball + Real Base Products
const rawMerged: Product[] = [
  ...badmintonProducts,
  ...pickleballProducts,
  ...runningProducts,
  ...trainingProducts,
  ...basketballProducts,
  ...footballProducts,
  ...golfProducts,
  ...sportlifeProducts,
  ...sportwearProducts,
  ...cleanBaseProducts,
];

const handleMap = new Map<string, Product>();
for (const p of rawMerged) {
  if (!handleMap.has(p.handle)) {
    handleMap.set(p.handle, p);
  }
}

export const products: Product[] = Array.from(handleMap.values());
