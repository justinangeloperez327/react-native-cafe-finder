# Café Finder

Cross-platform Android and iOS café discovery using Expo, React Native, Expo Router, TypeScript and NativeWind.

## Run mobile app

```bash
npm install
npx expo install --fix
npm run typecheck
npx expo start --clear
```

## Live café discovery

1. Enable Google Places API (New) and billing in Google Cloud.
2. Deploy the `api/places/nearby.ts` Vercel function. Set `GOOGLE_PLACES_API_KEY` as a **server-only** environment variable.
3. Copy `.env.example` to `.env`, set `EXPO_PUBLIC_API_BASE_URL` to the API HTTPS origin and restart Expo.
4. Grant foreground location permission when prompted in Explore.

Explore requests cafés within 5 km, displays Google ratings/open status when supplied, and opens directions. Search input filters the fetched list locally; it is not yet a full-text Places search. The Home screen still contains labeled previews. No private key belongs in Expo public variables. See `api/README.md` for production security requirements.
