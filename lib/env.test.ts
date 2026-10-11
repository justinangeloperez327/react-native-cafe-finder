import { afterEach, describe, expect, it } from 'vitest';
import { apiBaseUrl } from './env';
const original = process.env.EXPO_PUBLIC_API_BASE_URL;
afterEach(() => { if (original === undefined) delete process.env.EXPO_PUBLIC_API_BASE_URL; else process.env.EXPO_PUBLIC_API_BASE_URL = original; });
describe('API environment validation', () => {
  it('requires an API URL', () => { delete process.env.EXPO_PUBLIC_API_BASE_URL; expect(apiBaseUrl).toThrow(); });
  it('accepts HTTPS and removes trailing slash', () => { process.env.EXPO_PUBLIC_API_BASE_URL = 'https://example.com/'; expect(apiBaseUrl()).toBe('https://example.com'); });
  it('rejects insecure remote HTTP', () => { process.env.EXPO_PUBLIC_API_BASE_URL = 'http://example.com'; expect(apiBaseUrl).toThrow(); });
  it('allows local development', () => { process.env.EXPO_PUBLIC_API_BASE_URL = 'http://localhost:3000'; expect(apiBaseUrl()).toBe('http://localhost:3000'); });
});
