"use client";
import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/components/detail/ui/cart-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ProductDetailModal } from "@/components/category/product-detail-modal";

import { Product, products } from "@/components/category/product";

interface ProductGridProps {
  selectedCategory: string | null;
}

export function ProductGrid({ selectedCategory }: ProductGridProps) {
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = selectedCategory && selectedCategory !== "모든제품"
    ? products.filter((p) => p.categories.includes(selectedCategory))
    : products;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {filteredProducts.map((p) => (
          <div key={p.id} className="group block">
            <button
              onClick={() => setSelectedProduct(p)}
              className="w-full text-center"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-transparent mx-auto">
                <Image src={p.image} alt={p.name} fill className="object-cover" />
              </div>
              <h3 className="text-[#4C050C] mt-3 text-lg font-medium">{p.name}</h3>
            </button>
            <Button
              onClick={() => addToCart(p)}
              className="w-full mt-2 bg-[#4C050C] text-white hover:bg-[#4C050C] hover:opacity-100 transition-none border-none"
            >
              담기
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent 
          onPointerDownOutside={(e) => {
            if ((e.target as Element).closest('#cart-floating-button')) {
              e.preventDefault();
            }
          }}
          className="w-screen h-[100dvh] max-w-none sm:w-[95vw] sm:h-auto sm:max-w-[90vw] lg:max-w-[1400px] sm:aspect-video overflow-y-auto bg-[#EBEBDF]/95 sm:border border-[#4C050C]/10 p-0 overflow-x-hidden rounded-none sm:rounded-lg"
        >
          <DialogTitle className="sr-only">{selectedProduct?.name || "제품 상세"}</DialogTitle>
          {selectedProduct && <ProductDetailModal product={selectedProduct} />}
        </DialogContent>
      </Dialog>
    </>
  );
}