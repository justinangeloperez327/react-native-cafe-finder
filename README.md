# Café Finder

Cross-platform café discovery app built with Expo, React Native, TypeScript, Expo Router and NativeWind.

## Local development

```bash
npm install
npx expo install --fix
npm run typecheck
npx expo start --clear
```

## Google Places setup

1. Enable Places API (New) and billing in Google Cloud.
2. Deploy the serverless endpoint in `api/places/nearby.ts` to Vercel and set server-only `GOOGLE_PLACES_API_KEY`.
3. Set `EXPO_PUBLIC_API_BASE_URL` in a local `.env` to your HTTPS API origin.
4. Grant foreground location permission in the Explore tab.

## Group 4 map

The Explore screen now offers Map and List views, markers for fetched cafés, map selection cards, current-location recentering, local result filtering and navigation links. Search is limited to the initial 5 km Places response and does not automatically fetch results when the map is panned. Map native dependency versions should be validated with `npx expo install --check` and `npx expo install --fix` before native builds.

Never embed a private Places API key in Expo public variables. Protect the deployed endpoint with rate limiting, abuse protection and quotas before public launch.
