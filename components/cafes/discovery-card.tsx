import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import type { Cafe, Coordinates } from '@/types/cafe';
import { distanceKm } from '@/lib/cafe-filters';
import { useSavedCafes } from '@/features/saved/saved-context';
type Props = { cafe: Cafe; location: Coordinates | null; onMap: () => void; onDirections: () => void };
export function DiscoveryCard({ cafe, location, onMap, onDirections }: Props) {
  const { isSaved, toggleFavorite, ready, saving } = useSavedCafes();
  const favorite = isSaved(cafe.id);
  return <View className="mb-3 rounded-2xl border border-stone-200 bg-white p-4">
    <View className="flex-row items-start gap-3">
      <View className="h-14 w-14 items-center justify-center rounded-xl bg-coffee-100"><Ionicons name="cafe-outline" size={26} color="#6F4E37" /></View>
      <View className="flex-1">
        <Text className="text-lg font-semibold text-coffee-900">{cafe.name}</Text>
        <Text className="mt-1 text-sm text-stone-500">{cafe.address || 'Address unavailable'}</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={favorite ? 'Remove from favorites' : 'Add to favorites'} accessibilityState={{ disabled: !ready || saving }} disabled={!ready || saving} onPress={() => void toggleFavorite(cafe.id)} className="rounded-full bg-coffee-100 p-2">
        <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={20} color="#6F4E37" />
      </Pressable>
    </View>
    <View className="mt-3 flex-row flex-wrap gap-3">
      <Text className="text-sm text-coffee-700">{cafe.rating == null ? 'Not rated' : `★ ${cafe.rating.toFixed(1)}${cafe.ratingCount != null ? ` (${cafe.ratingCount})` : ''}`}</Text>
      {cafe.openNow != null && <Text className={`text-sm ${cafe.openNow ? 'text-green-700' : 'text-stone-500'}`}>{cafe.openNow ? 'Open now' : 'Closed'}</Text>}
      {location && <Text className="text-sm text-stone-500">{distanceKm(location, cafe).toFixed(1)} km straight-line</Text>}
    </View>
    <View className="mt-4 flex-row flex-wrap items-center gap-4">
      <Link href={{ pathname: '/cafe/[id]', params: { id: cafe.id } }}><Text className="font-semibold text-coffee-700">Details</Text></Link>
      <Pressable accessibilityRole="button" onPress={onMap}><Text className="font-semibold text-coffee-700">Map</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={onDirections}><Text className="font-semibold text-coffee-700">Directions</Text></Pressable>
    </View>
  </View>;
}
