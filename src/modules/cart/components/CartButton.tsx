import { useAtom } from 'jotai'
import { cartAtom } from '../state/cart'

export const CartButton = () => {
  const [cart, setCart] = useAtom(cartAtom)
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  
  return (
    <button 
    onClick={() => setCart({ ...cart, isOpen: !cart.isOpen })}
      className="bg-white/10 p-3 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all duration-300 group shadow-lg relative cursor-pointer"
      aria-label="Shopping Cart"
    >
      {/* Shopping Cart Icon */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="text-white group-hover:scale-110 transition-transform duration-300"
      >
        <circle cx="8" cy="21" r="1"></circle>
        <circle cx="19" cy="21" r="1"></circle>
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
      </svg>
      
      {/* Item Count Badge */}
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
          {itemCount}
        </span>
      )}
    </button>
  )
}
