import { STORE_SECTION_IDS } from "../../types/store";
import { SectionData } from "../store-sections";

export const menAccessoriesSection = {
  id: STORE_SECTION_IDS.MEN_ACCESSORIES,
  name: "Accesorios para hombre",
  model: {
    path: `displays/${STORE_SECTION_IDS.MEN_ACCESSORIES}`,
    position: [-157, -0.46, -55.6],
  },
  products: [
    {
      name: "Lentes de Sol Aviador",
      description: "Gafas de sol estilo aviador con montura metálica y protección UV.",
      price: 129.99,
      modelId: "aviator-sunglasses",
      modelPosition: [0, -0.5, 5],
      modelScale: 0.1
    },
    {
      name: "Cartera de Cuero",
      description: "Cartera elegante de cuero genuino con múltiples compartimentos.",
      price: 79.99,
      modelId: "wallet",
      modelPosition: [0, -0.15, 6],
      modelScale: 0.5
    },
    {
      name: "Reloj Seiko",
      description: "Reloj clásico Seiko con mecanismo automático y correa de acero inoxidable.",
      price: 249.99,
      modelId: "seiko",
      modelPosition: [0, -0.7, 5],
      modelScale: 10
    },
  ],
} as SectionData;