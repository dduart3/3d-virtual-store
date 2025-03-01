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
        model: {
          path: `products/${SECTION_IDS.MEN_SHOES}/magnanni`,
          position: [0, -0.02, 9.1],
          scale: 0.001,
        },
      },
      {
        id: "oxford",
        name: "Oxford",
        price: 150.99,
        description: "Estamos mejorando",
        model: {
          path: `products/${SECTION_IDS.MEN_SHOES}/oxford`,
          position: [0, -0.2, 7.5],
          scale: 3,
        },
      },
      {
        id: "rossi",
        name: "Rossi",
        price: 299.99,
        description: "Los definitivos",
        model: {
          path: `products/${SECTION_IDS.MEN_SHOES}/rossi`,
          position: [0, 0, 6.5],
          scale: 0.4,
        },
      },
    ],
  },
  {
    ...sections[SECTION_IDS.MEN_SUITS],
    products: [
      {
        id: "suit",
        name: "Suit",
        price: 99.99,
        description: "Los mas o menos, puede ser ",
        model: {
          path: `products/${SECTION_IDS.MEN_SUITS}/suit`,
          position: [0,-1.15,8],
          scale: 0.01
        },
      },
      {
        id: "suit",
        name: "Suit",
        price: 99.99,
        description: "Los mas o menos, puede ser ",
        model: {
          path: `products/${SECTION_IDS.MEN_SUITS}/black-suit`,
          position: [0,-.35,7.5],
          scale: 0.01
        },
      },
      {
        id: "suit",
        name: "Suit",
        price: 99.99,
        description: "Los mas o menos, puede ser ",
        model: {
          path: `products/${SECTION_IDS.MEN_SUITS}/tailcoat-suit`,
          position: [0,-0.5,7]
        },
      },
    ],
  },
  {
    ...sections[SECTION_IDS.MEN_HATS],
    products: [
      {
        id: "fedora",
        name: "Fedora",
        price: 99.99,
        description: "De Mafia I",
        model: {
          path: `products/${SECTION_IDS.MEN_HATS}/fedora`,
          position: [0, 0.2, 5],
          rotation: [0.1, 0, 0],
          scale: 0.058,
        },
      },

      {
        id: "summer-fedora",
        name: "Fedora de verano",
        price: 99.99,
        description: "De Mafia I",
        model: {
          path: `products/${SECTION_IDS.MEN_HATS}/summer-fedora`,
          position: [0, 0.6, 7],
        },
      },
      {
        id: "flat-cap",
        name: "Gorra inglesa",
        price: 99.99,
        description: "la q sale en los piki blainder",
        model: {
          path: `products/${SECTION_IDS.MEN_HATS}/flat-cap`,
          position: [0, -0.17, 3.8],
          scale: 0.085,
        },
      },
    ],
  },
  {
    ...sections[SECTION_IDS.MEN_SHIRTS],
    products: [
      {
        id: "sweater",
        name: "Sueter",
        price: 99.99,
        description: "un sueter",
        model: {
          path: `products/${SECTION_IDS.MEN_SHIRTS}/sweater`,
          position: [0, -3, 6],
          scale: 0.5
        },
      },
      {
        id: "shirt",
        name: "Franela",
        price: 99.99,
        description: "una franela",
        model: {
          path: `products/${SECTION_IDS.MEN_SHIRTS}/shirt`,
          position: [0,-0.1,4.5],
          scale: 0.07

        },
      },
      {
        id: "long-shirt",
        name: "Camisa",
        price: 99.99,
        description: "una camisa",
        model: {
          path: `products/${SECTION_IDS.MEN_SHIRTS}/long-shirt`,
          position: [0,-1.42,8],
        },
      },
    ],
  },
  {
    ...sections[SECTION_IDS.MEN_PANTS],
    products: [
      {
        id: "pants",
        name: "Pantalones",
        price: 99.99,
        description: "pantalones",
        model: {
          path: `products/${SECTION_IDS.MEN_PANTS}/pants`,
          position: [0, -1.5, 6],
          scale: 0.025
        },
      },
      {
        id: "jeans",
        name: "Jeans",
        price: 99.99,
        description: "son unos levi papa, los culito parao",
        model: {
          path: `products/${SECTION_IDS.MEN_PANTS}/jeans`,
          position: [0, -1.5, 5],
          scale: 0.4

        },
      },
      {
        id: "dark-jeans",
        name: "Jeans oscuros",
        price: 99.99,
        description: "son unos levi papa, los culito parao",
        model: {
          path: `products/${SECTION_IDS.MEN_PANTS}/dark-jeans`,
          position: [0, -0.8, 8],
          scale: 0.001

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
        model: {
          path: `products/${SECTION_IDS.WOMEN_SHOES}/high-heels`,
          position: [0, -0.15, 4.7],
          scale: 0.08,
        },
      },
      {
        id: "low-heel",
        name: "Tacones bajos",
        price: 99.99,
        description: "Si ",
        model: {
          path: `products/${SECTION_IDS.WOMEN_SHOES}/low-heels`,
          position: [0, -0.15, 4.7],
          rotation: [0, 0, -25],
        },
      },
      {
        id: "boot",
        name: "Botas",
        price: 99.99,
        description: "Para los transfors y prepagos ",
        model: {
          path: `products/${SECTION_IDS.WOMEN_SHOES}/boot`,
          position: [0, 0.45, 4.4],
          scale: 0.8,
        },
      },
    ],
  },
  {
    ...sections[SECTION_IDS.MEN_ACCESSORIES],
    products: [
      {
        id: "aviator-sunglasses",
        name: "Lentes Aviador ",
        price: 99.99,
        description: "Naguevona de cacheroso",
        model: {
          path: `products/${SECTION_IDS.MEN_ACCESSORIES}/aviator-sunglasses`,
          position: [0, -0.5, 5],
          scale: 0.1,
        },
      },
      {
        id: "wallet",
        name: "Cartera",
        price: 99.99,
        description: "La mejor cartera del mundo",
        model: {
          path: `products/${SECTION_IDS.MEN_ACCESSORIES}/wallet`,
          position: [0, -0.15, 6],
          scale: 0.5,
        },
      },
      {
        id: "seiko",
        name: "Reloj Seiko",
        price: 99.99,
        description: "Naguevona de cacheroso",
        model: {
          path: `products/${SECTION_IDS.MEN_ACCESSORIES}/seiko`,
          position: [0, -0.7, 5],
          scale: 10,
        },
      },
    ],
  },
  {
    ...sections[SECTION_IDS.WOMEN_BAGS],
    products: [
      {
        id: "valentino",
        name: "Bolso Valentino",
        price: 99.99,
        description: "si",
        model: {
          path: `products/${SECTION_IDS.WOMEN_BAGS}/valentino`,
          position: [0, -0.17, 8.7],
        },
      },
      {
        id: "saint",
        name: "Bolso Saint",
        price: 99.99,
        description: "si",
        model: {
          path: `products/${SECTION_IDS.WOMEN_BAGS}/saint`,
          position: [0, -0.1, 8.9],
        },
      },
      {
        id: "gucci",
        name: "Bolso Gucci",
        price: 99.99,
        description: "si",
        model: {
          path: `products/${SECTION_IDS.WOMEN_BAGS}/gucci`,
          position: [0, 0, 4.3],
          scale: 0.75,
        },
      },
    ],
  },
  {
    ...sections[SECTION_IDS.WOMEN_ACCESSORIES],
    products: [
      {
        id: "ring",
        name: "Anillo de diamante",
        price: 99.99,
        description: "si",
        model: {
          path: `products/${SECTION_IDS.WOMEN_ACCESSORIES}/ring`,
          position: [0,0.2,5],
          rotation: [-12, 0, 0],
          scale: 0.3
        },
      },
      {
        id: "watch",
        name: "Reloj Cadisen",
        price: 99.99,
        description: "si",
        model: {
          path: `products/${SECTION_IDS.WOMEN_ACCESSORIES}/watch`,
          position: [0,-.4,6],
          rotation: [0, 0, -.3],
          scale: 0.1

        },
      },
      {
        id: "necklace",
        name: "Collar de rubí",
        price: 99.99,
        description: "si",
        model: {
          path: `products/${SECTION_IDS.WOMEN_ACCESSORIES}/necklace`,
          position: [0,0.6,7],
          scale: 0.012
        },
      },

    ],
  },
  {
    ...sections[SECTION_IDS.WOMEN_DRESSES],
    products: [
      {
        id: "ring",
        name: "Vestido manga larga",
        price: 99.99,
        description: "si",
        model: {
          path: `products/${SECTION_IDS.WOMEN_DRESSES}/long-sleeve-dress`,
          position: [0,-1.3,7.7],  
          scale: 0.01
        },
      },
      {
        id: "ring",
        name: "Vestido",
        price: 99.99,
        description: "si",
        model: {
          path: `products/${SECTION_IDS.WOMEN_DRESSES}/blue-dress`,
          position: [0,-0.3,7.7],  
        },
      },
      {
        id: "ring",
        name: "Vestido",
        price: 99.99,
        description: "si",
        model: {
          path: `products/${SECTION_IDS.WOMEN_DRESSES}/dress`,
          position: [0,-1.35,7.7],  
        },
      },
      
    ],
  },
  {
    ...sections[SECTION_IDS.WOMEN_SKIRTS],
    products: [
      {
        id: "ring",
        name: "Falda azul",
        price: 99.99,
        description: "si",
        model: {
          path: `products/${SECTION_IDS.WOMEN_SKIRTS}/blue-skirt`,
          position: [0,-.5,8],  
          scale: 0.001
        },
      },
      {
        id: "skirt",
        name: "Falda",
        price: 99.99,
        description: "si",
        model: {
          path: `products/${SECTION_IDS.WOMEN_SKIRTS}/skirt`,
          position: [0, -.9, 7.5],
        },
      },
      {
        id: "skirt",
        name: "Falda",
        price: 99.99,
        description: "si",
        model: {
          path: `products/${SECTION_IDS.WOMEN_SKIRTS}/long-skirt`,
          position: [0, -.9, 7.5],
          scale: 0.001
        },
      },
    ],
  },
  {
    ...sections[SECTION_IDS.WOMEN_BLOUSES],
    products: [
      {
        id: "ring",
        name: "Blusa",
        price: 99.99,
        description: "si",
        model: {
          path: `products/${SECTION_IDS.WOMEN_BLOUSES}/blouse`,
          position: [0,-0.05,8.5],  

        },
      },
      {
        id: "ring",
        name: "Blusa",
        price: 99.99,
        description: "si",
        model: {
          path: `products/${SECTION_IDS.WOMEN_BLOUSES}/white-blouse`,
          position: [0,-1.3,8],  

        },
      },
      {
        id: "pink-blouse",
        name: "Blusa",
        price: 99.99,
        description: "si",
        model: {
          path: `products/${SECTION_IDS.WOMEN_BLOUSES}/pink-blouse`,
          position: [0,-0.2,4.2],  

        },
      },
      
    ],
  },
];
