# Café Finder

Android and iOS café discovery built with Expo, React Native, TypeScript, Expo Router and NativeWind.

## Development

```bash
npm install
npx expo install --fix
npm run typecheck
npx expo start --clear
```

## Live Places integration

Enable Places API (New) and billing in Google Cloud. Deploy `api/places/nearby.ts`, `api/places/details.ts`, and `api/places/photo.ts` as serverless endpoints with a server-only `GOOGLE_PLACES_API_KEY`. Configure `EXPO_PUBLIC_API_BASE_URL` in the Expo app. Keep Google API credentials off mobile clients and add API abuse protection before public release.

## Saved cafés (Group 6)

Favorites and named collections use AsyncStorage, without login. Only Google Place IDs and user-created collection metadata are persisted locally; café names, photos, ratings and addresses are fetched again when viewing saved items. Saved cafés will therefore show limited information offline. Collection membership is independent from Favorites: removing a favorite does not remove it from a collection.

Saved data is device-local and is not synchronized or backed up by the app. Clearing app storage or uninstalling may erase it.
