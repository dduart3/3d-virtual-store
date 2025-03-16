import { STORE_SECTION_IDS } from "../../types/section";
import { SectionData } from "../store-sections";

export const womenBlousesSection = {
  id: STORE_SECTION_IDS.WOMEN_BLOUSES,
  name: "Blusas para mujer",
  model: {
    path: `displays/${STORE_SECTION_IDS.WOMEN_BLOUSES}`,
    position: [-158, -0.46, -66.9],
  },
  products: [
    {
      name: "Blusa Casual",
      description: "Blusa versátil para uso diario con diseño moderno y cómodo.",
      price: 49.99,
      modelId: "blouse",
      modelPosition: [0, -0.05, 8.5]
    },
    {
      name: "Blusa Formal Blanca",
      description: "Elegante blusa blanca para entornos profesionales y eventos formales.",
      price: 59.99,
      modelId: "white-blouse",
      modelPosition: [0, -1.3, 8]
    },
    {
      name: "Blusa Rosa",
      description: "Blusa ligera en tono rosa con detalles delicados y acabado premium.",
      price: 54.99,
      modelId: "pink-blouse",
      modelPosition: [0, -0.2, 4.2]
    },
  ],
} as SectionData;