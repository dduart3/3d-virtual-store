import { useState, useEffect, useRef } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { useToast } from "../../../shared/context/ToastContext";
import { stripePromise } from "../../../lib/stripe";
import { useCreatePaymentIntent, useConfirmPayment } from "../hooks/usePayment";
import { useCreateOrder } from "../hooks/useOrder";
import { useAtom } from "jotai";
import { cartActionsAtom, cartAtom } from "../state/cart";
import { useQueryClient } from "@tanstack/react-query";
import { viewerStateAtom } from "../../product-viewer/state/viewer";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: () => void;
}

// The wrapper component that provides Stripe context
export function PaymentModalWrapper({
  isOpen,
  onClose,
  amount,
  onSuccess,
}: PaymentModalProps): JSX.Element | null {
  const [clientSecret, setClientSecret] = useState<string>("");
  const { showToast } = useToast();
  const hasTriedCreatingIntent = useRef<boolean>(false);

  // Use our hook for creating payment intent
  const createPaymentIntent = useCreatePaymentIntent();

  // Get client secret when modal opens
  useEffect(() => {
    // Only run this once when the modal opens
    if (
      isOpen &&
      amount > 0 &&
      !clientSecret &&
      !hasTriedCreatingIntent.current
    ) {
      // Set flag to prevent multiple attempts
      hasTriedCreatingIntent.current = true;

      console.log("Creating payment intent for amount:", amount);

      createPaymentIntent.mutate(
        { amount },
        {
          onSuccess: (data) => {
            console.log("Payment intent created successfully:", data);
            if (data && data.clientSecret) {
              setClientSecret(data.clientSecret);
            } else {
              console.error("No client secret in response:", data);
              showToast("Invalid payment setup response", "error");
            }
          },
          onError: (error) => {
            console.error("Error creating payment intent:", error);
            showToast("Error setting up payment. Please try again.", "error");
          },
        }
      );
    }

    // Reset flag when modal closes
    if (!isOpen) {
      hasTriedCreatingIntent.current = false;
      setClientSecret("");
    }
  }, [isOpen, amount, clientSecret, showToast]); // Remove createPaymentIntent from dependencies

  if (!isOpen) return null;

  if (createPaymentIntent.isPending) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="w-full max-w-md p-6 mx-auto bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 text-white text-center">
          <div className="animate-pulse mb-2">Setting up payment...</div>
          <div className="w-8 h-8 border-t-2 border-white/30 border-r-2 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (createPaymentIntent.isError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="w-full max-w-md p-6 mx-auto bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 text-white">
          <div className="mb-4 p-3 rounded bg-red-500/20 border border-red-500/40 text-red-200 text-sm">
            {createPaymentIntent.error?.message ||
              "Failed to initialize payment"}
          </div>
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-white text-black rounded"
            type="button"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  if (!clientSecret) return null;

  // Initialize Elements WITH the client secret
  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
      <PaymentModal
        isOpen={isOpen}
        onClose={onClose}
        amount={amount}
        onSuccess={onSuccess}
      />
    </Elements>
  );
}

// The actual modal component
function PaymentModal({ 
  //isOpen, 
  onClose, 
  amount, 
  onSuccess 
}: PaymentModalProps): JSX.Element {
  const stripe = useStripe();
  const elements = useElements();
  const { showToast } = useToast();
  const [isPaymentElementReady, setIsPaymentElementReady] = useState<boolean>(false);
  const [cart] = useAtom(cartAtom);
  

  const [, dispatch] = useAtom(cartActionsAtom);
  const [viewerState, setViewerState] = useAtom(viewerStateAtom);
  const queryClient = useQueryClient();
  

  
  // Use our hooks
  const confirmPayment = useConfirmPayment();
  const createOrder = useCreateOrder();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    
    if (!stripe || !elements || !isPaymentElementReady) {
      return;
    }
    
    confirmPayment.mutate(
      { stripe, elements },
      {
        onSuccess: async (paymentIntent) => {
          // Get the section IDs of all products in the cart to invalidate them later
          const sectionIds = new Set(cart.items.map(item => item.product.section_id));
          
          createOrder.mutate(
            {
              cart_items: cart.items,
              payment_intent_id: paymentIntent.id,
              total: amount,
              shipping_address: {}
            },
            {
              onSuccess: () => {
                // 1. Invalidate queries
                sectionIds.forEach(sectionId => {
                  queryClient.invalidateQueries({ 
                    queryKey: ['products', 'section', sectionId] 
                  });
                });
                
                cart.items.forEach(item => {
                  queryClient.invalidateQueries({ 
                    queryKey: ['product', item.product.id] 
                  });
                });
                
                // 2. Update the viewerState atom directly to reflect stock changes
                if (viewerState.products && viewerState.currentProduct) {
                  // Create a map of product quantities from cart
                  const purchasedQuantities = cart.items.reduce((acc, item) => {
                    acc[item.product.id] = item.quantity;
                    return acc;
                  }, {} as Record<string, number>);
                  
                  // Update all products in the viewer
                  const updatedProducts = viewerState.products.map(product => {
                    if (purchasedQuantities[product.id]) {
                      // Reduce the stock by the purchased quantity
                      return {
                        ...product,
                        stock: product.stock - purchasedQuantities[product.id]
                      };
                    }
                    return product;
                  });
                  
                  // Update the current product if it was purchased
                  let updatedCurrentProduct = viewerState.currentProduct;
                  if (purchasedQuantities[viewerState.currentProduct.id]) {
                    updatedCurrentProduct = {
                      ...viewerState.currentProduct,
                      stock: viewerState.currentProduct.stock - purchasedQuantities[viewerState.currentProduct.id]
                    };
                  }
                  
                  // Update the atom
                  setViewerState({
                    ...viewerState,
                    products: updatedProducts,
                    currentProduct: updatedCurrentProduct
                  });
                }
                
                // 3. Clear the cart
                dispatch({ type: 'CLEAR' });
                
                showToast('Order completed successfully!', 'success');
                onSuccess();
                onClose();
              },

              onError: (error) => {
                console.error('Error creating order:', error);
                showToast('Payment processed but order creation failed.', 'error');
              }
            }
          );
        },
        onError: (error) => {
          showToast(error.message || 'Payment failed', 'error');
        }
      }
    );
  };
  // Combined error from either payment confirmation or order creation
  const paymentError =
    confirmPayment.error?.message || createOrder.error?.message;
  const isProcessing = confirmPayment.isPending || createOrder.isPending;

  return (
    <div className="fixed z-[60] inset-0 flex items-center justify-center bg-black/70 pointer-events-auto">
      <div className="w-full max-w-md p-6 mx-auto bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-light">Completar Pago</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white"
            disabled={isProcessing}
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 p-3 rounded bg-white/5 border border-white/10 " >
          <p className="text-lg mb-1">Total: ${amount.toFixed(2)}</p>

        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="p-4 border text-white border-white/20 rounded bg-white/5 relative z-[60] pointer-events-auto">
              <PaymentElement
                onReady={() => setIsPaymentElementReady(true)}
                options={{
                  layout: "tabs",
                  
                  defaultValues: {
                    billingDetails: {
                      name: "Test User",
                    },
                  },
                }}
              />
            </div>
          </div>

          {paymentError && (
            <div className="mb-4 p-3 rounded bg-red-500/20 border border-red-500/40 text-red-200 text-sm">
              {paymentError}
            </div>
          )}

          <button
            type="submit"
            disabled={!stripe || !isPaymentElementReady || isProcessing}
            className="w-full py-3 px-4 bg-white text-black rounded font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-black/30 border-r-2 rounded-full animate-spin mr-2"></div>
                Processing...
              </div>
            ) : (
              "Pay Now"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
