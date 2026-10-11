import type { IncomingMessage, ServerResponse } from 'node:http';
function json(res: ServerResponse, status: number, body: unknown) { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); }
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed.' });
  const id = new URL(req.url || '/', 'https://api.local').searchParams.get('id');
  if (!id || !/^[A-Za-z0-9_-]{5,256}$/.test(id)) return json(res, 400, { error: 'Invalid café ID.' });
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return json(res, 503, { error: 'Café details are not configured.' });
  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(id)}`, {
      headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'id,displayName,formattedAddress,location,rating,userRatingCount,currentOpeningHours,googleMapsUri,nationalPhoneNumber,websiteUri,editorialSummary,photos' },
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) return json(res, response.status === 404 ? 404 : 502, { error: response.status === 404 ? 'Café not found.' : 'Unable to retrieve café details.' });
    const p = await response.json() as Record<string, any>;
    const cafe = { id: p.id, name: p.displayName?.text || 'Unnamed café', address: p.formattedAddress || '', latitude: p.location?.latitude, longitude: p.location?.longitude, rating: p.rating, ratingCount: p.userRatingCount, openNow: p.currentOpeningHours?.openNow, googleMapsUri: p.googleMapsUri, phone: p.nationalPhoneNumber, website: p.websiteUri, editorialSummary: p.editorialSummary?.text, weekdayDescriptions: p.currentOpeningHours?.weekdayDescriptions || [], photos: (p.photos || []).slice(0, 6).map((photo: any) => ({ name: photo.name, attribution: photo.authorAttributions?.map((a: any) => a.displayName).filter(Boolean).join(', ') })) };
    return json(res, 200, { cafe });
  } catch { return json(res, 502, { error: 'Unable to retrieve café details right now.' }); }
}
