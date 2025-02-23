export const SECTION_IDS = [
  "menShoes",
  "womenShoes",
  "menAccessories",
  "womenAccessories",
  "menShirts",
  "menPants",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];
