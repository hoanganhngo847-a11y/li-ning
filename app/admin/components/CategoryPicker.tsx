'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  adminCategoryTree,
  getAllLeafCategories,
  getCategoryNode,
  getCategoryPath,
  getCollectionTagsFromSelected,
  getFirstLeaf,
  getLeafCategories,
  getPrimaryLeafHandle,
  getSelectedLeafHandles,
  type AdminCategoryNode,
} from '../lib/category-tree';

interface CategoryPickerProps {
  selected: string[];
  onChange: (collections: string[]) => void;
}

function getActiveParent(handle: string) {
  const node = getCategoryNode(handle);
  const rootHandle = node?.parentHandles[0] || node?.handle;
  return adminCategoryTree.find((category) => category.handle === rootHandle) || adminCategoryTree[0];
}

function getActiveGroup(parent: AdminCategoryNode, handle: string) {
  const node = getCategoryNode(handle);
  const groupHandle = node?.parentHandles[1] || (node?.parentHandles[0] === parent.handle ? node.handle : '');
  return parent.children.find((category) => category.handle === groupHandle) || parent.children[0] || parent;
}

export { getCollectionTagsFromSelected };

export default function CategoryPicker({ selected, onChange }: CategoryPickerProps) {
  const selectedLeafHandles = useMemo(() => getSelectedLeafHandles(selected), [selected]);
  const primaryLeafHandle = getPrimaryLeafHandle(selected);
  const [activeParentHandle, setActiveParentHandle] = useState(() => getActiveParent(primaryLeafHandle)?.handle);
  const activeParent = adminCategoryTree.find((category) => category.handle === activeParentHandle) || adminCategoryTree[0];
  const [activeGroupHandle, setActiveGroupHandle] = useState(() => getActiveGroup(activeParent, primaryLeafHandle)?.handle);
  const activeGroup = activeParent.children.find((category) => category.handle === activeGroupHandle) || activeParent.children[0] || activeParent;
  const leafCategories = activeGroup.children.length > 0 ? getLeafCategories(activeGroup) : getLeafCategories(activeParent);
  const selectedLeafSet = new Set(selectedLeafHandles);

  const selectedPaths = selectedLeafHandles.map((handle) => ({
    handle,
    path: getCategoryPath(handle),
  }));

  useEffect(() => {
    if (!primaryLeafHandle) return;
    const nextParent = getActiveParent(primaryLeafHandle);
    const nextGroup = getActiveGroup(nextParent, primaryLeafHandle);
    setActiveParentHandle(nextParent.handle);
    setActiveGroupHandle(nextGroup.handle);
  }, [primaryLeafHandle]);

  const handleParentSelect = (parent: AdminCategoryNode) => {
    setActiveParentHandle(parent.handle);
    const firstChild = parent.children[0] || parent;
    setActiveGroupHandle(firstChild.handle);
  };

  const handleGroupSelect = (group: AdminCategoryNode) => {
    setActiveGroupHandle(group.handle);
  };

  const handleLeafToggle = (leaf: AdminCategoryNode) => {
    const nextLeaves = new Set(selectedLeafHandles);
    if (nextLeaves.has(leaf.handle)) {
      nextLeaves.delete(leaf.handle);
    } else {
      nextLeaves.add(leaf.handle);
    }
    onChange(getCollectionTagsFromSelected(Array.from(nextLeaves)));
  };

  const handleQuickPick = (category: AdminCategoryNode) => {
    const firstLeaf = getFirstLeaf(category);
    handleLeafToggle(firstLeaf);
  };

  const allLeaves = getAllLeafCategories();

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Phân loại danh mục</h2>
          <p className="text-sm text-gray-500">Chọn đúng danh mục con để sản phẩm tự nằm trong các danh mục cha tương ứng.</p>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
          {selectedLeafHandles.length} danh mục con
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_240px_1fr]">
        <div className="rounded-md border border-gray-200">
          <div className="border-b border-gray-200 px-3 py-2 text-xs font-bold uppercase tracking-wide text-gray-500">
            Danh mục cha
          </div>
          <div className="max-h-[360px] overflow-auto p-2">
            {adminCategoryTree.map((parent) => (
              <button
                key={parent.handle}
                type="button"
                onClick={() => handleParentSelect(parent)}
                className={`mb-1 flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition ${
                  activeParent.handle === parent.handle
                    ? 'bg-[#f30d29] font-semibold text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{parent.title}</span>
                <span className={activeParent.handle === parent.handle ? 'text-white/80' : 'text-gray-400'}>
                  {getLeafCategories(parent).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-gray-200">
          <div className="border-b border-gray-200 px-3 py-2 text-xs font-bold uppercase tracking-wide text-gray-500">
            Nhóm danh mục
          </div>
          <div className="max-h-[360px] overflow-auto p-2">
            {(activeParent.children.length > 0 ? activeParent.children : [activeParent]).map((group) => (
              <button
                key={group.handle}
                type="button"
                onClick={() => handleGroupSelect(group)}
                className={`mb-1 flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition ${
                  activeGroup.handle === group.handle
                    ? 'bg-gray-900 font-semibold text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{group.title}</span>
                <span className={activeGroup.handle === group.handle ? 'text-white/70' : 'text-gray-400'}>
                  {getLeafCategories(group).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-gray-200">
          <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Danh mục con</span>
            <button
              type="button"
              onClick={() => handleQuickPick(activeGroup)}
              className="text-xs font-semibold text-[#f30d29] hover:underline"
            >
              Chọn mục đầu
            </button>
          </div>
          <div className="grid max-h-[360px] gap-2 overflow-auto p-3 sm:grid-cols-2">
            {leafCategories.map((leaf) => {
              const checked = selectedLeafSet.has(leaf.handle);
              return (
                <label
                  key={leaf.handle}
                  className={`flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2 transition ${
                    checked
                      ? 'border-[#f30d29] bg-red-50 text-[#f30d29]'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleLeafToggle(leaf)}
                    className="mt-1 h-4 w-4 accent-[#f30d29]"
                  />
                  <span>
                    <span className="block text-sm font-semibold">{leaf.title}</span>
                    <span className="block text-xs text-gray-500">{leaf.handle}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {selectedPaths.length > 0 ? (
        <div className="mt-4 rounded-md bg-gray-50 p-3">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Đang gắn vào sản phẩm</div>
          <div className="flex flex-wrap gap-2">
            {selectedPaths.map(({ handle, path }) => (
              <button
                key={handle}
                type="button"
                onClick={() => {
                  const nextLeaves = selectedLeafHandles.filter((leafHandle) => leafHandle !== handle);
                  onChange(getCollectionTagsFromSelected(nextLeaves));
                }}
                className="rounded-full border border-red-200 bg-white px-3 py-1 text-left text-xs font-medium text-red-700 hover:bg-red-50"
                title="Bấm để bỏ danh mục này"
              >
                {path} x
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-md bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
          Chưa chọn danh mục con nào. Sản phẩm cần ít nhất một danh mục con để hiện đúng trên menu.
        </div>
      )}

      <select
        className="sr-only"
        value={selectedLeafHandles[0] || ''}
        onChange={(event) => onChange(getCollectionTagsFromSelected([event.target.value]))}
        aria-label="Danh mục con"
      >
        <option value="">Chọn danh mục</option>
        {allLeaves.map((leaf) => (
          <option key={leaf.handle} value={leaf.handle}>
            {getCategoryPath(leaf.handle)}
          </option>
        ))}
      </select>
    </section>
  );
}
