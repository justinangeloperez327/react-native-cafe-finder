import type { IncomingMessage, ServerResponse } from 'node:http';
import { json, requireGet, configuredPlacesKey } from '../_shared/security';

const MAX_RESULTS = 20;
export default async function handler(req: IncomingMessage & { query?: Record<string, string | string[]> }, res: ServerResponse) {
  if (!requireGet(req, res)) return;
  const url = new URL(req.url || '/', 'https://api.local');
  const lat = Number(url.searchParams.get('lat'));
  const lng = Number(url.searchParams.get('lng'));
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180 || !url.searchParams.has('lat') || !url.searchParams.has('lng')) { json(res, 400, { error: 'Valid latitude and longitude are required.' }); return; }
  const key = configuredPlacesKey(res);
  if (!key) return;
  try {
    const upstream = await fetch('https://places.googleapis.com/v1/places:searchNearby', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.currentOpeningHours.openNow,places.googleMapsUri' }, signal: AbortSignal.timeout(12000), body: JSON.stringify({ includedTypes: ['cafe'], maxResultCount: MAX_RESULTS, locationRestriction: { circle: { center: { latitude: lat, longitude: lng }, radius: 5000 } } }) });
    if (!upstream.ok) throw new Error(`Places API returned ${upstream.status}`);
    const data = await upstream.json() as { places?: Array<{ id?: string; displayName?: { text?: string }; formattedAddress?: string; location?: { latitude?: number; longitude?: number }; rating?: number; userRatingCount?: number; currentOpeningHours?: { openNow?: boolean }; googleMapsUri?: string }> };
    const cafes = (data.places || []).filter(p => p.id && p.location?.latitude != null && p.location?.longitude != null).map(p => ({ id: p.id!, name: p.displayName?.text || 'Unnamed café', address: p.formattedAddress || '', latitude: p.location!.latitude!, longitude: p.location!.longitude!, rating: p.rating, ratingCount: p.userRatingCount, openNow: p.currentOpeningHours?.openNow, googleMapsUri: p.googleMapsUri }));
    json(res, 200, { cafes });
  } catch { json(res, 502, { error: 'Unable to retrieve nearby cafés right now.' }); }
}
