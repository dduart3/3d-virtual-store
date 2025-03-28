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

// Helper functions to parse JSON strings from DB
export function parsePosition(position: string): Position3Array {
  if (typeof position === 'string') {
    return JSON.parse(position) as Position3Array;
  }
  // If it's already an array, return it
  return position as unknown as Position3Array;
}

export function parseRotation(rotation: string | null): Position3Array | undefined {
  if (!rotation) return undefined;
  if (typeof rotation === 'string') {
    return JSON.parse(rotation) as Position3Array;
  }
  // If it's already an array, return it
  return rotation as unknown as Position3Array;
}

export function parseScale(scale: number | string | null): number | Position3Array | undefined {
  if (scale === null) return undefined;
  if (typeof scale === 'number') return scale;
  if (typeof scale === 'string') {
    try {
      // Try to parse as JSON first (for array scales)
      return JSON.parse(scale);
    } catch {
      // If it's not valid JSON, try to parse as a number
      const num = parseFloat(scale);
      return isNaN(num) ? 1 : num; // Default to 1 if parsing fails
    }
  }
  return scale as unknown as number | Position3Array;
}
