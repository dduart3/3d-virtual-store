import { Model } from './Model'
import { useAtom } from 'jotai'
import { selectedProductAtom } from '../modules/catalog/state/catalog'

export const ProductDisplay = () => {
  const [selectedProduct] = useAtom(selectedProductAtom)

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-black/80 p-8 rounded-lg">
        <div className="h-64 w-64">
          {selectedProduct?.modelPath && <Model modelPath={selectedProduct.modelPath} />}
        </div>
        <div className="text-white mt-4">
          <h2>{selectedProduct?.name}</h2>
          <p>{selectedProduct?.description}</p>
          <p className="text-xl">${selectedProduct?.price}</p>
          <button className="bg-blue-500 px-4 py-2 rounded">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}