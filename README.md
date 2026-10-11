# Café Finder

Expo SDK 54, React Native, Expo Router, NativeWind, and Vercel Google Places API (New) proxy.

## Local verification

```powershell
npm install
npm run typecheck
npm test
npx expo-doctor
```

## Group 13 — Preview preparation

Added explicit Vitest config and manual Android preview build guide at `docs/android-preview.md`. CI runs typecheck, tests and Expo Doctor; it does not deploy. A valid `package-lock.json` still needs to be generated and committed before changing CI to `npm ci` for reproducible installs. No build or device test has been verified.
