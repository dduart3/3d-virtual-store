export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  modelPath: string;
  category: string;
};

export type ViewerState = {
  isOpen: boolean;
  currentProduct: Product | null;
  catalog: Product[];
  currentIndex: number;
};
