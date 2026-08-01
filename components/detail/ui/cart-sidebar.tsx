"use client";

import { useCart } from "@/components/detail/ui/cart-context";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";

export function CartSidebar() {
  const router = useRouter();
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, setIsCheckoutOpen } = useCart();

  const totalQuantity = items.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const calculateTotal = () => {
    let sum = 0;
    let currencySymbol = "₩";
    items.forEach((item) => {
      if (item.price.includes("$")) currencySymbol = "$";
      const numStr = item.price.replace(/[^0-9.]/g, "");
      const num = parseFloat(numStr) || 0;
      sum += num * (item.quantity || 1);
    });
    if (currencySymbol === "$") {
      return `$${sum.toFixed(2)}`;
    }
    return `₩${sum.toLocaleString()}`;
  };

  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] pointer-events-auto cursor-pointer animate-in fade-in-0 duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Slide-out Cart Sidebar Modal (Reference Editorial Style) */}
      <aside 
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] md:w-[460px] bg-white border-l border-black/10 z-[60] transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col pointer-events-auto shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-6 sm:px-8 sm:py-7 border-b border-black/10 bg-white/80 backdrop-blur-md">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
            Cart
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-xs font-semibold text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors py-1.5 px-3 rounded-full hover:bg-black/5"
          >
            Close
          </button>
        </div>

        {/* Products Count Header */}
        <div className="flex justify-between items-center px-6 py-4 sm:px-8 text-xs font-medium text-[#1A1A1A]/50 uppercase tracking-wider border-b border-black/5">
          <span>Products</span>
          <span>{totalQuantity} {totalQuantity === 1 ? "item" : "items"}</span>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center text-[#1A1A1A]/40 mb-2">
                <ShoppingBag className="w-8 h-8 stroke-1" />
              </div>
              <p className="text-[#1A1A1A]/80 font-bold text-base">Your cart is empty</p>
              <p className="text-[#1A1A1A]/50 text-xs max-w-[200px] leading-relaxed">
                Discover our minimalist furniture and tablewares to fill your space.
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 px-6 py-2.5 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-black transition-colors shadow-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item, i) => (
              <div 
                key={`${item.id}-${i}`} 
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-black/5 flex gap-4 sm:gap-5 items-start transition-all hover:shadow-md"
              >
                {/* Image Thumbnail */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-black/5">
                  <Image 
                    src={item.image || "/images/collection/goldenhour/1.png"} 
                    alt={item.name} 
                    fill 
                    className="object-contain p-1" 
                  />
                </div>

                {/* Product Info & Controls */}
                <div className="flex-1 flex flex-col justify-between h-20 sm:h-24">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm sm:text-base font-bold text-[#1A1A1A] tracking-tight leading-snug line-clamp-1">
                      {item.name}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm font-black text-[#1A1A1A] tracking-tight">
                    {item.price}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    {/* Pill Quantity Selector */}
                    <div className="flex items-center border border-black/15 rounded-full px-2 py-0.5 gap-3 bg-white shadow-2xs">
                      <button 
                        type="button"
                        onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                        disabled={(item.quantity || 1) <= 1}
                        className="p-1 hover:bg-black/5 rounded-full text-[#1A1A1A]/60 hover:text-[#1A1A1A] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-[#1A1A1A] w-4 text-center select-none font-mono">
                        {item.quantity || 1}
                      </span>
                      <button 
                        type="button"
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                        className="p-1 hover:bg-black/5 rounded-full text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Remove Link Button */}
                    <button 
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-[#1A1A1A]/40 hover:text-[#1A1A1A] underline underline-offset-2 transition-colors font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Summary Footer (Reference Style) */}
        {items.length > 0 && (
          <div className="border-t border-black/10 bg-white/80 backdrop-blur-md px-6 py-6 sm:px-8 sm:py-8 space-y-3">
            <div className="space-y-2 text-xs text-[#1A1A1A]/60 border-b border-black/5 pb-4 font-normal">
              <div className="flex justify-between items-center">
                <span>Taxes</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1 pb-3">
              <span className="text-base sm:text-lg font-bold text-[#1A1A1A]">Total</span>
              <span className="text-lg sm:text-xl font-black text-[#1A1A1A] tracking-tight">
                {calculateTotal()}
              </span>
            </div>

            <button 
              type="button"
              onClick={() => {
                setIsOpen(false);
                router.push('/checkout');
              }}
              className="w-full py-4 px-6 bg-[#1A1A1A] hover:bg-black text-white font-bold rounded-xl active:scale-[0.99] transition-all flex items-center justify-between shadow-lg group"
            >
              <span className="text-sm tracking-wide">Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 duration-300" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}