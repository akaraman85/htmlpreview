import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

const SALT_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;
const DIGEST = "sha256";

/**
 * Hashes a passphrase using PBKDF2
 * Returns a string in format: salt:hash (both hex encoded)
 */
export function hashPassphrase(passphrase: string): string {
  const salt = randomBytes(SALT_LENGTH);
  const hash = pbkdf2Sync(
    passphrase,
    salt,
    ITERATIONS,
    KEY_LENGTH,
    DIGEST,
  );
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

/**
 * Verifies a passphrase against a stored hash
 * Hash format: salt:hash (both hex encoded)
 */
export function verifyPassphrase(
  passphrase: string,
  storedHash: string,
): boolean {
  const [saltHex, hashHex] = storedHash.split(":");
  if (!saltHex || !hashHex) {
    return false;
  }

  const salt = Buffer.from(saltHex, "hex");
  const expectedHash = Buffer.from(hashHex, "hex");

  const computedHash = pbkdf2Sync(
    passphrase,
    salt,
    ITERATIONS,
    KEY_LENGTH,
    DIGEST,
  );

  if (expectedHash.length !== computedHash.length) {
    return false;
  }

  return timingSafeEqual(expectedHash, computedHash);
}
