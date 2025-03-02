import { SECTION_IDS } from "../../../../shared/types/section";
import { ProductData, SectionData } from "../store-sections";

export const womenBagsSection = {
  id: SECTION_IDS.WOMEN_BAGS,
  name: "Bolsos para mujer",
  model: {
    path: `displays/${SECTION_IDS.WOMEN_BAGS}`,
    position: [-146.1, -0.46, -64.1],
    rotation: [0, -Math.PI / 1, 0],
  },
  products: [
    {
      name: "Bolso Valentino",
      description: "Bolso de lujo Valentino con diseño exclusivo y materiales premium.",
      price: 1499.99,
      model: {
        path: `products/${SECTION_IDS.WOMEN_BAGS}/valentino`,
        position: [0, -0.17, 8.7],
      },
    },
    {
      name: "Bolso Saint Laurent",
      description: "Elegante bolso Saint Laurent con acabados refinados y estilo atemporal.",
      price: 1899.99,
      model: {
        path: `products/${SECTION_IDS.WOMEN_BAGS}/saint`,
        position: [0, -0.1, 8.9],
      },
    },
    {
      name: "Bolso Gucci",
      description: "Exclusivo bolso Gucci con el icónico diseño de la marca y alta calidad.",
      price: 2199.99,
      model: {
        path: `products/${SECTION_IDS.WOMEN_BAGS}/gucci`,
        position: [0, 0, 4.3],
        scale: 0.75,
      },
    },
  ],
}as SectionData;
