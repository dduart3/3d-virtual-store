import { atom } from "jotai";
import { ViewerState } from "../types/viewer";
import { getCatalogForSection } from "../../catalog/utils/getCatalogForSection";

const catalog = getCatalogForSection("women-skirts");

export const viewerStateAtom = atom<ViewerState>({
  isOpen: true,
  currentProduct: catalog?.products[0] ?? null,
  catalog: catalog ?? null,
  currentIndex: 0,
});