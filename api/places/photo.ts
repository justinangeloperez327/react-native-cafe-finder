import type { IncomingMessage, ServerResponse } from 'node:http';
function fail(res: ServerResponse, code: number, message: string) { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify({ error: message })); }
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'GET') return fail(res, 405, 'Method not allowed.');
  const url = new URL(req.url || '/', 'https://api.local');
  const name = url.searchParams.get('name') || '';
  const width = Number(url.searchParams.get('width') || 720);
  if (!/^places\/[A-Za-z0-9_-]+\/photos\/[A-Za-z0-9_-]+$/.test(name) || !Number.isInteger(width) || width < 100 || width > 1200) return fail(res, 400, 'Invalid photo request.');
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return fail(res, 503, 'Photos are not configured.');
  try {
    const upstream = await fetch(`https://places.googleapis.com/v1/${name}/media?maxWidthPx=${width}&skipHttpRedirect=true`, { headers: { 'X-Goog-Api-Key': key }, signal: AbortSignal.timeout(12000) });
    if (!upstream.ok) return fail(res, 502, 'Unable to retrieve photo.');
    const payload = await upstream.json() as { photoUri?: string };
    if (!payload.photoUri) return fail(res, 502, 'Photo unavailable.');
    const photoUrl = new URL(payload.photoUri);
    if (photoUrl.protocol !== 'https:' || !photoUrl.hostname.endsWith('.googleusercontent.com')) return fail(res, 502, 'Unexpected photo host.');
    const image = await fetch(photoUrl, { signal: AbortSignal.timeout(12000) });
    if (!image.ok) return fail(res, 502, 'Photo unavailable.');
    const type = image.headers.get('content-type') || '';
    if (!type.startsWith('image/')) return fail(res, 502, 'Unexpected photo response.');
    const data = await image.arrayBuffer();
    if (data.byteLength > 8_000_000) return fail(res, 502, 'Photo too large.');
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'private, max-age=300' });
    res.end(Buffer.from(data));
  } catch { return fail(res, 502, 'Unable to retrieve photo.'); }
}
