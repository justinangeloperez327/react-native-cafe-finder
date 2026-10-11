export function apiBaseUrl(): string {
  const value = process.env.EXPO_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, '');
  if (!value) throw new Error('EXPO_PUBLIC_API_BASE_URL is required. Configure it in .env.');
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && !(url.protocol === 'http:' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1'))) throw new Error('Invalid protocol');
    if (url.username || url.password || url.search || url.hash) throw new Error('Invalid URL components');
    return value;
  } catch { throw new Error('EXPO_PUBLIC_API_BASE_URL must be an HTTPS URL (or HTTP localhost for development).'); }
}
