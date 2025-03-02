import { Product } from "../../../shared/types/product";

export type ViewerState = {
    isOpen: boolean;
    currentProduct: Product | null;
    products: Product[] | null;
    currentIndex: number;
  };
  