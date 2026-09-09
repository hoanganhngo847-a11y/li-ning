import { Product } from '@/app/lib/types';
import { FitRoomClothType } from './types';

/**
 * Centralized mapping from Li-Ning catalog products to FitRoom cloth types:
 * - 'upper': T-shirts, Polos, Jackets, Hoodies, Sweaters, Bras, Long-sleeve shirts
 * - 'lower': Shorts, Pants, Joggers, Trousers, Skirts
 * - 'full_set': One-piece dresses, jumpsuits, full-body sets
 */
export function mapProductToFitRoomType(product: Product): 'upper' | 'lower' | 'full_set' {
  if (!product) return 'upper';

  const titleLower = (product.title || '').toLowerCase();
  const handleLower = (product.handle || '').toLowerCase();
  const collections = (product.collections || []).map((c) => c.toLowerCase());

  // 1. Check Full-Set / One-piece / Dress
  const isFullSet =
    titleLower.includes('đầm') ||
    titleLower.includes('váy liền') ||
    titleLower.includes('jumpsuit') ||
    titleLower.includes('dress') ||
    collections.some((c) => c.includes('vay-lien') || c.includes('dam'));

  if (isFullSet) {
    return 'full_set';
  }

  // 2. Check Lower (Quần, Chân váy, Shorts)
  const isLower =
    titleLower.startsWith('quần') ||
    titleLower.includes('quần ') ||
    titleLower.includes('chân váy') ||
    titleLower.includes('short') ||
    titleLower.includes('pant') ||
    titleLower.includes('jogger') ||
    titleLower.includes('trouser') ||
    titleLower.includes('skirt') ||
    collections.some((c) =>
      c.includes('quan-') ||
      c.includes('short') ||
      c.includes('chan-vay')
    );

  if (isLower) {
    return 'lower';
  }

  // 3. Check Upper (Áo các loại)
  const isUpper =
    titleLower.startsWith('áo') ||
    titleLower.includes('áo ') ||
    titleLower.includes('t-shirt') ||
    titleLower.includes('polo') ||
    titleLower.includes('jacket') ||
    titleLower.includes('hoodie') ||
    titleLower.includes('sweater') ||
    titleLower.includes('vest') ||
    titleLower.includes('tank top') ||
    titleLower.includes('bra') ||
    collections.some((c) =>
      c.includes('ao-') ||
      c.includes('t-shirt') ||
      c.includes('polo') ||
      c.includes('jacket') ||
      c.includes('bra')
    );

  if (isUpper) {
    return 'upper';
  }

  // 4. Special check: Suit sets like "Bộ quần áo nỉ", "Bộ quần áo thể thao"
  if (titleLower.includes('bộ quần áo') || titleLower.includes('bộ thể thao')) {
    return 'full_set';
  }

  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `[FitRoom CategoryMapper] Unmapped product category for SKU "${product.sku}", title: "${product.title}". Defaulting to 'upper'.`
    );
  }

  return 'upper';
}
