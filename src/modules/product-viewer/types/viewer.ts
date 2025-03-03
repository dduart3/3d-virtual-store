import { Product } from "../../../shared/types/product";
import { ProductData } from "../../store/data/store-sections";

export type ViewerState = {
    isOpen: boolean;
    currentProduct: ProductData | null;
    products: ProductData[] | null;
    currentIndex: number;
  };
  