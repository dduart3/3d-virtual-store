import { useState, useEffect, useRef } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
  AddressElement,
} from "@stripe/react-stripe-js";
import { useToast } from "../../../shared/context/ToastContext";
import { stripePromise } from "../../../lib/stripe";
import { useCreatePaymentIntent, useConfirmPayment } from "../hooks/usePayment";
import { useCreateOrder } from "../hooks/useOrder";
import { useAtom } from "jotai";
import { cartActionsAtom, cartAtom } from "../state/cart";
import { useQueryClient } from "@tanstack/react-query";
import { viewerStateAtom } from "../../experience/product-viewer/state/viewer";

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
          <div className="animate-pulse mb-2">Cargando interfaz de pago...</div>
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
              "Fallo la inicializacion del pago"}
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
  const [isAddressElementReady, setIsAddressElementReady] = useState<boolean>(false);
  const [shippingAddress, setShippingAddress] = useState<any>(null);
  const [addressComplete, setAddressComplete] = useState<boolean>(false);
  const [paymentComplete, setPaymentComplete] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment'>('shipping');
  const [cart] = useAtom(cartAtom);
 
  const [, dispatch] = useAtom(cartActionsAtom);
  const [viewerState, setViewerState] = useAtom(viewerStateAtom);
  const queryClient = useQueryClient();
 
  // Use our hooks
  const confirmPayment = useConfirmPayment();
  const createOrder = useCreateOrder();

  const handleAddressChange = (event: any) => {
    setShippingAddress(event.value);
    // Check if the address is complete based on the event
    setAddressComplete(event.complete === true);
  };

  const handlePaymentChange = (event: any) => {
    // Update payment completion status based on the event
    setPaymentComplete(event.complete === true);
  };

  const handleContinueToPayment = () => {
    if (!isAddressElementReady) {
      showToast("Address form is still loading", "error");
      return;
    }
    
    if (!addressComplete) {
      showToast("Please complete all required address fields", "error");
      return;
    }
    
    if (!shippingAddress) {
      showToast("Please enter a valid shipping address", "error");
      return;
    }
    
    // Check for specific required fields
    const requiredFields = ['line1', 'city', 'state', 'postal_code', 'country'];
    const missingFields = requiredFields.filter(field => 
      !shippingAddress[field] || shippingAddress[field].trim() === ''
    );
    
    if (missingFields.length > 0) {
      showToast(`Please complete the following fields: ${missingFields.join(', ')}`, "error");
      return;
    }
    
    setCurrentStep('payment');
  };

  const handleBackToShipping = () => {
    setCurrentStep('shipping');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
   
    if (!stripe || !elements) {
      showToast("Stripe has not been properly initialized", "error");
      return;
    }
    
    if (!isPaymentElementReady) {
      showToast("Payment form is still loading", "error");
      return;
    }
    
    if (!paymentComplete) {
      showToast("Please complete all payment information", "error");
      return;
    }
    
    if (!addressComplete || !shippingAddress) {
      showToast("Please complete shipping address information", "error");
      setCurrentStep('shipping');
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
              shipping_address: shippingAddress // Include the shipping address in the order
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
    <div className="fixed z-[60] inset-0 flex items-center justify-center bg-black/70 pointer-events-auto p-4">
      <div className="w-full max-w-md bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 text-white max-h-[90vh] flex flex-col">
        {/* Header - Fixed at top */}
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-light">
              {currentStep === 'shipping' ? 'Dirección de envío' : 'Completar Pago'}
            </h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white"
              disabled={isProcessing}
              type="button"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 p-3 rounded bg-white/5 border border-white/10">
            <p className="text-lg">Total: ${amount.toFixed(2)}</p>
          </div>

          {/* Step indicator */}
          <div className="flex mt-4">
            <div className={`flex-1 text-center pb-2 border-b-2 ${currentStep === 'shipping' ? 'border-white text-white' : 'border-white/30 text-white/50'}`}>
              1. Dirección
            </div>
            <div className={`flex-1 text-center pb-2 border-b-2 ${currentStep === 'payment' ? 'border-white text-white' : 'border-white/30 text-white/50'}`}>
              2. Pago
            </div>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 'shipping' ? (
            /* Shipping Address Step */
            <div className="p-4 border text-white border-white/20 rounded bg-white/5 relative z-[60] pointer-events-auto">
              <AddressElement
                options={{
                  mode: 'shipping',
                  allowedCountries: ['ES', 'US', 'MX', 'CO', 'VE'],
                  fields: {
                    phone: 'always',
                  },
                  validation: {
                    phone: {
                      required: 'always',
                    },
                  },
                }}
                onChange={handleAddressChange}
                onReady={() => setIsAddressElementReady(true)}
              />
            </div>
          ) : (
            /* Payment Step */
            <div>
              <div className="p-4 border text-white border-white/20 rounded bg-white/5 relative z-[60] pointer-events-auto">
                <PaymentElement
                  onReady={() => setIsPaymentElementReady(true)}
                  onChange={handlePaymentChange}
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

              {paymentError && (
                <div className="mt-4 p-3 rounded bg-red-500/20 border border-red-500/40 text-red-200 text-sm">
                  {paymentError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with buttons - Fixed at bottom */}
        <div className="p-6 border-t border-white/10">
          {currentStep === 'shipping' ? (
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-white/20 text-white/80 hover:text-white hover:border-white/40 rounded-none tracking-wider uppercase text-xs font-light"
                disabled={isProcessing}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleContinueToPayment}
                className="px-6 py-2 bg-white text-black rounded font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isAddressElementReady || !addressComplete}
              >
                Continuar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex justify-between">
              <button
                type="button"
                onClick={handleBackToShipping}
                className="px-4 py-2 border border-white/20 text-white/80 hover:text-white hover:border-white/40 rounded-none tracking-wider uppercase text-xs font-light"
                disabled={isProcessing}
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={!stripe || !isPaymentElementReady || !paymentComplete || isProcessing}
                className="px-6 py-2 bg-white text-black rounded font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-black/30 border-r-2 rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  "Pagar Ahora"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

