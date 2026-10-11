# Café Finder

Expo SDK 54 / React Native café discovery app.

## Install and check

```bash
npm install
npx expo install --fix
npm run typecheck
npm test
npx expo-doctor
npx expo start --clear
```

## Production configuration (Group 12)

1. Enable **Places API (New)** and billing in Google Cloud. Restrict your server key to the Places API, set billing alerts and service quotas, and store `GOOGLE_PLACES_API_KEY` only in Vercel environment variables. Do not put the key in Expo public variables.
2. Configure `EXPO_PUBLIC_API_BASE_URL=https://your-project.vercel.app` in the Expo build environment. Remote HTTP is rejected. Redeploy the app after changing this compile-time value.
3. Deploy the `api/places` serverless functions to Vercel **manually**. Git-based automatic deployments should be disabled in the Vercel project settings if desired; this repository does not configure automatic production deployment.
4. Configure EAS credentials and run `npx eas-cli build --profile preview --platform android` for an internal APK. Use `--profile production --platform android` or `--platform ios` for release builds. Apple signing and developer enrollment are required for iOS.
5. Before a public release, protect the public proxy with platform-level rate limits/WAF rules and quotas, monitoring, and abuse controls. **Server-side API key secrecy alone does not prevent unauthenticated abuse.** In-memory per-function counters are not reliable distributed rate limits.
6. Commit a generated `package-lock.json` and switch CI to `npm ci` for deterministic dependency installation. This is still outstanding.

## Known limitations

Nearby results are limited to up to 20 cafés within 5 km of the selected center. Search filters only affect loaded results. Saved cafés are device-local Place IDs. Android/iOS device validation, Expo Doctor, CI results, EAS signing, and live Google Places integration remain to be verified.
