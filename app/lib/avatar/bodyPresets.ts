import { Gender, BodyPresetId } from './avatarConfig';

export interface BodyPresetData {
  id: BodyPresetId;
  label: string;
  description: string;
  height: number;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  ratios: {
    chestToWaist: number;
    waistToHips: number;
  };
}

export const BODY_PRESETS: Record<Gender, Record<BodyPresetId, BodyPresetData>> = {
  male: {
    skinny_fat: {
      id: 'skinny_fat',
      label: 'Gầy mỡ bụng',
      description: 'Ít cơ bắp, có mỡ bụng',
      height: 175,
      weight: 67,
      chest: 92,
      waist: 82,
      hips: 92,
      ratios: { chestToWaist: 1.12, waistToHips: 0.89 },
    },
    slim: {
      id: 'slim',
      label: 'Thon gọn',
      description: 'Thanh thoát, mảnh mai',
      height: 175,
      weight: 62,
      chest: 88,
      waist: 72,
      hips: 88,
      ratios: { chestToWaist: 1.22, waistToHips: 0.81 },
    },
    muscular: {
      id: 'muscular',
      label: 'Cơ bắp',
      description: 'Săn chắc, chuẩn thể thao',
      height: 175,
      weight: 76,
      chest: 104,
      waist: 78,
      hips: 96,
      ratios: { chestToWaist: 1.33, waistToHips: 0.81 },
    },
    fat: {
      id: 'fat',
      label: 'Đầy đặn',
      description: 'Đậm người, tròn trịa',
      height: 175,
      weight: 92,
      chest: 112,
      waist: 98,
      hips: 106,
      ratios: { chestToWaist: 1.14, waistToHips: 0.92 },
    },
  },
  female: {
    skinny_fat: {
      id: 'skinny_fat',
      label: 'Gầy mỡ bụng',
      description: 'Khung nhỏ, tích mỡ bụng dưới',
      height: 165,
      weight: 52,
      chest: 84,
      waist: 70,
      hips: 88,
      ratios: { chestToWaist: 1.20, waistToHips: 0.79 },
    },
    slim: {
      id: 'slim',
      label: 'Thon gọn',
      description: 'Mảnh mai, uyển chuyển',
      height: 165,
      weight: 48,
      chest: 82,
      waist: 62,
      hips: 86,
      ratios: { chestToWaist: 1.32, waistToHips: 0.72 },
    },
    muscular: {
      id: 'muscular',
      label: 'Cơ bắp',
      description: 'Săn chắc, năng động',
      height: 168,
      weight: 58,
      chest: 90,
      waist: 65,
      hips: 94,
      ratios: { chestToWaist: 1.38, waistToHips: 0.69 },
    },
    fat: {
      id: 'fat',
      label: 'Đầy đặn',
      description: 'Đậm người, vóc dáng đầy',
      height: 165,
      weight: 72,
      chest: 100,
      waist: 84,
      hips: 104,
      ratios: { chestToWaist: 1.19, waistToHips: 0.81 },
    },
  },
};

export const BODY_PRESET_OPTIONS: { id: BodyPresetId; label: string; description: string }[] = [
  { id: 'skinny_fat', label: 'Gầy mỡ bụng', description: 'Ít cơ bắp, có mỡ bụng' },
  { id: 'slim', label: 'Thon gọn', description: 'Thanh thoát, mảnh mai' },
  { id: 'muscular', label: 'Cơ bắp', description: 'Săn chắc, chuẩn thể thao' },
  { id: 'fat', label: 'Đầy đặn', description: 'Đậm người, tròn trịa' },
];
