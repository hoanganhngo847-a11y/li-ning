/**
 * Production-Safe Secret Encryption using Node.js crypto (AES-256-GCM)
 * Strictly server-side! Never import in client components.
 */
import { randomBytes, createCipheriv, createDecipheriv, createHash } from 'crypto';

// Derive 32-byte encryption key from API_KEYS_ENCRYPTION_SECRET
function getEncryptionKey(): Buffer {
  const secret = process.env.API_KEYS_ENCRYPTION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        '[SECURITY WARNING] API_KEYS_ENCRYPTION_SECRET is not set in production! Using derived fallback key.'
      );
    }
    return createHash('sha256')
      .update('lining-production-default-encryption-secret-key-32b')
      .digest();
  }
  return createHash('sha256').update(secret).digest();
}

/**
 * Encrypts a plaintext secret string using AES-256-GCM.
 * Output format: "ivHex:authTagHex:encryptedHex"
 */
export function encryptSecret(plaintext: string): string {
  if (!plaintext || typeof plaintext !== 'string') {
    throw new Error('ENCRYPTION_ERROR: Plaintext must be a non-empty string');
  }

  const key = getEncryptionKey();
  const iv = randomBytes(12); // Standard 96-bit IV for GCM
  const cipher = createCipheriv('aes-256-gcm', key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag(); // 128-bit auth tag

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Decrypts an encrypted payload formatted as "ivHex:authTagHex:encryptedHex"
 */
export function decryptSecret(encryptedPayload: string): string {
  if (!encryptedPayload || typeof encryptedPayload !== 'string') {
    throw new Error('DECRYPTION_ERROR: Invalid encrypted payload');
  }

  const parts = encryptedPayload.split(':');
  if (parts.length !== 3) {
    throw new Error(
      'DECRYPTION_ERROR: Invalid payload structure (expected iv:authTag:ciphertext)'
    );
  }

  const [ivHex, authTagHex, encryptedHex] = parts;
  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');

  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}

/**
 * Returns a masked representation of the key showing only the last 4 characters.
 * E.g. "••••••••••••847a"
 */
export function maskSecret(secretOrLastFour: string): string {
  if (!secretOrLastFour) return '';
  const clean = secretOrLastFour.trim();
  const lastFour = clean.length <= 4 ? clean : clean.slice(-4);
  return `••••••••••••${lastFour}`;
}
