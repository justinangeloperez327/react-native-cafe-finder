# Café Finder

Expo / React Native café discovery for Android and iOS.

## Run

```bash
npm install
npx expo install --fix
npm run typecheck
npm test
npx expo start --clear
```

## Setup

Enable Google Places API (New) and billing. Deploy the functions under `api/places` to Vercel with a server-only `GOOGLE_PLACES_API_KEY`, and set `EXPO_PUBLIC_API_BASE_URL` in Expo. Add rate limiting and quotas before public deployment.

## Map exploration — Group 9

Pan or zoom the map, then tap **Search this area** to request cafés around the current map center. Searches are manual, not triggered continuously by map gestures. Recenter returns to the last searched center; **Use my current location** restores GPS-based search. Map/List views share results and filters.

The Places nearby API currently searches a 5 km circle, returns up to 20 cafés, and does not search the entire visible map bounds. Radius and distance filters operate on that result set. Map gesture detection may behave differently on iOS and Android; test on both.

## Saved cafés

Favorites and collections persist on-device using Place IDs. Café metadata is refreshed from the API.
