import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SavedCafesProvider } from '@/features/saved/saved-context';
export default function RootLayout() { return <SafeAreaProvider><SavedCafesProvider><Stack screenOptions={{ headerShown: false }} /><StatusBar style="dark" /></SavedCafesProvider></SafeAreaProvider>; }
