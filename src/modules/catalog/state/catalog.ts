import { atom } from "jotai";
import { Product } from "../../../types/Product";

export const catalogAtom = atom<Product[]>([]);
export const selectedProductAtom = atom<Product | null>(null);
export const cartAtom = atom<Product[]>([]);
