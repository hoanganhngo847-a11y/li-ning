'use client';

import { useState } from 'react';

export interface CategoryNode {
  handle: string;
  label: string;
  children?: CategoryNode[];
}

export const categoryTree: CategoryNode[] = [
  {
    handle: 'nam-1', label: '👨 NAM', children: [
      {
        handle: 'giay-nam-2', label: '👟 Giày Dép Nam', children: [
          { handle: 'giay-thoi-trang-nam', label: 'Giày thời trang' },
          { handle: 'giay-chay-bo-nam', label: 'Giày chạy bộ' },
          { handle: 'giay-cau-long-nam', label: 'Giày cầu lông' },
          { handle: 'giay-bong-ro-nam', label: 'Giày bóng rổ' },
          { handle: 'giay-bong-da-nam', label: 'Giày bóng đá' },
          { handle: 'giay-bong-ban-nam', label: 'Giày bóng bàn' },
          { handle: 'dep-nam', label: 'Dép' },
        ]
      },
      {
        handle: 'ao-nam-1', label: '👕 Áo Nam', children: [
          { handle: 'ao-t-shirt-nam', label: 'Áo T-Shirt' },
          { handle: 'ao-polo-nam', label: 'Áo Polo' },
          { handle: 'ao-gio-nam', label: 'Áo Gió' },
          { handle: 'ao-ni-nam', label: 'Áo Nỉ' },
          { handle: 'ao-dai-tay-nam', label: 'Áo Dài Tay' },
          { handle: 'ao-long-vu-nam', label: 'Áo Lông Vũ' },
        ]
      },
      {
        handle: 'quan-nam-2', label: '👖 Quần Nam', children: [
          { handle: 'quan-short-nam', label: 'Quần Short' },
          { handle: 'quan-gio-nam', label: 'Quần Gió' },
          { handle: 'quan-ni-nam', label: 'Quần Nỉ' },
        ]
      },
      {
        handle: 'bo-quan-ao-nam', label: '🏃 Bộ Quần Áo Nam', children: [
          { handle: 'bo-quan-ao-pickleball-nam', label: 'Bộ Pickleball' },
          { handle: 'bo-quan-ao-cau-long-nam', label: 'Bộ Cầu Lông' },
          { handle: 'bo-quan-ao-bong-da-nam', label: 'Bộ Bóng Đá' },
          { handle: 'bo-quan-ao-bong-ro-nam', label: 'Bộ Bóng Rổ' },
        ]
      },
      {
        handle: 'phu-kien-nam', label: '🎒 Phụ Kiện Nam', children: [
          { handle: 'mu-nam', label: 'Mũ' },
          { handle: 'tat-nam', label: 'Tất' },
          { handle: 'quan-lot-the-thao-nam', label: 'Quần lót thể thao' },
          { handle: 'balo-tui-xach-nam', label: 'Balo - Túi xách' },
          { handle: 'binh-nuoc-nam', label: 'Bình nước' },
          { handle: 'phu-kien-the-thao-nam', label: 'Phụ kiện thể thao' },
        ]
      },
    ]
  },
  {
    handle: 'nu-21', label: '👩 NỮ', children: [
      {
        handle: 'giay-nu-2', label: '👟 Giày Dép Nữ', children: [
          { handle: 'giay-thoi-trang-nu', label: 'Giày thời trang' },
          { handle: 'giay-chay-bo-nu', label: 'Giày chạy bộ' },
          { handle: 'giay-cau-long-nu', label: 'Giày cầu lông' },
          { handle: 'giay-bong-ro-nu', label: 'Giày bóng rổ' },
          { handle: 'dep-nu', label: 'Dép' },
        ]
      },
      {
        handle: 'ao-nu-2', label: '👕 Áo Nữ', children: [
          { handle: 'ao-t-shirt-nu', label: 'Áo T-Shirt' },
          { handle: 'ao-polo-nu', label: 'Áo Polo' },
          { handle: 'ao-bra', label: 'Áo Bra' },
          { handle: 'ao-gio-nu', label: 'Áo Gió' },
          { handle: 'ao-ni-nu', label: 'Áo Nỉ' },
          { handle: 'ao-dai-tay-nu', label: 'Áo Dài Tay' },
          { handle: 'ao-long-vu-nu', label: 'Áo Lông Vũ' },
        ]
      },
      {
        handle: 'quan-nu-2', label: '👖 Quần Nữ', children: [
          { handle: 'quan-short-nu', label: 'Quần Short' },
          { handle: 'quan-gio-nu', label: 'Quần Gió' },
          { handle: 'quan-ni-nu', label: 'Quần Nỉ' },
        ]
      },
      { handle: 'vay-chan-vay', label: '👗 Váy - Chân Váy' },
      {
        handle: 'bo-quan-ao-nu', label: '🏃 Bộ Quần Áo Nữ', children: [
          { handle: 'bo-quan-ao-pickleball-nu', label: 'Bộ Pickleball' },
          { handle: 'bo-quan-ao-cau-long-nu', label: 'Bộ Cầu Lông' },
        ]
      },
      {
        handle: 'phu-kien-nu', label: '🎒 Phụ Kiện Nữ', children: [
          { handle: 'mu-nu', label: 'Mũ' },
          { handle: 'tat-nu', label: 'Tất' },
          { handle: 'balo-tui-xach-nu', label: 'Balo - Túi xách' },
          { handle: 'phu-kien-the-thao-nu', label: 'Phụ kiện thể thao' },
        ]
      },
    ]
  },
  {
    handle: 'the-thao', label: '🏆 MÔN THỂ THAO', children: [
      { handle: 'pickleball', label: 'Pickleball' },
      { handle: 'cau-long-2', label: 'Cầu Lông' },
      { handle: 'chay-bo-1', label: 'Chạy Bộ' },
      { handle: 'luyen-tap-1', label: 'Tập Luyện' },
      { handle: 'bong-ro-2', label: 'Bóng Rổ' },
      { handle: 'bong-da', label: 'Bóng Đá' },
      { handle: 'golf-1', label: 'Golf' },
    ]
  },
  {
    handle: 'thoi-trang', label: '✨ THỜI TRANG', children: [
      { handle: 'sportlife', label: 'Sportlife' },
      { handle: 'sportwear', label: 'Sportwear' },
      { handle: 'isaac', label: 'Isaac' },
    ]
  },
  {
    handle: 'kids-1', label: '🧒 YOUNG / TRẺ EM', children: [
      { handle: 'be-trai-7-14-tuoi', label: 'Bé Trai (7-14 tuổi)' },
      { handle: 'be-gai-7-14-tuoi', label: 'Bé Gái (7-14 tuổi)' },
      { handle: 'phu-kien-boi', label: 'Phụ Kiện Bơi' },
    ]
  },
  {
    handle: 'khuyen-mai-sale', label: '🔥 SALE', children: [
      { handle: 'giam-30', label: 'Giảm 30%' },
      { handle: 'giam-40', label: 'Giảm 40%' },
      { handle: 'giam-50', label: 'Giảm 50%' },
    ]
  },
];

// Given a selected leaf handle, collect all ancestor handles
function getAncestors(handle: string, tree: CategoryNode[], path: string[] = []): string[] | null {
  for (const node of tree) {
    if (node.handle === handle) return path;
    if (node.children) {
      const result = getAncestors(handle, node.children, [...path, node.handle]);
      if (result) return result;
    }
  }
  return null;
}

export function getCollectionTagsFromSelected(selected: string[]): string[] {
  const allTags = new Set<string>();
  for (const handle of selected) {
    allTags.add(handle);
    const ancestors = getAncestors(handle, categoryTree);
    if (ancestors) {
      for (const a of ancestors) allTags.add(a);
    }
  }
  return Array.from(allTags);
}

interface TreeNodeProps {
  node: CategoryNode;
  selected: Set<string>;
  onToggle: (handle: string) => void;
  depth: number;
}

function TreeNode({ node, selected, onToggle, depth }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(depth < 1);
  const hasChildren = node.children && node.children.length > 0;
  const isChecked = selected.has(node.handle);

  // Check if any descendant is selected
  const hasSelectedDescendant = hasChildren && node.children!.some(c => {
    if (selected.has(c.handle)) return true;
    if (c.children) return c.children.some(cc => selected.has(cc.handle));
    return false;
  });

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-gray-50 ${depth === 0 ? 'mt-2' : ''}`}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-700 text-xs"
          >
            {expanded ? '▼' : '▶'}
          </button>
        ) : (
          <span className="w-5" />
        )}
        <label className="flex items-center gap-2 cursor-pointer flex-1">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => onToggle(node.handle)}
            className="w-4 h-4 rounded text-[#f30d29]"
          />
          <span className={`text-sm ${depth === 0 ? 'font-bold text-gray-900' : depth === 1 ? 'font-semibold text-gray-700' : 'text-gray-600'}`}>
            {node.label}
          </span>
          {hasSelectedDescendant && !isChecked && (
            <span className="text-xs text-blue-500">●</span>
          )}
        </label>
      </div>
      {hasChildren && expanded && (
        <div>
          {node.children!.map(child => (
            <TreeNode key={child.handle} node={child} selected={selected} onToggle={onToggle} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

interface CategoryPickerProps {
  selected: string[];
  onChange: (collections: string[]) => void;
}

export default function CategoryPicker({ selected, onChange }: CategoryPickerProps) {
  const selectedSet = new Set(selected);

  const handleToggle = (handle: string) => {
    const next = new Set(selected);
    if (next.has(handle)) {
      next.delete(handle);
    } else {
      next.add(handle);
    }
    // Recalculate all tags including ancestors
    onChange(getCollectionTagsFromSelected(Array.from(next)));
  };

  const selectedCount = selected.length;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Danh mục sản phẩm</h2>
        <span className="text-sm text-gray-500">{selectedCount} danh mục đã chọn</span>
      </div>
      <div className="max-h-[400px] overflow-y-auto border rounded p-2 bg-gray-50">
        {categoryTree.map(node => (
          <TreeNode key={node.handle} node={node} selected={selectedSet} onToggle={handleToggle} depth={0} />
        ))}
      </div>
      {selectedCount > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {selected.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 text-xs rounded-full border border-red-200">
              {tag}
              <button type="button" onClick={() => {
                const next = selected.filter(s => s !== tag);
                onChange(next);
              }} className="hover:text-red-900">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
