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
}## Error Type
Build Error

## Error Message
Module not found: Can't resolve './cart-context'

## Build Output
./app/layout.tsx:2:1
Module not found: Can't resolve './cart-context'
  1 | "use client";
> 2 | import { useCart } from "./cart-context";
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  3 | import Image from "next/image";
  4 |
  5 | export function ProductModal() {

Import traces:
  Client Component Browser:
    ./app/layout.tsx [Client Component Browser]
    ./app/layout.tsx [Server Component]

  Client Component SSR:
    ./app/layout.tsx [Client Component SSR]
    ./app/layout.tsx [Server Component]

https://nextjs.org/docs/messages/module-not-found

Next.js version: 16.2.6 (Turbopack)
