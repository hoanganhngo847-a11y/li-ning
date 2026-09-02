import { Gender, BodyPresetId } from '@/app/lib/avatar/avatarConfig';
import { BodyParameters, checkIfCustomized } from '@/app/lib/avatar/bodyParameters';
import { BODY_PRESETS, BODY_PRESET_OPTIONS } from '@/app/lib/avatar/bodyPresets';
import type { Product } from '@/app/lib/types';

export type { Gender, BodyPresetId };
export type BodyType = BodyPresetId;

export interface BodyProfile {
  gender: Gender;
  height: number; // in cm: 145 to 195 cm
  weight: number; // in kg: 40 to 125 kg
  chest: number;  // Vòng 1 (Vòng ngực) in cm: 70 to 130 cm
  waist: number;  // Vòng 2 (Vòng eo) in cm: 50 to 125 cm
  hips: number;   // Vòng 3 (Vòng hông) in cm: 75 to 135 cm
  bodyType: BodyType;
  isCustomized?: boolean;
}

export type StylistStepId = 'body' | 'skin_tone' | 'sport' | 'outfit';

export interface StylistStep {
  id: StylistStepId;
  stepNumber: string;
  label: string;
}

export const STYLIST_STEPS: StylistStep[] = [
  { id: 'body', stepNumber: '01', label: 'VÓC DÁNG' },
  { id: 'skin_tone', stepNumber: '02', label: 'MÀU DA' },
  { id: 'sport', stepNumber: '03', label: 'MÔN THỂ THAO' },
  { id: 'outfit', stepNumber: '04', label: 'TRANG PHỤC' },
];

export const BODY_TYPE_PRESETS = BODY_PRESETS;
export const BODY_TYPE_OPTIONS = BODY_PRESET_OPTIONS;
export { BODY_PRESET_OPTIONS };

// ==========================================
// SKIN TONE DEFINITIONS
// ==========================================
export interface SkinTonePreset {
  id: string;
  label: string;
  description: string;
  hex: string;
  recommendedPalette: {
    title: string;
    colors: { name: string; hex: string }[];
  };
}

export const SKIN_TONE_PRESETS: SkinTonePreset[] = [
  {
    id: 'fair',
    label: 'Trắng sáng',
    description: 'Tone da sáng, tươi tắn',
    hex: '#f8d8c8',
    recommendedPalette: {
      title: 'Màu tôn da nổi bật',
      colors: [
        { name: 'Đỏ Li-Ning', hex: '#f30d29' },
        { name: 'Xanh Navy', hex: '#1a365d' },
        { name: 'Đen Tuyển', hex: '#111111' },
        { name: 'Hồng Pastel', hex: '#f472b6' },
      ],
    },
  },
  {
    id: 'natural',
    label: 'Tự nhiên',
    description: 'Tone da chuẩn Á Đông',
    hex: '#e6b8a2',
    recommendedPalette: {
      title: 'Màu tôn da thanh lịch',
      colors: [
        { name: 'Đỏ Li-Ning', hex: '#f30d29' },
        { name: 'Trắng Sứ', hex: '#ffffff' },
        { name: 'Xanh Dương', hex: '#2563eb' },
        { name: 'Xám Titanium', hex: '#4b5563' },
      ],
    },
  },
  {
    id: 'golden_tan',
    label: 'Vàng ấm',
    description: 'Tone da khỏe khoắn, năng động',
    hex: '#d89b7d',
    recommendedPalette: {
      title: 'Màu thể thao mạnh mẽ',
      colors: [
        { name: 'Trắng Tinh', hex: '#ffffff' },
        { name: 'Đỏ Li-Ning', hex: '#f30d29' },
        { name: 'Xanh Lục Bảo', hex: '#059669' },
        { name: 'Cam Năng Động', hex: '#ea580c' },
      ],
    },
  },
  {
    id: 'bronze',
    label: 'Rám nắng',
    description: 'Tone da rám nắng thể thao',
    hex: '#c48360',
    recommendedPalette: {
      title: 'Màu tương phản cao',
      colors: [
        { name: 'Trắng Tinh Khôi', hex: '#ffffff' },
        { name: 'Vàng Neon', hex: '#eab308' },
        { name: 'Cam San Hô', hex: '#f97316' },
        { name: 'Đen Thể Thao', hex: '#111111' },
      ],
    },
  },
  {
    id: 'honey',
    label: 'Bánh mật',
    description: 'Tone da nâu sẫm, săn chắc',
    hex: '#9e6347',
    recommendedPalette: {
      title: 'Màu nổi bật vóc dáng',
      colors: [
        { name: 'Trắng Kim Loại', hex: '#f8fafc' },
        { name: 'Đỏ Li-Ning', hex: '#f30d29' },
        { name: 'Vàng Chanh', hex: '#84cc16' },
        { name: 'Xanh Mint', hex: '#10b981' },
      ],
    },
  },
  {
    id: 'deep',
    label: 'Ngăm khỏe',
    description: 'Tone da ngăm đậm, cơ bắp',
    hex: '#683d29',
    recommendedPalette: {
      title: 'Màu phát sáng neon',
      colors: [
        { name: 'Trắng Sáng', hex: '#ffffff' },
        { name: 'Cam Lửa', hex: '#ff5722' },
        { name: 'Xanh Coban', hex: '#0284c7' },
        { name: 'Vàng Thể Thao', hex: '#facc15' },
      ],
    },
  },
];

export const SKIN_TONE_COLOR_MATCH: Record<
  string,
  {
    bestTones: string[];
    goodTones: string[];
    label: string;
    advice: string;
  }
> = {
  fair: {
    bestTones: ['do', 'xanh_navy', 'den', 'hong', 'tim', 'xanh_duong'],
    goodTones: ['xam', 'xanh_la'],
    label: 'Trắng sáng',
    advice: 'Tone da sáng rất hợp với màu đỏ Li-Ning, xanh navy, đen và các gam màu tương phản cao, làm nổi bật làn da tươi tắn.',
  },
  natural: {
    bestTones: ['do', 'trang', 'xanh_duong', 'xam', 'den', 'xanh_navy'],
    goodTones: ['cam', 'hong', 'tim'],
    label: 'Tự nhiên (Á Đông)',
    advice: 'Tone da tự nhiên hài hòa với trang phục màu đỏ, trắng sứ, xanh dương và xám titanium, tạo vẻ thanh lịch, khỏe khoắn.',
  },
  golden_tan: {
    bestTones: ['trang', 'do', 'xanh_la', 'cam', 'xanh_duong'],
    goodTones: ['den', 'vang', 'be'],
    label: 'Vàng ấm',
    advice: 'Tone da vàng ấm cực kỳ ăn nhập với màu trắng tinh, đỏ rực rỡ, xanh lục bảo và cam, tôn lên vẻ thể thao tràn đầy năng lượng.',
  },
  bronze: {
    bestTones: ['trang', 'vang', 'cam', 'den', 'do', 'xanh_la'],
    goodTones: ['xanh_duong', 'xam'],
    label: 'Rám nắng',
    advice: 'Tone da rám nắng tỏa sáng rực rỡ với trang phục màu trắng tinh khôi, vàng neon, cam san hô và đen thể thao tạo độ tương phản mạnh mẽ.',
  },
  honey: {
    bestTones: ['trang', 'vang', 'cam', 'xanh_la', 'hong', 'do'],
    goodTones: ['xanh_duong', 'xam'],
    label: 'Bánh mật',
    advice: 'Tone da bánh mật nâu săn chắc rất hợp màu trắng sáng, vàng chanh, cam rực rỡ và xanh neon, làm tôn nét khỏe khoắn của cơ bắp.',
  },
  deep: {
    bestTones: ['trang', 'cam', 'xanh_duong', 'vang', 'do'],
    goodTones: ['xanh_la', 'xam'],
    label: 'Ngăm khỏe',
    advice: 'Tone da ngăm đậm nổi bật khi mặc trang phục màu trắng sáng, cam lửa, xanh coban hoặc vàng thể thao phát sáng.',
  },
};

// ==========================================
// SPORT OPTIONS
// ==========================================
export interface SportOption {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  collectionHandle: string;
  badge: string;
}

export const SPORT_OPTIONS: SportOption[] = [
  {
    id: 'pickleball',
    name: 'Pickleball',
    icon: '🏓',
    tagline: 'Bộ sưu tập hot trend, linh hoạt & trẻ trung',
    collectionHandle: 'pickleball',
    badge: 'XU HƯỚNG 2026',
  },
  {
    id: 'badminton',
    name: 'Cầu lông',
    icon: '🏸',
    tagline: 'Áo đấu thoáng khí, tăng tốc bứt phá',
    collectionHandle: 'cau-long-2',
    badge: 'DI SẢN LI-NING',
  },
  {
    id: 'running',
    name: 'Chạy bộ',
    icon: '🏃‍♂️',
    tagline: 'Chất liệu siêu nhẹ, cản gió & thoáng khí',
    collectionHandle: 'chay-bo-1',
    badge: 'CHUYÊN SÂU',
  },
  {
    id: 'training',
    name: 'Tập luyện / Gym',
    icon: '🏋️‍♂️',
    tagline: 'Bó cơ đa chiều, hỗ trợ phục hồi cơ bắp',
    collectionHandle: 'luyen-tap-1',
    badge: 'LINH HOẠT',
  },
  {
    id: 'basketball',
    name: 'Bóng rổ',
    icon: '🏀',
    tagline: 'Form rộng cá tính, bật nhảy tối đa',
    collectionHandle: 'bong-ro-2',
    badge: 'NĂNG ĐỘNG',
  },
  {
    id: 'golf',
    name: 'Golf',
    icon: '⛳',
    tagline: 'Lịch lãm, chống nắng UV & co giãn 4 chiều',
    collectionHandle: 'golf-1',
    badge: 'CAO CẤP',
  },
];

// ==========================================
// CLOTHING FIT INTERFACES
// ==========================================
export type ClothingSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface FittedItem {
  product: Product;
  size: ClothingSize;
  colorHex: string;
  category: 'top' | 'bottom' | 'shoes';
}

export interface FittingState {
  top: FittedItem | null;
  bottom: FittedItem | null;
  shoes: FittedItem | null;
}

export function toBodyParameters(profile: BodyProfile): BodyParameters {
  const isCust = profile.isCustomized ?? checkIfCustomized({
    gender: profile.gender,
    heightCm: profile.height,
    weightKg: profile.weight,
    chestCm: profile.chest,
    waistCm: profile.waist,
    hipCm: profile.hips,
    preset: profile.bodyType,
    isCustomized: false,
  });

  return {
    gender: profile.gender,
    heightCm: profile.height,
    weightKg: profile.weight,
    chestCm: profile.chest,
    waistCm: profile.waist,
    hipCm: profile.hips,
    preset: profile.bodyType,
    isCustomized: isCust,
  };
}

/**
 * Recommends best clothing size based on anatomical measurements
 */
export function recommendSize(profile: BodyProfile, category: 'top' | 'bottom' = 'top'): ClothingSize {
  const { gender, height, weight, chest, waist } = profile;

  if (category === 'top') {
    if (gender === 'female') {
      if (chest <= 82 && weight <= 48) return 'S';
      if (chest <= 86 && weight <= 54) return 'M';
      if (chest <= 92 && weight <= 60) return 'L';
      if (chest <= 98 && weight <= 68) return 'XL';
      return 'XXL';
    } else {
      if (chest <= 88 && weight <= 62) return 'S';
      if (chest <= 96 && weight <= 70) return 'M';
      if (chest <= 104 && weight <= 78) return 'L';
      if (chest <= 112 && weight <= 88) return 'XL';
      return 'XXL';
    }
  } else {
    if (gender === 'female') {
      if (waist <= 64) return 'S';
      if (waist <= 70) return 'M';
      if (waist <= 76) return 'L';
      if (waist <= 84) return 'XL';
      return 'XXL';
    } else {
      if (waist <= 74) return 'S';
      if (waist <= 80) return 'M';
      if (waist <= 86) return 'L';
      if (waist <= 94) return 'XL';
      return 'XXL';
    }
  }
}
