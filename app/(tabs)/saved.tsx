import { Link } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCafeDetails } from '@/lib/cafes';
import { useSavedCafes } from '@/features/saved/saved-context';
import type { CafeDetails } from '@/types/cafe';

export default function SavedScreen() {
  const { favoriteIds, collections, ready, saving, error: storageError, toggleFavorite, createCollection, deleteCollection, toggleCollectionPlace } = useSavedCafes();
  const [name, setName] = useState('');
  const [details, setDetails] = useState<Record<string, CafeDetails>>({});
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const allIds = [...new Set([...favoriteIds, ...collections.flatMap(c => c.placeIds)])];
  const key = allIds.join('|');
  const load = useCallback(async (ids: string[], signal: AbortSignal) => {
    if (!ids.length) { setDetails({}); setLoadError(null); return; }
    setLoading(true); setLoadError(null);
    const results = await Promise.allSettled(ids.map(id => getCafeDetails(id, signal)));
    if (signal.aborted) return;
    const next: Record<string, CafeDetails> = {};
    results.forEach((result, index) => { if (result.status === 'fulfilled') next[ids[index]] = result.value; });
    setDetails(next);
    if (results.some(result => result.status === 'rejected')) setLoadError('Some café details could not be loaded. Check your connection or API configuration.');
    setLoading(false);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const controller = new AbortController();
    void load(key ? key.split('|') : [], controller.signal);
    return () => controller.abort();
  }, [key, ready, load]);
  const renderPlace = (id: string, collectionId?: string) => {
    const cafe = details[id];
    return <View key={id} className="mb-3 rounded-2xl border border-stone-200 bg-white p-4">
      <Text className="text-base font-semibold text-coffee-900">{cafe?.name || 'Saved café'}</Text>
      <Text className="mt-1 text-sm text-stone-500">{cafe?.address || 'Details unavailable offline'}</Text>
      <View className="mt-3 flex-row flex-wrap gap-4">
        <Link href={{ pathname: '/cafe/[id]', params: { id } }}><Text className="font-semibold text-coffee-700">Details</Text></Link>
        {collectionId ? <Pressable disabled={saving} onPress={() => void toggleCollectionPlace(collectionId, id)}><Text className="text-stone-600">Remove from collection</Text></Pressable>
          : <Pressable disabled={saving} onPress={() => void toggleFavorite(id)}><Text className="text-stone-600">Unsave</Text></Pressable>}
      </View>
      {!collectionId && collections.length > 0 && <View className="mt-4 flex-row flex-wrap gap-2">{collections.map(c => {
        const included = c.placeIds.includes(id);
        return <Pressable key={c.id} disabled={saving} onPress={() => void toggleCollectionPlace(c.id, id)}
          className={`rounded-lg px-3 py-2 ${included ? 'bg-coffee-700' : 'bg-coffee-100'}`}>
          <Text className={included ? 'text-white' : 'text-coffee-700'}>{included ? '✓ ' : '+ '}{c.name}</Text>
        </Pressable>;
      })}</View>}
    </View>;
  };
  return <SafeAreaView className="flex-1 bg-coffee-50"><ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>
    <Text className="text-3xl font-bold text-coffee-900">Saved cafés</Text>
    <Text className="mb-6 mt-2 text-stone-500">Your favorite coffee spots, stored on this device.</Text>
    {!ready && <ActivityIndicator color="#6F4E37" />}
    {!!storageError && <Text className="mb-4 text-red-700">{storageError}</Text>}
    <Text className="mb-3 text-xl font-semibold text-coffee-900">Favorites ({favoriteIds.length})</Text>
    {ready && favoriteIds.length === 0 && <View className="mb-6 rounded-2xl bg-white p-5"><Text className="text-stone-500">No favorites yet. Open a café's details and tap Save.</Text><Link href="/(tabs)/explore" className="mt-3 font-semibold text-coffee-700">Explore cafés</Link></View>}
    {favoriteIds.map(id => renderPlace(id))}
    <Text className="mb-3 mt-6 text-xl font-semibold text-coffee-900">Collections</Text>
    <View className="mb-6 flex-row gap-2">
      <TextInput accessibilityLabel="New collection name" value={name} onChangeText={setName} maxLength={50} placeholder="e.g. Weekend coffee" className="flex-1 rounded-xl border border-stone-200 bg-white px-4 py-3 text-coffee-900" />
      <Pressable disabled={!ready || saving || !name.trim()} onPress={() => { void createCollection(name).then(created => { if (created) setName(''); }); }} className="justify-center rounded-xl bg-coffee-700 px-4"><Text className="font-semibold text-white">Create</Text></Pressable>
    </View>
    {collections.length === 0 && <Text className="text-stone-500">Create a collection to organize your favorite places.</Text>}
    {collections.map(c => <View key={c.id} className="mb-5">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-coffee-900">{c.name} ({c.placeIds.length})</Text>
        <Pressable disabled={saving} onPress={() => Alert.alert('Delete collection?', 'The cafés will remain in your favorites if saved there.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => void deleteCollection(c.id) }])}><Text className="text-red-700">Delete</Text></Pressable>
      </View>
      {c.placeIds.length === 0 ? <Text className="mb-3 text-sm text-stone-500">Add cafés using the collection buttons under Favorites.</Text> : c.placeIds.map(id => renderPlace(id, c.id))}
    </View>)}
    {loading && <ActivityIndicator color="#6F4E37" />}
    {!!loadError && <Text className="mt-3 text-sm text-stone-500">{loadError}</Text>}
  </ScrollView></SafeAreaView>;
}
