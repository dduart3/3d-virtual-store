
import { SectionId, Sections } from "../../../shared/types/section";

import  { Product } from "../../store/types/store";

export type Catalogs = Sections & {
  [key in SectionId]: {
    products: Product[];
  };
};

export type Catalog = Catalogs[keyof Catalogs]