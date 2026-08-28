export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

export function calculateDiscount(price: number, compareAtPrice: number): number {
  if (compareAtPrice <= price || compareAtPrice === 0) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
