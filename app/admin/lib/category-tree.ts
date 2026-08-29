import { navigation } from '@/app/lib/data/navigation';
import type { NavItem } from '@/app/lib/types';

export interface AdminCategoryNode {
  handle: string;
  title: string;
  href: string;
  parentHandles: string[];
  parentTitles: string[];
  children: AdminCategoryNode[];
}

function getCollectionHandle(href: string) {
  return href.startsWith('/collections/') ? href.replace('/collections/', '') : null;
}

function toCategoryNode(item: NavItem, ancestors: AdminCategoryNode[] = []): AdminCategoryNode | null {
  const handle = getCollectionHandle(item.href);
  if (!handle) return null;

  const node: AdminCategoryNode = {
    handle,
    title: item.title,
    href: item.href,
    parentHandles: ancestors.map((ancestor) => ancestor.handle),
    parentTitles: ancestors.map((ancestor) => ancestor.title),
    children: [],
  };

  node.children = (item.children || [])
    .map((child) => toCategoryNode(child, [...ancestors, node]))
    .filter((child): child is AdminCategoryNode => Boolean(child));

  return node;
}

export const adminCategoryTree: AdminCategoryNode[] = navigation
  .map((item) => toCategoryNode(item))
  .filter((item): item is AdminCategoryNode => Boolean(item));

export function flattenCategories(nodes: AdminCategoryNode[] = adminCategoryTree): AdminCategoryNode[] {
  return nodes.flatMap((node) => [node, ...flattenCategories(node.children)]);
}

export const allAdminCategories = flattenCategories();

export function getCategoryNode(handle: string) {
  return allAdminCategories.find((category) => category.handle === handle) || null;
}

export function getCategoryPath(handle: string) {
  const category = getCategoryNode(handle);
  if (!category) return handle;
  return [...category.parentTitles, category.title].join(' / ');
}

export function getLeafCategories(node: AdminCategoryNode): AdminCategoryNode[] {
  if (node.children.length === 0) return [node];
  return node.children.flatMap((child) => getLeafCategories(child));
}

export function getAllLeafCategories() {
  return adminCategoryTree.flatMap((category) => getLeafCategories(category));
}

export function getFirstLeaf(node: AdminCategoryNode) {
  return getLeafCategories(node)[0] || node;
}

export function getCollectionTagsFromSelected(selectedHandles: string[]) {
  const tags = new Set<string>();

  selectedHandles.forEach((handle) => {
    const category = getCategoryNode(handle);
    if (!category) {
      tags.add(handle);
      return;
    }

    category.parentHandles.forEach((parentHandle) => tags.add(parentHandle));
    tags.add(category.handle);
  });

  return Array.from(tags);
}

export function getSelectedLeafHandles(selectedHandles: string[]) {
  const selected = new Set(selectedHandles);
  return getAllLeafCategories()
    .filter((category) => selected.has(category.handle))
    .map((category) => category.handle);
}

export function getPrimaryLeafHandle(collectionHandles: string[]) {
  const selected = new Set(collectionHandles);
  const leaf = getAllLeafCategories().find((category) => selected.has(category.handle));
  return leaf?.handle || collectionHandles[0] || adminCategoryTree[0]?.handle || '';
}
