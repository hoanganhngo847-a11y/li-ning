import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { GenerateModelImageInput } from './types';

export interface CachedImageEntry {
  imageUrl?: string;
  imageBase64?: string;
  mimeType: string;
  promptUsed: string;
  createdAt: string;
  metadata?: {
    model: string;
    aspectRatio?: string;
    gender: string;
  };
}

const CACHE_FILE_PATH = path.join(process.cwd(), 'data', 'gemini-image-cache.json');

// In-memory fallback / L1 cache
const memoryCache = new Map<string, CachedImageEntry>();

/**
 * Generate a deterministic hash key from body profile and garment selections
 */
export function getImageCacheKey(input: GenerateModelImageInput): string {
  const normalized = {
    gender: (input.gender || 'nam').toLowerCase(),
    height: Math.round(Number(input.heightCm) || 175),
    weight: Math.round(Number(input.weightKg) || 68),
    bust: Math.round(Number(input.bustCm) || 96),
    waist: Math.round(Number(input.waistCm) || 78),
    hips: Math.round(Number(input.hipsCm) || 95),
    skinTone: (input.skinTone || 'medium_asian').toLowerCase(),
    top: (input.selectedTop?.title || input.selectedTop?.description || '').trim().toLowerCase(),
    bottom: (input.selectedBottom?.title || input.selectedBottom?.description || '').trim().toLowerCase(),
    shoes: (input.selectedShoes?.title || input.selectedShoes?.description || '').trim().toLowerCase(),
    outfit: (input.selectedOutfitName || '').trim().toLowerCase(),
  };

  const payload = JSON.stringify(normalized);
  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Reads all cached items from JSON disk storage
 */
function readDiskCache(): Record<string, CachedImageEntry> {
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const content = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
      return JSON.parse(content) as Record<string, CachedImageEntry>;
    }
  } catch (err) {
    console.error('Error reading Gemini image cache file:', err);
  }
  return {};
}

/**
 * Retrieves a cached image entry if available
 */
export function getCachedImage(key: string): CachedImageEntry | null {
  // Check L1 memory
  if (memoryCache.has(key)) {
    return memoryCache.get(key)!;
  }

  // Check L2 disk
  const disk = readDiskCache();
  if (disk[key]) {
    memoryCache.set(key, disk[key]);
    return disk[key];
  }

  return null;
}

/**
 * Persists an image entry into memory and disk cache
 */
export function setCachedImage(key: string, entry: CachedImageEntry): void {
  // L1 memory
  memoryCache.set(key, entry);

  // L2 disk
  try {
    const dataDir = path.dirname(CACHE_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const disk = readDiskCache();
    disk[key] = entry;

    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(disk, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to Gemini image cache file:', err);
  }
}
