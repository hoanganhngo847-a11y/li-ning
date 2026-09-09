import { products } from '@/app/lib/data/products';
import { Product } from '@/app/lib/types';
import { mapProductToFitRoomType } from './category-mapper';
import { SkinToneId, evaluateGarmentSkinMatch } from './color-advisor';

export interface CatalogGarment {
  id: string;
  sku: string;
  title: string;
  price: number;
  image: string;
  type: 'upper' | 'lower' | 'full_set';
  handle: string;
  gender: 'nam' | 'nu' | 'unisex' | 'kids';
  categoryKey: string;
  categoryLabel: string;
  isRecommendedSkinTone?: boolean;
}

const NON_APPAREL_TERMS = [
  'giày', 'dép', 'vợt', 'tất', 'balo', 'bình', 'mũ', 'bóng', 'túi', 
  'băng', 'dây', 'quấn cán', 'quả cầu', 'ống cầu', 'hộp cầu', 'khăn', 
  'lót', 'kính', 'ống tay'
];

/**
 * Checks if a product is an actual wearable apparel (not shoes, rackets, bags, balls, socks, bottles)
 */
export function isApparelProduct(product: Product): boolean {
  if (!product || !product.title) return false;
  const title = product.title.toLowerCase();

  // Exclude non-apparel items
  if (NON_APPAREL_TERMS.some((term) => title.includes(term))) {
    return false;
  }

  // Must positively be clothing
  const isCloth =
    title.includes('áo') ||
    title.includes('quần') ||
    title.includes('bộ') ||
    title.includes('váy') ||
    title.includes('đầm') ||
    title.includes('polo') ||
    title.includes('t-shirt') ||
    title.includes('jacket') ||
    title.includes('hoodie') ||
    title.includes('sweater') ||
    title.includes('short') ||
    title.includes('jogger') ||
    title.includes('pant') ||
    title.includes('skirt') ||
    title.includes('bra');

  if (!isCloth) return false;

  // Must have at least one valid image
  if (!product.images || product.images.length === 0 || !product.images[0]) {
    return false;
  }

  return true;
}

/**
 * Detect subcategory for fine-grained tabs
 */
export function detectGarmentCategory(product: Product, type: 'upper' | 'lower' | 'full_set'): { key: string; label: string } {
  const title = (product.title || '').toLowerCase();
  const collections = (product.collections || []).map((c) => c.toLowerCase());

  if (type === 'upper') {
    if (title.includes('polo') || collections.some((c) => c.includes('polo'))) {
      return { key: 'polo', label: 'Áo Polo' };
    }
    if (title.includes('t-shirt') || title.includes('tshirt') || collections.some((c) => c.includes('t-shirt'))) {
      return { key: 'tshirt', label: 'Áo T-Shirt' };
    }
    if (title.includes('gió') || title.includes('khoác') || title.includes('jacket') || collections.some((c) => c.includes('gio'))) {
      return { key: 'jacket', label: 'Áo Gió/Khoác' };
    }
    if (title.includes('nỉ') || title.includes('dài tay') || title.includes('hoodie') || title.includes('sweater')) {
      return { key: 'sweatshirt', label: 'Áo Nỉ/Dài Tay' };
    }
    if (title.includes('bra') || title.includes('ba lỗ') || title.includes('tank')) {
      return { key: 'bra_tank', label: 'Áo Bra/Ba Lỗ' };
    }
    return { key: 'other_top', label: 'Áo Thể Thao' };
  }

  if (type === 'lower') {
    if (title.includes('short') || collections.some((c) => c.includes('short'))) {
      return { key: 'shorts', label: 'Quần Short' };
    }
    if (title.includes('chân váy') || title.includes('váy') || collections.some((c) => c.includes('vay') || c.includes('skirt'))) {
      return { key: 'skirt', label: 'Chân Váy' };
    }
    if (title.includes('nỉ') || title.includes('jogger')) {
      return { key: 'jogger', label: 'Quần Nỉ/Jogger' };
    }
    if (title.includes('gió') || title.includes('dài') || collections.some((c) => c.includes('quan-gio'))) {
      return { key: 'pants', label: 'Quần Dài/Gió' };
    }
    return { key: 'other_bottom', label: 'Quần Thể Thao' };
  }

  return { key: 'full_set', label: 'Bộ Thể Thao' };
}

// Pre-filter and map all apparel products from catalog
export const ALL_APPAREL_GARMENTS: CatalogGarment[] = products
  .filter(isApparelProduct)
  .map((product) => {
    const type = mapProductToFitRoomType(product);
    const cat = detectGarmentCategory(product, type);
    return {
      id: product.id,
      sku: product.sku || product.handle,
      title: product.title,
      price: product.price,
      image: product.images[0], // Exact authentic CDN thumbnail!
      type,
      handle: product.handle,
      gender: product.gender,
      categoryKey: cat.key,
      categoryLabel: cat.label,
    };
  });

export interface GetSuggestedGarmentsParams {
  gender?: 'nam' | 'nu' | 'all';
  skinTone?: SkinToneId;
  type?: 'upper' | 'lower' | 'full_set' | 'all';
  categoryKey?: string; // 'all' or specific key like 'polo', 'shorts'
  searchQuery?: string;
  onlyRecommendedSkinTone?: boolean;
  limit?: number;
}

/**
 * Returns suggested garments tailored to gender, skin tone, and categories
 */
export function getSuggestedGarments(params: GetSuggestedGarmentsParams = {}): {
  garments: CatalogGarment[];
  totalMatches: number;
} {
  const {
    gender = 'nam',
    skinTone = 'medium_asian',
    type = 'upper',
    categoryKey = 'all',
    searchQuery = '',
    onlyRecommendedSkinTone = false,
    limit = 12,
  } = params;

  let filtered = ALL_APPAREL_GARMENTS.filter((item) => {
    // 1. Filter Type (upper, lower, full_set)
    if (type !== 'all' && item.type !== type) {
      return false;
    }

    // 2. Filter Gender (allow unisex for both)
    if (gender !== 'all') {
      if (item.gender !== gender && item.gender !== 'unisex') {
        return false;
      }
    }

    // 3. Filter Category Key
    if (categoryKey && categoryKey !== 'all' && item.categoryKey !== categoryKey) {
      return false;
    }

    // 4. Search Query (by title or sku)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSku = item.sku.toLowerCase().includes(q);
      if (!matchTitle && !matchSku) return false;
    }

    return true;
  });

  // Calculate skin tone recommendations
  const scored = filtered.map((item) => {
    const match = evaluateGarmentSkinMatch(item.title, skinTone);
    return {
      ...item,
      isRecommendedSkinTone: match.isRecommended,
    };
  });

  // Filter only recommended if user toggled
  let result = scored;
  if (onlyRecommendedSkinTone) {
    result = result.filter((item) => item.isRecommendedSkinTone);
  }

  // Sort: Put skin-tone recommended first, then stable order
  result.sort((a, b) => {
    if (a.isRecommendedSkinTone && !b.isRecommendedSkinTone) return -1;
    if (!a.isRecommendedSkinTone && b.isRecommendedSkinTone) return 1;
    return 0;
  });

  const totalMatches = result.length;
  const paginated = limit ? result.slice(0, limit) : result;

  return {
    garments: paginated,
    totalMatches,
  };
}

/**
 * Returns available categories for Upper or Lower
 */
export function getAvailableCategories(type: 'upper' | 'lower', gender: 'nam' | 'nu' | 'all'): { key: string; label: string; count: number }[] {
  const items = ALL_APPAREL_GARMENTS.filter((item) => {
    if (item.type !== type) return false;
    if (gender !== 'all' && item.gender !== gender && item.gender !== 'unisex') return false;
    return true;
  });

  const map = new Map<string, { label: string; count: number }>();
  for (const item of items) {
    const existing = map.get(item.categoryKey);
    if (existing) {
      existing.count++;
    } else {
      map.set(item.categoryKey, { label: item.categoryLabel, count: 1 });
    }
  }

  const list: { key: string; label: string; count: number }[] = [
    { key: 'all', label: 'Tất cả', count: items.length },
  ];

  for (const [key, val] of map.entries()) {
    list.push({ key, label: val.label, count: val.count });
  }

  return list;
}
