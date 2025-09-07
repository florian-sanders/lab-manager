import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from './crypto.js';

describe('crypto utils', () => {
  describe('hashPassword', () => {
    it('should hash a password and return salt:hash format', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);

      expect(hash).toMatch(/^[a-f0-9]{64}:[a-f0-9]{128}$/);
      expect(hash.split(':')).toHaveLength(2);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'testPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);

      const isValid = await comparePassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword456';
      const hash = await hashPassword(password);

      const isValid = await comparePassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });

    it('should return false for malformed hash', async () => {
      const password = 'testPassword123';
      const malformedHash = 'invalidhash';

      const isValid = await comparePassword(password, malformedHash);
      expect(isValid).toBe(false);
    });

    it('should return false for hash missing colon separator', async () => {
      const password = 'testPassword123';
      const hashWithoutColon = 'abcdef1234567890';

      const isValid = await comparePassword(password, hashWithoutColon);
      expect(isValid).toBe(false);
    });
  });
});