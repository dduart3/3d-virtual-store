import { Product } from "../../../shared/types/product";
import { SectionId, Sections } from "../../../shared/types/section";

export type Catalogs = Sections & {
  [key in SectionId]: {
    products: Product[];
  };
};

export type Catalog = Catalogs[keyof Catalogs]