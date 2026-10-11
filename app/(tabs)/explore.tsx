import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CafeMap } from '@/components/cafes/cafe-map';
import { getCurrentCoordinates } from '@/lib/location';
import { findNearbyCafes } from '@/lib/cafes';
import type { Cafe, Coordinates } from '@/types/cafe';

export default function ExploreScreen() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [selected, setSelected] = useState<Cafe | null>(null);
  const [mode, setMode] = useState<'map' | 'list'>('map');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const coords = await getCurrentCoordinates();
      setLocation(coords);
      const results = await findNearbyCafes(coords);
      setCafes(results); setSelected(null); setSearched(true);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load cafés.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const filtered = cafes.filter(c => `${c.name} ${c.address}`.toLowerCase().includes(query.trim().toLowerCase()));
  const directions = (cafe: Cafe) => {
    const url = cafe.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${cafe.latitude},${cafe.longitude}`;
    void Linking.openURL(url);
  };
  return <SafeAreaView className="flex-1 bg-coffee-50">
    <View className="px-5 pb-3 pt-5">
      <Text className="text-3xl font-bold text-coffee-900">Explore cafés</Text>
      <Text className="mb-4 mt-1 text-stone-500">Find coffee spots near you</Text>
      <TextInput value={query} onChangeText={setQuery} placeholder="Filter cafés by name or address" placeholderTextColor="#9A8F87"
        accessibilityLabel="Filter cafés" className="mb-3 rounded-xl border border-stone-200 bg-white px-4 py-3 text-coffee-900" />
      <View className="flex-row gap-2">
        {(['map', 'list'] as const).map(value => <Pressable key={value} accessibilityRole="button"
          accessibilityState={{ selected: mode === value }} onPress={() => setMode(value)}
          className={`flex-1 flex-row items-center justify-center rounded-xl p-3 ${mode === value ? 'bg-coffee-700' : 'border border-stone-200 bg-white'}`}>
          <Ionicons name={value === 'map' ? 'map-outline' : 'list-outline'} size={17} color={mode === value ? '#FFFFFF' : '#6F4E37'} />
          <Text className={`ml-2 font-medium ${mode === value ? 'text-white' : 'text-coffee-700'}`}>{value === 'map' ? 'Map' : 'List'}</Text>
        </Pressable>)}
        <Pressable accessibilityRole="button" accessibilityLabel="Refresh nearby cafés" onPress={() => void load()} className="rounded-xl border border-stone-200 bg-white p-3">
          <Ionicons name="refresh" size={19} color="#6F4E37" />
        </Pressable>
      </View>
    </View>
    {error && <View className="mx-5 mb-3 rounded-xl bg-white p-4"><Text className="mb-3 text-coffee-900">{error}</Text><Pressable onPress={() => void load()}><Text className="font-semibold text-coffee-700">Try again</Text></Pressable></View>}
    {mode === 'map' && <View className="flex-1">
      <CafeMap cafes={filtered} location={location} selected={selected && filtered.some(c => c.id === selected.id) ? selected : null}
        onSelect={setSelected} onDirections={directions} loading={loading} />
      {!loading && !error && searched && filtered.length === 0 && <View className="absolute left-5 right-5 top-4 rounded-xl bg-white p-4"><Text className="text-center text-stone-500">No cafés match your search.</Text></View>}
    </View>}
    {mode === 'list' && <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 28 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={() => void load()} />}>
      {loading && <ActivityIndicator color="#6F4E37" style={{ marginTop: 24 }} />}
      {!loading && !error && searched && filtered.length === 0 && <Text className="mt-8 text-center text-stone-500">No cafés match your search.</Text>}
      {!loading && filtered.map(cafe => <View key={cafe.id} className="mb-3 rounded-2xl border border-stone-200 bg-white p-5">
        <Text className="text-lg font-semibold text-coffee-900">{cafe.name}</Text>
        <Text className="mt-1 text-sm text-stone-500">{cafe.address}</Text>
        <Text className="mt-2 text-sm text-coffee-700">{cafe.rating == null ? 'Not rated' : `★ ${cafe.rating.toFixed(1)}`}{cafe.openNow == null ? '' : cafe.openNow ? ' · Open now' : ' · Closed'}</Text>
        <View className="mt-4 flex-row gap-4">
          <Pressable onPress={() => { setSelected(cafe); setMode('map'); }} accessibilityRole="button"><Text className="font-semibold text-coffee-700">Show on map</Text></Pressable>
          <Pressable onPress={() => directions(cafe)} accessibilityRole="button"><Text className="font-semibold text-coffee-700">Directions</Text></Pressable>
        </View>
      </View>)}
    </ScrollView>}
  </SafeAreaView>;
}
