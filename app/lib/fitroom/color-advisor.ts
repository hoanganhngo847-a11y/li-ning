export type SkinToneId = 'fair' | 'medium_asian' | 'tan' | 'deep';

export interface SkinToneConfig {
  id: SkinToneId;
  name: string;
  vietnameseName: string;
  hexColor: string;
  undertone: string;
  description: string;
  bestColors: string[];
  avoidColors: string[];
  stylingAdvice: string;
  flatteringKeywords: string[]; // Keywords in product titles or descriptions
  cautionKeywords: string[];
}

export const SKIN_TONE_CONFIGS: Record<SkinToneId, SkinToneConfig> = {
  fair: {
    id: 'fair',
    name: 'Fair / Light',
    vietnameseName: 'Da Trắng Sáng',
    hexColor: '#FCE2D4',
    undertone: 'Cool / Neutral (Sắc tố sáng, hồng hào)',
    description: 'Nước da trắng sáng tự nhiên, bắt sáng tốt.',
    bestColors: ['Đỏ Li-Ning', 'Đen', 'Xanh Cobalt', 'Xanh Royal', 'Hồng Cánh Sen', 'Xanh Ngọc', 'Tím Pastel'],
    avoidColors: ['Vàng Nhạt', 'Be Sáng', 'Trắng Ngà'],
    stylingAdvice: 'Tạo độ tương phản sắc nét với các gam màu đậm như Đỏ Li-Ning, Đen tuyền hoặc các sắc xanh biển đậm giúp nổi bật làn da.',
    flatteringKeywords: ['đỏ', 'đen', 'black', 'red', 'cobalt', 'royal', 'xanh dương', 'hồng', 'pink', 'tím', 'purple'],
    cautionKeywords: ['be', 'kem', 'vàng nhạt', 'beige'],
  },
  medium_asian: {
    id: 'medium_asian',
    name: 'Warm Medium / Asian',
    vietnameseName: 'Da Vàng Châu Á / Sáng Tự Nhiên',
    hexColor: '#E8B896',
    undertone: 'Warm Neutral (Sắc tố ấm đặc trưng Á Đông)',
    description: 'Nước da vàng tự nhiên phổ biến nhất tại Việt Nam, khỏe khoắn và hài hòa.',
    bestColors: ['Đỏ Đô / Burgundy', 'Xanh Navy', 'Trắng Tinh Khôi', 'Cam Cháy', 'Xanh Lá Thông', 'Xám Đậm'],
    avoidColors: ['Vàng Mù Tạt Nhạt', 'Xám Xỉn', 'Nâu Vàng'],
    stylingAdvice: 'Gam màu xanh navy, đỏ sẫm hoặc trắng sáng mang lại vẻ ngoài năng động thể thao và làm sáng bừng gương mặt.',
    flatteringKeywords: ['navy', 'xanh than', 'đỏ', 'trắng', 'white', 'cam', 'orange', 'xanh lá', 'green', 'đen'],
    cautionKeywords: ['xám nhạt', 'vàng nhạt'],
  },
  tan: {
    id: 'tan',
    name: 'Athletic Tan / Honey',
    vietnameseName: 'Da Răm Nắng / Bánh Mật',
    hexColor: '#C68A56',
    undertone: 'Warm Golden (Sắc tố nâu bánh mật thể thao)',
    description: 'Làn da rám nắng thể thao, khỏe khoắn, tràn đầy năng lượng vận động.',
    bestColors: ['Trắng Sáng Tinh Khiết', 'Cam San Hô', 'Đỏ Cam', 'Xanh Mint / Bạc Hà', 'Vàng Neon', 'Đen Thể Thao'],
    avoidColors: ['Nâu Đất Sẫm', 'Tím Than Quá Tối'],
    stylingAdvice: 'Nước da bánh mật cực kỳ tôn đồ màu Trắng tinh, Đỏ cam và các chi tiết Neon phản quang thể thao.',
    flatteringKeywords: ['trắng', 'white', 'cam', 'neon', 'đỏ cam', 'xanh ngọc', 'mint', 'đen', 'vàng neon'],
    cautionKeywords: ['nâu sẫm', 'tím than'],
  },
  deep: {
    id: 'deep',
    name: 'Deep / Dark Athletic',
    vietnameseName: 'Da Nâu Đậm / Ngăm Khỏe',
    hexColor: '#8D5524',
    undertone: 'Deep Bronze (Sắc tố nâu sâu cá tính)',
    description: 'Nước da ngăm khỏe khoắn, góc cạnh và cơ bắp rõ nét.',
    bestColors: ['Trắng Sáng Tương Phản', 'Vàng Chanh', 'Đỏ Tươi Li-Ning', 'Xanh Coban', 'Xanh Da Trời Sáng'],
    avoidColors: ['Nâu Đất', 'Xám Tro Đậm'],
    stylingAdvice: 'Gam màu tương phản cực đại (High Contrast) như Trắng sáng, Đỏ tươi Li-Ning hoặc Vàng chanh sẽ tạo điểm nhấn bùng nổ.',
    flatteringKeywords: ['trắng', 'white', 'vàng', 'yellow', 'đỏ', 'red', 'xanh sáng', 'cyan', 'neon'],
    cautionKeywords: ['nâu', 'brown', 'xám tro'],
  },
};

export const ALL_SKIN_TONES: SkinToneConfig[] = Object.values(SKIN_TONE_CONFIGS);

export interface GarmentMatchResult {
  isRecommended: boolean;
  score: number; // 0 - 100
  badgeText?: string;
  reason: string;
}

/**
 * Evaluates whether a given Li-Ning garment matches and flatters the customer's skin tone.
 */
export function evaluateGarmentSkinMatch(
  garmentTitle: string,
  skinToneId: SkinToneId = 'medium_asian'
): GarmentMatchResult {
  const config = SKIN_TONE_CONFIGS[skinToneId] || SKIN_TONE_CONFIGS.medium_asian;
  const titleLower = garmentTitle.toLowerCase();

  let flatteringHits = 0;
  for (const kw of config.flatteringKeywords) {
    if (titleLower.includes(kw)) {
      flatteringHits++;
    }
  }

  let cautionHits = 0;
  for (const kw of config.cautionKeywords) {
    if (titleLower.includes(kw)) {
      cautionHits++;
    }
  }

  // Calculate score
  let score = 70; // baseline
  if (flatteringHits > 0) score += 25;
  if (cautionHits > 0) score -= 30;

  score = Math.max(20, Math.min(100, score));
  const isRecommended = score >= 75;

  let reason = '';
  if (isRecommended) {
    reason = `Màu sắc này tạo độ tương phản lý tưởng, giúp tôn vinh nước ${config.vietnameseName.toLowerCase()} của bạn.`;
  } else if (cautionHits > 0) {
    reason = `Màu này có thể hơi tiệp với nước da; bạn nên phối kèm phụ kiện hoặc áo khoác tương phản.`;
  } else {
    reason = `Gam màu cơ bản dễ mặc, kết hợp tốt trong mọi hoạt động thể thao.`;
  }

  return {
    isRecommended,
    score,
    badgeText: isRecommended ? '✦ Tôn Nước Da Của Bạn' : undefined,
    reason,
  };
}
