import { Gender, BodyPresetId } from '@/app/lib/avatar/avatarConfig';
import { BodyParameters, checkIfCustomized } from '@/app/lib/avatar/bodyParameters';
import { BODY_PRESETS, BODY_PRESET_OPTIONS } from '@/app/lib/avatar/bodyPresets';

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

export type StylistStepId = 'body' | 'sport' | 'style' | 'outfit';

export interface StylistStep {
  id: StylistStepId;
  stepNumber: string;
  label: string;
}

export const STYLIST_STEPS: StylistStep[] = [
  { id: 'body', stepNumber: '01', label: 'BODY' },
  { id: 'sport', stepNumber: '02', label: 'SPORT' },
  { id: 'style', stepNumber: '03', label: 'STYLE' },
  { id: 'outfit', stepNumber: '04', label: 'OUTFIT' },
];

export const BODY_TYPE_PRESETS = BODY_PRESETS;
export const BODY_TYPE_OPTIONS = BODY_PRESET_OPTIONS;
export { BODY_PRESET_OPTIONS };

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
