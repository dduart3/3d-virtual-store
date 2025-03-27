import { STORE_SECTION_IDS } from "../../types/section";
import { SectionData } from "../store-sections";

export const womenDressesSection = {
  id: STORE_SECTION_IDS.WOMEN_DRESSES,
  name: "Vestidos para mujer",
  model: {
    path: `displays/${STORE_SECTION_IDS.WOMEN_DRESSES}`,
    position: [-152, -0.46, -66.9],
  },
  products: [
    {
      id: "long-sleeve-dress",
      name: "Vestido Manga Larga",
      description: "Vestido elegante con mangas largas ideal para eventos formales.",
      price: 119.99,
      modelId: "long-sleeve-dress",
      modelPosition: [0, -1.3, 7.7],
      modelScale: 0.01
    },
    {
      id: "blue-dress",
      name: "Vestido Azul Casual",
      description: "Vestido azul para uso diario con diseño contemporáneo y tejido cómodo.",
      price: 89.99,
      modelId: "blue-dress",
      modelPosition: [0, -0.3, 7.7]
    },
    {
      id: "dress",
      name: "Vestido de Fiesta",
      description: "Vestido sofisticado para ocasiones especiales con detalles refinados.",
      price: 149.99,
      modelId: "dress",
      modelPosition: [0, -1.35, 7.7]
    },
  ],
} as SectionData;