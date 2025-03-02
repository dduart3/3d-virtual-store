import { SECTION_IDS } from "../../../../shared/types/section";
import { ProductData, SectionData } from "../store-sections";

export const womenBlousesSection = {
  id: SECTION_IDS.WOMEN_BLOUSES,
  name: "Blusas para mujer",
  model: {
    path: `displays/${SECTION_IDS.WOMEN_BLOUSES}`,
    position: [-158, -0.46, -66.9],
  },
  products: [
    {
      name: "Blusa Casual",
      description: "Blusa versátil para uso diario con diseño moderno y cómodo.",
      price: 49.99,
      model: {
        path: `products/${SECTION_IDS.WOMEN_BLOUSES}/blouse`,
        position: [0, -0.05, 8.5],
      },
    },
    {
      name: "Blusa Formal Blanca",
      description: "Elegante blusa blanca para entornos profesionales y eventos formales.",
      price: 59.99,
      model: {
        path: `products/${SECTION_IDS.WOMEN_BLOUSES}/white-blouse`,
        position: [0, -1.3, 8],
      },
    },
    {
      name: "Blusa Rosa",
      description: "Blusa ligera en tono rosa con detalles delicados y acabado premium.",
      price: 54.99,
      model: {
        path: `products/${SECTION_IDS.WOMEN_BLOUSES}/pink-blouse`,
        position: [0, -0.2, 4.2],
      },
    },
  ],
} as SectionData;
