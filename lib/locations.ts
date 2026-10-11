import type { Coordinates } from '@/types/cafe';
export type LocationSuggestion = { id: string; label: string };
function base(): string {
  const url = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
  if (!url) throw new Error('Configure EXPO_PUBLIC_API_BASE_URL to search locations.');
  return url;
}
async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  const body: unknown = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body && typeof body === 'object' && 'error' in body && typeof body.error === 'string' ? body.error : 'Location search failed.');
  return body as T;
}
export async function getLocationSuggestions(query: string, signal?: AbortSignal): Promise<LocationSuggestion[]> {
  const result = await getJson<{ suggestions: LocationSuggestion[] }>(`${base()}/api/places/suggest?q=${encodeURIComponent(query)}`, signal);
  if (!Array.isArray(result.suggestions)) throw new Error('Unexpected location suggestions.');
  return result.suggestions;
}
export async function resolveLocation(id: string, signal?: AbortSignal): Promise<{ location: Coordinates; label: string }> {
  const result = await getJson<{ location: Coordinates; label: string }>(`${base()}/api/places/resolve?id=${encodeURIComponent(id)}`, signal);
  if (!Number.isFinite(result.location?.latitude) || !Number.isFinite(result.location?.longitude)) throw new Error('Invalid location coordinates.');
  return result;
}
