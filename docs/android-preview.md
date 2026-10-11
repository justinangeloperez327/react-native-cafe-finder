# Manual Android preview

## Prerequisites

- GitHub CI passes on `main`.
- Vercel API is deployed manually and has `GOOGLE_PLACES_API_KEY` configured as a server-side environment variable.
- Google Places API (New) is enabled and the key is permitted to call the required Places endpoints.
- EAS CLI is authenticated with your Expo account.

## Configure mobile API endpoint

Set `EXPO_PUBLIC_API_BASE_URL` to the deployed HTTPS Vercel API base URL in the EAS build environment. Do **not** put `GOOGLE_PLACES_API_KEY` in Expo public variables.

Expo inlines `EXPO_PUBLIC_*` variables at build time. A local `.env` file is not automatically available to cloud builds. Configure the value in EAS or use an EAS-managed environment that contains it, then select the same environment when building.

## Verify and build

```powershell
git pull origin main
npm ci
npm run typecheck
npm test
npx expo-doctor
npx eas-cli login
npx eas-cli build --platform android --profile preview
```

If EAS asks to link or create an Expo project, follow its prompts. The first Android build may also prompt to generate or register signing credentials. The preview profile produces an installable APK.

## Device acceptance checks

1. Install the APK on a physical Android device.
2. Grant and deny GPS permission in separate tests; confirm both paths are usable.
3. Verify nearby cafés load from the deployed API, including a clear error when the API is unavailable.
4. Search for a city and choose a suggestion; verify results match the selected location.
5. Move the map and use **Search this area**; confirm markers and list results update.
6. Open café details and verify photos, opening hours, directions, and optional phone/website links.
7. Save and unsave cafés, create collections, restart the app, and confirm persistence.
8. Test slow connections, offline recovery, and repeated navigation.

## Deployment policy

GitHub Actions runs checks only. EAS builds are started manually. Disable automatic Git deployments for the Vercel project in Vercel settings if you want manual backend releases.

Passing CI is not proof of a successful native build or Google Places integration; verify both separately.
