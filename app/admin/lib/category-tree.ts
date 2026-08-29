import { navigation } from '@/app/lib/data/navigation';
import type { NavItem } from '@/app/lib/types';

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

export const ADMIN_CATEGORIES_STORAGE_KEY = 'li-ning-admin-categories';
export const ADMIN_CATEGORIES_EVENT = 'li-ning-admin-categories-updated';

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

const defaultAdminCategoryTree: AdminCategoryNode[] = navigation
  .map((item) => toCategoryNode(item))
  .filter((item): item is AdminCategoryNode => Boolean(item));

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

export function buildAdminCategoryTree(customCategories: StoredAdminCategory[] = []) {
  const tree = defaultAdminCategoryTree.map((node) => cloneCategoryNode(node));
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
