import { useAtom } from "jotai";
import { viewerStateAtom } from "../state/viewer";
import { fadeRefAtom } from "../../../shared/state/fade";
import { cartActionsAtom, cartAtom } from "../../cart/state/cart";
import { useEffect, useState } from "react";
import { useToast } from "../../../shared/context/ToastContext";

export const ViewerUI = () => {
  const [viewerState, setViewerState] = useAtom(viewerStateAtom);
  const isFirstProduct = viewerState.currentIndex === 0;
  const isLastProduct =
    viewerState.currentIndex ===
    (viewerState.catalog?.products?.length ?? 0) - 1;
  const [fadeRef] = useAtom(fadeRefAtom);
  const product = viewerState.currentProduct;
  const { showToast } = useToast();

  const [, dispatch] = useAtom(cartActionsAtom);
  const [cart] = useAtom(cartAtom);
  const [quantity, setQuantity] = useState(1);

  const isOutOfStock = product?.stock === 0;
  const maxQuantity = product?.stock || 0;

  // Find if the current product is already in cart
  const existingCartItem = product
    ? cart.items.find((item) => item.product.id === product.id)
    : undefined;

  // Update quantity selector when changing products or if it's already in cart
  useEffect(() => {
    if (existingCartItem) {
      setQuantity(existingCartItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [viewerState.currentProduct, existingCartItem]);

  const handleAddToCart = () => {
    if (viewerState.currentProduct && !isOutOfStock && quantity > 0) {
      // Always use UPDATE instead of ADD to set the exact quantity
      dispatch({
        type: "UPDATE",
        product: viewerState.currentProduct,
        quantity,
      });

      // Show appropriate toast message
      if (existingCartItem) {
        showToast(
          `Cantidad actualizada: ${quantity} × ${viewerState.currentProduct.name}`,
          "info",
          3000
        );
      } else {
        showToast(
          `${quantity} × ${viewerState.currentProduct.name} añadido al carrito`,
          "success",
          3000
        );
      }
    }
  };

  // Reset quantity when changing products (unless already in cart)
  useEffect(() => {
    if (!existingCartItem) {
      setQuantity(1);
    }
  }, [viewerState.currentIndex, existingCartItem]);
  const increaseQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handlePrev = () => {
    setViewerState((prev) => ({
      ...prev,
      currentIndex: prev.catalog
        ? (prev.currentIndex - 1 + prev.catalog.products.length) %
          prev.catalog.products.length
        : 0,
      currentProduct: prev.catalog
        ? prev.catalog.products[
            (prev.currentIndex - 1 + prev.catalog.products.length) %
              prev.catalog.products.length
          ]
        : null,
    }));
    // Reset quantity when changing products
    setQuantity(1);
  };

  const handleNext = () => {
    setViewerState((prev) => ({
      ...prev,
      currentIndex: prev.catalog
        ? (prev.currentIndex + 1) % prev.catalog.products.length
        : 0,
      currentProduct: prev.catalog
        ? prev.catalog.products[
            (prev.currentIndex + 1) % prev.catalog.products.length
          ]
        : null,
    }));
    // Reset quantity when changing products
    setQuantity(1);
  };

  const handleClose = () => {
    fadeRef?.fadeToBlack();
    setTimeout(() => {
      setViewerState((prev) => ({ ...prev, isOpen: false }));
      fadeRef?.fadeFromBlack();
    }, 1000);
  };

  return (
    <>
      {viewerState.isOpen && product && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center select-none">
          <div className="relative w-full h-full">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="transition-all duration-200 hover:scale-125 hover:opacity-100 opacity-80 cursor-pointer absolute top-[10%] right-[5%]"
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="white"
                className="drop-shadow-lg hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>

            {/* Product Name */}
            <h1 className="absolute top-[10%] left-1/2 -translate-x-1/2 text-white text-[3rem] font-extralight tracking-[0.2em] m-0 uppercase">
              {product.name}
            </h1>

            {/* Description */}
            <p className="absolute bottom-[5%] left-1/2 -translate-x-1/2 text-white text-lg font-light tracking-wider w-[600px] text-center leading-relaxed">
              {product.description}
            </p>

            {/* Price and Stock Info */}
            <div className="absolute right-[5%] bottom-[25%] text-right">
              <div className="text-white text-[2.5rem] font-medium">
                ${product.price}
              </div>
              {isOutOfStock ? (
                <div className="text-red-500 text-sm uppercase tracking-wider mt-1">
                  Agotado
                </div>
              ) : (
                <div className="text-green-400 text-sm tracking-wider mt-1">
                  En existencia: {product.stock}
                </div>
              )}
            </div>
            {/* Quantity Selector and Add to Cart Button */}
            <div className="absolute right-[5%] bottom-[15%] flex items-center gap-4">
              {!isOutOfStock && (
                <div className="flex items-center bg-white/5 border border-white/30 rounded-sm">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="px-3 py-4 text-white text-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    –
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={maxQuantity}
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (isNaN(value)) {
                        setQuantity(1);
                      } else if (value < 1) {
                        setQuantity(1);
                      } else if (value > maxQuantity) {
                        setQuantity(maxQuantity);
                      } else {
                        setQuantity(value);
                      }
                    }}
                    className="w-14 bg-transparent text-center text-white border-0 outline-none focus:outline-none"
                  />
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= maxQuantity}
                    className="px-3 py-4 text-white text-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              )}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`bg-transparent border border-white/30 px-8 py-4 text-white text-sm tracking-[0.2em] uppercase font-light transition-all duration-400 
                    ${
                      isOutOfStock
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:bg-white/10 hover:scale-105 hover:tracking-[0.25em]"
                    }`}
              >
                {isOutOfStock ? "Agotado" : "Añadir al Carrito"}
              </button>
            </div>
            {/* Navigation Arrows */}
            {!isFirstProduct && (
              <button
                onClick={handlePrev}
                className="transition-all duration-200 hover:scale-125 hover:opacity-100 opacity-80 cursor-pointer absolute left-[5%] top-1/2"
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="drop-shadow-lg hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                >
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>
            )}

            {!isLastProduct && (
              <button
                onClick={handleNext}
                className="transition-all duration-200 hover:scale-125 hover:opacity-100 opacity-80 cursor-pointer absolute right-[5%] top-1/2"
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="drop-shadow-lg hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                >
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
