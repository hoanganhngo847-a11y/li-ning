export function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parsePrice(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseCompareAtPrice(value: unknown) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function uniqueStrings(value: unknown, fallback: string[] = []) {
  const source = Array.isArray(value) ? value : fallback;
  return Array.from(new Set(source.map((item) => String(item).trim()).filter(Boolean)));
}

function normalizeGender(value: unknown, fallback = 'unisex') {
  return value === 'nam' || value === 'nu' || value === 'kids' || value === 'unisex' ? value : fallback;
}

export function normalizeProductBody(body: any, id: string, existingProduct: any = {}) {
  const price = parsePrice(body.price, parsePrice(existingProduct.price));
  const compareAtPrice = parseCompareAtPrice(body.compareAtPrice ?? existingProduct.compareAtPrice);
  const available = body.available !== undefined ? body.available !== false : existingProduct.available !== false;
  const collections = uniqueStrings(body.collections, existingProduct.collections || []);
  const title = String(body.title || existingProduct.title || 'Sản phẩm mới').trim();
  const images = uniqueStrings(body.images, existingProduct.images || []);
  const gender = normalizeGender(body.gender, existingProduct.gender || 'unisex');
  const sport = String(body.sport || existingProduct.sport || collections[0] || 'thoi-trang').trim();

  const variants = Array.isArray(body.variants) && body.variants.length > 0
    ? body.variants
    : existingProduct.variants?.length
      ? existingProduct.variants
      : [
          {
            id: `${id}-1`,
            title: 'Freesize / Mặc định',
            size: 'Freesize',
            color: 'Mặc định',
            available,
            price,
            compareAtPrice,
          },
        ];

  return {
    ...existingProduct,
    ...body,
    id,
    handle: existingProduct.handle || slugify(title),
    title,
    price,
    compareAtPrice,
    images,
    variants: variants.map((variant: any, index: number) => ({
      id: variant.id || `${id}-${index + 1}`,
      title: variant.title || `${variant.size || 'Freesize'} / ${variant.color || 'Mặc định'}`,
      size: variant.size || 'Freesize',
      color: variant.color || 'Mặc định',
      available: variant.available !== false,
      price: parsePrice(variant.price, price),
      compareAtPrice: parseCompareAtPrice(variant.compareAtPrice ?? compareAtPrice),
    })),
    collections,
    sport,
    gender,
    description: String(body.description || existingProduct.description || ''),
    sku: String(body.sku || existingProduct.sku || id).trim(),
    available,
  };
}

export function buildUniqueHandle(baseHandle: string, products: any[], id: string) {
  const fallback = baseHandle || `san-pham-${id}`;
  let handle = fallback;
  let suffix = 2;

  while (products.some((product) => product.id !== id && product.handle === handle)) {
    handle = `${fallback}-${suffix}`;
    suffix += 1;
  }

  return handle;
}
