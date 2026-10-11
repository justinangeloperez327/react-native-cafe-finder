import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

const KEY = '@cafe-finder/saved/v1';
export type SavedCollection = { id: string; name: string; placeIds: string[] };
type SavedData = { favoriteIds: string[]; collections: SavedCollection[] };
type SavedContextValue = SavedData & {
  ready: boolean; saving: boolean; error: string | null;
  isSaved: (id: string) => boolean;
  toggleFavorite: (id: string) => Promise<void>;
  createCollection: (name: string) => Promise<boolean>;
  deleteCollection: (id: string) => Promise<void>;
  toggleCollectionPlace: (collectionId: string, placeId: string) => Promise<void>;
};
const initial: SavedData = { favoriteIds: [], collections: [] };
const Context = createContext<SavedContextValue | null>(null);
function parseStored(value: string | null): SavedData {
  if (!value) return initial;
  try {
    const raw: unknown = JSON.parse(value);
    if (!raw || typeof raw !== 'object') return initial;
    const data = raw as Partial<SavedData>;
    const ids = Array.isArray(data.favoriteIds) ? data.favoriteIds.filter((id): id is string => typeof id === 'string') : [];
    const collections = Array.isArray(data.collections) ? data.collections.filter(c => c && typeof c.id === 'string' && typeof c.name === 'string' && Array.isArray(c.placeIds)).map(c => ({ id: c.id, name: c.name, placeIds: c.placeIds.filter((id): id is string => typeof id === 'string') })) : [];
    return { favoriteIds: [...new Set(ids)], collections };
  } catch { return initial; }
}
export function SavedCafesProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SavedData>(initial);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dataRef = useRef(data);
  const busy = useRef(false);
  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(KEY).then(value => {
      if (!mounted) return;
      const next = parseStored(value);
      dataRef.current = next; setData(next);
    }).catch(() => { if (mounted) setError('Unable to read saved cafés from this device.'); })
      .finally(() => { if (mounted) setReady(true); });
    return () => { mounted = false; };
  }, []);
  const persist = useCallback(async (transform: (current: SavedData) => SavedData) => {
    if (!ready || busy.current) return;
    busy.current = true; setSaving(true); setError(null);
    const next = transform(dataRef.current);
    try { await AsyncStorage.setItem(KEY, JSON.stringify(next)); dataRef.current = next; setData(next); }
    catch { setError('Unable to save changes on this device. Please try again.'); }
    finally { busy.current = false; setSaving(false); }
  }, [ready]);
  const toggleFavorite = useCallback(async (id: string) => {
    if (!id) return;
    await persist(current => ({ ...current, favoriteIds: current.favoriteIds.includes(id) ? current.favoriteIds.filter(x => x !== id) : [...current.favoriteIds, id] }));
  }, [persist]);
  const createCollection = useCallback(async (name: string) => {
    const trimmed = name.trim().slice(0, 50);
    if (!trimmed || !ready || busy.current) return false;
    if (dataRef.current.collections.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) { setError('A collection with that name already exists.'); return false; }
    await persist(current => ({ ...current, collections: [...current.collections, { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, name: trimmed, placeIds: [] }] }));
    return true;
  }, [persist, ready]);
  const deleteCollection = useCallback(async (id: string) => { await persist(current => ({ ...current, collections: current.collections.filter(c => c.id !== id) })); }, [persist]);
  const toggleCollectionPlace = useCallback(async (collectionId: string, placeId: string) => {
    await persist(current => ({ ...current, collections: current.collections.map(c => c.id !== collectionId ? c : { ...c, placeIds: c.placeIds.includes(placeId) ? c.placeIds.filter(id => id !== placeId) : [...c.placeIds, placeId] }) }));
  }, [persist]);
  const value = useMemo(() => ({ ...data, ready, saving, error, isSaved: (id: string) => data.favoriteIds.includes(id), toggleFavorite, createCollection, deleteCollection, toggleCollectionPlace }), [data, ready, saving, error, toggleFavorite, createCollection, deleteCollection, toggleCollectionPlace]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useSavedCafes() { const value = useContext(Context); if (!value) throw new Error('SavedCafesProvider is missing.'); return value; }
