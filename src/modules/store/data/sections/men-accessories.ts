import { SECTION_IDS } from "../../../../shared/types/section";
import { SectionData } from "../store-sections";

export const menAccessoriesSection = {
  id: SECTION_IDS.MEN_ACCESSORIES,
  name: "Accesorios para hombre",
  model: {
    path: `displays/${SECTION_IDS.MEN_ACCESSORIES}`,
    position: [-157, -0.46, -55.6],
  },
  products: [
    {
      name: "Lentes de Sol Aviador",
      description: "Gafas de sol estilo aviador con montura metálica y protección UV.",
      price: 129.99,
      model: {
        path: `products/${SECTION_IDS.MEN_ACCESSORIES}/aviator-sunglasses`,
        position: [0, -0.5, 5],
        scale: 0.1,
      },
    },
    {
      name: "Cartera de Cuero",
      description: "Cartera elegante de cuero genuino con múltiples compartimentos.",
      price: 79.99,
      model: {
        path: `products/${SECTION_IDS.MEN_ACCESSORIES}/wallet`,
        position: [0, -0.15, 6],
        scale: 0.5,
      },
    },
    {
      name: "Reloj Seiko",
      description: "Reloj clásico Seiko con mecanismo automático y correa de acero inoxidable.",
      price: 249.99,
      model: {
        path: `products/${SECTION_IDS.MEN_ACCESSORIES}/seiko`,
        position: [0, -0.7, 5],
        scale: 10,
      },
    },
  ],
}as SectionData;
