/**
 * Database Abstraction Layer for API Credentials (PostgreSQL / Vercel Serverless)
 * Supports Neon, Supabase, Vercel Postgres, AWS RDS via DATABASE_URL / POSTGRES_URL.
 * Gracefully provides local development fallback when no database connection string is provided.
 */
// Lazy-loaded database driver for Serverless safety
export interface ApiCredential {
  id: string;
  provider: string;
  encrypted_value: string;
  last_four: string;
  is_configured: boolean;
  created_at: Date;
  updated_at: Date;
}

let pool: any = null;
let isTableInitialized = false;

function getDbUrl(): string | null {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    null
  );
}

async function getPool(): Promise<any> {
  const dbUrl = getDbUrl();
  if (!dbUrl) return null;

  if (!pool) {
    try {
      const { Pool } = await import('pg');
      const isLocalhost = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');
      pool = new Pool({
        connectionString: dbUrl,
        ssl: isLocalhost ? false : { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
    } catch (err: any) {
      console.warn('[DB Init Error] Could not load pg driver:', err.message);
      return null;
    }
  }
  return pool;
}

/**
 * Initializes table schema if not already present in PostgreSQL
 */
async function ensureSchema(p: any): Promise<void> {
  if (isTableInitialized) return;

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS api_credentials (
      id VARCHAR(64) PRIMARY KEY,
      provider VARCHAR(64) UNIQUE NOT NULL,
      encrypted_value TEXT NOT NULL,
      last_four VARCHAR(16) NOT NULL,
      is_configured BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_api_credentials_provider ON api_credentials(provider);
  `;

  try {
    await p.query(createTableQuery);
    isTableInitialized = true;
  } catch (err: any) {
    console.error('[DB Init Error] Could not initialize api_credentials table:', err.message);
  }
}

// Local fallback in-memory store for local development without active PostgreSQL URL
declare global {
  // eslint-disable-next-line no-var
  var __localApiCredentialsStore: Map<string, ApiCredential> | undefined;
}

function getLocalStore(): Map<string, ApiCredential> {
  if (!globalThis.__localApiCredentialsStore) {
    globalThis.__localApiCredentialsStore = new Map<string, ApiCredential>();
  }
  return globalThis.__localApiCredentialsStore;
}

/**
 * Retrieves a credential by provider name from Database or local fallback
 */
export async function getDbCredential(provider: string): Promise<ApiCredential | null> {
  const cleanProvider = provider.trim().toLowerCase();
  const p = await getPool();

  if (p) {
    try {
      await ensureSchema(p);
      const res = await p.query(
        'SELECT id, provider, encrypted_value, last_four, is_configured, created_at, updated_at FROM api_credentials WHERE provider = $1 LIMIT 1',
        [cleanProvider]
      );
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          id: row.id,
          provider: row.provider,
          encrypted_value: row.encrypted_value,
          last_four: row.last_four,
          is_configured: Boolean(row.is_configured),
          created_at: new Date(row.created_at),
          updated_at: new Date(row.updated_at),
        };
      }
      return null;
    } catch (err: any) {
      console.error(`[DB Error] getDbCredential failed for ${cleanProvider}:`, err.message);
      // Fallback to local store on DB error
    }
  }

  const local = getLocalStore().get(cleanProvider);
  return local || null;
}

/**
 * Inserts or updates a credential in the database (Upsert)
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
  const p = await getPool();

  if (p) {
    try {
      await ensureSchema(p);
      const upsertQuery = `
        INSERT INTO api_credentials (id, provider, encrypted_value, last_four, is_configured, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (provider) DO UPDATE SET
          encrypted_value = EXCLUDED.encrypted_value,
          last_four = EXCLUDED.last_four,
          is_configured = EXCLUDED.is_configured,
          updated_at = EXCLUDED.updated_at
        RETURNING id, provider, encrypted_value, last_four, is_configured, created_at, updated_at;
      `;

      const res = await p.query(upsertQuery, [
        id,
        cleanProvider,
        encryptedValue,
        lastFour,
        isConfigured,
        now,
        now,
      ]);

      if (res.rows.length > 0) {
        const row = res.rows[0];
        const cred: ApiCredential = {
          id: row.id,
          provider: row.provider,
          encrypted_value: row.encrypted_value,
          last_four: row.last_four,
          is_configured: Boolean(row.is_configured),
          created_at: new Date(row.created_at),
          updated_at: new Date(row.updated_at),
        };
        // Also keep local store synced
        getLocalStore().set(cleanProvider, cred);
        return cred;
      }
    } catch (err: any) {
      console.error(`[DB Error] upsertDbCredential failed for ${cleanProvider}:`, err.message);
    }
  }

  // Local store upsert
  const cred: ApiCredential = {
    id,
    provider: cleanProvider,
    encrypted_value: encryptedValue,
    last_four: lastFour,
    is_configured: isConfigured,
    created_at: getLocalStore().get(cleanProvider)?.created_at || now,
    updated_at: now,
  };
  getLocalStore().set(cleanProvider, cred);
  return cred;
}

/**
 * Lists all credentials in the database
 */
export async function listDbCredentials(): Promise<ApiCredential[]> {
  const p = await getPool();

  if (p) {
    try {
      await ensureSchema(p);
      const res = await p.query(
        'SELECT id, provider, encrypted_value, last_four, is_configured, created_at, updated_at FROM api_credentials ORDER BY provider ASC'
      );
      return res.rows.map((row: any) => ({
        id: row.id,
        provider: row.provider,
        encrypted_value: row.encrypted_value,
        last_four: row.last_four,
        is_configured: Boolean(row.is_configured),
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at),
      }));
    } catch (err: any) {
      console.error('[DB Error] listDbCredentials failed:', err.message);
    }
  }

  return Array.from(getLocalStore().values());
}

/**
 * Deletes a credential from the database
 */
export async function deleteDbCredential(provider: string): Promise<boolean> {
  const cleanProvider = provider.trim().toLowerCase();
  const p = await getPool();

  if (p) {
    try {
      await ensureSchema(p);
      await p.query('DELETE FROM api_credentials WHERE provider = $1', [cleanProvider]);
      getLocalStore().delete(cleanProvider);
      return true;
    } catch (err: any) {
      console.error(`[DB Error] deleteDbCredential failed for ${cleanProvider}:`, err.message);
    }
  }

  getLocalStore().delete(cleanProvider);
  return true;
}
