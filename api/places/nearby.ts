import type { IncomingMessage, ServerResponse } from 'node:http';

const MAX_RESULTS = 20;
export default async function handler(req: IncomingMessage & { query?: Record<string, string | string[]> }, res: ServerResponse) {
  if (req.method !== 'GET') { res.writeHead(405, { Allow: 'GET' }); res.end(JSON.stringify({ error: 'Method not allowed' })); return; }
  const url = new URL(req.url || '/', 'https://api.local');
  const lat = Number(url.searchParams.get('lat'));
  const lng = Number(url.searchParams.get('lng'));
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180 || !url.searchParams.has('lat') || !url.searchParams.has('lng')) { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'Valid latitude and longitude are required.' })); return; }
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) { res.writeHead(503, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'Café discovery is not configured yet.' })); return; }
  try {
    const upstream = await fetch('https://places.googleapis.com/v1/places:searchNearby', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.currentOpeningHours.openNow,places.googleMapsUri' }, body: JSON.stringify({ includedTypes: ['cafe'], maxResultCount: MAX_RESULTS, locationRestriction: { circle: { center: { latitude: lat, longitude: lng }, radius: 5000 } } }) });
    if (!upstream.ok) throw new Error(`Places API returned ${upstream.status}`);
    const data = await upstream.json() as { places?: Array<{ id?: string; displayName?: { text?: string }; formattedAddress?: string; location?: { latitude?: number; longitude?: number }; rating?: number; userRatingCount?: number; currentOpeningHours?: { openNow?: boolean }; googleMapsUri?: string }> };
    const cafes = (data.places || []).filter(p => p.id && p.location?.latitude != null && p.location?.longitude != null).map(p => ({ id: p.id!, name: p.displayName?.text || 'Unnamed café', address: p.formattedAddress || '', latitude: p.location!.latitude!, longitude: p.location!.longitude!, rating: p.rating, ratingCount: p.userRatingCount, openNow: p.currentOpeningHours?.openNow, googleMapsUri: p.googleMapsUri }));
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'private, max-age=60' }); res.end(JSON.stringify({ cafes }));
  } catch { res.writeHead(502, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'Unable to retrieve nearby cafés right now.' })); }
}
