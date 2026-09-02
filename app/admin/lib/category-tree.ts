import type { Product } from '@/app/lib/types';
import { getProductsForCollection } from '@/app/lib/data/collectionMap';

export interface AdminCategoryNode {
  handle: string;
  title: string;
  href: string;
  parentHandles: string[];
  parentTitles: string[];
  children: AdminCategoryNode[];
  custom?: boolean;
}

export interface StoredAdminCategory {
  id: string;
  handle: string;
  title: string;
  parentHandle: string | null;
  createdAt: number;
}

export interface ProductCategoryPath {
  rootHandle: string;
  rootTitle: string;
  groupHandle?: string;
  groupTitle?: string;
  childHandle?: string;
  childTitle?: string;
  leafHandle: string;
  leafTitle: string;
  fullPathString: string;
  href: string;
}

export const ADMIN_CATEGORIES_STORAGE_KEY = 'li-ning-admin-categories';
export const ADMIN_CATEGORIES_EVENT = 'li-ning-admin-categories-updated';

/**
 * Authoritative 3-level Category Tree strictly matching navigation menu:
 * - MÔN THỂ THAO
 * - THỜI TRANG
 * - YOUNG
 * - NAM
 * - NỮ
 * - SALE
 * (Excludes 'GIỚI THIỆU' and 'MIX & MATCH' as requested)
 */
export const baseCategoryTree: AdminCategoryNode[] = [
  {
    handle: 'the-thao',
    title: 'MÔN THỂ THAO',
    href: '/collections/the-thao',
    parentHandles: [],
    parentTitles: [],
    children: [
      {
        handle: 'pickleball',
        title: 'PICKLEBALL',
        href: '/collections/pickleball',
        parentHandles: ['the-thao'],
        parentTitles: ['MÔN THỂ THAO'],
        children: [
          { handle: 'vot-pick', title: 'Vợt Pickleball', href: '/collections/vot-pick', parentHandles: ['the-thao', 'pickleball'], parentTitles: ['MÔN THỂ THAO', 'PICKLEBALL'], children: [] },
          { handle: 'giay-pickleball', title: 'Giày Pickleball', href: '/collections/giay-pickleball', parentHandles: ['the-thao', 'pickleball'], parentTitles: ['MÔN THỂ THAO', 'PICKLEBALL'], children: [] },
          { handle: 'bo-quan-ao-pickleball-nam', title: 'Bộ quần áo Pickleball Nam', href: '/collections/bo-quan-ao-pickleball-nam', parentHandles: ['the-thao', 'pickleball'], parentTitles: ['MÔN THỂ THAO', 'PICKLEBALL'], children: [] },
          { handle: 'bo-quan-ao-pickleball-nu', title: 'Bộ quần áo Pickleball Nữ', href: '/collections/bo-quan-ao-pickleball-nu', parentHandles: ['the-thao', 'pickleball'], parentTitles: ['MÔN THỂ THAO', 'PICKLEBALL'], children: [] },
          { handle: 'phu-kien-pickleball', title: 'Phụ kiện Pickleball', href: '/collections/phu-kien-pickleball', parentHandles: ['the-thao', 'pickleball'], parentTitles: ['MÔN THỂ THAO', 'PICKLEBALL'], children: [] },
        ],
      },
      {
        handle: 'cau-long-2',
        title: 'CẦU LÔNG',
        href: '/collections/cau-long-2',
        parentHandles: ['the-thao'],
        parentTitles: ['MÔN THỂ THAO'],
        children: [
          { handle: 'vot-cau-long', title: 'Vợt Cầu Lông', href: '/collections/vot-cau-long', parentHandles: ['the-thao', 'cau-long-2'], parentTitles: ['MÔN THỂ THAO', 'CẦU LÔNG'], children: [] },
          { handle: 'giay-cau-long-nam', title: 'Giày cầu lông Nam', href: '/collections/giay-cau-long-nam', parentHandles: ['the-thao', 'cau-long-2'], parentTitles: ['MÔN THỂ THAO', 'CẦU LÔNG'], children: [] },
          { handle: 'giay-cau-long-nu', title: 'Giày cầu lông Nữ', href: '/collections/giay-cau-long-nu', parentHandles: ['the-thao', 'cau-long-2'], parentTitles: ['MÔN THỂ THAO', 'CẦU LÔNG'], children: [] },
          { handle: 'bo-quan-ao-cau-long-nam', title: 'Bộ Quần Áo Cầu Lông Nam', href: '/collections/bo-quan-ao-cau-long-nam', parentHandles: ['the-thao', 'cau-long-2'], parentTitles: ['MÔN THỂ THAO', 'CẦU LÔNG'], children: [] },
          { handle: 'bo-quan-ao-cau-long-nu', title: 'Bộ Quần Áo Cầu Lông Nữ', href: '/collections/bo-quan-ao-cau-long-nu', parentHandles: ['the-thao', 'cau-long-2'], parentTitles: ['MÔN THỂ THAO', 'CẦU LÔNG'], children: [] },
          { handle: 'phu-kien-cau-long', title: 'Phụ kiện Cầu Lông', href: '/collections/phu-kien-cau-long', parentHandles: ['the-thao', 'cau-long-2'], parentTitles: ['MÔN THỂ THAO', 'CẦU LÔNG'], children: [] },
        ],
      },
      {
        handle: 'chay-bo-1',
        title: 'CHẠY BỘ',
        href: '/collections/chay-bo-1',
        parentHandles: ['the-thao'],
        parentTitles: ['MÔN THỂ THAO'],
        children: [
          { handle: 'giay-chay-bo-nam', title: 'Giày chạy bộ Nam', href: '/collections/giay-chay-bo-nam', parentHandles: ['the-thao', 'chay-bo-1'], parentTitles: ['MÔN THỂ THAO', 'CHẠY BỘ'], children: [] },
          { handle: 'giay-chay-bo-nu', title: 'Giày chạy bộ Nữ', href: '/collections/giay-chay-bo-nu', parentHandles: ['the-thao', 'chay-bo-1'], parentTitles: ['MÔN THỂ THAO', 'CHẠY BỘ'], children: [] },
          { handle: 'ao-chay-bo', title: 'Trang phục Áo Chạy Bộ', href: '/collections/ao-chay-bo', parentHandles: ['the-thao', 'chay-bo-1'], parentTitles: ['MÔN THỂ THAO', 'CHẠY BỘ'], children: [] },
          { handle: 'quan-chay-bo', title: 'Quần Chạy Bộ', href: '/collections/quan-chay-bo', parentHandles: ['the-thao', 'chay-bo-1'], parentTitles: ['MÔN THỂ THAO', 'CHẠY BỘ'], children: [] },
        ],
      },
      {
        handle: 'luyen-tap-1',
        title: 'TẬP LUYỆN',
        href: '/collections/luyen-tap-1',
        parentHandles: ['the-thao'],
        parentTitles: ['MÔN THỂ THAO'],
        children: [
          { handle: 'ao-tap-luyen', title: 'Áo Tập Luyện & Gym', href: '/collections/ao-tap-luyen', parentHandles: ['the-thao', 'luyen-tap-1'], parentTitles: ['MÔN THỂ THAO', 'TẬP LUYỆN'], children: [] },
          { handle: 'quan-tap-luyen', title: 'Quần Tập Luyện', href: '/collections/quan-tap-luyen', parentHandles: ['the-thao', 'luyen-tap-1'], parentTitles: ['MÔN THỂ THAO', 'TẬP LUYỆN'], children: [] },
          { handle: 'ao-bra', title: 'Áo Bra Thể Thao', href: '/collections/ao-bra', parentHandles: ['the-thao', 'luyen-tap-1'], parentTitles: ['MÔN THỂ THAO', 'TẬP LUYỆN'], children: [] },
        ],
      },
      {
        handle: 'bong-ro-2',
        title: 'BÓNG RỔ',
        href: '/collections/bong-ro-2',
        parentHandles: ['the-thao'],
        parentTitles: ['MÔN THỂ THAO'],
        children: [
          { handle: 'giay-bong-ro-nam', title: 'Giày bóng rổ Nam', href: '/collections/giay-bong-ro-nam', parentHandles: ['the-thao', 'bong-ro-2'], parentTitles: ['MÔN THỂ THAO', 'BÓNG RỔ'], children: [] },
          { handle: 'giay-bong-ro-nu', title: 'Giày bóng rổ Nữ', href: '/collections/giay-bong-ro-nu', parentHandles: ['the-thao', 'bong-ro-2'], parentTitles: ['MÔN THỂ THAO', 'BÓNG RỔ'], children: [] },
          { handle: 'bo-quan-ao-bong-ro-nam', title: 'Bộ Quần Áo Bóng Rổ Nam', href: '/collections/bo-quan-ao-bong-ro-nam', parentHandles: ['the-thao', 'bong-ro-2'], parentTitles: ['MÔN THỂ THAO', 'BÓNG RỔ'], children: [] },
        ],
      },
      {
        handle: 'bong-da',
        title: 'BÓNG ĐÁ',
        href: '/collections/bong-da',
        parentHandles: ['the-thao'],
        parentTitles: ['MÔN THỂ THAO'],
        children: [
          { handle: 'giay-bong-da-nam', title: 'Giày bóng đá Nam / Cỏ nhân tạo', href: '/collections/giay-bong-da-nam', parentHandles: ['the-thao', 'bong-da'], parentTitles: ['MÔN THỂ THAO', 'BÓNG ĐÁ'], children: [] },
          { handle: 'bo-quan-ao-bong-da-nam', title: 'Bộ quần áo bóng đá Nam', href: '/collections/bo-quan-ao-bong-da-nam', parentHandles: ['the-thao', 'bong-da'], parentTitles: ['MÔN THỂ THAO', 'BÓNG ĐÁ'], children: [] },
        ],
      },
      {
        handle: 'golf-1',
        title: 'GOLF',
        href: '/collections/golf-1',
        parentHandles: ['the-thao'],
        parentTitles: ['MÔN THỂ THAO'],
        children: [
          { handle: 'giay-golf-nam', title: 'Giày Golf Nam', href: '/collections/giay-golf-nam', parentHandles: ['the-thao', 'golf-1'], parentTitles: ['MÔN THỂ THAO', 'GOLF'], children: [] },
          { handle: 'ao-polo-golf', title: 'Áo Polo Golf', href: '/collections/ao-polo-golf', parentHandles: ['the-thao', 'golf-1'], parentTitles: ['MÔN THỂ THAO', 'GOLF'], children: [] },
          { handle: 'quan-golf', title: 'Quần Golf', href: '/collections/quan-golf', parentHandles: ['the-thao', 'golf-1'], parentTitles: ['MÔN THỂ THAO', 'GOLF'], children: [] },
        ],
      },
    ],
  },
  {
    handle: 'thoi-trang',
    title: 'THỜI TRANG',
    href: '/collections/thoi-trang',
    parentHandles: [],
    parentTitles: [],
    children: [
      {
        handle: 'sportlife',
        title: 'SPORTLIFE',
        href: '/collections/sportlife',
        parentHandles: ['thoi-trang'],
        parentTitles: ['THỜI TRANG'],
        children: [
          { handle: 'giay-thoi-trang-sportlife', title: 'Giày Sneaker Sportlife', href: '/collections/giay-thoi-trang-sportlife', parentHandles: ['thoi-trang', 'sportlife'], parentTitles: ['THỜI TRANG', 'SPORTLIFE'], children: [] },
          { handle: 'ao-sportlife', title: 'Áo Polo & T-Shirt Sportlife', href: '/collections/ao-sportlife', parentHandles: ['thoi-trang', 'sportlife'], parentTitles: ['THỜI TRANG', 'SPORTLIFE'], children: [] },
          { handle: 'quan-sportlife', title: 'Quần Sportlife', href: '/collections/quan-sportlife', parentHandles: ['thoi-trang', 'sportlife'], parentTitles: ['THỜI TRANG', 'SPORTLIFE'], children: [] },
        ],
      },
      {
        handle: 'sportwear',
        title: 'SPORTWEAR',
        href: '/collections/sportwear',
        parentHandles: ['thoi-trang'],
        parentTitles: ['THỜI TRANG'],
        children: [
          { handle: 'giay-sportwear', title: 'Giày & Dép Sportwear', href: '/collections/giay-sportwear', parentHandles: ['thoi-trang', 'sportwear'], parentTitles: ['THỜI TRANG', 'SPORTWEAR'], children: [] },
          { handle: 'ao-sportwear', title: 'Áo Thể Thao Sportwear', href: '/collections/ao-sportwear', parentHandles: ['thoi-trang', 'sportwear'], parentTitles: ['THỜI TRANG', 'SPORTWEAR'], children: [] },
          { handle: 'quan-sportwear', title: 'Quần Nỉ & Gió Sportwear', href: '/collections/quan-sportwear', parentHandles: ['thoi-trang', 'sportwear'], parentTitles: ['THỜI TRANG', 'SPORTWEAR'], children: [] },
        ],
      },
      {
        handle: 'isaac',
        title: 'ISAAC',
        href: '/collections/isaac',
        parentHandles: ['thoi-trang'],
        parentTitles: ['THỜI TRANG'],
        children: [],
      },
    ],
  },
  {
    handle: 'kids-1',
    title: 'YOUNG',
    href: '/collections/kids-1',
    parentHandles: [],
    parentTitles: [],
    children: [
      { handle: 'be-trai-7-14-tuoi', title: 'BÉ TRAI (7-14 tuổi)', href: '/collections/be-trai-7-14-tuoi', parentHandles: ['kids-1'], parentTitles: ['YOUNG'], children: [] },
      { handle: 'be-gai-7-14-tuoi', title: 'BÉ GÁI (7-14 tuổi)', href: '/collections/be-gai-7-14-tuoi', parentHandles: ['kids-1'], parentTitles: ['YOUNG'], children: [] },
      { handle: 'phu-kien-boi', title: 'PHỤ KIỆN BƠI', href: '/collections/phu-kien-boi', parentHandles: ['kids-1'], parentTitles: ['YOUNG'], children: [] },
    ],
  },
  {
    handle: 'nam-1',
    title: 'NAM',
    href: '/collections/nam-1',
    parentHandles: [],
    parentTitles: [],
    children: [
      {
        handle: 'giay-nam-2',
        title: 'GIÀY DÉP',
        href: '/collections/giay-nam-2',
        parentHandles: ['nam-1'],
        parentTitles: ['NAM'],
        children: [
          { handle: 'giay-thoi-trang-nam', title: 'Giày thời trang', href: '/collections/giay-thoi-trang-nam', parentHandles: ['nam-1', 'giay-nam-2'], parentTitles: ['NAM', 'GIÀY DÉP'], children: [] },
          { handle: 'giay-chay-bo-nam', title: 'Giày chạy bộ', href: '/collections/giay-chay-bo-nam', parentHandles: ['nam-1', 'giay-nam-2'], parentTitles: ['NAM', 'GIÀY DÉP'], children: [] },
          { handle: 'giay-cau-long-nam', title: 'Giày cầu lông', href: '/collections/giay-cau-long-nam', parentHandles: ['nam-1', 'giay-nam-2'], parentTitles: ['NAM', 'GIÀY DÉP'], children: [] },
          { handle: 'giay-bong-ro-nam', title: 'Giày bóng rổ', href: '/collections/giay-bong-ro-nam', parentHandles: ['nam-1', 'giay-nam-2'], parentTitles: ['NAM', 'GIÀY DÉP'], children: [] },
          { handle: 'giay-bong-da-nam', title: 'Giày bóng đá', href: '/collections/giay-bong-da-nam', parentHandles: ['nam-1', 'giay-nam-2'], parentTitles: ['NAM', 'GIÀY DÉP'], children: [] },
          { handle: 'giay-bong-ban-nam', title: 'Giày bóng bàn', href: '/collections/giay-bong-ban-nam', parentHandles: ['nam-1', 'giay-nam-2'], parentTitles: ['NAM', 'GIÀY DÉP'], children: [] },
          { handle: 'dep-nam', title: 'Dép', href: '/collections/dep-nam', parentHandles: ['nam-1', 'giay-nam-2'], parentTitles: ['NAM', 'GIÀY DÉP'], children: [] },
        ],
      },
      {
        handle: 'ao-nam-1',
        title: 'ÁO',
        href: '/collections/ao-nam-1',
        parentHandles: ['nam-1'],
        parentTitles: ['NAM'],
        children: [
          { handle: 'ao-t-shirt-nam', title: 'Áo T-Shirt', href: '/collections/ao-t-shirt-nam', parentHandles: ['nam-1', 'ao-nam-1'], parentTitles: ['NAM', 'ÁO'], children: [] },
          { handle: 'ao-polo-nam', title: 'Áo Polo', href: '/collections/ao-polo-nam', parentHandles: ['nam-1', 'ao-nam-1'], parentTitles: ['NAM', 'ÁO'], children: [] },
          { handle: 'ao-gio-nam', title: 'Áo Gió', href: '/collections/ao-gio-nam', parentHandles: ['nam-1', 'ao-nam-1'], parentTitles: ['NAM', 'ÁO'], children: [] },
          { handle: 'ao-ni-nam', title: 'Áo Nỉ', href: '/collections/ao-ni-nam', parentHandles: ['nam-1', 'ao-nam-1'], parentTitles: ['NAM', 'ÁO'], children: [] },
          { handle: 'ao-dai-tay-nam', title: 'Áo Dài Tay', href: '/collections/ao-dai-tay-nam', parentHandles: ['nam-1', 'ao-nam-1'], parentTitles: ['NAM', 'ÁO'], children: [] },
          { handle: 'ao-long-vu-nam', title: 'Áo Lông Vũ', href: '/collections/ao-long-vu-nam', parentHandles: ['nam-1', 'ao-nam-1'], parentTitles: ['NAM', 'ÁO'], children: [] },
        ],
      },
      {
        handle: 'quan-nam-2',
        title: 'QUẦN',
        href: '/collections/quan-nam-2',
        parentHandles: ['nam-1'],
        parentTitles: ['NAM'],
        children: [
          { handle: 'quan-short-nam', title: 'Quần Short', href: '/collections/quan-short-nam', parentHandles: ['nam-1', 'quan-nam-2'], parentTitles: ['NAM', 'QUẦN'], children: [] },
          { handle: 'quan-gio-nam', title: 'Quần Gió', href: '/collections/quan-gio-nam', parentHandles: ['nam-1', 'quan-nam-2'], parentTitles: ['NAM', 'QUẦN'], children: [] },
          { handle: 'quan-ni-nam', title: 'Quần Nỉ', href: '/collections/quan-ni-nam', parentHandles: ['nam-1', 'quan-nam-2'], parentTitles: ['NAM', 'QUẦN'], children: [] },
        ],
      },
      {
        handle: 'bo-quan-ao-nam',
        title: 'BỘ QUẦN ÁO',
        href: '/collections/bo-quan-ao-nam',
        parentHandles: ['nam-1'],
        parentTitles: ['NAM'],
        children: [
          { handle: 'bo-quan-ao-pickleball-nam', title: 'Bộ quần áo pickleball', href: '/collections/bo-quan-ao-pickleball-nam', parentHandles: ['nam-1', 'bo-quan-ao-nam'], parentTitles: ['NAM', 'BỘ QUẦN ÁO'], children: [] },
          { handle: 'bo-quan-ao-cau-long-nam', title: 'Bộ Quần Áo Cầu Lông', href: '/collections/bo-quan-ao-cau-long-nam', parentHandles: ['nam-1', 'bo-quan-ao-nam'], parentTitles: ['NAM', 'BỘ QUẦN ÁO'], children: [] },
          { handle: 'bo-quan-ao-bong-da-nam', title: 'Bộ quần áo bóng đá', href: '/collections/bo-quan-ao-bong-da-nam', parentHandles: ['nam-1', 'bo-quan-ao-nam'], parentTitles: ['NAM', 'BỘ QUẦN ÁO'], children: [] },
          { handle: 'bo-quan-ao-bong-ro-nam', title: 'Bộ Quần Áo Bóng Rổ', href: '/collections/bo-quan-ao-bong-ro-nam', parentHandles: ['nam-1', 'bo-quan-ao-nam'], parentTitles: ['NAM', 'BỘ QUẦN ÁO'], children: [] },
        ],
      },
      {
        handle: 'phu-kien-nam',
        title: 'PHỤ KIỆN',
        href: '/collections/phu-kien-nam',
        parentHandles: ['nam-1'],
        parentTitles: ['NAM'],
        children: [
          { handle: 'mu-nam', title: 'Mũ', href: '/collections/mu-nam', parentHandles: ['nam-1', 'phu-kien-nam'], parentTitles: ['NAM', 'PHỤ KIỆN'], children: [] },
          { handle: 'tat-nam', title: 'Tất', href: '/collections/tat-nam', parentHandles: ['nam-1', 'phu-kien-nam'], parentTitles: ['NAM', 'PHỤ KIỆN'], children: [] },
          { handle: 'quan-lot-the-thao-nam', title: 'Quần lót thể thao', href: '/collections/quan-lot-the-thao-nam', parentHandles: ['nam-1', 'phu-kien-nam'], parentTitles: ['NAM', 'PHỤ KIỆN'], children: [] },
          { handle: 'balo-tui-xach-nam', title: 'Balo - Túi xách', href: '/collections/balo-tui-xach-nam', parentHandles: ['nam-1', 'phu-kien-nam'], parentTitles: ['NAM', 'PHỤ KIỆN'], children: [] },
          { handle: 'binh-nuoc-nam', title: 'Bình nước', href: '/collections/binh-nuoc-nam', parentHandles: ['nam-1', 'phu-kien-nam'], parentTitles: ['NAM', 'PHỤ KIỆN'], children: [] },
          { handle: 'phu-kien-the-thao-nam', title: 'Phụ kiện thể thao', href: '/collections/phu-kien-the-thao-nam', parentHandles: ['nam-1', 'phu-kien-nam'], parentTitles: ['NAM', 'PHỤ KIỆN'], children: [] },
        ],
      },
    ],
  },
  {
    handle: 'nu-21',
    title: 'NỮ',
    href: '/collections/nu-21',
    parentHandles: [],
    parentTitles: [],
    children: [
      {
        handle: 'giay-nu-2',
        title: 'GIÀY DÉP',
        href: '/collections/giay-nu-2',
        parentHandles: ['nu-21'],
        parentTitles: ['NỮ'],
        children: [
          { handle: 'giay-thoi-trang-nu', title: 'Giày thời trang', href: '/collections/giay-thoi-trang-nu', parentHandles: ['nu-21', 'giay-nu-2'], parentTitles: ['NỮ', 'GIÀY DÉP'], children: [] },
          { handle: 'giay-chay-bo-nu', title: 'Giày chạy bộ', href: '/collections/giay-chay-bo-nu', parentHandles: ['nu-21', 'giay-nu-2'], parentTitles: ['NỮ', 'GIÀY DÉP'], children: [] },
          { handle: 'giay-cau-long-nu', title: 'Giày cầu lông', href: '/collections/giay-cau-long-nu', parentHandles: ['nu-21', 'giay-nu-2'], parentTitles: ['NỮ', 'GIÀY DÉP'], children: [] },
          { handle: 'giay-bong-ro-nu', title: 'Giày bóng rổ', href: '/collections/giay-bong-ro-nu', parentHandles: ['nu-21', 'giay-nu-2'], parentTitles: ['NỮ', 'GIÀY DÉP'], children: [] },
          { handle: 'dep-nu', title: 'Dép', href: '/collections/dep-nu', parentHandles: ['nu-21', 'giay-nu-2'], parentTitles: ['NỮ', 'GIÀY DÉP'], children: [] },
        ],
      },
      {
        handle: 'ao-nu-2',
        title: 'ÁO',
        href: '/collections/ao-nu-2',
        parentHandles: ['nu-21'],
        parentTitles: ['NỮ'],
        children: [
          { handle: 'ao-t-shirt-nu', title: 'Áo T-Shirt', href: '/collections/ao-t-shirt-nu', parentHandles: ['nu-21', 'ao-nu-2'], parentTitles: ['NỮ', 'ÁO'], children: [] },
          { handle: 'ao-polo-nu', title: 'Áo Polo', href: '/collections/ao-polo-nu', parentHandles: ['nu-21', 'ao-nu-2'], parentTitles: ['NỮ', 'ÁO'], children: [] },
          { handle: 'ao-bra', title: 'Áo Bra', href: '/collections/ao-bra', parentHandles: ['nu-21', 'ao-nu-2'], parentTitles: ['NỮ', 'ÁO'], children: [] },
          { handle: 'ao-gio-nu', title: 'Áo Gió', href: '/collections/ao-gio-nu', parentHandles: ['nu-21', 'ao-nu-2'], parentTitles: ['NỮ', 'ÁO'], children: [] },
          { handle: 'ao-ni-nu', title: 'Áo Nỉ', href: '/collections/ao-ni-nu', parentHandles: ['nu-21', 'ao-nu-2'], parentTitles: ['NỮ', 'ÁO'], children: [] },
          { handle: 'ao-dai-tay-nu', title: 'Áo Dài Tay', href: '/collections/ao-dai-tay-nu', parentHandles: ['nu-21', 'ao-nu-2'], parentTitles: ['NỮ', 'ÁO'], children: [] },
          { handle: 'ao-long-vu-nu', title: 'Áo Lông Vũ', href: '/collections/ao-long-vu-nu', parentHandles: ['nu-21', 'ao-nu-2'], parentTitles: ['NỮ', 'ÁO'], children: [] },
        ],
      },
      {
        handle: 'quan-nu-2',
        title: 'QUẦN',
        href: '/collections/quan-nu-2',
        parentHandles: ['nu-21'],
        parentTitles: ['NỮ'],
        children: [
          { handle: 'quan-short-nu', title: 'Quần Short', href: '/collections/quan-short-nu', parentHandles: ['nu-21', 'quan-nu-2'], parentTitles: ['NỮ', 'QUẦN'], children: [] },
          { handle: 'quan-gio-nu', title: 'Quần Gió', href: '/collections/quan-gio-nu', parentHandles: ['nu-21', 'quan-nu-2'], parentTitles: ['NỮ', 'QUẦN'], children: [] },
          { handle: 'quan-ni-nu', title: 'Quần Nỉ', href: '/collections/quan-ni-nu', parentHandles: ['nu-21', 'quan-nu-2'], parentTitles: ['NỮ', 'QUẦN'], children: [] },
        ],
      },
      {
        handle: 'vay-chan-vay',
        title: 'VÁY - CHÂN VÁY',
        href: '/collections/vay-chan-vay',
        parentHandles: ['nu-21'],
        parentTitles: ['NỮ'],
        children: [],
      },
      {
        handle: 'bo-quan-ao-nu',
        title: 'BỘ QUẦN ÁO',
        href: '/collections/bo-quan-ao-nu',
        parentHandles: ['nu-21'],
        parentTitles: ['NỮ'],
        children: [
          { handle: 'bo-quan-ao-pickleball-nu', title: 'Bộ quần áo pickleball', href: '/collections/bo-quan-ao-pickleball-nu', parentHandles: ['nu-21', 'bo-quan-ao-nu'], parentTitles: ['NỮ', 'BỘ QUẦN ÁO'], children: [] },
          { handle: 'bo-quan-ao-cau-long-nu', title: 'Bộ Quần Áo Cầu Lông', href: '/collections/bo-quan-ao-cau-long-nu', parentHandles: ['nu-21', 'bo-quan-ao-nu'], parentTitles: ['NỮ', 'BỘ QUẦN ÁO'], children: [] },
        ],
      },
      {
        handle: 'phu-kien-nu',
        title: 'PHỤ KIỆN',
        href: '/collections/phu-kien-nu',
        parentHandles: ['nu-21'],
        parentTitles: ['NỮ'],
        children: [
          { handle: 'mu-nu', title: 'Mũ', href: '/collections/mu-nu', parentHandles: ['nu-21', 'phu-kien-nu'], parentTitles: ['NỮ', 'PHỤ KIỆN'], children: [] },
          { handle: 'tat-nu', title: 'Tất', href: '/collections/tat-nu', parentHandles: ['nu-21', 'phu-kien-nu'], parentTitles: ['NỮ', 'PHỤ KIỆN'], children: [] },
          { handle: 'balo-tui-xach-nu', title: 'Balo - Túi xách', href: '/collections/balo-tui-xach-nu', parentHandles: ['nu-21', 'phu-kien-nu'], parentTitles: ['NỮ', 'PHỤ KIỆN'], children: [] },
          { handle: 'phu-kien-the-thao-nu', title: 'Phụ kiện thể thao', href: '/collections/phu-kien-the-thao-nu', parentHandles: ['nu-21', 'phu-kien-nu'], parentTitles: ['NỮ', 'PHỤ KIỆN'], children: [] },
        ],
      },
    ],
  },
  {
    handle: 'khuyen-mai-sale',
    title: 'SALE',
    href: '/collections/khuyen-mai-sale',
    parentHandles: [],
    parentTitles: [],
    children: [
      { handle: 'giam-30', title: 'GIẢM 30%', href: '/collections/giam-30', parentHandles: ['khuyen-mai-sale'], parentTitles: ['SALE'], children: [] },
      { handle: 'giam-40', title: 'GIẢM 40%', href: '/collections/giam-40', parentHandles: ['khuyen-mai-sale'], parentTitles: ['SALE'], children: [] },
      { handle: 'giam-50', title: 'GIẢM 50%', href: '/collections/giam-50', parentHandles: ['khuyen-mai-sale'], parentTitles: ['SALE'], children: [] },
    ],
  },
];

function cloneCategoryNode(node: AdminCategoryNode, ancestors: AdminCategoryNode[] = []): AdminCategoryNode {
  const cloned: AdminCategoryNode = {
    handle: node.handle,
    title: node.title,
    href: node.href,
    parentHandles: ancestors.map((ancestor) => ancestor.handle),
    parentTitles: ancestors.map((ancestor) => ancestor.title),
    children: [],
    custom: node.custom,
  };

  cloned.children = node.children.map((child) => cloneCategoryNode(child, [...ancestors, cloned]));
  return cloned;
}

export function buildAdminCategoryTree(customCategories: StoredAdminCategory[] = []): AdminCategoryNode[] {
  const tree = baseCategoryTree.map((node) => cloneCategoryNode(node));
  const allNodes = new Map<string, AdminCategoryNode>();
  flattenCategories(tree).forEach((node) => allNodes.set(node.handle, node));

  customCategories.forEach((category) => {
    if (!category.handle || allNodes.has(category.handle)) return;

    const parent = category.parentHandle ? allNodes.get(category.parentHandle) : null;
    const node: AdminCategoryNode = {
      handle: category.handle,
      title: category.title,
      href: `/collections/${category.handle}`,
      parentHandles: parent ? [...parent.parentHandles, parent.handle] : [],
      parentTitles: parent ? [...parent.parentTitles, parent.title] : [],
      children: [],
      custom: true,
    };

    if (parent) {
      parent.children.push(node);
    } else {
      tree.push(node);
    }

    allNodes.set(node.handle, node);
  });

  return tree;
}

export const adminCategoryTree: AdminCategoryNode[] = buildAdminCategoryTree();

export function flattenCategories(nodes: AdminCategoryNode[] = adminCategoryTree): AdminCategoryNode[] {
  return nodes.flatMap((node) => [node, ...flattenCategories(node.children)]);
}

export const allAdminCategories = flattenCategories();

export function getCategoryNode(handle: string, tree: AdminCategoryNode[] = adminCategoryTree) {
  return flattenCategories(tree).find((category) => category.handle === handle) || null;
}

export function getCategoryPath(handle: string, tree: AdminCategoryNode[] = adminCategoryTree) {
  const category = getCategoryNode(handle, tree);
  if (!category) return handle;
  return [...category.parentTitles, category.title].join(' / ');
}

export function getLeafCategories(node: AdminCategoryNode): AdminCategoryNode[] {
  if (node.children.length === 0) return [node];
  return node.children.flatMap((child) => getLeafCategories(child));
}

export function getAllLeafCategories(tree: AdminCategoryNode[] = adminCategoryTree) {
  return tree.flatMap((category) => getLeafCategories(category));
}

export function getFirstLeaf(node: AdminCategoryNode) {
  return getLeafCategories(node)[0] || node;
}

/**
 * Calculates ALL hierarchical Category Tree paths that a product belongs to.
 * For example:
 * - MÔN THỂ THAO → CẦU LÔNG → Giày cầu lông Nam
 * - NAM → GIÀY DÉP → Giày cầu lông
 * - SALE → GIẢM 30%
 */
export function getProductCategoryTreePaths(
  product: Product,
  tree: AdminCategoryNode[] = adminCategoryTree
): ProductCategoryPath[] {
  const paths: ProductCategoryPath[] = [];
  const seenPaths = new Set<string>();

  // Iterate over every node in tree
  function checkNode(node: AdminCategoryNode, rootNode: AdminCategoryNode, groupNode?: AdminCategoryNode) {
    const productsInNode = getProductsForCollection([product], node.handle);
    const isMember = productsInNode.length > 0;

    if (isMember) {
      const fullPathTitles = [...node.parentTitles, node.title];
      const pathKey = fullPathTitles.join(' > ');

      if (!seenPaths.has(pathKey)) {
        seenPaths.add(pathKey);

        paths.push({
          rootHandle: rootNode.handle,
          rootTitle: rootNode.title,
          groupHandle: groupNode?.handle || (node.parentHandles.length === 1 ? node.handle : undefined),
          groupTitle: groupNode?.title || (node.parentTitles.length === 1 ? node.title : undefined),
          childHandle: node.children.length === 0 ? node.handle : undefined,
          childTitle: node.children.length === 0 ? node.title : undefined,
          leafHandle: node.handle,
          leafTitle: node.title,
          fullPathString: fullPathTitles.join(' → '),
          href: node.href,
        });
      }
    }

    for (const child of node.children) {
      checkNode(
        child,
        rootNode,
        groupNode || (node === rootNode ? child : groupNode)
      );
    }
  }

  for (const root of tree) {
    checkNode(root, root);
  }

  return paths;
}

export function getCollectionTagsFromSelected(selectedHandles: string[], tree: AdminCategoryNode[] = adminCategoryTree) {
  const tags = new Set<string>();

  selectedHandles.forEach((handle) => {
    const category = getCategoryNode(handle, tree);
    if (!category) {
      tags.add(handle);
      return;
    }

    category.parentHandles.forEach((parentHandle) => tags.add(parentHandle));
    tags.add(category.handle);
  });

  return Array.from(tags);
}

export function getSelectedLeafHandles(selectedHandles: string[], tree: AdminCategoryNode[] = adminCategoryTree) {
  const selected = new Set(selectedHandles);
  return getAllLeafCategories(tree)
    .filter((category) => selected.has(category.handle))
    .map((category) => category.handle);
}

export function getPrimaryLeafHandle(collectionHandles: string[], tree: AdminCategoryNode[] = adminCategoryTree) {
  const selected = new Set(collectionHandles);
  const leaf = getAllLeafCategories(tree).find((category) => selected.has(category.handle));
  return leaf?.handle || collectionHandles[0] || tree[0]?.handle || '';
}


export function readStoredAdminCategories(): StoredAdminCategory[] {
  if (typeof window === 'undefined') return [];

  try {
    const rawValue = window.localStorage.getItem(ADMIN_CATEGORIES_STORAGE_KEY);
    if (!rawValue) return [];
    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue.filter(isStoredCategory) : [];
  } catch {
    return [];
  }
}

export function writeStoredAdminCategories(categories: StoredAdminCategory[]) {
  window.localStorage.setItem(ADMIN_CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  window.dispatchEvent(new CustomEvent(ADMIN_CATEGORIES_EVENT));
}

export function slugifyCategoryTitle(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isStoredCategory(value: unknown): value is StoredAdminCategory {
  if (!value || typeof value !== 'object') return false;

  const category = value as StoredAdminCategory;
  return Boolean(
    category.id &&
    category.handle &&
    category.title &&
    (category.parentHandle === null || typeof category.parentHandle === 'string')
  );
}
