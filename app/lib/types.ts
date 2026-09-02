export interface ProductVariant {
  id: string;
  title: string;
  size: string;
  color: string;
  available: boolean;
  price: number;
  compareAtPrice: number | null;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  variants: ProductVariant[];
  collections: string[];
  sport: string;
  gender: 'nam' | 'nu' | 'unisex' | 'kids';
  description: string;
  sku: string;
  available: boolean;
  colorTone?: 'do' | 'den' | 'trang' | 'xanh_duong' | 'xanh_navy' | 'xanh_la' | 'vang' | 'cam' | 'hong' | 'tim' | 'xam' | 'be' | 'nau';
  colorName?: string;
  colorHex?: string;
}

export interface Collection {
  handle: string;
  title: string;
  description: string;
  image: string;
  productHandles: string[];
}

export interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
}

export interface BlogPost {
  handle: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  phone: string;
  hours: string;
  mapUrl: string;
}

export interface Banner {
  id: string;
  image: string;
  imageMobile: string;
  link: string;
  alt: string;
}

export interface CartItem {
  product: Product;
  variantId: string;
  quantity: number;
}

export interface PolicyPage {
  title: string;
  content: string;
}
