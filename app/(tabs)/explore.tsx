import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'expo-router';
import { Linking, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CafeMap } from '@/components/cafes/cafe-map';
import { DiscoveryCard } from '@/components/cafes/discovery-card';
import { DiscoveryState } from '@/components/cafes/discovery-state';
import { CafeFilterControls } from '@/components/cafes/cafe-filters';
import { LocationSearch } from '@/components/cafes/location-search';
import { resolveLocation, type LocationSuggestion } from '@/lib/locations';
import { defaultCafeFilters, filterCafes, distanceKm } from '@/lib/cafe-filters';
import { getCurrentCoordinates } from '@/lib/location';
import { findNearbyCafes } from '@/lib/cafes';
import type { Cafe, Coordinates } from '@/types/cafe';

export default function ExploreScreen() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [locationLabel, setLocationLabel] = useState('Your location');
  const [selected, setSelected] = useState<Cafe | null>(null);
  const [mode, setMode] = useState<'map' | 'list'>('map');
  const [filters, setFilters] = useState(defaultCafeFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  const load = useCallback(async (target?: { coordinates: Coordinates; label: string }) => {
    request.current?.abort();
    const controller = new AbortController(); request.current = controller;
    setLoading(true); setError(null);
    try {
      const coords = target?.coordinates ?? await getCurrentCoordinates();
      if (controller.signal.aborted) return;
      const results = await findNearbyCafes(coords, controller.signal);
      if (controller.signal.aborted) return;
      setLocation(coords); setLocationLabel(target?.label ?? 'Your location');
      setCafes(results); setSelected(null); setSearched(true);
    } catch (e) { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : 'Unable to load cafés.'); }
    finally { if (!controller.signal.aborted) setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const selectLocation = async (suggestion: LocationSuggestion) => {
    setLoading(true); setError(null);
    try { const resolved = await resolveLocation(suggestion.id); await load({ coordinates: resolved.location, label: resolved.label }); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to search this location.'); setLoading(false); }
  };
  const filtered = filterCafes(cafes, location, filters);
  const searchMapArea = (center: Coordinates) => {
    void load({ coordinates: center, label: 'Map area' });
  };
  const directions = (cafe: Cafe) => {
    const url = cafe.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${cafe.latitude},${cafe.longitude}`;
    void Linking.openURL(url);
  };
  return <SafeAreaView className="flex-1 bg-coffee-50">
    <View className="px-5 pb-3 pt-5">
      <Text className="text-3xl font-bold text-coffee-900">Explore cafés</Text>
      <Text className="mb-2 mt-1 text-stone-500">Explore: {locationLabel}</Text>
      <LocationSearch onSelect={suggestion => void selectLocation(suggestion)} disabled={loading} />
      <Pressable accessibilityRole="button" disabled={loading} onPress={() => void load()} className="mb-3 self-start"><Text className="text-sm font-semibold text-coffee-700">Use my current location</Text></Pressable>
      <TextInput value={filters.query} onChangeText={query => setFilters(current => ({ ...current, query }))} placeholder="Filter cafés by name or address" placeholderTextColor="#9A8F87"
        accessibilityLabel="Filter cafés" className="mb-3 rounded-xl border border-stone-200 bg-white px-4 py-3 text-coffee-900" />
      <View className="flex-row gap-2">
        {(['map', 'list'] as const).map(value => <Pressable key={value} accessibilityRole="button"
          accessibilityState={{ selected: mode === value }} onPress={() => setMode(value)}
          className={`flex-1 flex-row items-center justify-center rounded-xl p-3 ${mode === value ? 'bg-coffee-700' : 'border border-stone-200 bg-white'}`}>
          <Ionicons name={value === 'map' ? 'map-outline' : 'list-outline'} size={17} color={mode === value ? '#FFFFFF' : '#6F4E37'} />
          <Text className={`ml-2 font-medium ${mode === value ? 'text-white' : 'text-coffee-700'}`}>{value === 'map' ? 'Map' : 'List'}</Text>
        </Pressable>)}
        <Pressable accessibilityRole="button" accessibilityLabel="Refresh nearby cafés" onPress={() => void (location ? load({ coordinates: location, label: locationLabel }) : load())} className="rounded-xl border border-stone-200 bg-white p-3">
          <Ionicons name="refresh" size={19} color="#6F4E37" />
        </Pressable>
      </View>
      <CafeFilterControls filters={filters} onChange={setFilters} onReset={() => setFilters(defaultCafeFilters)} />
      <Text className="mt-3 text-xs text-stone-500">{filtered.length} of {cafes.length} cafés near {locationLabel} · Filters apply to loaded results</Text>
    </View>
    {error && <DiscoveryState kind="error" message={error} onRetry={() => void (location ? load({ coordinates: location, label: locationLabel }) : load())} />}
    {mode === 'map' && <View className="flex-1">
      <CafeMap cafes={filtered} location={location} selected={selected && filtered.some(c => c.id === selected.id) ? selected : null}
        onSelect={setSelected} onDirections={directions} loading={loading} onSearchArea={searchMapArea} />
      {!loading && !error && searched && filtered.length === 0 && <View className="absolute bottom-3 left-0 right-0"><DiscoveryState kind={cafes.length ? 'filtered' : 'empty'} onReset={cafes.length ? () => setFilters(defaultCafeFilters) : undefined} /></View>}
    </View>}
    {mode === 'list' && <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 28 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={() => void (location ? load({ coordinates: location, label: locationLabel }) : load())} />}>
      {loading && <DiscoveryState kind="loading" />}
      {!loading && !error && searched && filtered.length === 0 && <DiscoveryState kind={cafes.length ? 'filtered' : 'empty'} onReset={cafes.length ? () => setFilters(defaultCafeFilters) : undefined} />}
      {!loading && filtered.map(cafe => <DiscoveryCard key={cafe.id} cafe={cafe} location={location} onMap={() => { setSelected(cafe); setMode('map'); }} onDirections={() => directions(cafe)} />)}
    </ScrollView>}
  </SafeAreaView>;
}
