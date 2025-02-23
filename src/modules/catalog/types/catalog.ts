import { SectionId } from "../../../shared/types/section"

export interface Product {
  id: string
  name: string
  price: number
  description: string
  modelPath: string
  thumbnailPath: string
}

export interface Catalog {
  id: SectionId
  name: string
  products: Product[]
}