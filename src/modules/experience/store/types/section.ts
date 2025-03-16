import { ModelWithParsedFields } from "../../types/model";

export interface Section {
    id: string;
    name: string;
  }
  
  export interface SectionWithModel extends Section {
    model: ModelWithParsedFields;
  }

export const STORE_SECTION_IDS = {
    MEN_SUITS: "men-suits",
    MEN_PANTS: "men-pants",
    MEN_SHIRTS: "men-shirts",
    MEN_HATS: "men-hats",
    MEN_SHOES: "men-shoes",
    MEN_ACCESSORIES: "men-accessories",
    WOMEN_BLOUSES: "women-blouses",
    WOMEN_DRESSES: "women-dresses",
    WOMEN_SKIRTS: "women-skirts",
    WOMEN_ACCESSORIES: "women-accessories",
    WOMEN_SHOES: "women-shoes",
    WOMEN_BAGS: "women-bags",
  } as const;
  
  export type SectionId = (typeof STORE_SECTION_IDS)[keyof typeof STORE_SECTION_IDS];