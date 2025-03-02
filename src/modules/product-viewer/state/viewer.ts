import { atom } from "jotai";
import { ViewerState } from "../types/viewer";

export const viewerStateAtom = atom<ViewerState>({
  isOpen: false,
  currentProduct: null,
  products: null,
  currentIndex: 0,
});
