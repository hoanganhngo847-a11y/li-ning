import { Gender, BodyPresetId, AVATAR_CONFIG } from './avatarConfig';
import { BODY_PRESETS } from './bodyPresets';

export interface BodyParameters {
  gender: Gender;
  heightCm: number;
  weightKg: number;
  chestCm: number;
  waistCm: number;
  hipCm: number;
  preset: BodyPresetId;
  isCustomized: boolean;
}

/**
 * Creates default body parameters for a given gender and preset
 */
export function createDefaultBodyParameters(
  gender: Gender = 'male',
  presetId: BodyPresetId = 'muscular'
): BodyParameters {
  const preset = BODY_PRESETS[gender][presetId];
  return {
    gender,
    heightCm: preset.height,
    weightKg: preset.weight,
    chestCm: preset.chest,
    waistCm: preset.waist,
    hipCm: preset.hips,
    preset: presetId,
    isCustomized: false,
  };
}

/**
 * Clamps a numerical value within bounds
 */
export function clampValue(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/**
 * Normalizes a value between 0.0 and 1.0 based on min and max
 */
export function normalizeValue(val: number, min: number, max: number): number {
  if (max === min) return 0;
  return clampValue((val - min) / (max - min), 0.0, 1.0);
}

export function sanitizeBodyParameters(
  params: Partial<BodyParameters>,
  defaultGender: Gender = 'male'
): BodyParameters {
  const gender = params.gender || defaultGender || 'male';
  const config = AVATAR_CONFIG[gender];
  const defaults = createDefaultBodyParameters(gender, params.preset || 'muscular');

  const heightCm = clampValue(
    params.heightCm ?? defaults.heightCm,
    config.ranges.height.min,
    config.ranges.height.max
  );

  const weightKg = clampValue(
    params.weightKg ?? defaults.weightKg,
    config.ranges.weight.min,
    config.ranges.weight.max
  );

  const chestCm = clampValue(
    params.chestCm ?? defaults.chestCm,
    config.ranges.chest.min,
    config.ranges.chest.max
  );

  const waistCm = clampValue(
    params.waistCm ?? defaults.waistCm,
    config.ranges.waist.min,
    config.ranges.waist.max
  );

  const hipCm = clampValue(
    params.hipCm ?? defaults.hipCm,
    config.ranges.hips.min,
    config.ranges.hips.max
  );

  const preset = params.preset ?? defaults.preset;
  const isCustomized = checkIfCustomized({
    gender,
    heightCm,
    weightKg,
    chestCm,
    waistCm,
    hipCm,
    preset,
    isCustomized: false,
  });

  return {
    gender,
    heightCm,
    weightKg,
    chestCm,
    waistCm,
    hipCm,
    preset,
    isCustomized,
  };
}

/**
 * Checks if current measurements diverge from the chosen preset baseline
 */
export function checkIfCustomized(params: BodyParameters): boolean {
  const presetBaseline = BODY_PRESETS[params.gender][params.preset];
  if (!presetBaseline) return true;

  const isChestDiff = Math.abs(params.chestCm - presetBaseline.chest) > 0.5;
  const isWaistDiff = Math.abs(params.waistCm - presetBaseline.waist) > 0.5;
  const isHipDiff = Math.abs(params.hipCm - presetBaseline.hips) > 0.5;
  const isWeightDiff = Math.abs(params.weightKg - presetBaseline.weight) > 0.5;

  return isChestDiff || isWaistDiff || isHipDiff || isWeightDiff;
}

/**
 * Computes BMI and classification label (used strictly as supporting diagnostic data)
 */
export function calculateBmi(heightCm: number, weightKg: number): { value: number; label: string; color: string } {
  const heightM = heightCm / 100;
  if (heightM <= 0) return { value: 22.0, label: 'Bình thường', color: 'text-emerald-600' };

  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  let label = 'Cân đối';
  let color = 'text-emerald-600';

  if (bmi < 18.5) {
    label = 'Gầy / Thon gọn';
    color = 'text-blue-600';
  } else if (bmi >= 18.5 && bmi < 24.9) {
    label = 'Chuẩn thể thao';
    color = 'text-emerald-600';
  } else if (bmi >= 24.9 && bmi < 29.9) {
    label = 'Đô con / Vạm vỡ';
    color = 'text-amber-600';
  } else {
    label = 'Đậm người';
    color = 'text-orange-600';
  }

  return { value: bmi, label, color };
}
