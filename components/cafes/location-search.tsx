import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { getLocationSuggestions, type LocationSuggestion } from '@/lib/locations';

type Props = { onSelect: (suggestion: LocationSuggestion) => void; disabled?: boolean };
export function LocationSearch({ onSelect, disabled }: Props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    if (query.trim().length < 3) { setSuggestions([]); setError(null); setLoading(false); return () => controller.abort(); }
    setLoading(true); setError(null);
    const timeout = setTimeout(() => {
      getLocationSuggestions(query.trim(), controller.signal)
        .then(setSuggestions)
        .catch(e => { if (!controller.signal.aborted) { setSuggestions([]); setError(e instanceof Error ? e.message : 'Search unavailable.'); } })
        .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    }, 400);
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [query]);
  return <View className="mb-3">
    <TextInput accessibilityLabel="Search city or neighborhood" value={query} onChangeText={setQuery} editable={!disabled}
      placeholder="Search city or neighborhood" placeholderTextColor="#9A8F87" autoCorrect={false}
      className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-coffee-900" />
    {loading && <ActivityIndicator size="small" color="#6F4E37" style={{ marginTop: 8 }} />}
    {error && <Text className="mt-2 text-sm text-red-700">{error}</Text>}
    {!loading && query.trim().length >= 3 && suggestions.length === 0 && !error && <Text className="mt-2 text-xs text-stone-500">No matching areas found.</Text>}
    {suggestions.length > 0 && <View className="mt-2 rounded-xl border border-stone-200 bg-white">
      {suggestions.map(s => <Pressable key={s.id} accessibilityRole="button" disabled={disabled}
        onPress={() => { setQuery(''); setSuggestions([]); onSelect(s); }} className="border-b border-stone-100 px-4 py-3">
        <Text className="text-sm text-coffee-900">{s.label}</Text>
      </Pressable>)}
    </View>}
  </View>;
}
