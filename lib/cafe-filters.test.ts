import { describe, expect, it } from 'vitest';
import { defaultCafeFilters, distanceKm, filterCafes } from './cafe-filters';
import type { Cafe } from '@/types/cafe';
const origin = { latitude: 0, longitude: 0 };
const cafes: Cafe[] = [
  { id: 'a', name: 'Alpha', address: 'Street 1', latitude: 0, longitude: 0.009, rating: 4.6, openNow: true },
  { id: 'b', name: 'Beta', address: 'Street 2', latitude: 0, longitude: 0.018, rating: 3.5, openNow: false },
  { id: 'c', name: 'Gamma', address: 'Street 3', latitude: 0, longitude: 0.03 },
];
describe('café filtering', () => {
  it('computes approximate geographic distance', () => expect(distanceKm(origin, cafes[0])).toBeCloseTo(1, 1));
  it('filters by rating and open status', () => expect(filterCafes(cafes, origin, { ...defaultCafeFilters, minimumRating: 4, openNow: true }).map(c => c.id)).toEqual(['a']));
  it('excludes unknown opening hours when open-now is enabled', () => expect(filterCafes(cafes, origin, { ...defaultCafeFilters, openNow: true }).map(c => c.id)).toEqual(['a']));
  it('filters by radius', () => expect(filterCafes(cafes, origin, { ...defaultCafeFilters, maxDistanceKm: 1.5 }).map(c => c.id)).toEqual(['a']));
  it('sorts by rating with unrated cafes last', () => expect(filterCafes(cafes, origin, { ...defaultCafeFilters, sort: 'rating' }).map(c => c.id)).toEqual(['a', 'b', 'c']));
  it('filters text case-insensitively', () => expect(filterCafes(cafes, origin, { ...defaultCafeFilters, query: 'STREET 2' }).map(c => c.id)).toEqual(['b']));
});
