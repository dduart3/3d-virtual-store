import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { atomFamily } from 'jotai/utils';
import { ProductWithModel } from '../../experience/store/types/product';

export interface CartItem {
  product: ProductWithModel;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  isOpen: boolean; // Add this property
}

// Create an empty cart
const createEmptyCart = (): Cart => ({
  items: [],
  isOpen: false // Initialize as closed
});

// Create a cart atom family keyed by user ID
export const userCartAtomFamily = atomFamily((userId: string | null) => 
  atomWithStorage<Cart>(`cart-${userId || 'guest'}`, createEmptyCart())
);

// Current user ID atom
export const currentUserIdAtom = atom<string | null>(null);

// Derived atom that gets the current user's cart
export const cartAtom = atom(
  (get) => {
    const userId = get(currentUserIdAtom);
    return get(userCartAtomFamily(userId));
  },
  (get, set, newCart: Cart) => {
    const userId = get(currentUserIdAtom);
    set(userCartAtomFamily(userId), newCart);
  }
);

// Payment modal state
export const paymentModalOpenAtom = atom<boolean>(false);

// Cart actions atom for dispatching cart operations
export const cartActionsAtom = atom(
  null,
  (get, set, action: { 
    type: 'ADD' | 'REMOVE' | 'UPDATE' | 'CLEAR', 
    product?: ProductWithModel, 
    quantity?: number 
  }) => {
    const cart = get(cartAtom);
    
    switch (action.type) {
      case 'ADD':
        if (!action.product) return;
        
        const existingItem = cart.items.find(
          item => item.product.id === action.product!.id
        );
        
        if (existingItem) {
          // If item exists, update quantity
          set(cartAtom, {
            ...cart,
            items: cart.items.map(item => 
              item.product.id === action.product!.id
                ? { ...item, quantity: item.quantity + (action.quantity || 1) }
                : item
            )
          });
        } else {
          // Add new item
          set(cartAtom, {
            ...cart,
            items: [...cart.items, { product: action.product, quantity: action.quantity || 1 }]
          });
        }
        break;
        
      case 'REMOVE':
        if (!action.product) return;
        
        set(cartAtom, {
          ...cart,
          items: cart.items.filter(item => item.product.id !== action.product!.id)
        });
        break;
        
      case 'UPDATE':
        if (!action.product || action.quantity === undefined) return;
        
        if (action.quantity <= 0) {
          // If quantity is 0 or negative, remove the item
          set(cartAtom, {
            ...cart,
            items: cart.items.filter(item => item.product.id !== action.product!.id)
          });
        } else {
          // Check if item exists
          const itemExists = cart.items.some(
            item => item.product.id === action.product!.id
          );
          
          if (itemExists) {
            // Update existing item
            set(cartAtom, {
              ...cart,
              items: cart.items.map(item => 
                item.product.id === action.product!.id
                  ? { ...item, quantity: action.quantity! }
                  : item
              )
            });
          } else {
            // Add as new item
            set(cartAtom, {
              ...cart,
              items: [...cart.items, { product: action.product, quantity: action.quantity }]
            });
          }
        }
        break;
        
      case 'CLEAR':
        set(cartAtom, createEmptyCart());
        break;
    }
  }
);
