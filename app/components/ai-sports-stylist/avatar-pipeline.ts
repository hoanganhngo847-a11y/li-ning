import * as THREE from 'three';
import { BodyProfile, Gender, BodyType } from './types';
import { AVATAR_CONFIG } from '@/app/lib/avatar/avatarConfig';
import { toBodyParameters } from './types';

export interface AvatarAssetConfig {
  gender: Gender;
  modelPath: string;
  nominalHeight: number;
  headOffsetFactor: number;
}

export const AVATAR_PIPELINE_CONFIG = AVATAR_CONFIG;

export function computeParametricDeformation(profile: BodyProfile, config?: any) {
  const params = toBodyParameters(profile);
  const { heightCm, weightKg, chestCm, waistCm, hipCm, preset } = params;

  const targetRefHeight = profile.gender === 'female' ? 165 : 175;
  const scaleYFactor = heightCm / targetRefHeight;

  const morphWeights: Record<string, number> = {
    skinny_fat: preset === 'skinny_fat' ? 1.0 : 0.0,
    slim: preset === 'slim' ? 1.0 : 0.0,
    muscular: preset === 'muscular' ? 1.0 : 0.0,
    fat: preset === 'fat' ? 1.0 : 0.0,
  };

  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  return {
    scaleXFactor: 1.0,
    scaleYFactor,
    scaleZFactor: 1.0,
    morphWeights,
    bmi,
  };
}

export function applyParametricMorphs(
  model: THREE.Group,
  morphWeights: Record<string, number>,
  config?: any
) {
  // Pass-through
}
