"use client";
import { useCart } from "./cart-context";
import Image from "next/image";

export function ProductModal() {
  const { selectedProduct, setSelectedProduct, addToCart } = useCart();
  if (!selectedProduct) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#EBEBDF]/80 p-4" onClick={() => setSelectedProduct(null)}>
      <div className="bg-neutral-900 p-8 rounded-lg max-w-lg w-full text-[#4C050C] relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-[#4C050C]" onClick={() => setSelectedProduct(null)}>✕</button>
        <div className="relative w-full h-64 mb-4"><Image src={selectedProduct.image} alt={selectedProduct.name} fill className="object-cover" /></div>
        <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
        <p className="mt-2 text-neutral-400">{selectedProduct.price}</p>
        <button className="mt-6 w-full bg-white text-black py-3 rounded font-bold hover:bg-neutral-200" onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}>장바구니 담기</button>
      </div>
    </div>
  );
}
