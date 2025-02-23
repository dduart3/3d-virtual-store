import { atom } from "jotai";
import { ViewerState } from "../../../types/product";

export const viewerStateAtom = atom<ViewerState>({
  isOpen: false, // Start with the viewer closed
  currentProduct: null,
  catalog: [], // Populate this with your product data
  currentIndex: 0,
});