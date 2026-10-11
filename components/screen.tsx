import type { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';

export function Screen({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return <SafeAreaView style={styles.safe}><View style={styles.container}><Text style={styles.title}>{title}</Text><Text style={styles.description}>{description}</Text>{children}</View></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#FAF8F5' }, container: { flex: 1, padding: 24, paddingTop: 36, gap: 12 }, title: { fontSize: 30, fontWeight: '700', color: '#30241D' }, description: { fontSize: 16, lineHeight: 24, color: '#74675F' } });
