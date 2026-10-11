import type { Cafe, Coordinates } from '@/types/cafe';
export async function findNearbyCafes(location: Coordinates, signal?: AbortSignal): Promise<Cafe[]> {
  const base = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
  if (!base) throw new Error('Set EXPO_PUBLIC_API_BASE_URL in .env to connect café discovery.');
  const response = await fetch(`${base}/api/places/nearby?lat=${encodeURIComponent(location.latitude)}&lng=${encodeURIComponent(location.longitude)}`, { signal });
  if (!response.ok) { const payload = await response.json().catch(() => ({})); throw new Error(typeof payload.error === 'string' ? payload.error : `Café search failed (${response.status}).`); }
  const payload: unknown = await response.json();
  if (!payload || typeof payload !== 'object' || !('cafes' in payload) || !Array.isArray(payload.cafes)) throw new Error('Unexpected café search response.');
  return payload.cafes as Cafe[];
}
