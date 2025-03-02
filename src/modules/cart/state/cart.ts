import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Product } from "../../store/types/store";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  isOpen: boolean;
}

// Use atomWithStorage instead of regular atom to persist cart between sessions
export const cartAtom = atomWithStorage<Cart>("store-cart", {
  items: [],
  isOpen: false,
});

type CartAction =
  | { type: "ADD"; product: Product; quantity: number }
  | { type: "REMOVE"; product: Product }
  | { type: "UPDATE"; product: Product; quantity: number }
  | { type: "CLEAR" };

export const cartActionsAtom = atom(
  (get) => get(cartAtom),
  (get, set, action: CartAction) => {
    const cart = get(cartAtom);

    switch (action.type) {
      case "ADD": {
        const existingItem = cart.items.find(
          (item) => item.product.id === action.product.id
        );

        if (existingItem) {
          set(cartAtom, {
            ...cart,
            items: cart.items.map((item) =>
              item.product.id === action.product.id
                ? { ...item, quantity: item.quantity + action.quantity }
                : item
            ),
          });
        } else {
          set(cartAtom, {
            ...cart,
            items: [
              ...cart.items,
              { product: action.product, quantity: action.quantity },
            ],
          });
        }
        break;
      }
      case "UPDATE": {
        const existingItem = cart.items.find(
          (item) => item.product.id === action.product.id
        );

        if (existingItem) {
          set(cartAtom, {
            ...cart,
            items: cart.items.map((item) =>
              item.product.id === action.product.id
                ? { ...item, quantity: action.quantity }
                : item
            ),
          });
        } else {
          set(cartAtom, {
            ...cart,
            items: [
              ...cart.items,
              { product: action.product, quantity: action.quantity },
            ],
          });
        }
        break;
      }
      case "REMOVE":
        set(cartAtom, {
          ...cart,
          items: cart.items.filter(
            (item) => item.product.id !== action.product.id
          ),
        });
        break;
      case "CLEAR":
        set(cartAtom, {
          ...cart,
          items: [],
        });
        break;
    }
  }
);
