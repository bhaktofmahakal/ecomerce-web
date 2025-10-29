/**
 * Simple API Key authentication for admin routes
 * In production, use proper OAuth2, JWT, or session-based auth
 */

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'admin-secret-key-2024';

/**
 * Verify admin API key
 */
export function verifyAdminKey(apiKey: string | null | undefined): boolean {
  if (!apiKey) return false;
  return apiKey === ADMIN_API_KEY;
}

/**
 * Extract API key from request headers
 */
export function getApiKeyFromRequest(headers: Headers): string | null {
  const authHeader = headers.get('x-api-key');
  if (authHeader) return authHeader;

  const authBearer = headers.get('authorization');
  if (authBearer?.startsWith('Bearer ')) {
    return authBearer.slice(7);
  }

  return null;
}