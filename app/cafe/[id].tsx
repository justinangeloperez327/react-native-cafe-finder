import { useLocalSearchParams, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { cafePhotoUrl, getCafeDetails } from '@/lib/cafes';
import { useSavedCafes } from '@/features/saved/saved-context';
import type { CafeDetails } from '@/types/cafe';
export default function CafeDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isSaved, toggleFavorite, ready, saving } = useSavedCafes();
  const [cafe, setCafe] = useState<CafeDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setCafe(null); setError(null); setLoading(true);
    if (!id) { setError('Café ID is missing.'); setLoading(false); return () => controller.abort(); }
    getCafeDetails(id, controller.signal).then(setCafe).catch(e => { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : 'Unable to load café.'); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id, retryKey]);
  const open = (url?: string) => { if (url) void Linking.openURL(url); };
  return <SafeAreaView className="flex-1 bg-coffee-50">
    <Stack.Screen options={{ headerShown: true, title: 'Café details', headerBackTitle: 'Back' }} />
    {loading && <ActivityIndicator color="#6F4E37" style={{ marginTop: 48 }} />}
    {error && !loading && <View className="px-6 pt-8"><Text accessibilityRole="alert" className="text-coffee-900">{error}</Text><Pressable accessibilityRole="button" accessibilityLabel="Retry loading café details" onPress={() => setRetryKey(value => value + 1)} className="mt-4 self-start rounded-xl bg-coffee-700 px-5 py-3"><Text className="font-semibold text-white">Try again</Text></Pressable></View>}
    {cafe && <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
      {cafe.photos.length > 0 ? <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} className="mb-5">
        {cafe.photos.map(photo => <View key={photo.name} style={{ width: 320, marginLeft: 16 }}>
          <Image source={{ uri: cafePhotoUrl(photo.name) }} style={{ width: 320, height: 210, borderRadius: 16, backgroundColor: '#F1EAE2' }} resizeMode="cover" />
          {!!photo.attribution && <Text className="mt-1 text-xs text-stone-500">Photo: {photo.attribution}</Text>}
        </View>)}
      </ScrollView> : <View className="mx-6 mb-5 h-40 items-center justify-center rounded-2xl bg-coffee-100"><Ionicons name="cafe-outline" size={52} color="#6F4E37" /></View>}
      <View className="px-6">
        <Text className="text-3xl font-bold text-coffee-900">{cafe.name}</Text>
        <Text className="mt-2 text-base text-stone-500">{cafe.address}</Text>
        <Text className="mt-3 text-base text-coffee-700">{cafe.rating == null ? 'No rating available' : `★ ${cafe.rating.toFixed(1)}${cafe.ratingCount == null ? '' : ` · ${cafe.ratingCount} ratings`}`}{cafe.openNow == null ? '' : cafe.openNow ? ' · Open now' : ' · Closed'}</Text>
        {cafe.editorialSummary ? <Text className="mt-5 text-base leading-6 text-coffee-900">{cafe.editorialSummary}</Text> : null}
        <View className="mt-6 flex-row flex-wrap gap-3">
          <Pressable accessibilityRole="button" accessibilityLabel={isSaved(cafe.id) ? "Remove from saved cafés" : "Save café"} disabled={!ready || saving} onPress={() => void toggleFavorite(cafe.id)} className="rounded-xl border border-stone-200 bg-white px-5 py-3"><Text className="font-semibold text-coffee-700">{isSaved(cafe.id) ? "♥ Saved" : "♡ Save"}</Text></Pressable>
          <Pressable accessibilityRole="button" onPress={() => open(cafe.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafe.name + ' ' + cafe.address)}`)} className="rounded-xl bg-coffee-700 px-5 py-3"><Text className="font-semibold text-white">Directions</Text></Pressable>
          {cafe.phone ? <Pressable accessibilityRole="button" onPress={() => open(`tel:${cafe.phone}`)} className="rounded-xl border border-stone-200 bg-white px-5 py-3"><Text className="font-semibold text-coffee-700">Call</Text></Pressable> : null}
          {cafe.website ? <Pressable accessibilityRole="button" onPress={() => open(cafe.website)} className="rounded-xl border border-stone-200 bg-white px-5 py-3"><Text className="font-semibold text-coffee-700">Website</Text></Pressable> : null}
        </View>
        {(cafe.weekdayDescriptions?.length ?? 0) > 0 && <View className="mt-8 rounded-2xl bg-white p-5"><Text className="mb-3 text-lg font-semibold text-coffee-900">Opening hours</Text>{cafe.weekdayDescriptions?.map(day => <Text key={day} className="mb-2 text-sm text-stone-600">{day}</Text>)}</View>}
        <Text className="mt-6 text-xs text-stone-500">Place information provided by Google Maps Platform.</Text>
      </View>
    </ScrollView>}
  </SafeAreaView>;
}
