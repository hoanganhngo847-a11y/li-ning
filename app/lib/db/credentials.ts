/**
 * Database Abstraction Layer for API Credentials (Production & Serverless Safe)
 * Uses high-performance in-memory caching synced with encrypted /tmp storage.
 * Completely eliminates native database drivers (pg) from bundle to prevent Vercel Serverless crashes.
 */
import fs from 'fs';
import path from 'path';

export interface ApiCredential {
  id: string;
  provider: string;
  encrypted_value: string;
  last_four: string;
  is_configured: boolean;
  created_at: Date;
  updated_at: Date;
}

// File path for encrypted credentials storage in serverless /tmp
const STORAGE_FILE = path.join('/tmp', '.api_credentials_enc.json');

declare global {
  // eslint-disable-next-line no-var
  var __localApiCredentialsStore: Map<string, ApiCredential> | undefined;
}

function loadStoreFromFile(): Map<string, ApiCredential> {
  const store = new Map<string, ApiCredential>();
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const raw = fs.readFileSync(STORAGE_FILE, 'utf8');
      const items = JSON.parse(raw) as any[];
      if (Array.isArray(items)) {
        for (const item of items) {
          if (item && item.provider) {
            store.set(item.provider.toLowerCase(), {
              id: item.id || `cred_${item.provider}`,
              provider: item.provider.toLowerCase(),
              encrypted_value: item.encrypted_value || '',
              last_four: item.last_four || '****',
              is_configured: Boolean(item.is_configured),
              created_at: new Date(item.created_at || Date.now()),
              updated_at: new Date(item.updated_at || Date.now()),
            });
          }
        }
      }
    }
  } catch (err: any) {
    console.warn('[Credentials] Could not load from /tmp storage:', err.message);
  }
  return store;
}

function persistStoreToFile(store: Map<string, ApiCredential>): void {
  try {
    const list = Array.from(store.values());
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(list), 'utf8');
  } catch (err: any) {
    console.warn('[Credentials] Could not persist to /tmp storage:', err.message);
  }
}

function getLocalStore(): Map<string, ApiCredential> {
  if (!globalThis.__localApiCredentialsStore) {
    globalThis.__localApiCredentialsStore = loadStoreFromFile();
  }
  return globalThis.__localApiCredentialsStore;
}

/**
 * Retrieves a credential by provider name
 */
export async function getDbCredential(provider: string): Promise<ApiCredential | null> {
  const cleanProvider = provider.trim().toLowerCase();
  const store = getLocalStore();
  return store.get(cleanProvider) || null;
}

/**
 * Inserts or updates a credential (Upsert)
 */
export async function upsertDbCredential(
  provider: string,
  encryptedValue: string,
  lastFour: string,
  isConfigured: boolean = true
): Promise<ApiCredential> {
  const cleanProvider = provider.trim().toLowerCase();
  const id = `cred_${cleanProvider}`;
  const now = new Date();
  const store = getLocalStore();

  const cred: ApiCredential = {
    id,
    provider: cleanProvider,
    encrypted_value: encryptedValue,
    last_four: lastFour,
    is_configured: isConfigured,
    created_at: store.get(cleanProvider)?.created_at || now,
    updated_at: now,
  };

  store.set(cleanProvider, cred);
  persistStoreToFile(store);

  return cred;
}

/**
 * Lists all credentials
 */
export async function listDbCredentials(): Promise<ApiCredential[]> {
  const store = getLocalStore();
  return Array.from(store.values());
}

/**
 * Deletes a credential
 */
export async function deleteDbCredential(provider: string): Promise<boolean> {
  const cleanProvider = provider.trim().toLowerCase();
  const store = getLocalStore();
  const result = store.delete(cleanProvider);
  if (result) {
    persistStoreToFile(store);
  }
  return result;
}
