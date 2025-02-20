import { atom } from "jotai";
import { ViewerState } from "../../../types/Product";

export const viewerStateAtom = atom<ViewerState>({
  isOpen: true,
  currentProduct: null,
  catalog: [],
  currentIndex: 0,
});
