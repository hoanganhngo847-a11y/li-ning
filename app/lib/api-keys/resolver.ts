/**
 * Central API Key Resolver
 * Strictly server-side! Never import in client components.
 */
import { getDbCredential } from '../db/credentials';
import { decryptSecret, maskSecret } from '../crypto/secret-encryption';

export type ApiProvider = 'gemini' | 'fitroom' | 'tripo' | 'cloudflare' | 'alibaba';

export const ENV_FALLBACK_MAP: Record<ApiProvider, string> = {
  gemini: 'GEMINI_API_KEY',
  fitroom: 'FITROOM_API_KEY',
  tripo: 'TRIPO_API_KEY',
  cloudflare: 'CLOUDFLARE_API_TOKEN',
  alibaba: 'ALIBABA_API_KEY',
};

/**
 * Resolves the API key for a given provider:
 * 1. Try database credential first.
 * 2. Decrypt server-side.
 * 3. Fallback to server environment variable.
 */
export async function getProviderApiKey(provider: string): Promise<string | null> {
  const cleanProvider = provider.trim().toLowerCase() as ApiProvider;

  // 1. Check Database
  try {
    const cred = await getDbCredential(cleanProvider);
    if (cred && cred.is_configured && cred.encrypted_value) {
      const decrypted = decryptSecret(cred.encrypted_value);
      if (decrypted && decrypted.trim()) {
        return decrypted.trim();
      }
    }
  } catch (err: any) {
    console.error(`[KeyResolver] Failed to read/decrypt DB credential for ${cleanProvider}:`, err.message);
  }

  // 2. Fallback to process.env
  const envVarName = ENV_FALLBACK_MAP[cleanProvider];
  if (envVarName) {
    const envVal = process.env[envVarName];
    if (envVal && envVal.trim()) {
      return envVal.trim();
    }
  }

  return null;
}

/**
 * Resolves Cloudflare Account ID:
 * 1. Check database credential (provider = 'cloudflare_account_id')
 * 2. Fallback to process.env.CLOUDFLARE_ACCOUNT_ID
 */
export async function getCloudflareAccountId(): Promise<string | null> {
  try {
    const cred = await getDbCredential('cloudflare_account_id');
    if (cred && cred.is_configured && cred.encrypted_value) {
      const decrypted = decryptSecret(cred.encrypted_value);
      if (decrypted && decrypted.trim()) {
        return decrypted.trim();
      }
    }
  } catch (err: any) {
    console.error('[KeyResolver] Failed to read DB cloudflare_account_id:', err.message);
  }

  const envVal = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (envVal && envVal.trim()) {
    return envVal.trim();
  }

  return null;
}

export interface ProviderStatusInfo {
  provider: ApiProvider;
  name: string;
  configured: boolean;
  maskedKey: string;
  source: 'database' | 'environment' | 'none';
  updatedAt: string | null;
  hasAccountId?: boolean;
  maskedAccountId?: string;
}

/**
 * Returns metadata and masked keys for admin dashboard (NEVER returns raw keys)
 */
export async function getAdminProviderStatuses(): Promise<ProviderStatusInfo[]> {
  const providers: { id: ApiProvider; name: string }[] = [
    { id: 'gemini', name: 'Google Gemini Image AI' },
    { id: 'fitroom', name: 'FitRoom Virtual Try-On' },
    { id: 'tripo', name: 'Tripo 3D Model Studio' },
    { id: 'cloudflare', name: 'Cloudflare Workers AI' },
    { id: 'alibaba', name: 'Alibaba Cloud Model Studio' },
  ];

  const results: ProviderStatusInfo[] = [];

  for (const p of providers) {
    let configured = false;
    let maskedKey = '';
    let source: 'database' | 'environment' | 'none' = 'none';
    let updatedAt: string | null = null;
    let hasAccountId: boolean | undefined = undefined;
    let maskedAccountId: string | undefined = undefined;

    try {
      const cred = await getDbCredential(p.id);
      if (cred && cred.is_configured) {
        configured = true;
        maskedKey = maskSecret(cred.last_four);
        source = 'database';
        updatedAt = cred.updated_at.toISOString();
      }
    } catch {}

    if (!configured) {
      const envName = ENV_FALLBACK_MAP[p.id];
      const envVal = envName ? process.env[envName] : null;
      if (envVal && envVal.trim()) {
        configured = true;
        maskedKey = maskSecret(envVal.trim().slice(-4));
        source = 'environment';
      }
    }

    if (p.id === 'cloudflare') {
      const accId = await getCloudflareAccountId();
      if (accId && accId.trim()) {
        hasAccountId = true;
        maskedAccountId = maskSecret(accId.trim().slice(-4));
      } else {
        hasAccountId = false;
        maskedAccountId = '';
      }
    }

    results.push({
      provider: p.id,
      name: p.name,
      configured,
      maskedKey,
      source,
      updatedAt,
      hasAccountId,
      maskedAccountId,
    });
  }

  return results;
}
