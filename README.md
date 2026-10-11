# Café Finder

Expo + React Native café discovery for Android and iOS.

## Development

```bash
npm install
npx expo install --fix
npm run typecheck
npm test
npx expo start --clear
```

## API

Enable Google Places API (New) with billing. Deploy the functions under `api/places` and set server-only `GOOGLE_PLACES_API_KEY`; set `EXPO_PUBLIC_API_BASE_URL` in Expo. Add rate limiting and quotas before production.

## Group 10 — Discovery UX

Explore list cards now display available ratings, rating counts, opening status, straight-line distance, favorites and actions. Search loading, API failures, empty areas and filtered-out results have distinct messages. Starting a new nearby request cancels the previous nearby request, preventing stale results from overwriting the newest search. This is a client-side UX improvement; live API/device verification is still required.

Search-by-city, map-center discovery and filters from Groups 7–9 remain available. Google Places nearby results are capped at 20 within 5 km. Saved favorites and collections persist locally as Place IDs.
