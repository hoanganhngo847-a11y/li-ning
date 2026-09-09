import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// In-memory global maps for task deduplication and taskId -> hash mapping
declare global {
  // eslint-disable-next-line no-var
  var __tripoActiveTasks: Map<string, { taskId: string; createdAt: number }> | undefined;
  // eslint-disable-next-line no-var
  var __tripoTaskToHash: Map<string, string> | undefined;
}

function getActiveTasks(): Map<string, { taskId: string; createdAt: number }> {
  if (!globalThis.__tripoActiveTasks) {
    globalThis.__tripoActiveTasks = new Map();
  }
  return globalThis.__tripoActiveTasks;
}

function getTaskToHash(): Map<string, string> {
  if (!globalThis.__tripoTaskToHash) {
    globalThis.__tripoTaskToHash = new Map();
  }
  return globalThis.__tripoTaskToHash;
}

export function computeImageHash(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex').substring(0, 32);
}

const MODELS_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'uploads', 'models');

function ensureModelsDir(): boolean {
  try {
    if (!fs.existsSync(MODELS_DIR)) {
      fs.mkdirSync(MODELS_DIR, { recursive: true });
    }
    return true;
  } catch (err) {
    console.warn('[TripoCache] Cannot create models directory (read-only filesystem):', err);
    return false;
  }
}

// Pre-seeded model mapping for default sample images
const SEED_CACHE_MAP: Record<string, string> = {
  // Default male sample image (step4_after_hd.jpg)
  '207ddcc263221fb07553daa73ea77a5d': '/uploads/models/lining-3d-0b801dbe-e8cf-4480-83fd-e317625881a4.glb',
  // Default female sample images (step4_after_female_hd.webp & jpg)
  '368fb35d83ac45cee17d3e568228bbe3': '/uploads/models/lining-3d-0b801dbe-e8cf-4480-83fd-e317625881a4.glb',
  '27a1d92535fb1961c95536b6fec968b5': '/uploads/models/lining-3d-0b801dbe-e8cf-4480-83fd-e317625881a4.glb',
};

/**
 * Checks if a cached GLB model exists on disk for a given hash or key.
 * Returns the public URL path if found.
 */
export function getCachedGlbUrl(key: string): string | null {
  try {
    // 1. Check pre-seeded model map
    if (SEED_CACHE_MAP[key]) {
      const targetRel = SEED_CACHE_MAP[key];
      const targetAbs = path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', targetRel.replace(/^\//, ''));
      if (fs.existsSync(targetAbs) && fs.statSync(targetAbs).size > 1024) {
        return targetRel;
      }
    }

    // 2. Check dynamic cache on disk
    const filename = `tripo_${key}.glb`;
    const fullPath = path.join(MODELS_DIR, filename);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).size > 1024) {
      return `/uploads/models/${filename}`;
    }
  } catch {}
  return null;
}

/**
 * Saves a GLB buffer to disk cache.
 */
export function saveGlbToCache(key: string, buffer: Buffer): string | null {
  if (!ensureModelsDir()) return null;
  try {
    const filename = `tripo_${key}.glb`;
    const fullPath = path.join(MODELS_DIR, filename);
    fs.writeFileSync(fullPath, buffer);
    return `/uploads/models/${filename}`;
  } catch (err: any) {
    console.warn(`[TripoCache] Failed to save GLB cache for ${key}:`, err.message);
    return null;
  }
}

/**
 * Registers an active task for an image hash to avoid concurrent duplicate requests.
 */
export function registerActiveTask(imageHash: string, taskId: string): void {
  getActiveTasks().set(imageHash, { taskId, createdAt: Date.now() });
  getTaskToHash().set(taskId, imageHash);
}

/**
 * Retrieves an active taskId for an image hash if still fresh (< 10 mins).
 */
export function getActiveTaskId(imageHash: string): string | null {
  const active = getActiveTasks().get(imageHash);
  if (active) {
    if (Date.now() - active.createdAt < 10 * 60 * 1000) {
      return active.taskId;
    }
    getActiveTasks().delete(imageHash);
  }
  return null;
}

/**
 * Resolves imageHash from taskId
 */
export function getImageHashFromTaskId(taskId: string): string | null {
  return getTaskToHash().get(taskId) || null;
}

/**
 * Removes completed or failed task
 */
export function clearActiveTask(taskId: string): void {
  const hash = getTaskToHash().get(taskId);
  if (hash) {
    getActiveTasks().delete(hash);
  }
  getTaskToHash().delete(taskId);
}
