import { STORE_SECTION_IDS } from "../../types/store";
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
      name: "Vestido Manga Larga",
      description: "Vestido elegante con mangas largas ideal para eventos formales.",
      price: 119.99,
      model: {
        path: `products/${STORE_SECTION_IDS.WOMEN_DRESSES}/long-sleeve-dress`,
        position: [0, -1.3, 7.7],
        scale: 0.01
      },
    },
    {
      name: "Vestido Azul Casual",
      description: "Vestido azul para uso diario con diseño contemporáneo y tejido cómodo.",
      price: 89.99,
      model: {
        path: `products/${STORE_SECTION_IDS.WOMEN_DRESSES}/blue-dress`,
        position: [0, -0.3, 7.7],
      },
    },
    {
      name: "Vestido de Fiesta",
      description: "Vestido sofisticado para ocasiones especiales con detalles refinados.",
      price: 149.99,
      model: {
        path: `products/${STORE_SECTION_IDS.WOMEN_DRESSES}/dress`,
        position: [0, -1.35, 7.7],
      },
    },
  ],
} as SectionData;
