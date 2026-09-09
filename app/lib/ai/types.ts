export type GenderType = 'nam' | 'nu' | 'male' | 'female';

export interface SelectedGarmentItem {
  id?: string;
  title: string;
  category?: string;
  color?: string;
  description?: string;
  image?: string;
  price?: number;
}

export interface GenerateModelImageInput {
  gender: GenderType;
  age?: number;
  ethnicity?: string;
  skinTone?: string;
  heightCm?: number;
  weightKg?: number;
  bustCm?: number;
  waistCm?: number;
  hipsCm?: number;
  bodyType?: string;
  pose?: string;
  selectedTop?: SelectedGarmentItem;
  selectedBottom?: SelectedGarmentItem;
  selectedShoes?: SelectedGarmentItem;
  selectedOutfitName?: string;
  brandStyle?: string;
  useCache?: boolean;
}

export interface GenerateModelImageOutput {
  success: boolean;
  imageUrl?: string;
  imageBase64?: string;
  mimeType?: string;
  promptUsed?: string;
  cached?: boolean;
  provider: 'gemini' | 'legacy';
  metadata?: {
    model: string;
    latencyMs: number;
    aspectRatio?: string;
  };
  error?: string;
}
