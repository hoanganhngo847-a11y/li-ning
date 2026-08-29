import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { buildUniqueHandle, normalizeProductBody } from '../../product-utils';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const filePath = join(process.cwd(), 'data', 'products.json');
    const data = readFileSync(filePath, 'utf-8');
    const products = JSON.parse(data);
    
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
    const filePath = join(process.cwd(), 'data', 'products.json');
    const data = readFileSync(filePath, 'utf-8');
    let products = JSON.parse(data);
    
    const index = products.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    const normalizedProduct = normalizeProductBody(body, id, products[index]);
    products[index] = {
      ...normalizedProduct,
      handle: buildUniqueHandle(normalizedProduct.handle, products, id),
    };
    writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');
    
    return NextResponse.json(products[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const filePath = join(process.cwd(), 'data', 'products.json');
    const data = readFileSync(filePath, 'utf-8');
    let products = JSON.parse(data);
    
    const index = products.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    products.splice(index, 1);
    writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
