import { Pressable, ScrollView, Text, View } from 'react-native';
import type { CafeFilters, SortOption } from '@/lib/cafe-filters';

type Props = { filters: CafeFilters; onChange: (next: CafeFilters) => void; onReset: () => void };
const ratings = [0, 3.5, 4, 4.5] as const;
const distances = [1, 2, 3, 5] as const;
const sorts: { value: SortOption; label: string }[] = [
  { value: 'distance', label: 'Nearest' }, { value: 'rating', label: 'Top rated' }, { value: 'name', label: 'A–Z' },
];
function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress}
    className={`mr-2 rounded-xl border px-3 py-2 ${selected ? 'border-coffee-700 bg-coffee-700' : 'border-stone-200 bg-white'}`}>
    <Text className={`text-sm font-medium ${selected ? 'text-white' : 'text-coffee-700'}`}>{label}</Text>
  </Pressable>;
}
export function CafeFilterControls({ filters, onChange, onReset }: Props) {
  return <View className="mt-3">
    <View className="mb-2 flex-row items-center justify-between"><Text className="text-xs font-semibold uppercase tracking-wider text-stone-500">Filters</Text><Pressable accessibilityRole="button" onPress={onReset}><Text className="text-xs font-semibold text-coffee-700">Reset</Text></Pressable></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
      <Chip label="Open now" selected={filters.openNow} onPress={() => onChange({ ...filters, openNow: !filters.openNow })} />
      {ratings.map(r => <Chip key={r} label={r === 0 ? 'Any rating' : `${r}+ ★`} selected={filters.minimumRating === r} onPress={() => onChange({ ...filters, minimumRating: r })} />)}
    </ScrollView>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
      {distances.map(d => <Chip key={d} label={`Within ${d} km`} selected={filters.maxDistanceKm === d} onPress={() => onChange({ ...filters, maxDistanceKm: d })} />)}
    </ScrollView>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {sorts.map(s => <Chip key={s.value} label={s.label} selected={filters.sort === s.value} onPress={() => onChange({ ...filters, sort: s.value })} />)}
    </ScrollView>
  </View>;
}
