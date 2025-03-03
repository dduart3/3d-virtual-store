import { STORE_SECTION_IDS } from "../../types/store";
import { SectionData } from "../store-sections";

export const menSuitsSection = {
  id: STORE_SECTION_IDS.MEN_SUITS,
  name: "Trajes para hombre",
  model: {
    path: `displays/${STORE_SECTION_IDS.MEN_SUITS}`,
    position: [-146, -0.46, -51.1],
  },
  products: [
    {
      name: "Traje Formal Negro",
      description: "Elegante traje negro para ocasiones formales y eventos especiales.",
      price: 349.99,
      modelId: "suit",
      modelPosition: [0, -1.15, 8],
      modelScale: 0.01
    },
    {
      name: "Traje Ejecutivo Azul",
      description: "Traje azul marino de corte moderno, ideal para el ambiente corporativo.",
      price: 399.99,
      modelId: "black-suit",
      modelPosition: [0, -.35, 7.5],
      modelScale: 0.01
    },
    {
      name: "Traje de Gala",
      description: "Sofisticado traje de gala con acabados premium para eventos de etiqueta.",
      price: 499.99,
      modelId: "tailcoat-suit",
      modelPosition: [0, -0.5, 7]
    },
  ],
} as SectionData;
