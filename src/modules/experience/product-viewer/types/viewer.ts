import { ProductWithModel } from "../../store/types/product";

export type ViewerState = {
    isOpen: boolean;
    currentProduct: ProductWithModel | null;
    products: ProductWithModel[] | null;
    currentIndex: number;
    isLoading: boolean;
  };
  