import { STORE_SECTION_IDS } from "../../types/store";
import { SectionData } from "../store-sections";

export const womenShoesSection = {
  id: STORE_SECTION_IDS.WOMEN_SHOES,
  name: "Zapatos para mujer",
  model: {
    path: `displays/${STORE_SECTION_IDS.WOMEN_SHOES}`,
    position: [-151.8, -0.46, -64.1],
    rotation: [0, -Math.PI / 1, 0],
  },
  products: [
    {
      name: "Tacones Altos",
      description: "Elegantes tacones altos para ocasiones formales y eventos especiales.",
      price: 129.99,
      modelId: "high-heels",
      modelPosition: [0, -0.15, 4.7],
      modelScale: 0.08
    },
    {
      name: "Tacones Bajos",
      description: "Tacones de altura media, cómodos para uso prolongado con diseño versátil.",
      price: 99.99,
      modelId: "low-heels",
      modelPosition: [0, -0.15, 4.7],
      modelRotation: [0, 0, -25]
    },
    {
      name: "Botas de Moda",
      description: "Botas estilizadas con diseño contemporáneo para complementar diversos looks.",
      price: 149.99,
      modelId: "boot",
      modelPosition: [0, 0.45, 4.4],
      modelScale: 0.8
    },
  ],
} as SectionData;