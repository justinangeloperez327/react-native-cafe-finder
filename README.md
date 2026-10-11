# Café Finder

Android and iOS café discovery app with Expo, React Native, TypeScript, Expo Router and NativeWind.

## Development

```bash
npm install
npx expo install --fix
npm run typecheck
npm test
npx expo start --clear
```

## Google Places

Enable Places API (New) and billing in Google Cloud. Deploy the API functions under `api/places` to Vercel with server-only `GOOGLE_PLACES_API_KEY`. Configure `EXPO_PUBLIC_API_BASE_URL` in the Expo app. Protect the proxy with quotas, rate limiting and abuse controls before production.

## Discovery (Group 7)

Explore supports map/list switching, nearby cafés, text filtering, open-now status, minimum Google rating, distance radius and nearest/top-rated/name sorting. Filtering is client-side over the nearby response (up to 20 cafés within a 5 km radius); it does not perform full-text Google Places searches. Distance is straight-line rather than travel distance. Unrated cafés are excluded when a minimum rating is selected; unknown opening status is excluded by Open now.

## Saved cafés

Favorites and named collections persist locally in AsyncStorage using Place IDs only. Café details are fetched again when online. No account or cross-device synchronization yet.
