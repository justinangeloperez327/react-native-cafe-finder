import type { IncomingMessage, ServerResponse } from 'node:http';
function reply(res: ServerResponse, code: number, body: unknown) { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); }
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'GET') return reply(res, 405, { error: 'Method not allowed.' });
  const id = new URL(req.url || '/', 'https://api.local').searchParams.get('id') || '';
  if (!/^[A-Za-z0-9_-]{5,256}$/.test(id)) return reply(res, 400, { error: 'Invalid place ID.' });
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return reply(res, 503, { error: 'Location search is not configured.' });
  try {
    const upstream = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(id)}`, {
      headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'id,displayName,formattedAddress,location' },
      signal: AbortSignal.timeout(10000),
    });
    if (!upstream.ok) return reply(res, 502, { error: 'Unable to locate this area.' });
    const p = await upstream.json() as { location?: { latitude?: number; longitude?: number }; formattedAddress?: string; displayName?: { text?: string } };
    const latitude = p.location?.latitude, longitude = p.location?.longitude;
    if (latitude == null || longitude == null) return reply(res, 404, { error: 'No coordinates available for this area.' });
    return reply(res, 200, { location: { latitude, longitude }, label: p.formattedAddress || p.displayName?.text || 'Selected area' });
  } catch { return reply(res, 502, { error: 'Unable to locate this area.' }); }
}
