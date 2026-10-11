# Manual Android preview

Run `npm install`, `npm run typecheck`, `npm test`, and `npx expo-doctor` locally. Generate and commit `package-lock.json` after npm install. Set `EXPO_PUBLIC_API_BASE_URL` to the deployed HTTPS Vercel endpoint in the EAS environment, and keep `GOOGLE_PLACES_API_KEY` on Vercel only.

Run `npx eas-cli login`, `npx eas-cli build:configure`, and `npx eas-cli build --platform android --profile preview` to produce an internal Android APK. Verify GPS denial, city search, map area search, café details, favorites, and offline behavior on a device.

EAS builds are manual. Vercel automatic Git deployment must be disabled in the Vercel dashboard if manual deployment is desired.
