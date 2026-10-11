import type { Cafe, CafeDetails, Coordinates } from '@/types/cafe';
function getApiBase(): string {
  const base = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
  if (!base) throw new Error('Set EXPO_PUBLIC_API_BASE_URL in .env to connect café discovery.');
  return base;
}
async function requestJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => ({}));
    const message = body && typeof body === 'object' && 'error' in body && typeof body.error === 'string' ? body.error : `Request failed (${response.status}).`;
    throw new Error(message);
  }
  return await response.json() as T;
}
export async function findNearbyCafes(location: Coordinates, signal?: AbortSignal): Promise<Cafe[]> {
  const data = await requestJson<{ cafes: Cafe[] }>(`${getApiBase()}/api/places/nearby?lat=${encodeURIComponent(location.latitude)}&lng=${encodeURIComponent(location.longitude)}`, signal);
  if (!Array.isArray(data?.cafes)) throw new Error('Unexpected café search response.');
  return data.cafes;
}
export async function getCafeDetails(id: string, signal?: AbortSignal): Promise<CafeDetails> {
  const data = await requestJson<{ cafe: CafeDetails }>(`${getApiBase()}/api/places/details?id=${encodeURIComponent(id)}`, signal);
  if (!data?.cafe || !Array.isArray(data.cafe.photos)) throw new Error('Unexpected café details response.');
  return data.cafe;
}
export function cafePhotoUrl(name: string, width = 720): string {
  return `${getApiBase()}/api/places/photo?name=${encodeURIComponent(name)}&width=${width}`;
}
