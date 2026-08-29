import { NextRequest, NextResponse } from 'next/server';
import { products as seededProducts } from '@/app/lib/data/products';
import { buildUniqueHandle, normalizeProductBody } from '../../product-utils';

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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const products = getProductsStore();
    
    const product = products.find((p: any) => p.id === id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json() as any;
    const products = getProductsStore();
    
    const index = products.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    const normalizedProduct = normalizeProductBody(body, id, products[index]);
    products[index] = {
      ...normalizedProduct,
      handle: buildUniqueHandle(normalizedProduct.handle, products, id),
    };

    return NextResponse.json(products[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const products = getProductsStore();
    
    const index = products.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    products.splice(index, 1);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
