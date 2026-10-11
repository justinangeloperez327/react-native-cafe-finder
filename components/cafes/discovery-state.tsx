import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
type Props = { kind: 'loading' | 'error' | 'empty' | 'filtered'; message?: string; onRetry?: () => void; onReset?: () => void };
export function DiscoveryState({ kind, message, onRetry, onReset }: Props) {
  const title = kind === 'loading' ? 'Finding coffee spots' : kind === 'error' ? 'Could not load cafés' : kind === 'filtered' ? 'No matching cafés' : 'No cafés found in this area';
  const description = message || (kind === 'loading' ? 'Searching the selected area…' : kind === 'filtered' ? 'Try fewer filters or a different search term.' : 'Move the map or choose another area.');
  return <View accessibilityRole="summary" className="mx-5 my-4 items-center rounded-2xl border border-stone-200 bg-white px-5 py-7">
    {kind === 'loading' ? <ActivityIndicator color="#6F4E37" /> : <Ionicons name={kind === 'error' ? 'cloud-offline-outline' : 'cafe-outline'} size={28} color="#6F4E37" />}
    <Text className="mt-3 text-center text-lg font-semibold text-coffee-900">{title}</Text>
    <Text className="mt-2 text-center text-sm text-stone-500">{description}</Text>
    {onRetry && <Pressable accessibilityRole="button" onPress={onRetry} className="mt-4 rounded-xl bg-coffee-700 px-5 py-3"><Text className="font-semibold text-white">Try again</Text></Pressable>}
    {onReset && <Pressable accessibilityRole="button" onPress={onReset} className="mt-4 rounded-xl bg-coffee-700 px-5 py-3"><Text className="font-semibold text-white">Clear filters</Text></Pressable>}
  </View>;
}
