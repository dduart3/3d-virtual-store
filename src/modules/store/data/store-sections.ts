import { menShoesSection } from './sections/men-shoes';
import { menSuitsSection } from './sections/men-suits';
import { menPantsSection } from './sections/men-pants';
import { menShirtsSection } from './sections/men-shirts';
import { menHatsSection } from './sections/men-hats';
import { menAccessoriesSection } from './sections/men-accessories';
import { womenBlousesSection } from './sections/women-blouses';
import { womenDressesSection } from './sections/women-dresses';
import { womenSkirtsSection } from './sections/women-skirts';
import { womenAccessoriesSection } from './sections/women-accessories';
import { womenShoesSection } from './sections/women-shoes';
import { womenBagsSection } from './sections/women-bags';
import { Model } from '../../../shared/types/model';
import { SectionId } from '../types/store';

// Models should match your database schema


export interface SectionModel extends Model {
  id: SectionId;
  name: string;
}

export interface ProductData {
  name: string;
  description: string;
  price: number;
  stock?: number;
  model: Model;
}

export interface SectionData {
  id: SectionId; // Using SECTION_IDS values
  name: string;
  model: Model;
  products: ProductData[];
}

// Generate random stock between 1 and 50
const addRandomStock = (section: SectionData): SectionData => {
  return {
    ...section,
    products: section.products.map(product => ({
      ...product,
      stock: Math.floor(Math.random() * 50) + 1
    }))
  };
};

// Combine all sections and add random stock
export const storeData: SectionData[] = [
  addRandomStock(menShoesSection),
  addRandomStock(menSuitsSection),
  addRandomStock(menPantsSection),
  addRandomStock(menShirtsSection),
  addRandomStock(menHatsSection),
  addRandomStock(menAccessoriesSection),
  addRandomStock(womenBlousesSection),
  addRandomStock(womenDressesSection),
  addRandomStock(womenSkirtsSection),
  addRandomStock(womenAccessoriesSection),
  addRandomStock(womenShoesSection),
  addRandomStock(womenBagsSection)
];

// Create a map for easier access by section ID
export const storeDataMap: Record<string, SectionData> = storeData.reduce((acc, section) => {
  acc[section.id] = section;
  return acc;
}, {} as Record<string, SectionData>);

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
