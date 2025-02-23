import { SectionId, Sections } from "../../../shared/types/section";

export type StoreModels = Sections & {
  [key in SectionId]: {
    path: `displays/${key}`;
    position: [number, number, number];
    rotation?: [number, number, number];
    label?: string;
  };
};