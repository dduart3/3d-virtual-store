import { STORE_SECTION_IDS } from "../../types/store";
import { SectionData } from "../store-sections";

export const menShirtsSection = {
  id: STORE_SECTION_IDS.MEN_SHIRTS,
  name: "Camisas y suéteres para hombre",
  model: {
    path: `displays/${STORE_SECTION_IDS.MEN_SHIRTS}`,
    position: [-158, -0.46, -51.1],
  },
  products: [
    {
      name: "Suéter Casual",
      description: "Suéter confortable y moderno para un estilo casual elegante.",
      price: 59.99,
      model: {
        path: `products/${STORE_SECTION_IDS.MEN_SHIRTS}/sweater`,
        position: [0, -3, 6],
        scale: 0.5
      },
    },
    {
      name: "Camisa Informal",
      description: "Camisa ligera y versátil para un look relajado pero presentable.",
      price: 45.99,
      model: {
        path: `products/${STORE_SECTION_IDS.MEN_SHIRTS}/shirt`,
        position: [0, -0.1, 4.5],
        scale: 0.07
      },
    },
    {
      name: "Camisa de Vestir",
      description: "Camisa elegante de corte ajustado, ideal para ocasiones formales.",
      price: 69.99,
      model: {
        path: `products/${STORE_SECTION_IDS.MEN_SHIRTS}/long-shirt`,
        position: [0, -1.42, 8],
      },
    },
  ],
} as SectionData;;
