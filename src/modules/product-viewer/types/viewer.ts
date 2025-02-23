import { Product } from "../../../shared/types/product";
import { Catalog } from "../../catalog/types/catalog";

export type ViewerState = {
    isOpen: boolean;
    currentProduct: Product | null;
    catalog: Catalog | null;
    currentIndex: number;
  };
  