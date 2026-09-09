import type { GenerateModelImageInput } from './types';

/**
 * Maps skin tone id to descriptive natural prompt adjectives
 */
function getSkinToneDescription(skinTone?: string): string {
  switch (skinTone?.toLowerCase()) {
    case 'fair':
      return 'fair porcelain Asian skin tone';
    case 'tan':
      return 'healthy sun-kissed tanned athletic skin tone';
    case 'deep':
      return 'warm deep honey-tanned skin tone';
    case 'medium_asian':
    default:
      return 'natural warm medium East Asian skin tone';
  }
}

/**
 * Builds an optimal image generation prompt tailored for Google Gemini / Imagen
 */
export function buildModelImagePrompt(input: GenerateModelImageInput): string {
  const isFemale = input.gender === 'nu' || input.gender === 'female';
  const genderTerm = isFemale ? 'female' : 'male';
  const age = input.age || (isFemale ? 24 : 26);
  const ethnicity = input.ethnicity || 'Vietnamese / East Asian';
  const skinToneDesc = getSkinToneDescription(input.skinTone);

  const height = input.heightCm || (isFemale ? 165 : 178);
  const weight = input.weightKg || (isFemale ? 52 : 72);
  const bust = input.bustCm || (isFemale ? 86 : 98);
  const waist = input.waistCm || (isFemale ? 65 : 79);
  const hips = input.hipsCm || (isFemale ? 91 : 96);
  const bodyType = input.bodyType || 'athletic toned physique with defined muscles and posture';

  // Garments
  const topDesc = input.selectedTop?.title
    ? `Li-Ning ${input.selectedTop.title}${input.selectedTop.color ? ` in ${input.selectedTop.color}` : ''}`
    : 'Li-Ning breathable high-performance athletic sports t-shirt';

  const bottomDesc = input.selectedBottom?.title
    ? `Li-Ning ${input.selectedBottom.title}${input.selectedBottom.color ? ` in ${input.selectedBottom.color}` : ''}`
    : 'Li-Ning athletic lightweight training shorts';

  const shoesDesc = input.selectedShoes?.title
    ? `Li-Ning ${input.selectedShoes.title} sports shoes`
    : 'Li-Ning professional cushioned running shoes';

  const brand = input.brandStyle || 'Li-Ning';
  const pose = input.pose || 'standing confident front-facing athletic pose, hands relaxed, looking towards camera';

  return `Professional full-body studio photograph of a ${genderTerm} sports model, ${age} years old, ${ethnicity}, with ${skinToneDesc}.
Physique: ${height} cm tall, ${weight} kg, ${bodyType}, with anatomical body proportions matching bust ${bust} cm, waist ${waist} cm, hips ${hips} cm.
Sportswear Outfit:
- Upper: ${topDesc} with authentic ${brand} logo and sportswear design accents.
- Lower: ${bottomDesc} with streamlined fit and ${brand} branding.
- Footwear: ${shoesDesc}.
Composition:
- Full body shot from head to sneakers, perfectly framed.
- Pose: ${pose}.
- Lighting: Soft commercial studio lighting with subtle rim lights highlighting athletic silhouette.
- Background: Minimalist clean light grey and white sports-tech studio backdrop with subtle soft shadows under sneakers.
- Aesthetic: High realism, commercial e-commerce lookbook quality, 8k resolution, photorealistic fabric textures, sharp details, accurate garment fit.`.trim();
}
