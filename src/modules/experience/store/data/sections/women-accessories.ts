import { STORE_SECTION_IDS } from "../../types/section";
import { SectionData } from "../store-sections";

export const womenAccessoriesSection = {
  id: STORE_SECTION_IDS.WOMEN_ACCESSORIES,
  name: "Accesorios para mujer",
  model: {
    path: `displays/${STORE_SECTION_IDS.WOMEN_ACCESSORIES}`,
    position: [-157, -0.46, -62.6],
  },
  products: [
    {
      id: "ring",
      name: "Anillo de Diamante",
      description: "Elegante anillo con diamante de alta calidad y diseño atemporal.",
      price: 1299.99,
      modelId: "ring",
      modelPosition: [0, 0.2, 5],
      modelRotation: [-12, 0, 0],
      modelScale: 0.3
    },
    {
      id: "watch",
      name: "Reloj Cadisen",
      description: "Reloj sofisticado con detalles premium y estilo contemporáneo.",
      price: 179.99,
      modelId: "watch",
      modelPosition: [0, -.4, 6],
      modelRotation: [0, 0, -.3],
      modelScale: 0.1
    },
    {
      id: "necklace",
      name: "Collar de Rubí",
      description: "Collar exclusivo con rubí central y acabados delicados en oro.",
      price: 899.99,
      modelId: "necklace",
      modelPosition: [0, 0.6, 7],
      modelScale: 0.012
    },
  ],
} as SectionData;