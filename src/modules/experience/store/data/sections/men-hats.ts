import { STORE_SECTION_IDS } from "../../types/section";
import { SectionData } from "../store-sections";

export const menHatsSection = {
  id: STORE_SECTION_IDS.MEN_HATS,
  name: "Sombreros para hombre",
  model: {
    path: `displays/${STORE_SECTION_IDS.MEN_HATS}`,
    position: [-148, -0.46, -55.6],
  },
  products: [
    {
      name: "Sombrero Fedora Clásico",
      description: "Fedora tradicional de alta calidad para un estilo distinguido.",
      price: 69.99,
      modelId: "fedora",
      modelPosition: [0, 0.2, 5],
      modelRotation: [0.1, 0, 0],
      modelScale: 0.058
    },
    {
      name: "Fedora de Verano",
      description: "Sombrero fedora de material ligero, perfecto para los días cálidos.",
      price: 59.99,
      modelId: "summer-fedora",
      modelPosition: [0, 0.6, 7]
    },
    {
      name: "Gorra Inglesa",
      description: "Elegante gorra de estilo inglés con diseño atemporal.",
      price: 49.99,
      modelId: "flat-cap",
      modelPosition: [0, -0.17, 3.8],
      modelScale: 0.085
    },
  ],
} as SectionData;
