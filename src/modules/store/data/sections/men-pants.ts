import { SECTION_IDS } from "../../../../shared/types/section";
import { ProductData, SectionData } from "../store-sections";

export const menPantsSection = {
  id: SECTION_IDS.MEN_PANTS,
  name: "Pantalones para hombre",
  model: {
    path: `displays/${SECTION_IDS.MEN_PANTS}`,
    position: [-152, -0.46, -51.1],
  },
  products: [
    {
      name: "Pantalón Formal",
      description: "Pantalón de vestir con acabado elegante, perfecto para ocasiones formales.",
      price: 89.99,
      model: {
        path: `products/${SECTION_IDS.MEN_PANTS}/pants`,
        position: [0, -1.5, 6],
        scale: 0.025
      },
    },
    {
      name: "Jeans Clásicos",
      description: "Jeans resistentes y cómodos para uso diario con corte tradicional.",
      price: 79.99,
      model: {
        path: `products/${SECTION_IDS.MEN_PANTS}/jeans`,
        position: [0, -1.5, 5],
        scale: 0.4
      },
    },
    {
      name: "Jeans Premium",
      description: "Jeans de alta calidad con tejido premium y acabado exclusivo.",
      price: 129.99,
      model: {
        path: `products/${SECTION_IDS.MEN_PANTS}/dark-jeans`,
        position: [0, -0.8, 8],
        scale: 0.001
      },
    },
  ],
} as SectionData;;
