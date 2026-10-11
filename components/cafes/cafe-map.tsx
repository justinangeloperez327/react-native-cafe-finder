import { useEffect, useRef } from 'react';
import { Link } from 'expo-router';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import type { Cafe, Coordinates } from '@/types/cafe';

type Props = { cafes: Cafe[]; location: Coordinates | null; selected: Cafe | null; onSelect: (cafe: Cafe) => void; onDirections: (cafe: Cafe) => void; loading: boolean };
export function CafeMap({ cafes, location, selected, onSelect, onDirections, loading }: Props) {
  const map = useRef<MapView>(null);
  useEffect(() => {
    if (!location) return;
    const region: Region = { ...location, latitudeDelta: 0.055, longitudeDelta: 0.055 };
    map.current?.animateToRegion(region, 450);
  }, [location]);
  return <View className="flex-1">
    <MapView ref={map} style={{ flex: 1 }} showsUserLocation={!!location} showsMyLocationButton={false}
      initialRegion={{ latitude: location?.latitude ?? 24.4539, longitude: location?.longitude ?? 54.3773, latitudeDelta: 0.055, longitudeDelta: 0.055 }}
      accessibilityLabel="Map of nearby cafés">
      {cafes.map(cafe => <Marker key={cafe.id} coordinate={{ latitude: cafe.latitude, longitude: cafe.longitude }}
        title={cafe.name} description={cafe.address} pinColor={selected?.id === cafe.id ? '#30241D' : '#6F4E37'}
        onPress={() => onSelect(cafe)} />)}
    </MapView>
    {location && <Pressable accessibilityRole="button" accessibilityLabel="Center map on my location"
      className="absolute right-4 top-4 rounded-full bg-white p-3 shadow"
      onPress={() => map.current?.animateToRegion({ ...location, latitudeDelta: 0.055, longitudeDelta: 0.055 }, 450)}>
      <Text className="text-lg text-coffee-700">◎</Text>
    </Pressable>}
    {loading && <View className="absolute left-4 top-4 rounded-full bg-white p-3"><ActivityIndicator color="#6F4E37" /></View>}
    {selected && <View className="absolute bottom-5 left-4 right-4 rounded-2xl bg-white p-5 shadow">
      <Text className="text-lg font-semibold text-coffee-900">{selected.name}</Text>
      <Text className="mt-1 text-sm text-stone-500">{selected.address}</Text>
      <Text className="mt-2 text-sm text-coffee-700">{selected.rating == null ? 'Not rated' : `★ ${selected.rating.toFixed(1)}`}{selected.openNow == null ? '' : selected.openNow ? ' · Open now' : ' · Closed'}</Text>
      <Link href={{ pathname: '/cafe/[id]', params: { id: selected.id } }} className="mt-3 font-semibold text-coffee-700">View café details</Link>
      <Pressable accessibilityRole="button" onPress={() => onDirections(selected)} className="mt-4 rounded-xl bg-coffee-700 p-3">
        <Text className="text-center font-semibold text-white">Directions</Text>
      </Pressable>
    </View>}
  </View>;
}
