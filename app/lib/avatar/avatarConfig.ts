export type Gender = 'male' | 'female';
export type BodyPresetId = 'skinny_fat' | 'slim' | 'muscular' | 'fat';

export interface MeasurementRange {
  min: number;
  max: number;
  step: number;
  unit: string;
  default: number;
  label: string;
  description: string;
}

export interface GenderAssetConfig {
  gender: Gender;
  canonicalHeightMeters: number;
  headCenterOffsetRatio: number;
  landmarkRatios: {
    chest: number;
    waist: number;
    hips: number;
  };
  modelPaths: Record<BodyPresetId, string>;
  ranges: {
    height: MeasurementRange;
    weight: MeasurementRange;
    chest: MeasurementRange;
    waist: MeasurementRange;
    hips: MeasurementRange;
  };
}

export const AVATAR_CONFIG: Record<Gender, GenderAssetConfig> = {
  male: {
    gender: 'male',
    canonicalHeightMeters: 1.75,
    headCenterOffsetRatio: 0.52,
    landmarkRatios: {
      chest: 0.71,
      waist: 0.58,
      hips: 0.48,
    },
    modelPaths: {
      skinny_fat: '/models/avatar/male-base-skinny-fat.glb',
      slim: '/models/avatar/male-base-slim.glb',
      muscular: '/models/avatar/male-base-muscular.glb',
      fat: '/models/avatar/male-base-fat.glb',
    },
    ranges: {
      height: {
        min: 155,
        max: 195,
        step: 1,
        unit: 'cm',
        default: 175,
        label: 'Chiều cao',
        description: 'Chiều cao cơ thể tính từ đỉnh đầu đến gót chân',
      },
      weight: {
        min: 45,
        max: 125,
        step: 1,
        unit: 'kg',
        default: 76,
        label: 'Cân nặng',
        description: 'Khối lượng cơ thể',
      },
      chest: {
        min: 75,
        max: 130,
        step: 1,
        unit: 'cm',
        default: 104,
        label: 'Vòng 1 (Vòng ngực)',
        description: 'Chu vi vòng ngực qua điểm nở nhất',
      },
      waist: {
        min: 55,
        max: 125,
        step: 1,
        unit: 'cm',
        default: 78,
        label: 'Vòng 2 (Vòng eo)',
        description: 'Chu vi vòng eo tự nhiên qua rốn',
      },
      hips: {
        min: 75,
        max: 135,
        step: 1,
        unit: 'cm',
        default: 96,
        label: 'Vòng 3 (Vòng hông)',
        description: 'Chu vi vòng mông qua điểm lớn nhất',
      },
    },
  },
  female: {
    gender: 'female',
    canonicalHeightMeters: 1.65,
    headCenterOffsetRatio: 0.52,
    landmarkRatios: {
      chest: 0.70,
      waist: 0.57,
      hips: 0.47,
    },
    modelPaths: {
      skinny_fat: '/models/avatar/female-base-skinny-fat.glb',
      slim: '/models/avatar/female-base-slim.glb',
      muscular: '/models/avatar/female-base-muscular.glb',
      fat: '/models/avatar/female-base-fat.glb',
    },
    ranges: {
      height: {
        min: 145,
        max: 185,
        step: 1,
        unit: 'cm',
        default: 165,
        label: 'Chiều cao',
        description: 'Chiều cao cơ thể tính từ đỉnh đầu đến gót chân',
      },
      weight: {
        min: 40,
        max: 105,
        step: 1,
        unit: 'kg',
        default: 58,
        label: 'Cân nặng',
        description: 'Khối lượng cơ thể',
      },
      chest: {
        min: 70,
        max: 120,
        step: 1,
        unit: 'cm',
        default: 90,
        label: 'Vòng 1 (Vòng ngực)',
        description: 'Chu vi vòng ngực / chân ngực',
      },
      waist: {
        min: 50,
        max: 110,
        step: 1,
        unit: 'cm',
        default: 65,
        label: 'Vòng 2 (Vòng eo)',
        description: 'Chu vi vòng eo',
      },
      hips: {
        min: 75,
        max: 130,
        step: 1,
        unit: 'cm',
        default: 94,
        label: 'Vòng 3 (Vòng hông)',
        description: 'Chu vi vòng mông / hông',
      },
    },
  },
};
