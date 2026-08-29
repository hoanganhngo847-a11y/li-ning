import { NextRequest, NextResponse } from 'next/server';
import { products as seededProducts } from '@/app/lib/data/products';
import { buildUniqueHandle, normalizeProductBody } from '../product-utils';

declare global {
  // eslint-disable-next-line no-var
  var liNingAdminProducts: any[] | undefined;
}

function cloneProducts(products: any[]) {
  return products.map((product) => ({
    ...product,
    images: [...(product.images || [])],
    variants: (product.variants || []).map((variant: any) => ({ ...variant })),
    collections: [...(product.collections || [])],
  }));
}

function getProductsStore() {
  if (!globalThis.liNingAdminProducts) {
    globalThis.liNingAdminProducts = cloneProducts(seededProducts);
  }

  return globalThis.liNingAdminProducts;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const gender = searchParams.get('gender') || '';

    let products = [...getProductsStore()];

    if (search) {
      products = products.filter((p: any) => 
        p.title.toLowerCase().includes(search) || p.sku?.toLowerCase().includes(search)
      );
    }
    if (gender) {
      products = products.filter((p: any) => p.gender === gender);
    }

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as any;
    const products = getProductsStore();

    const maxId = products.reduce((max: number, p: any) => {
      const id = parseInt(p.id, 10);
      return !isNaN(id) ? Math.max(max, id) : max;
    }, 0);
    const newId = (maxId + 1).toString();

    const normalizedProduct = normalizeProductBody(body, newId);
    const newProduct = {
      ...normalizedProduct,
      handle: buildUniqueHandle(normalizedProduct.handle, products, newId),
    };

    products.unshift(newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}
