import type { Cafe, CafeDetails, Coordinates } from '@/types/cafe';
import { apiBaseUrl } from '@/lib/env';
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
  const data = await requestJson<{ cafes: Cafe[] }>(`${apiBaseUrl()}/api/places/nearby?lat=${encodeURIComponent(location.latitude)}&lng=${encodeURIComponent(location.longitude)}`, signal);
  if (!Array.isArray(data?.cafes)) throw new Error('Unexpected café search response.');
  return data.cafes;
}
export async function getCafeDetails(id: string, signal?: AbortSignal): Promise<CafeDetails> {
  const data = await requestJson<{ cafe: CafeDetails }>(`${apiBaseUrl()}/api/places/details?id=${encodeURIComponent(id)}`, signal);
  if (!data?.cafe || typeof data.cafe.id !== 'string' || typeof data.cafe.name !== 'string' || !Array.isArray(data.cafe.photos)) throw new Error('Unexpected café details response.');
  return data.cafe;
}
export function cafePhotoUrl(name: string, width = 720): string {
  return `${apiBaseUrl()}/api/places/photo?name=${encodeURIComponent(name)}&width=${width}`;
}
