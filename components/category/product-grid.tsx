"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/components/detail/ui/cart-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ProductDetailModal } from "@/components/category/product-detail-modal";
import { getProducts } from "@/app/actions/product";
import { Product, products as staticProducts } from "@/components/category/product";

interface ProductGridProps {
  selectedCategory: string | null;
}

export function ProductGrid({ selectedCategory }: ProductGridProps) {
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const localFallback = localStorage.getItem("findcategory_fallback_products");
      if (localFallback) {
        try { return JSON.parse(localFallback); } catch (e) {}
      }
    }
    return staticProducts;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await getProducts();
      if (result.success && result.data) {
        let items = result.data;
        if (result.isFallback && typeof window !== "undefined") {
          const localFallback = localStorage.getItem("findcategory_fallback_products");
          if (localFallback) {
            try { items = JSON.parse(localFallback); } catch (e) { console.error(e); }
          }
        }
        setProducts(items);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory && selectedCategory !== "모든제품"
    ? products.filter((p) => {
        const cats = Array.isArray(p.categories) ? p.categories : [p.categories];
        return cats.some(c => c === selectedCategory || c?.startsWith(selectedCategory + " >"));
      })
    : products;

  if (loading) {
    return <div className="py-20 text-center text-[#4C050C]/60 font-medium">상품을 불러오는 중...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {filteredProducts.map((p) => (
          <div key={p.id} className="group flex flex-col justify-between h-full gap-4">
            <button
              onClick={() => setSelectedProduct(p)}
              className="w-full text-center flex-1 flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-transparent mx-auto w-full">
                <Image src={p.image} alt={p.name} fill className="object-cover" />
              </div>
              <div className="flex flex-col flex-1 mt-3">
                <h3 className="text-[#4C050C] text-lg font-medium">{p.name}</h3>
                <p className="text-[#4C050C] font-bold mt-1">{p.price}</p>
              </div>
            </button>
            <Button
              onClick={() => addToCart(p)}
              className="w-full mt-auto bg-[#4C050C] text-white hover:bg-[#4C050C] hover:opacity-100 transition-none border-none"
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