import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentCoordinates } from '@/lib/location';
import { findNearbyCafes } from '@/lib/cafes';
import type { Cafe } from '@/types/cafe';

export default function ExploreScreen() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { const coords = await getCurrentCoordinates(); setCafes(await findNearbyCafes(coords)); setSearched(true); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to load cafés.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const filtered = cafes.filter(c => `${c.name} ${c.address}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <SafeAreaView className="flex-1 bg-coffee-50"><ScrollView className="px-6" contentContainerStyle={{ paddingTop: 28, paddingBottom: 36 }} refreshControl={<RefreshControl refreshing={loading} onRefresh={() => void load()} />}>
    <Text className="text-3xl font-bold text-coffee-900">Explore cafés</Text><Text className="mb-5 mt-2 text-stone-500">Coffee spots near your current location</Text>
    <TextInput value={query} onChangeText={setQuery} placeholder="Filter by café name or address" placeholderTextColor="#9A8F87" className="mb-5 rounded-2xl border border-stone-200 bg-white p-4 text-coffee-900" accessibilityLabel="Filter nearby cafés" />
    {loading && <View className="items-center py-8"><ActivityIndicator color="#6F4E37" /><Text className="mt-3 text-stone-500">Finding nearby cafés…</Text></View>}
    {error && <View className="rounded-2xl border border-stone-200 bg-white p-5"><Text className="mb-3 text-coffee-900">{error}</Text><Pressable onPress={() => void load()} accessibilityRole="button" className="self-start rounded-xl bg-coffee-700 px-5 py-3"><Text className="font-semibold text-white">Try again</Text></Pressable></View>}
    {!loading && !error && searched && filtered.length === 0 && <Text className="py-8 text-center text-stone-500">No matching cafés found. Try another search or refresh.</Text>}
    {!loading && !error && filtered.map(cafe => <View key={cafe.id} className="mb-3 rounded-2xl border border-stone-200 bg-white p-5"><View className="flex-row items-start"><View className="mr-3 rounded-xl bg-coffee-100 p-3"><Ionicons name="cafe-outline" size={22} color="#6F4E37" /></View><View className="flex-1"><Text className="text-lg font-semibold text-coffee-900">{cafe.name}</Text><Text className="mt-1 text-sm text-stone-500">{cafe.address}</Text><Text className="mt-2 text-sm text-coffee-700">{cafe.rating != null ? `★ ${cafe.rating.toFixed(1)}${cafe.ratingCount != null ? ` (${cafe.ratingCount})` : ''}` : 'No rating'}{cafe.openNow != null ? ` · ${cafe.openNow ? 'Open now' : 'Closed'}` : ''}</Text></View></View><Pressable accessibilityRole="link" className="mt-4 flex-row items-center" onPress={() => { const url = cafe.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${cafe.latitude},${cafe.longitude}`; void Linking.openURL(url); }}><Ionicons name="navigate-outline" size={17} color="#6F4E37" /><Text className="ml-2 font-semibold text-coffee-700">View directions</Text></Pressable></View>)}
  </ScrollView></SafeAreaView>;
}
