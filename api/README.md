# Places proxy

`api/places/nearby.ts` is a Vercel Node function. Deploy this repository as a Vercel project with root directory `.` and set the server-only `GOOGLE_PLACES_API_KEY` environment variable. Enable **Places API (New)** in Google Cloud and attach billing. Set `EXPO_PUBLIC_API_BASE_URL` in the Expo application's `.env` to the HTTPS origin of the deployed API.

The mobile app must never contain the private Places key. Before production, add per-client quotas, abuse protection/rate limiting, monitoring, and an appropriate access-control policy. Public proxy endpoints can otherwise incur unexpected API charges. Google Places content and caching are subject to Google Maps Platform terms.
