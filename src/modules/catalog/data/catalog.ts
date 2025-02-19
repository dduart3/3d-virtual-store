import { Product } from "../../../types/Product";

const CATALOGS: Record<string, Product[]> = {
  menShoes: [
    {
      id: 'oxford',
      name: 'Oxford Brown Leather',
      description: 'Classic brown leather oxford shoes',
      price: 149.99,
      modelPath: '/products/men/shoes/oxford',
      category: 'menShoes',
    },
    // Add more shoes
  ],
  // Add more catalogs for other categories
}

export const getCatalogForModel = (modelId: string): Product[] => {
  return CATALOGS[modelId] || []
}