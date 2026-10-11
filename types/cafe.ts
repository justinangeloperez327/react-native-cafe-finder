export type Cafe = { id: string; name: string; address: string; latitude: number; longitude: number; rating?: number; ratingCount?: number; openNow?: boolean; photoName?: string; googleMapsUri?: string };
export type Coordinates = { latitude: number; longitude: number };
export type CafeDetails = Cafe & { phone?: string; website?: string; editorialSummary?: string; weekdayDescriptions?: string[]; photos: { name: string; attribution?: string }[] };
