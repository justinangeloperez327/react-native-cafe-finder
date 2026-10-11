import type { IncomingMessage, ServerResponse } from 'node:http';
export function json(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(JSON.stringify(body));
}
export function requireGet(req: IncomingMessage, res: ServerResponse): boolean {
  if (req.method === 'GET') return true;
  res.setHeader('Allow', 'GET');
  json(res, 405, { error: 'Method not allowed.' });
  return false;
}
export function configuredPlacesKey(res: ServerResponse): string | null {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) { json(res, 503, { error: 'Places service is not configured.' }); return null; }
  return key;
}
export function getUrl(req: IncomingMessage): URL {
  return new URL(req.url || '/', 'https://api.local');
}
