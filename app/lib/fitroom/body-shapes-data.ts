export interface BodyShapeModel {
  id: string;
  gender: 'male' | 'female';
  name: string;
  subtitle: string;
  tag: string;
  height: string;
  weight: string;
  measurements: string;
  description: string;
  imageSrc: string;
  thumbSrc: string;
}

export const BODY_SHAPE_MODELS: BodyShapeModel[] = [
  // ==========================================
  // MẪU NAM (4 VÓC DÁNG)
  // ==========================================
  {
    id: 'male-lean-athletic',
    gender: 'male',
    name: 'Dáng Cân Đối Thể Thao',
    subtitle: 'Lean Athletic',
    tag: 'Tiêu Chuẩn VĐV',
    height: '178 cm',
    weight: '70 kg',
    measurements: '98 - 78 - 96',
    description: 'Cơ bắp vừa vặn, tỉ lệ vai - eo - chân cân đối chuẩn VĐV thể thao chuyên nghiệp.',
    imageSrc: '/images/body-shapes/male-lean-athletic.png',
    thumbSrc: '/images/body-shapes/male-lean-athletic.jpg',
  },
  {
    id: 'male-v-taper',
    gender: 'male',
    name: 'Dáng Chữ V Cơ Bắp',
    subtitle: 'V-Taper Athletic',
    tag: 'Cơ Bắp · Đô Vai',
    height: '182 cm',
    weight: '76 kg',
    measurements: '104 - 79 - 97',
    description: 'Khung vai rộng nở nang, ngực lớn, thắt eo gọn tạo form chữ V mạnh mẽ và uy lực.',
    imageSrc: '/images/body-shapes/male-v-taper.png',
    thumbSrc: '/images/body-shapes/male-v-taper.jpg',
  },
  {
    id: 'male-solid-heavy',
    gender: 'male',
    name: 'Dáng Đô Con / Vạm Vỡ',
    subtitle: 'Solid Heavy',
    tag: 'Vóc Dáng Lớn',
    height: '175 cm',
    weight: '82 kg',
    measurements: '108 - 88 - 102',
    description: 'Khung xương to, cơ bắp dày chắc, phù hợp form đồ thể thao rộng rãi và thoải mái.',
    imageSrc: '/images/body-shapes/male-solid-heavy.png',
    thumbSrc: '/images/body-shapes/male-solid-heavy.jpg',
  },
  {
    id: 'male-slim-lean',
    gender: 'male',
    name: 'Dáng Mảnh Mai / Thon Gọn',
    subtitle: 'Slim Lean',
    tag: 'Thon Gọn · Nhanh Nhẹn',
    height: '176 cm',
    weight: '62 kg',
    measurements: '92 - 74 - 90',
    description: 'Thân hình thanh thoát, linh hoạt, di chuyển tốc độ và thanh thoát trên sân thi đấu.',
    imageSrc: '/images/body-shapes/male-slim-lean.png',
    thumbSrc: '/images/body-shapes/male-slim-lean.jpg',
  },

  // ==========================================
  // MẪU NỮ (7 VÓC DÁNG)
  // ==========================================
  {
    id: 'female-hourglass-fit',
    gender: 'female',
    name: 'Dáng Đồng Hồ Cát Cân Đối',
    subtitle: 'Fit Hourglass',
    tag: 'Chuẩn Thể Thao Nữ',
    height: '165 cm',
    weight: '52 kg',
    measurements: '86 - 63 - 90',
    description: 'Tỉ lệ 3 vòng cân đối hài hòa, eo thon gọn săn chắc, form dáng thể thao năng động.',
    imageSrc: '/images/body-shapes/female-hourglass-fit.png',
    thumbSrc: '/images/body-shapes/female-hourglass-fit.jpg',
  },
  {
    id: 'female-athletic-rectangle',
    gender: 'female',
    name: 'Dáng Thước Kẻ Thể Thao',
    subtitle: 'Athletic Rectangle',
    tag: 'Cơ Bắp Săn Chắc',
    height: '168 cm',
    weight: '54 kg',
    measurements: '84 - 67 - 88',
    description: 'Khung người thẳng, cơ bụng nét, cơ bắp gọn gàng, nhanh nhẹn và năng động.',
    imageSrc: '/images/body-shapes/female-athletic-rectangle.png',
    thumbSrc: '/images/body-shapes/female-athletic-rectangle.jpg',
  },
  {
    id: 'female-pear-shape',
    gender: 'female',
    name: 'Dáng Quả Lê',
    subtitle: 'Pear Shape',
    tag: 'Hông Đầy Đặn',
    height: '163 cm',
    weight: '53 kg',
    measurements: '82 - 64 - 93',
    description: 'Hông và đùi nở nang săn chắc, eo nhỏ, trọng tâm vững vàng cho các bước di chuyển.',
    imageSrc: '/images/body-shapes/female-pear-shape.png',
    thumbSrc: '/images/body-shapes/female-pear-shape.jpg',
  },
  {
    id: 'female-inverted-triangle',
    gender: 'female',
    name: 'Dáng Tam Giác Ngược',
    subtitle: 'Inverted Triangle',
    tag: 'Vai Thể Thao',
    height: '170 cm',
    weight: '56 kg',
    measurements: '88 - 66 - 87',
    description: 'Bờ vai thể thao mạnh mẽ, lưng thon gọn, chuẩn vóc dáng VĐV bơi lội và cầu lông.',
    imageSrc: '/images/body-shapes/female-inverted-triangle.png',
    thumbSrc: '/images/body-shapes/female-inverted-triangle.jpg',
  },
  {
    id: 'female-hourglass-curvy',
    gender: 'female',
    name: 'Dáng Đồng Hồ Cát Đầy Đặn',
    subtitle: 'Curvy Hourglass',
    tag: 'Nở Nang Quyến Rũ',
    height: '164 cm',
    weight: '58 kg',
    measurements: '92 - 68 - 96',
    description: 'Vòng 1 và vòng 3 đầy đặn, thắt eo rõ nét, mang lại vẻ đẹp khỏe khoắn cuốn hút.',
    imageSrc: '/images/body-shapes/female-hourglass-curvy.png',
    thumbSrc: '/images/body-shapes/female-hourglass-curvy.jpg',
  },
  {
    id: 'female-petite-slim',
    gender: 'female',
    name: 'Dáng Mảnh Mai / Nhỏ Nhắn',
    subtitle: 'Petite Slim',
    tag: 'Nhẹ Nhàng Linh Hoạt',
    height: '158 cm',
    weight: '46 kg',
    measurements: '80 - 60 - 84',
    description: 'Vóc dáng nhỏ nhắn, chân tay thon dài, di chuyển thanh thoát và khéo léo trên sân.',
    imageSrc: '/images/body-shapes/female-petite-slim.png',
    thumbSrc: '/images/body-shapes/female-petite-slim.jpg',
  },
  {
    id: 'female-full-curve',
    gender: 'female',
    name: 'Dáng Đầy Đặn',
    subtitle: 'Full Curve',
    tag: 'Vóc Dáng Lớn',
    height: '165 cm',
    weight: '65 kg',
    measurements: '96 - 76 - 102',
    description: 'Thân hình đầy đặn, đường nét mềm mại, thoải mái và tự tin trong mọi trang phục.',
    imageSrc: '/images/body-shapes/female-full-curve.png',
    thumbSrc: '/images/body-shapes/female-full-curve.jpg',
  },
];
