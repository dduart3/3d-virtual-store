import { menShoesSection } from "./sections/men-shoes";
import { menSuitsSection } from "./sections/men-suits";
import { menPantsSection } from "./sections/men-pants";
import { menShirtsSection } from "./sections/men-shirts";
import { menHatsSection } from "./sections/men-hats";
import { menAccessoriesSection } from "./sections/men-accessories";
import { womenBlousesSection } from "./sections/women-blouses";
import { womenDressesSection } from "./sections/women-dresses";
import { womenSkirtsSection } from "./sections/women-skirts";
import { womenAccessoriesSection } from "./sections/women-accessories";
import { womenShoesSection } from "./sections/women-shoes";
import { womenBagsSection } from "./sections/women-bags";
import { SectionId } from "../types/section";

// Models should match your database schema
export interface ModelData {
  path: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  label?: string;
}

export interface ProductData {
  name: string;
  description: string;
  price: number;
  stock?: number;
  modelId: string;
  modelPosition: [number, number, number];
  modelRotation?: [number, number, number];
  modelScale?: number | [number, number, number];
}

export interface SectionData {
  id: SectionId; // Using STORE_SECTION_IDS values
  name: string;
  model: ModelData;
  products: ProductData[];
}

export interface SectionModel extends ModelData {
  id: SectionId;
  name: string;
}

// Generate random stock between 1 and 50
const addRandomStock = (section: SectionData): SectionData => {
  return {
    ...section,
    products: section.products.map((product) => ({
      ...product,
      stock: Math.floor(Math.random() * 50) + 1,
    })),
  };
};

// Combine all sections and add random stock
export const storeData: SectionData[] = [
  menShoesSection,
  menSuitsSection,
  menPantsSection,
  menShirtsSection,
  menHatsSection,
  menAccessoriesSection,
  womenBlousesSection,
  womenDressesSection,
  womenSkirtsSection,
  womenAccessoriesSection,
  womenShoesSection,
  womenBagsSection,
].map(addRandomStock);

// Create a map for easier access by section ID
export const storeDataMap: Record<string, SectionData> = storeData.reduce(
  (acc, section) => {
    acc[section.id] = section;
    return acc;
  },
  {} as Record<string, SectionData>
);

/*

// Helper function to get a section by ID
export const getSectionById = (id: string): SectionData | undefined => {
  return storeDataMap[id];
};

// Helper function to get all products across all sections
export const getAllProducts = (): ProductData[] => {
  return storeData.flatMap(section => section.products);
};

// Helper function to get all products for a specific section
export const getProductsBySection = (sectionId: string): ProductData[] => {
  const section = getSectionById(sectionId);
  return section ? section.products : [];
};

// Add this interface for section models


// Add this helper function to get all section models
export const getAllSectionModels = (): SectionModel[] => {
  return storeData.map(section => ({
    id: section.id,
    name: section.name,
     ...section.model
  }));
};

// If you need it as a map instead of an array:
export const getSectionModelsMap = (): Record<string, Model> => {
  return storeData.reduce((acc, section) => {
    acc[section.id] = section.model;
    return acc;
  }, {} as Record<string, Model>);
};
*/
