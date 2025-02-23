import { sections } from "../../../shared/data/section";
import { SECTION_IDS } from "../../../shared/types/section";
import { Catalog } from "../types/catalog";

export const catalogs: Catalog[] = [
  {
    ...sections[SECTION_IDS.MEN_SHOES],
    products: [
      {
        id: "magnanni",
        name: "Magnanni",
        price: 99.99,
        description: "Los mas o menos, puede ser ",
        model:{
          path: `products/${SECTION_IDS.MEN_SHOES}/magnanni`,
          position: [0, -.02, 9.1],
          scale: 0.001,
        }
      },
      {
        id: "oxford",
        name: "Oxford",
        price: 150.99,
        description: "Estamos mejorando",
        model:{
          path: `products/${SECTION_IDS.MEN_SHOES}/oxford`,
          position: [0, -.2, 7.5],
          scale: 3
        },
      },
      {
        id: "rossi",
        name: "Rossi",
        price: 299.99,
        description: "Los definitivos",
        model:{
          path: `products/${SECTION_IDS.MEN_SHOES}/rossi`,
          position: [0, 0, 6.5],
          scale: 0.4,
        },
      },
    ],
  },
  {
    ...sections[SECTION_IDS.WOMEN_SHOES],
    products: [
      {
        id: "high-heel",
        name: "Tacones altos",
        price: 99.99,
        description: "Para los transfors y prepagos ",
        model:{
          path: `products/${SECTION_IDS.WOMEN_SHOES}/high-heels`,
          position: [0,-.15,4.7],
          scale: 0.08
        }
      },
      {
        id: "low-heel",
        name: "Tacones bajos",
        price: 99.99,
        description: "Para los transfors y prepagos ",
        model:{
          path: `products/${SECTION_IDS.WOMEN_SHOES}/low-heels`,
          position: [0,-.15,4.7],
        }
      },
      {
        id: "boot",
        name: "Botas",
        price: 99.99,
        description: "Para los transfors y prepagos ",
        model:{
          path: `products/${SECTION_IDS.WOMEN_SHOES}/boot`,
          position: [0,.45,4.4],
          scale: 0.8
        }
      },
    ],
  },
];
