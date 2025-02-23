import { atom } from "jotai";
import { ViewerState } from "../types/viewer";
import { getCatalogForSection } from "../../catalog/utils/getCatalogForSection";

const catalog = getCatalogForSection("men-shoes");

export const viewerStateAtom = atom<ViewerState>({
  isOpen: true,
  currentProduct: catalog?.products[0] ?? null,
  catalog: catalog ?? null,
  currentIndex: 0,
});