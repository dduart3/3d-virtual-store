import { atom } from "jotai";
import { ViewerState } from "../../../types/Product";

export const viewerStateAtom = atom<ViewerState>({
  isOpen: true, // Start with the viewer closed
  currentProduct: null,
  catalog: [], // Populate this with your product data
  currentIndex: 0,
});