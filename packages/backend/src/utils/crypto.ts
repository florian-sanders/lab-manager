import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

/**
 * Hash a password using Node.js native crypto (scrypt)
 * @param password - The plain text password to hash
 * @returns Promise<string> - The hashed password with salt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(32);
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt.toString('hex')}:${derivedKey.toString('hex')}`;
}

/**
 * Compare a plain text password with a hashed password
 * @param password - The plain text password
 * @param hashedPassword - The hashed password (salt:hash format)
 * @returns Promise<boolean> - True if passwords match
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  const [saltHex, hashHex] = hashedPassword.split(':');
  
  if (!saltHex || !hashHex) {
    return false;
  }
  
  const salt = Buffer.from(saltHex, 'hex');
  const hash = Buffer.from(hashHex, 'hex');
  
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  
  return timingSafeEqual(hash, derivedKey);
}