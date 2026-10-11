import { Text, View } from 'react-native';
export function SectionHeading({ title, caption }: { title: string; caption?: string }) { return <View className="mb-4"><Text className="text-xl font-semibold text-coffee-900">{title}</Text>{caption ? <Text className="mt-1 text-sm text-stone-500">{caption}</Text> : null}</View>; }
