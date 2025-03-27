import { STORE_SECTION_IDS } from "../../types/section";
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
      id:"sweater",
      name: "Suéter Casual",
      description: "Suéter confortable y moderno para un estilo casual elegante.",
      price: 59.99,
      modelId: "sweater",
      modelPosition: [0, -3, 6],
      modelScale: 0.5
    },
    {
      id:"shirt",
      name: "Camisa Informal",
      description: "Camisa ligera y versátil para un look relajado pero presentable.",
      price: 45.99,
      modelId: "shirt",
      modelPosition: [0, -0.1, 4.5],
      modelScale: 0.07
    },
    {
      id:"long-shirt",
      name: "Camisa de Vestir",
      description: "Camisa elegante de corte ajustado, ideal para ocasiones formales.",
      price: 69.99,
      modelId: "long-shirt",
      modelPosition: [0, -1.42, 8]
    },
  ],
} as SectionData;
