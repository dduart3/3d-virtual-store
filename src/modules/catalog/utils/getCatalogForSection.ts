import { SectionId } from '../../../shared/types/section'
import { catalogs } from '../data/catalog'

export const getCatalogForSection = (sectionId: SectionId) => {
  return catalogs.find((catalog) => catalog.id === sectionId)
}
