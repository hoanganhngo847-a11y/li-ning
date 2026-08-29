import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { buildUniqueHandle, normalizeProductBody } from '../product-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const gender = searchParams.get('gender') || '';

    const filePath = join(process.cwd(), 'data', 'products.json');
    const data = readFileSync(filePath, 'utf-8');
    let products = JSON.parse(data);

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
    const filePath = join(process.cwd(), 'data', 'products.json');
    const data = readFileSync(filePath, 'utf-8');
    const products = JSON.parse(data);

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

    products.push(newProduct);
    writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}
