export const SECTION_IDS = [
  "men-shoes",
  "men-suits",
  "men-accessories",
  "men-shirts",
  "men-pants",
  "men-hats",
  "women-shoes",
  "women-accessories",
  "women-dresses",
  "women-blouses",
  "women-skirts",
  "women-bags",
] as const;

export type SectionId = typeof SECTION_IDS[number]

export interface StoreSection {
  id: SectionId
  // other properties
}

type ValidateSections<T extends { id: SectionId }[]> = T & {
  length: typeof SECTION_IDS['length']
} & ([SectionId] extends [T[number]['id']] ? unknown : never)

const sections: ValidateSections<StoreSection[]> = [
  { id: 'men-shoes', /* other props */ },
  { id: 'men-suits', /* other props */ },
  { id: 'men-accessories', /* other props */ },
  { id: 'men-shirts', /* other props */ },
  { id: 'men-pants', /* other props */ },
  { id: 'men-hats', /* other props */ },
  { id: 'women-shoes', /* other props */ },
  { id: 'women-accessories', /* other props */ },
  { id: 'women-dresses', /* other props */ },
  { id: 'women-blouses', /* other props */ },
  { id: 'women-skirts', /* other props */ },
  { id: 'women-bags', /* other props */ }
]

