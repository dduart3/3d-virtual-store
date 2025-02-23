export type CatalogType = 
  | 'men-shoes'
  | 'women-shoes'
  | 'men-accessories'
  | 'women-accessories'
  | 'men-shirts'
  | 'men-pants'

export interface Product {
  id: string
  name: string
  price: number
  description: string
  modelPath: string
  thumbnailPath: string
}

export interface Catalog {
  id: CatalogType
  name: string
  products: Product[]
}