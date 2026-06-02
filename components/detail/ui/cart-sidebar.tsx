"use client";
import { useCart } from "@/components/detail/ui/cart-context";
import Image from "next/image";
import { X, Plus, Minus } from "lucide-react";

export function CartSidebar() {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, setIsCheckoutOpen } = useCart();

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#EBEBDF]/50 backdrop-blur-sm z-[55] pointer-events-auto cursor-pointer"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={`fixed top-0 right-0 h-full w-96 bg-[#EBEBDF]/95 border-l border-[#4C050C]/10 z-[60] transform transition-transform duration-300 ease-in-out flex flex-col pointer-events-auto ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex justify-between items-center p-6 border-b border-neutral-800">
          <h2 className="text-[#4C050C] font-bold text-lg">장바구니</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#4C050C] hover:text-neutral-300 transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <p className="text-neutral-500 text-sm text-center py-8">장바구니가 비어있습니다.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item, i) => (
                <div key={i} className="flex gap-4 border-b border-neutral-800 pb-4">
                  <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-[#4C050C] font-medium">{item.name}</p>
                      <p className="text-xs text-neutral-400">{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                        className="p-1 hover:bg-neutral-700 rounded text-neutral-400 hover:text-[#4C050C] transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-xs text-[#4C050C] font-medium w-6 text-center">{item.quantity || 1}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                        className="p-1 hover:bg-neutral-700 rounded text-neutral-400 hover:text-[#4C050C] transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-neutral-500 hover:text-[#4C050C] transition-colors p-1 text-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-neutral-800 p-6">
            <button 
              onClick={() => {
                setIsCheckoutOpen(true);
                setIsOpen(false);
              }}
              className="w-full py-3 bg-[#4C050C] text-white font-bold rounded-lg hover:opacity-80 transition-opacity"
            >
              결제하기
            </button>
          </div>
        )}
      </aside>
    </>
  );
}