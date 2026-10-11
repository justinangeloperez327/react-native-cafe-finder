# Café Finder

React Native café discovery using Expo, Expo Router, TypeScript and Google Places API (New).

## Local checks

```bash
npm install
npx expo install --fix
npm run typecheck
npm test
npx expo start --clear
```

CI installs dependencies, runs TypeScript checks and runs Vitest. No lockfile is committed yet, so CI intentionally does not use npm caching or npm ci. Generate and commit a lockfile before adopting reproducible npm ci builds.

## Configuration

Deploy `api/places/*` to Vercel and set server-only `GOOGLE_PLACES_API_KEY`; set `EXPO_PUBLIC_API_BASE_URL` in Expo. Google Places API (New) billing is required. Apply API quotas, rate limiting and abuse controls before public release.

## Group 11 reliability

Nearby requests are aborted when superseded; pending location resolutions are also aborted. Saved-item writes are serialized to avoid losing rapid edits. Failed writes return failure rather than reporting collection creation as successful. Saved café detail requests are limited to batches of four to reduce concurrent load. CI includes the test suite.

## Current limitations

Map gestures need verification on Android and iOS. Google Places search returns up to 20 cafés within 5 km of the selected center; client filters cannot extend the search area. Favorites and collections are device-local, storing Place IDs rather than café metadata. Google API photo usage and platform billing should be reviewed before release.
