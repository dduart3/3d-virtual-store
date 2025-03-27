import { STORE_SECTION_IDS } from "../../types/section";
import { SectionData } from "../store-sections";

export const menPantsSection = {
  id: STORE_SECTION_IDS.MEN_PANTS,
  name: "Pantalones para hombre",
  model: {
    path: `displays/${STORE_SECTION_IDS.MEN_PANTS}`,
    position: [-152, -0.46, -51.1],
  },
  products: [
    {
      id:"pants",
      name: "Pantalón Formal",
      description: "Pantalón de vestir con acabado elegante, perfecto para ocasiones formales.",
      price: 89.99,
      modelId: "pants",
      modelPosition: [0, -1.5, 6],
      modelScale: 0.025
    },
    {
      id:"jeans",
      name: "Jeans Clásicos",
      description: "Jeans resistentes y cómodos para uso diario con corte tradicional.",
      price: 79.99,
      modelId: "jeans",
      modelPosition: [0, -1.5, 5],
      modelScale: 0.4
    },
    { 
      id:"dark-jeans",
      name: "Jeans Oscuros",
      description: "Jeans oscuros con un acabado elegante y ajuste perfecto.",
      price: 129.99,
      modelId: "dark-jeans",
      modelPosition: [0, -0.8, 8],
      modelScale: 0.001
    },
  ],
} as SectionData;