import { sections } from "../../../shared/data/section";
import { SECTION_IDS } from "../../../shared/types/section";
import { StoreModels } from "../types/store-models";

export const storeModels: StoreModels = {
  [SECTION_IDS.MEN_SUITS]: {
    path: `displays/${SECTION_IDS.MEN_SUITS}`,
    position: [-146, -0.46, -51.1],
    ...sections[SECTION_IDS.MEN_SUITS],
  },
  [SECTION_IDS.MEN_PANTS]: {
    path: `displays/${SECTION_IDS.MEN_PANTS}`,
    position: [-152, -0.46, -51.1],
    ...sections[SECTION_IDS.MEN_PANTS],
  },
  [SECTION_IDS.MEN_SHIRTS]: {
    path: `displays/${SECTION_IDS.MEN_SHIRTS}`,
    position: [-158, -0.46, -51.1],
    ...sections[SECTION_IDS.MEN_SHIRTS],
  },
  [SECTION_IDS.MEN_HATS]: {
    path: `displays/${SECTION_IDS.MEN_HATS}`,
    position: [-148, -0.46, -55.6],
    ...sections[SECTION_IDS.MEN_HATS],
  },
  [SECTION_IDS.MEN_SHOES]: {
    path: `displays/${SECTION_IDS.MEN_SHOES}`,
    position: [-153.8, -0.46, -55.6],
    ...sections[SECTION_IDS.MEN_SHOES],
  },
  [SECTION_IDS.MEN_ACCESSORIES]: {
    path: `displays/${SECTION_IDS.MEN_ACCESSORIES}`,
    position: [-157, -0.46, -55.6],
    ...sections[SECTION_IDS.MEN_ACCESSORIES],
  },
  [SECTION_IDS.WOMEN_BLOUSES]: {
    path: `displays/${SECTION_IDS.WOMEN_BLOUSES}`,
    position: [-158, -0.46, -66.9],
    ...sections[SECTION_IDS.WOMEN_BLOUSES],
  },
  [SECTION_IDS.WOMEN_DRESSES]: {
    path: `displays/${SECTION_IDS.WOMEN_DRESSES}`,
    position: [-152, -0.46, -66.9],
    ...sections[SECTION_IDS.WOMEN_DRESSES],
  },
  [SECTION_IDS.WOMEN_SKIRTS]: {
    path: `displays/${SECTION_IDS.WOMEN_SKIRTS}`,
    position: [-146, -0.46, -66.9],
    ...sections[SECTION_IDS.WOMEN_SKIRTS],
  },
  [SECTION_IDS.WOMEN_SHOES]: {
    path: `displays/${SECTION_IDS.WOMEN_SHOES}`,
    position: [-151.8, -0.46, -64.1],
    rotation: [0, -Math.PI / 1, 0],
    ...sections[SECTION_IDS.WOMEN_SHOES],
  },
  [SECTION_IDS.WOMEN_ACCESSORIES]: {
    path: `displays/${SECTION_IDS.WOMEN_ACCESSORIES}`,
    position: [-157, -0.46, -62.6],
    ...sections[SECTION_IDS.WOMEN_ACCESSORIES],
  },
  [SECTION_IDS.WOMEN_BAGS]: {
    path: `displays/${SECTION_IDS.WOMEN_BAGS}`,
    position: [-146.1, -0.46, -64.1],
    rotation: [0, -Math.PI / 1, 0],
    ...sections[SECTION_IDS.WOMEN_BAGS],
  },
};

