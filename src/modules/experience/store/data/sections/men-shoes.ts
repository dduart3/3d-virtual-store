import { STORE_SECTION_IDS } from "../../types/section";
import { SectionData } from "../store-sections";

export const menShoesSection = {
  id: STORE_SECTION_IDS.MEN_SHOES,
  name: "Zapatos de hombre",
  model: {
    path: `displays/${STORE_SECTION_IDS.MEN_SHOES}`,
    position: [-153.8, -0.46, -55.6],
  },
  products: [
    {
      name: "Mocasines",
      description: "Elegantes mocasines de cuero genuino con costura detallada y diseño clásico.",
      price: 99.99,
      modelId: "oxford",
      modelPosition: [0, -0.2, 7.5],
      modelScale: 3,
    },
    {
      name: "Zapatos de vestir claros",
      description: "Zapatos formales de tono claro con acabado premium y diseño italiano sofisticado.",
      price: 299.99,
      modelId: "magnanni",
      modelPosition: [0, -0.02, 9.1],
      modelScale: 0.001,
    },
    {
      name: "Zapatos de vestir oscuros",
      description: "Zapatos de vestir en tono oscuro con cuero de alta calidad y suela resistente.",
      price: 249.99,
      modelId: "rossi",
      modelPosition: [0, 0, 6.5],
      modelScale: 0.4,
    },
  ],
} as SectionData;
