import { atom } from 'jotai'
import { Catalog } from '../types/catalog'

export const currentCatalogAtom = atom<Catalog | null>(null)
export const currentProductIndexAtom = atom<number>(0)
