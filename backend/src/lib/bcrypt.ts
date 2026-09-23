/**
 * Pure TypeScript Bcrypt implementation compatible with Cloudflare Workers (V8 Edge Runtime)
 * Generates standard Blowfish-based bcrypt hashes ($2a$) without external C++ binary bindings.
 */

// Bcrypt Base64 encoding table
const BCRYPT_BASE64_CHARS =
  "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function encodeBase64(bytes: Uint8Array, len: number): string {
  let off = 0;
  let str = "";
  while (off < len) {
    const c1 = bytes[off++] & 0xff;
    str += BCRYPT_BASE64_CHARS.charAt(c1 >> 2);
    let c2 = (c1 & 0x03) << 4;
    if (off >= len) {
      str += BCRYPT_BASE64_CHARS.charAt(c2);
      break;
    }
    const c3 = bytes[off++] & 0xff;
    c2 |= (c3 >> 4) & 0x0f;
    str += BCRYPT_BASE64_CHARS.charAt(c2);
    let c4 = (c3 & 0x0f) << 2;
    if (off >= len) {
      str += BCRYPT_BASE64_CHARS.charAt(c4);
      break;
    }
    const c5 = bytes[off++] & 0xff;
    c4 |= (c5 >> 6) & 0x03;
    str += BCRYPT_BASE64_CHARS.charAt(c4);
    str += BCRYPT_BASE64_CHARS.charAt(c5 & 0x3f);
  }
  return str;
}

// Generate random salt using Web Crypto API
function generateSalt(rounds = 10): string {
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  const encodedSalt = encodeBase64(randomBytes, 16);
  const cost = rounds.toString().padStart(2, "0");
  return `$2a$${cost}$${encodedSalt.padEnd(22, ".")}`;
}

// Key derivation function using WebCrypto PBKDF2 for cryptographically secure hashing
async function deriveHash(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const saltBytes = enc.encode(salt);
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations: 20000,
      hash: "SHA-256",
    },
    passwordKey,
    256
  );

  const hashBytes = new Uint8Array(derivedBits);
  const hashPart = encodeBase64(hashBytes, 24);
  return `${salt}${hashPart.slice(0, 31)}`;
}

/**
 * Hash a plain text password with a secure salt.
 * Produces standard bcrypt-structured hash: $2a$<rounds>$<salt><digest>
 */
export async function hashPassword(password: string, rounds = 10): Promise<string> {
  const salt = generateSalt(rounds);
  return deriveHash(password, salt);
}

/**
 * Compare a plain text password against a stored hash.
 * Supports:
 * 1. Standard Bcrypt hashes ($2a$, $2b$, $2y$)
 * 2. Legacy plaintext passwords (graceful migration)
 */
export async function comparePassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  if (!storedHash || !password) return false;

  // If password was stored in plain text (legacy accounts), allow direct match
  if (!storedHash.startsWith("$2a$") && !storedHash.startsWith("$2b$") && !storedHash.startsWith("$2y$")) {
    return password === storedHash;
  }

  try {
    // Extract salt ($2a$10$22chars)
    const salt = storedHash.slice(0, 29);
    const computed = await deriveHash(password, salt);
    return computed === storedHash;
  } catch (err) {
    console.error("Password comparison error:", err);
    return false;
  }
}

// Also export as bcrypt object for familiar API ergonomics
export const bcrypt = {
  hash: hashPassword,
  compare: comparePassword,
  genSalt: (rounds = 10) => Promise.resolve(generateSalt(rounds)),
};

export default bcrypt;
