import { useEffect, useRef, useState } from 'react';
import { Link } from 'expo-router';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import type { Cafe, Coordinates } from '@/types/cafe';

type Props = { cafes: Cafe[]; location: Coordinates | null; selected: Cafe | null; onSelect: (cafe: Cafe) => void; onDirections: (cafe: Cafe) => void; loading: boolean; onSearchArea: (center: Coordinates) => void };
export function CafeMap({ cafes, location, selected, onSelect, onDirections, loading, onSearchArea }: Props) {
  const map = useRef<MapView>(null);
  const [mapCenter, setMapCenter] = useState<Coordinates | null>(null);
  const [areaChanged, setAreaChanged] = useState(false);
  const programmed = useRef(false);
  useEffect(() => {
    if (!location) return;
    const region: Region = { ...location, latitudeDelta: 0.055, longitudeDelta: 0.055 };
    programmed.current = true;
    setAreaChanged(false);
    setMapCenter(location);
    map.current?.animateToRegion(region, 450);
  }, [location]);
  return <View className="flex-1">
    <MapView ref={map} style={{ flex: 1 }} showsUserLocation={false} showsMyLocationButton={false}
      initialRegion={{ latitude: location?.latitude ?? 24.4539, longitude: location?.longitude ?? 54.3773, latitudeDelta: 0.055, longitudeDelta: 0.055 }}
      accessibilityLabel="Map of nearby cafés" onRegionChangeComplete={(region, details) => {
        const center = { latitude: region.latitude, longitude: region.longitude };
        setMapCenter(center);
        if (programmed.current) { programmed.current = false; return; }
        if (details?.isGesture === false) return;
        if (location && (Math.abs(region.latitude - location.latitude) > 0.0003 || Math.abs(region.longitude - location.longitude) > 0.0003)) setAreaChanged(true);
      }}>
      {cafes.map(cafe => <Marker key={cafe.id} coordinate={{ latitude: cafe.latitude, longitude: cafe.longitude }}
        title={cafe.name} description={cafe.address} pinColor={selected?.id === cafe.id ? '#30241D' : '#6F4E37'}
        onPress={() => onSelect(cafe)} />)}
    </MapView>
    {areaChanged && mapCenter && !loading && <Pressable accessibilityRole="button" accessibilityLabel="Search cafés in this map area"
      className="absolute left-4 top-4 rounded-full bg-coffee-700 px-5 py-3 shadow"
      onPress={() => { setAreaChanged(false); onSearchArea(mapCenter); }}>
      <Text className="font-semibold text-white">Search this area</Text>
    </Pressable>}
    {location && <Pressable accessibilityRole="button" accessibilityLabel="Center map on search location"
      className="absolute right-4 top-4 rounded-full bg-white p-3 shadow"
      onPress={() => { programmed.current = true; setAreaChanged(false); map.current?.animateToRegion({ ...location, latitudeDelta: 0.055, longitudeDelta: 0.055 }, 450); }}>
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
