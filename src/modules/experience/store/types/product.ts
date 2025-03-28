import { ModelWithParsedFields } from "../../types/model";

export interface Product {
    id: string;
    section_id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    thumbnail_url: string;
  }
  
  export interface ProductWithModel extends Product {
    model: ModelWithParsedFields;
  }
