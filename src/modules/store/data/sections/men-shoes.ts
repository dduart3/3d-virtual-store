import { STORE_SECTION_IDS } from "../../types/store";
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
      description: "",
      price: 99.99,
      model: {
        path: `products/${STORE_SECTION_IDS.MEN_SHOES}/oxford`,
        position: [0, -0.2, 7.5],
        scale: 3,
      },
    },
    {
      name: "Zapatos de vestir claros",
      description: "",
      price: 299.99,
      model: {
        path: `products/${STORE_SECTION_IDS.MEN_SHOES}/magnanni`,
        position: [0, -0.02, 9.1],
        scale: 0.001,
      },
    },
    {
      name: "Zapatos de vestir oscuros",
      description: "",
      price: 249.99,
      model: {
        path: `products/${STORE_SECTION_IDS.MEN_SHOES}/rossi`,
        position: [0, 0, 6.5],
        scale: 0.4,
      },
    },
  ],
}as SectionData;
