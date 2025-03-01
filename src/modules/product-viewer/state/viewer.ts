import { atom } from "jotai";
import { ViewerState } from "../types/viewer";

export const viewerStateAtom = atom<ViewerState>({
  isOpen: true,
  currentProduct: null,
  catalog: null,
  currentIndex: 0,
});
