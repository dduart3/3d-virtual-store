import { STORE_SECTION_IDS } from "../../types/store";
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
      name: "Falda Azul Elegante",
      description: "Falda azul versátil que combina con diversos estilos y ocasiones.",
      price: 69.99,
      model: {
        path: `products/${STORE_SECTION_IDS.WOMEN_SKIRTS}/blue-skirt`,
        position: [0, -.5, 8],
        scale: 0.001
      },
    },
    {
      name: "Falda Casual",
      description: "Falda de diseño casual para uso cotidiano con corte moderno.",
      price: 59.99,
      model: {
        path: `products/${STORE_SECTION_IDS.WOMEN_SKIRTS}/skirt`,
        position: [0, -.9, 7.5],
      },
    },
    {
      name: "Falda Larga",
      description: "Falda de longitud maxi con caída elegante y tejido premium.",
      price: 79.99,
      model: {
        path: `products/${STORE_SECTION_IDS.WOMEN_SKIRTS}/long-skirt`,
        position: [0, -.9, 7.5],
        scale: 0.001
      },
    },
  ],
}as SectionData;
