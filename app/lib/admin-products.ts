'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Product } from './types';

export const ADMIN_PRODUCTS_STORAGE_KEY = 'li-ning-admin-products';
export const ADMIN_PRODUCTS_EVENT = 'li-ning-admin-products-updated';

type ProductStoreState = {
  adminProducts: Product[];
  isLoaded: boolean;
};

export function readAdminProducts(): Product[] {
  if (typeof window === 'undefined') return [];

  try {
    const rawValue = window.localStorage.getItem(ADMIN_PRODUCTS_STORAGE_KEY);
    if (!rawValue) return [];
    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue.filter(isProductLike) : [];
  } catch {
    return [];
  }
}

export function writeAdminProducts(products: Product[]) {
  window.localStorage.setItem(ADMIN_PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  window.dispatchEvent(new CustomEvent(ADMIN_PRODUCTS_EVENT));
}

export function useProductsWithAdminProducts(staticProducts: Product[]) {
  const [{ adminProducts, isLoaded }, setState] = useState<ProductStoreState>({
    adminProducts: [],
    isLoaded: false,
  });

  useEffect(() => {
    let cancelled = false;

    const syncProducts = async () => {
      const localProducts = readAdminProducts();

      try {
        const response = await fetch('/api/admin/products', { cache: 'no-store' });
        if (!response.ok) throw new Error('Unable to load admin products');
        const apiProducts = await response.json();

        if (!cancelled) {
          setState({
            adminProducts: Array.isArray(apiProducts) ? apiProducts.filter(isProductLike) : localProducts,
            isLoaded: true,
          });
        }
      } catch {
        if (!cancelled) {
          setState({ adminProducts: localProducts, isLoaded: true });
        }
      }
    };

    syncProducts();
    window.addEventListener('storage', syncProducts);
    window.addEventListener(ADMIN_PRODUCTS_EVENT, syncProducts);

    return () => {
      cancelled = true;
      window.removeEventListener('storage', syncProducts);
      window.removeEventListener(ADMIN_PRODUCTS_EVENT, syncProducts);
    };
  }, []);

  const mergedProducts = useMemo(
    () => mergeProducts(adminProducts, staticProducts),
    [adminProducts, staticProducts]
  );

  return { products: mergedProducts, adminProducts, isLoaded };
}

export function mergeProducts(adminProducts: Product[], staticProducts: Product[]) {
  const seen = new Set<string>();
  return [...adminProducts, ...staticProducts].filter((product) => {
    const key = product.handle || product.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isProductLike(value: unknown): value is Product {
  if (!value || typeof value !== 'object') return false;

  const product = value as Product;
  return Boolean(
    product.id &&
    product.handle &&
    product.title &&
    typeof product.price === 'number' &&
    Array.isArray(product.images) &&
    Array.isArray(product.variants) &&
    Array.isArray(product.collections)
  );
}
