import { ProductWithModel } from "../../../shared/types/app";

export type ViewerState = {
    isOpen: boolean;
    currentProduct: ProductWithModel | null;
    products: ProductWithModel[] | null;
    currentIndex: number;
  };
  