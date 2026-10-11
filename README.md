# Café Finder

Android and iOS café discovery app built with Expo, React Native, TypeScript, Expo Router and NativeWind.

## Development

```bash
npm install
npx expo install --fix
npm run typecheck
npm test
npx expo start --clear
```

## Live discovery

Enable Google Places API (New) and billing in Google Cloud. Deploy the Vercel API functions in `api/places` and configure the server-only `GOOGLE_PLACES_API_KEY`. Set `EXPO_PUBLIC_API_BASE_URL` in the Expo app. Apply rate limiting, quota controls and authentication/abuse protection before public launch.

## Group 8 — Location search

Explore supports city and neighborhood suggestions from Places Autocomplete (New), selecting a suggested area, retrieving its coordinates, and searching cafés within 5 km of the selected area. The chosen area remains active when refreshing the results; **Use my current location** restores GPS discovery. Map and list share the same results and client-side filters. Search suggestions require the deployed API; they are not offline-capable.

Nearby search is capped at 20 results. Filters do not search the entire city. The map center is the selected search area, not necessarily the device's GPS position.

## Saved cafés

Favorites and collections persist locally using Place IDs only. Café details are fetched online; no account or cloud sync yet.
