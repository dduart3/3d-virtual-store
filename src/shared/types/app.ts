export interface Section {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  section_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  thumbnail_path: string;
  stripe_product_id?: string;
  stripe_price_id?: string;
}

export interface Model {
  id: number;
  section_id: string | null;
  product_id: string | null;
  path: string;
  position: string; // JSON string in DB
  rotation: string | null; // JSON string in DB
  scale: number | string | null; // Number or JSON string in DB
  label: string | null;
}

// Helper type for position arrays
export type Position3Array = [number, number, number];

// API return types (what components will use)
export interface ModelWithParsedFields {
  id: number;
  path: string;
  position: Position3Array;
  rotation?: Position3Array;
  scale?: number | Position3Array;
  label?: string;
}

export interface SectionWithModel extends Section {
  model: ModelWithParsedFields;
}

export interface ProductWithModel extends Product {
  model: ModelWithParsedFields;
}

// Helper functions to parse JSON strings from DB
export function parsePosition(position: string): Position3Array {
  return JSON.parse(position) as Position3Array;
}

export function parseRotation(rotation: string | null): Position3Array | undefined {
  return rotation ? JSON.parse(rotation) as Position3Array : undefined;
}

export function parseScale(scale: number | string | null): number | Position3Array | undefined {
  if (scale === null) return undefined;
  if (typeof scale === 'number') return scale;
  return JSON.parse(scale) as Position3Array;
}
