import { verifyAdminKey, getApiKeyFromRequest } from '@/lib/auth';

describe('Authentication Library', () => {
  describe('verifyAdminKey', () => {
    it('should return true for valid admin key', () => {
      process.env.ADMIN_API_KEY = 'admin-secret-key-2024';
      const result = verifyAdminKey('admin-secret-key-2024');
      expect(result).toBe(true);
    });

    it('should return false for invalid key', () => {
      process.env.ADMIN_API_KEY = 'admin-secret-key-2024';
      const result = verifyAdminKey('wrong-key');
      expect(result).toBe(false);
    });

    it('should return false for null key', () => {
      const result = verifyAdminKey(null);
      expect(result).toBe(false);
    });

    it('should return false for undefined key', () => {
      const result = verifyAdminKey(undefined);
      expect(result).toBe(false);
    });

    it('should return false for empty string', () => {
      const result = verifyAdminKey('');
      expect(result).toBe(false);
    });

    it('should use default key when ADMIN_API_KEY is not set', () => {
      delete process.env.ADMIN_API_KEY;
      const result = verifyAdminKey('admin-secret-key-2024');
      expect(result).toBe(true);
    });
  });

  describe('getApiKeyFromRequest', () => {
    it('should extract API key from x-api-key header', () => {
      const headers = new Headers({
        'x-api-key': 'test-api-key',
      });
      const key = getApiKeyFromRequest(headers);
      expect(key).toBe('test-api-key');
    });

    it('should extract API key from Authorization Bearer header', () => {
      const headers = new Headers({
        authorization: 'Bearer test-bearer-key',
      });
      const key = getApiKeyFromRequest(headers);
      expect(key).toBe('test-bearer-key');
    });

    it('should prefer x-api-key over Authorization header', () => {
      const headers = new Headers({
        'x-api-key': 'api-key',
        authorization: 'Bearer bearer-key',
      });
      const key = getApiKeyFromRequest(headers);
      expect(key).toBe('api-key');
    });

    it('should return null if no API key is found', () => {
      const headers = new Headers({
        'content-type': 'application/json',
      });
      const key = getApiKeyFromRequest(headers);
      expect(key).toBeNull();
    });

    it('should ignore Authorization header without Bearer prefix', () => {
      const headers = new Headers({
        authorization: 'Basic credentials',
      });
      const key = getApiKeyFromRequest(headers);
      expect(key).toBeNull();
    });
  });
});