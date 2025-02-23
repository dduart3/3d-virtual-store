import { Model } from "./model";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  priceId?: string;
  model: Model;
}