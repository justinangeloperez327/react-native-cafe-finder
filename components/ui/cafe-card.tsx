import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
export type CafePreview = { id: string; name: string; area: string; note: string };
export function CafeCard({ cafe }: { cafe: CafePreview }) { return <View className="mb-3 flex-row items-center rounded-2xl border border-stone-200 bg-white p-4"><View className="mr-4 h-16 w-16 items-center justify-center rounded-xl bg-coffee-100"><Ionicons name="cafe-outline" size={28} color="#6F4E37" /></View><View className="flex-1"><Text className="text-base font-semibold text-coffee-900">{cafe.name}</Text><Text className="mt-1 text-sm text-stone-500">{cafe.area}</Text><Text className="mt-1 text-xs text-coffee-700">{cafe.note}</Text></View><Ionicons name="chevron-forward" size={18} color="#967354" /></View>; }
