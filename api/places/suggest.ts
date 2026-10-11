import type { IncomingMessage, ServerResponse } from 'node:http';
function reply(res: ServerResponse, code: number, body: unknown) { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); }
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'GET') return reply(res, 405, { error: 'Method not allowed.' });
  const input = new URL(req.url || '/', 'https://api.local').searchParams.get('q')?.trim() || '';
  if (input.length < 3 || input.length > 120) return reply(res, 400, { error: 'Enter 3–120 characters.' });
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return reply(res, 503, { error: 'Location search is not configured.' });
  try {
    const upstream = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key },
      body: JSON.stringify({ input, includedPrimaryTypes: ['(regions)'] }), signal: AbortSignal.timeout(10000),
    });
    if (!upstream.ok) return reply(res, 502, { error: 'Location suggestions are unavailable.' });
    const payload = await upstream.json() as { suggestions?: Array<{ placePrediction?: { placeId?: string; text?: { text?: string } } }> };
    const suggestions = (payload.suggestions || []).flatMap(item => {
      const p = item.placePrediction;
      return p?.placeId && p.text?.text ? [{ id: p.placeId, label: p.text.text }] : [];
    }).slice(0, 8);
    return reply(res, 200, { suggestions });
  } catch { return reply(res, 502, { error: 'Location suggestions are unavailable.' }); }
}
