import { Catalog } from '../types/catalog'

export const catalogs: Catalog[] = [
  {
    id: 'men-shoes',
    name: 'Men\'s Shoes',
    products: [
      {
        id: 'oxford-classic',
        name: 'Oxford Classic',
        price: 299.99,
        description: 'Premium leather Oxford shoes with classic design',
        modelPath: '/models/men-shoes/oxford.glb',
        thumbnailPath: '/images/men-shoes/oxford.jpg'
      },
      {
        id: 'loafer-brown',
        name: 'Brown Loafers',
        price: 249.99,
        description: 'Comfortable brown leather loafers',
        modelPath: '/models/men-shoes/loafer.glb',
        thumbnailPath: '/images/men-shoes/loafer.jpg'
      }
    ]
  }
]
