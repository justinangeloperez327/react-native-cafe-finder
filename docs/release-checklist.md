# Group 14 release checklist

The repository does not yet contain a generated npm lockfile. On a network-connected machine run `npm install`, then `npm run typecheck`, `npm test`, and `npx expo-doctor`. Commit `package-lock.json` and switch CI to `npm ci` after validating the dependency tree.

For the first Android preview build, configure `EXPO_PUBLIC_API_BASE_URL` in EAS, keep the Google Places API key on Vercel only, then run `npx eas-cli login`, `npx eas-cli build:configure`, and `npx eas-cli build --platform android --profile preview`.

Test GPS permission granted and denied, city autocomplete, map search, café details, saved collections, offline recovery, and restart persistence on a physical Android device. Configure API quotas and Vercel rate limiting before production.

No APK build or passing CI run has been verified. Manual deployment is unchanged.
