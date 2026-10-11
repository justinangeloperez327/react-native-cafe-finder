import type { Cafe, Coordinates } from '@/types/cafe';

export type SortOption = 'distance' | 'rating' | 'name';
export type CafeFilters = { query: string; minimumRating: number; openNow: boolean; maxDistanceKm: number; sort: SortOption };
export const defaultCafeFilters: CafeFilters = { query: '', minimumRating: 0, openNow: false, maxDistanceKm: 5, sort: 'distance' };
export function distanceKm(a: Coordinates, b: Coordinates): number {
  const radians = Math.PI / 180;
  const lat = (b.latitude - a.latitude) * radians;
  const lng = (b.longitude - a.longitude) * radians;
  const h = Math.sin(lat / 2) ** 2 + Math.cos(a.latitude * radians) * Math.cos(b.latitude * radians) * Math.sin(lng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)));
}
export function filterCafes(cafes: Cafe[], location: Coordinates | null, filters: CafeFilters): Cafe[] {
  const query = filters.query.trim().toLocaleLowerCase();
  return cafes.filter(cafe => {
    if (query && !`${cafe.name} ${cafe.address}`.toLocaleLowerCase().includes(query)) return false;
    if (filters.minimumRating > 0 && (cafe.rating == null || cafe.rating < filters.minimumRating)) return false;
    if (filters.openNow && cafe.openNow !== true) return false;
    if (location && distanceKm(location, cafe) > filters.maxDistanceKm) return false;
    return true;
  }).sort((a, b) => {
    if (filters.sort === 'rating') return (b.rating ?? -1) - (a.rating ?? -1) || a.name.localeCompare(b.name);
    if (filters.sort === 'name') return a.name.localeCompare(b.name);
    return location ? distanceKm(location, a) - distanceKm(location, b) : a.name.localeCompare(b.name);
  });
}
