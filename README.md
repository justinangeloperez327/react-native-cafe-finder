# Café Finder

Expo SDK 54 / React Native app with Expo Router, NativeWind, maps, saved cafés, and a Vercel Google Places API (New) proxy.

## Local verification

```powershell
npm ci
npm run typecheck
npm test
npx expo-doctor
```

The dependency lockfile is committed. GitHub Actions checks locked dependency installation, TypeScript, tests, and Expo compatibility on pushes to `main`; it does not deploy the app or backend.

## Environment

- `EXPO_PUBLIC_API_BASE_URL`: HTTPS URL of the deployed Vercel API, configured for local development and separately for EAS cloud builds.
- `GOOGLE_PLACES_API_KEY`: server-only Vercel environment variable; never expose this key in the Expo client.

Copy `.env.example` to `.env` for local configuration. Keep actual credentials out of source control.

## Android preview

See [manual Android preview instructions](docs/android-preview.md) for EAS build steps and on-device acceptance checks.

## Deployment policy

EAS preview and production builds are initiated manually. Vercel backend deployment is also intended to be manual; disable automatic Git deployments in Vercel project settings. CI passing does not replace native-build and device testing.
