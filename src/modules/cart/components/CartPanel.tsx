import { useAtom } from "jotai";
import { cartAtom, cartActionsAtom, paymentModalOpenAtom } from "../state/cart";
import { useToast } from "../../../shared/context/ToastContext";
import { PaymentModalWrapper } from "./PaymentModal";

export const CartPanel = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const [, dispatch] = useAtom(cartActionsAtom);
  const { showToast } = useToast();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useAtom(paymentModalOpenAtom);

  const handlePaymentSuccess = () => {
    showToast('Order completed successfully!', 'success');
    dispatch({ type: 'CLEAR' });
  };

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <>
    <div
      className={`fixed right-0 top-0 h-screen w-96 bg-black/90 transform transition-transform duration-300 z-[100] pointer-events-auto ${
        cart.isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6 h-full flex flex-col pointer-events-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-2xl">Carrito</h2>
          <button
            onClick={() => setCart((prev) => ({ ...prev, isOpen: false }))}
            className="text-white opacity-60 hover:opacity-100 hover:cursor-pointer"
            type="button"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          {cart.items.length === 0 ? (
            <div className="text-white/70 text-center mt-10">
              Tu carrito está vacío
            </div>
          ) : (
            cart.items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-4 mb-4 text-white"
              >
                <div className="w-20 h-20 bg-white/10 rounded flex items-center justify-center overflow-hidden">
                  {item.product.thumbnail_path ? (
                    <img
                      src={`/thumbnails/${item.product.thumbnail_path}`}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm">{item.product.name[0]}</span>
                  )}
                </div>
                <div>
                  <h3>{item.product.name}</h3>
                  <p>${item.product.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        // If quantity would go to 0 or less, remove the item entirely
                        if (item.quantity <= 1) {
                          dispatch({ type: "REMOVE", product: item.product });
                        } else {
                          // Otherwise just decrement normally
                          dispatch({
                            type: "UPDATE",
                            product: item.product,
                            quantity: item.quantity - 1,
                          });
                        }
                      }}
                      className="px-2 py-1 bg-white/20 rounded hover:bg-white/30 pointer-events-auto z-[101]"
                      type="button"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => {
                        // Only increment if we haven't reached the stock limit
                        if (item.quantity < item.product.stock) {
                          dispatch({
                            type: "UPDATE",
                            product: item.product,
                            quantity: item.quantity + 1,
                          });
                        } else {
                          // Optionally show toast notification that max stock reached
                          // if you have the toast context available in this component
                          showToast(
                            `Solo hay ${item.product.stock} unidades disponibles de este producto`,
                            "info"
                          );
                        }
                      }}
                      // Disable the button visually when at max stock
                      className={`px-2 py-1 bg-white/20 rounded hover:bg-white/30 pointer-events-auto z-[101] ${
                        item.quantity >= item.product.stock
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={item.quantity >= item.product.stock}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() =>
                    dispatch({ type: "REMOVE", product: item.product })
                  }
                  className="ml-auto text-red-400 hover:text-red-300 p-1.5 rounded-full hover:bg-red-400/10 transition-colors"
                  title="Eliminar"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
        <div className="border-t border-white/20 pt-4 mt-4">
          <div className="flex justify-between text-white mb-4">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mt-4 items-center">
            <button
              onClick={() => dispatch({ type: "CLEAR" })}
              className="bg-transparent border border-red-500/30 px-4 py-2 text-red-400 text-xs tracking-wide uppercase font-light hover:bg-red-500/10 transition-colors rounded-sm flex items-center"
              type="button"
            >
              <svg
                className="w-3.5 h-3.5 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Vaciar carrito
            </button>

            <button
              className="py-3 px-6 bg-white text-black font-medium rounded hover:bg-white/90 transition-colors"
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
            >
              Pagar
            </button>
          </div>
        </div>
      </div>
    </div>
    <PaymentModalWrapper 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={total}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};
