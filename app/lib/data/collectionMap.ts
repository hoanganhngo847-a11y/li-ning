import type { Product } from '../types';

const aliasToCanonical: Record<string, string> = {
  'giay-chay-bo-nam-2': 'giay-chay-bo-nam',
  'giay-bong-ro-nam-2': 'giay-bong-ro-nam',
  'giay-bong-ban': 'giay-bong-ban-nam',
  dep: 'dep-nam',
  'ao-gio-nam-1': 'ao-gio-nam',
  'ao-ni-nam-1': 'ao-ni-nam',
  'ao-dai-tay-nam-1': 'ao-dai-tay-nam',
  'ao-long-vu-nam-1': 'ao-long-vu-nam',
  'quan-gio-nam-1': 'quan-gio-nam',
  'quan-ni-nam-1': 'quan-ni-nam',
  'bo-quan-ao-nam-1': 'bo-quan-ao-nam',
  'bo-quan-ao-pick': 'bo-quan-ao-pickleball-nam',
  'bo-quan-ao-cau-long-nam-1': 'bo-quan-ao-cau-long-nam',
  'mu-nam-1': 'mu-nam',
  'tat-nam-1': 'tat-nam',
  'balo-tui-xach': 'balo-tui-xach-nam',
  'binh-nuoc-1': 'binh-nuoc-nam',
  bang: 'phu-kien-the-thao-nam',
  'giay-chay-bo-nu-2': 'giay-chay-bo-nu',
  'ao-bra-1': 'ao-bra',
  'ao-gio-nu-1': 'ao-gio-nu',
  'ao-ni-nu-1': 'ao-ni-nu',
  'ao-long-vu-nu-1': 'ao-long-vu-nu',
  'quan-gio-nu-1': 'quan-gio-nu',
  'quan-ni-nu-1': 'quan-ni-nu',
  vay: 'vay-chan-vay',
  'mu-nu-1': 'mu-nu',
  'tat-nu-1': 'tat-nu',
  'collection-liningxisaac': 'isaac',
  'plct8-30-1-8-31-8': 'giam-30',
  'plct8-40-1-8-31-8': 'giam-40',
  'plct8-50-1-8-31-8': 'giam-50',
};

const directChildren: Record<string, string[]> = {
  // Môn thể thao
  'the-thao': ['pickleball', 'cau-long-2', 'chay-bo-1', 'luyen-tap-1', 'bong-ro-2', 'bong-da', 'golf-1'],

  // Nam → sub-categories
  'nam-1': ['giay-nam-2', 'ao-nam-1', 'quan-nam-2', 'bo-quan-ao-nam', 'phu-kien-nam'],

  // Nữ → sub-categories
  'nu-21': ['giay-nu-2', 'ao-nu-2', 'quan-nu-2', 'vay-chan-vay', 'bo-quan-ao-nu', 'phu-kien-nu'],

  // Giày Nam
  'giay-nam-2': ['giay-thoi-trang-nam', 'giay-chay-bo-nam', 'giay-cau-long-nam', 'giay-bong-ro-nam', 'giay-bong-da-nam', 'giay-bong-ban-nam', 'dep-nam'],

  // Áo Nam
  'ao-nam-1': ['ao-t-shirt-nam', 'ao-polo-nam', 'ao-gio-nam', 'ao-ni-nam', 'ao-dai-tay-nam', 'ao-long-vu-nam'],

  // Quần Nam
  'quan-nam-2': ['quan-short-nam', 'quan-gio-nam', 'quan-ni-nam'],

  // Bộ quần áo Nam
  'bo-quan-ao-nam': ['bo-quan-ao-pickleball-nam', 'bo-quan-ao-cau-long-nam', 'bo-quan-ao-bong-da-nam', 'bo-quan-ao-bong-ro-nam'],

  // Phụ kiện Nam
  'phu-kien-nam': ['mu-nam', 'tat-nam', 'quan-lot-the-thao-nam', 'balo-tui-xach-nam', 'binh-nuoc-nam', 'phu-kien-the-thao-nam'],

  // Giày Nữ
  'giay-nu-2': ['giay-thoi-trang-nu', 'giay-chay-bo-nu', 'giay-cau-long-nu', 'giay-bong-ro-nu', 'dep-nu'],

  // Áo Nữ
  'ao-nu-2': ['ao-t-shirt-nu', 'ao-polo-nu', 'ao-bra', 'ao-gio-nu', 'ao-ni-nu', 'ao-dai-tay-nu', 'ao-long-vu-nu'],

  // Quần Nữ
  'quan-nu-2': ['quan-short-nu', 'quan-gio-nu', 'quan-ni-nu'],

  // Bộ quần áo Nữ
  'bo-quan-ao-nu': ['bo-quan-ao-pickleball-nu', 'bo-quan-ao-cau-long-nu'],

  // Phụ kiện Nữ
  'phu-kien-nu': ['mu-nu', 'tat-nu', 'balo-tui-xach-nu', 'phu-kien-the-thao-nu'],

  // Sale
  'khuyen-mai-sale': ['giam-30', 'giam-40', 'giam-50'],

  // Kids
  'kids-1': ['be-trai-7-14-tuoi', 'be-gai-7-14-tuoi', 'phu-kien-boi'],

  // Thời trang
  'thoi-trang': ['sportlife', 'sportwear', 'isaac'],

  // Homepage tab groups
  'ao-he': ['ao-nam-1', 'ao-nu-2', 'ao-polo-nam', 'ao-t-shirt-nam', 'ao-gio-nam', 'ao-ni-nu'],
  'quan-he': ['quan-nam-2', 'quan-nu-2', 'quan-short-nam'],
  'bo-quan-ao-he': ['bo-quan-ao-nam', 'bo-quan-ao-nu'],
  'vot-pick': [],
  'giay-pickleball': [],
  'phu-kien-pickleball': [],
};

export function canonicalizeCollectionHandle(handle: string): string {
  return aliasToCanonical[handle] || handle;
}

/**
 * Given a collection handle, returns a Set of all handles that should match,
 * including the handle itself and all descendant handles (recursively).
 */
export function getExpandedHandles(handle: string): Set<string> {
  const canonicalHandle = canonicalizeCollectionHandle(handle);
  const result = new Set<string>([handle, canonicalHandle]);
  const queue = [canonicalHandle];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const children = directChildren[current];
    if (children) {
      for (const child of children) {
        if (!result.has(child)) {
          result.add(child);
          queue.push(child);
        }
      }
    }
  }

  return result;
}

export function getProductsForCollection(allProducts: Product[], handle: string): Product[] {
  const canonicalHandle = canonicalizeCollectionHandle(handle);
  const matchHandles = getExpandedHandles(canonicalHandle);
  const directMatches = allProducts.filter((product) =>
    product.collections?.some((collectionHandle) =>
      matchHandles.has(canonicalizeCollectionHandle(collectionHandle))
    )
  );
  const semanticMatches = allProducts.filter((product) =>
    matchesSemanticCollection(product, canonicalHandle)
  );

  return uniqueProducts([...directMatches, ...semanticMatches]);
}

function uniqueProducts(items: Product[]): Product[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.handle)) return false;
    seen.add(item.handle);
    return true;
  });
}

function matchesSemanticCollection(product: Product, handle: string): boolean {
  const title = normalizeText(product.title);
  const isNam = product.gender === 'nam' || product.gender === 'unisex';
  const isNu = product.gender === 'nu' || product.gender === 'unisex';
  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  if (handle === 'all') return true;
  if (handle === 'ao-he') return title.includes('ao') && !title.includes('bo quan ao');
  if (handle === 'quan-he') return title.includes('quan') && !title.includes('bo quan ao');
  if (handle === 'bo-quan-ao-he') return title.includes('bo quan ao');
  if (handle === 'khuyen-mai-sale') return discount > 0;
  if (handle === 'giam-30') return discount >= 25 && discount < 40;
  if (handle === 'giam-40') return discount >= 35 && discount < 50;
  if (handle === 'giam-50') return discount >= 45;

  if (handle === 'the-thao') return product.sport !== 'thoi-trang' || titleIncludes(title, ['giay', 'vot', 'balo', 'quan']);
  if (handle === 'vot-pick') return title.includes('pickleball') && title.includes('vot');
  if (handle === 'phu-kien-pickleball') return title.includes('pickleball') && titleIncludes(title, ['bong', 'tui', 'phu kien']);
  if (handle === 'pickleball') return title.includes('pickleball') || product.sport === 'pickleball';
  if (handle === 'cau-long-2') return title.includes('cau long') || product.sport === 'cau-long-2';
  if (handle === 'chay-bo-1') return title.includes('chay bo') || product.sport === 'chay-bo-1';
  if (handle === 'bong-ro-2') return title.includes('bong ro') || product.sport === 'bong-ro-2';
  if (handle === 'bong-da') return title.includes('bong da') || product.sport === 'bong-da';
  if (handle === 'golf-1') return title.includes('golf') || product.sport === 'golf-1';
  if (handle === 'luyen-tap-1') return titleIncludes(title, ['tap luyen', 'gym', 'training', 'ao gio', 'ao ni', 'quan']);

  if (handle === 'nam-1') return isNam;
  if (handle === 'nu-21') return isNu;
  if (handle === 'kids-1') return product.gender === 'kids' || titleIncludes(title, ['kid', 'tre em', 'be trai', 'be gai']);

  if (handle.startsWith('giay-')) {
    if (!title.includes('giay')) return false;
    if (handle.endsWith('-nam') && !isNam) return false;
    if (handle.endsWith('-nu') && !isNu) return false;
    if (handle.includes('pickleball')) return title.includes('pickleball');
    if (handle.includes('cau-long')) return title.includes('cau long');
    if (handle.includes('chay-bo')) return title.includes('chay bo');
    if (handle.includes('bong-ro')) return title.includes('bong ro');
    if (handle.includes('bong-da')) return title.includes('bong da');
    if (handle.includes('bong-ban')) return title.includes('bong ban');
    if (handle.includes('thoi-trang')) return product.sport === 'thoi-trang';
    return true;
  }

  if (handle.startsWith('ao-')) {
    if (!title.includes('ao')) return false;
    if (handle.endsWith('-nam') && !isNam) return false;
    if (handle.endsWith('-nu') && !isNu) return false;
    if (handle.includes('polo')) return title.includes('polo');
    if (handle.includes('t-shirt')) return titleIncludes(title, ['t-shirt', 't shirt', 'thun']);
    if (handle.includes('gio')) return title.includes('gio');
    if (handle.includes('ni')) return title.includes('ni');
    if (handle.includes('bra')) return title.includes('bra');
    if (handle.includes('dai-tay')) return title.includes('dai tay');
    if (handle.includes('long-vu')) return title.includes('long vu');
    return true;
  }

  if (handle.startsWith('quan-')) {
    if (!title.includes('quan')) return false;
    if (handle.endsWith('-nam') && !isNam) return false;
    if (handle.endsWith('-nu') && !isNu) return false;
    if (handle.includes('short')) return title.includes('short');
    if (handle.includes('gio')) return title.includes('gio');
    if (handle.includes('ni')) return title.includes('ni');
    return true;
  }

  if (handle.includes('vay')) return title.includes('vay') && isNu;
  if (handle.startsWith('bo-quan-ao')) return titleIncludes(title, ['bo quan ao', 'set']);
  if (handle.startsWith('balo')) return title.includes('balo');
  if (handle.startsWith('mu-')) return title.includes('mu');
  if (handle.startsWith('tat-')) return title.includes('tat');
  if (handle.startsWith('binh-nuoc')) return title.includes('binh nuoc');
  if (handle.startsWith('phu-kien')) return titleIncludes(title, ['vot', 'balo', 'mu', 'tat', 'binh nuoc', 'bang']);
  if (handle === 'sportlife' || handle === 'sportwear' || handle === 'isaac' || handle === 'lookboook') return product.sport === 'thoi-trang';

  return false;
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

function titleIncludes(title: string, needles: string[]): boolean {
  return needles.some((needle) => title.includes(needle));
}
