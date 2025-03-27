import { STORE_SECTION_IDS } from "../../types/section";
import { SectionData } from "../store-sections";

export const womenSkirtsSection = {
  id: STORE_SECTION_IDS.WOMEN_SKIRTS,
  name: "Faldas para mujer",
  model: {
    path: `displays/${STORE_SECTION_IDS.WOMEN_SKIRTS}`,
    position: [-146, -0.46, -66.9],
  },
  products: [
    {
      id: "blue-skirt",
      name: "Falda Azul Elegante",
      description: "Falda azul versátil que combina con diversos estilos y ocasiones.",
      price: 69.99,
      modelId: "blue-skirt",
      modelPosition: [0, -.5, 8],
      modelScale: 0.001
    },
    {
      id: "skirt",
      name: "Falda Casual",
      description: "Falda de diseño casual para uso cotidiano con corte moderno.",
      price: 59.99,
      modelId: "skirt",
      modelPosition: [0, -.9, 7.5]
    },
    {
      id: "long-skirt",
      name: "Falda Larga",
      description: "Falda de longitud maxi con caída elegante y tejido premium.",
      price: 79.99,
      modelId: "long-skirt",
      modelPosition: [0, -.9, 7.5],
      modelScale: 0.001
    },
  ],
} as SectionData;
