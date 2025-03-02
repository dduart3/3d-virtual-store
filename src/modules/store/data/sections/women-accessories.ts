import { SECTION_IDS } from "../../../../shared/types/section";
import { ProductData, SectionData } from "../store-sections";

export const womenAccessoriesSection = {
  id: SECTION_IDS.WOMEN_ACCESSORIES,
  name: "Accesorios para mujer",
  model: {
    path: `displays/${SECTION_IDS.WOMEN_ACCESSORIES}`,
    position: [-157, -0.46, -62.6],
  },
  products: [
    {
      name: "Anillo de Diamante",
      description: "Elegante anillo con diamante de alta calidad y diseño atemporal.",
      price: 1299.99,
      model: {
        path: `products/${SECTION_IDS.WOMEN_ACCESSORIES}/ring`,
        position: [0, 0.2, 5],
        rotation: [-12, 0, 0],
        scale: 0.3
      },
    },
    {
      name: "Reloj Cadisen",
      description: "Reloj sofisticado con detalles premium y estilo contemporáneo.",
      price: 179.99,
      model: {
        path: `products/${SECTION_IDS.WOMEN_ACCESSORIES}/watch`,
        position: [0, -.4, 6],
        rotation: [0, 0, -.3],
        scale: 0.1
      },
    },
    {
      name: "Collar de Rubí",
      description: "Collar exclusivo con rubí central y acabados delicados en oro.",
      price: 899.99,
      model: {
        path: `products/${SECTION_IDS.WOMEN_ACCESSORIES}/necklace`,
        position: [0, 0.6, 7],
        scale: 0.012
      },
    },
  ],
} as SectionData;;
