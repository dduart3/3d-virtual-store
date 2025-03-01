import { atom } from "jotai";
import { ViewerState } from "../types/viewer";

export const viewerStateAtom = atom<ViewerState>({
  isOpen: false,
  currentProduct: null,
  catalog: null,
  currentIndex: 0,
});
