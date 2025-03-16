import { ModelWithParsedFields } from "../../types/model";

export interface Product {
    id: string;
    section_id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    thumbnail_path: string;
    stripe_product_id?: string;
    stripe_price_id?: string;
  }
  
  export interface ProductWithModel extends Product {
    model: ModelWithParsedFields;
  }
  
  