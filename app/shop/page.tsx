"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, ArrowRight, Sparkles } from "lucide-react";
import { useCart } from "@/components/detail/ui/cart-context";
import { getProducts } from "@/app/actions/product";
import { Product, products as staticProducts } from "@/components/product/product";
import { ProductDetailModal } from "@/components/product/product-detail-modal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const shopCategories = [
    { id: "All", label: "All Products" },
    { id: "Featured", label: "Featured" },
    { id: "플레이트", label: "Plate" },
    { id: "커트러리", label: "Cutlery" },
    { id: "글라스", label: "Glass" },
    { id: "오브제", label: "Object" },
    { id: "소품", label: "Props" },
    { id: "테이블", label: "Tableware" },
    { id: "데코", label: "Decors" },
    { id: "패브릭", label: "Fabric" },
];

export default function ShopPage() {
    const { addToCart, items, setIsOpen } = useCart();
    // 하이드레이션 에러 방지를 위해 서버와 동일하게 무조건 staticProducts로 초기화
    const [products, setProducts] = useState<Product[]>(staticProducts);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [activeTab, setActiveTab] = useState<string>("All");

    useEffect(() => {
        // 1. 하이드레이션 완료 후 브라우저 스토리지(어드민 동기화 데이터) 우선 적용
        if (typeof window !== "undefined") {
            const localFallback = localStorage.getItem("findcategory_fallback_products");
            if (localFallback) {
                try {
                    setProducts(JSON.parse(localFallback));
                } catch (e) {
                    console.error("Local storage parse error:", e);
                }
            }
        }

        // 2. 백그라운드에서 DB/서버 최신 데이터 확인
        const fetchProducts = async () => {
            try {
                const result = await getProducts();
                if (result.success && result.data) {
                    let fetchedItems = result.data;
                    if (result.isFallback && typeof window !== "undefined") {
                        const localFallback = localStorage.getItem("findcategory_fallback_products");
                        if (localFallback) {
                            try { fetchedItems = JSON.parse(localFallback); } catch (e) { }
                        }
                    }
                    setProducts(fetchedItems);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };
        fetchProducts();
    }, []);

    // 카테고리 필터링
    const filteredProducts = products.filter((p) => {
        if (selectedCategory === "All") return true;
        if (selectedCategory === "Featured") {
            return p.id % 2 === 1 || p.price.includes("3") || p.categories.some(c => c.includes("오브제") || c.includes("플레이트"));
        }
        const cats = Array.isArray(p.categories) ? p.categories : [p.categories];
        return cats.some(c => c?.includes(selectedCategory) || selectedCategory.includes(c));
    });

    const handleAddToCart = (product: Product, e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart(product);
        setIsOpen(true);
    };

    const totalCartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#F7F7F4] text-[#1A1A1A] font-sans antialiased selection:bg-[#1A1A1A] selection:text-white">
            {/* 
        ========================================================
        LEFT SIDEBAR : FIXED / STICKY AREA
        ========================================================
      */}
            <aside className="w-full md:w-[320px] lg:w-[380px] xl:w-[420px] md:h-screen md:sticky md:top-0 p-8 md:p-12 lg:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#1A1A1A]/10 bg-[#F7F7F4] z-20 flex-shrink-0">
                <div>
                    {/* Logo & Brand Identity */}
                    <Link href="/" className="inline-block group">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-tighter mb-3 uppercase text-[#1A1A1A] group-hover:opacity-80 transition-opacity">
                            FINDCATEGORY©
                        </h1>
                    </Link>
                    <p className="text-xs italic text-[#1A1A1A]/60 mb-8 font-serif">
                        Refined. Minimal. Never boring.
                    </p>

                    <div className="text-xs sm:text-sm leading-relaxed text-[#1A1A1A]/80 font-normal max-w-[280px] space-y-1">
                        <p>Furniture & decor that speaks softly, but stands out loud.</p>
                        <p>Clean lines, crafted with wit.</p>
                        <p className="text-[#1A1A1A] font-medium pt-1">Elegance with a wink — style first.</p>
                    </div>
                </div>

                {/* Category Navigation Menu */}
                <div className="mt-12 md:mt-0 pt-8 border-t border-[#1A1A1A]/10 md:border-t-0 md:pt-0">
                    <h2 className="text-sm font-black uppercase tracking-wider text-[#1A1A1A]/50 mb-4">
                        Shop
                    </h2>
                    <nav className="flex flex-wrap md:flex-col gap-2 md:gap-2.5">
                        {shopCategories.map((cat) => {
                            const isActive = selectedCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`text-left text-sm transition-all duration-200 flex items-center justify-between group py-1 ${isActive
                                        ? "font-bold text-[#1A1A1A] translate-x-1"
                                        : "font-normal text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:translate-x-1"
                                        }`}
                                >
                                    <span className="tracking-tight">{cat.label}</span>
                                    {isActive && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] ml-2 inline-block animate-pulse" />
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Additional Footer info in Sidebar */}
                    <div className="hidden md:block mt-12 pt-8 border-t border-[#1A1A1A]/10 text-[11px] text-[#1A1A1A]/40 uppercase tracking-widest">
                        © {new Date().getFullYear()} FINDCATEGORY. ALL RIGHTS RESERVED.
                    </div>
                </div>
            </aside>

            {/* 
        ========================================================
        RIGHT AREA : SCROLLABLE PRODUCT SHOWCASE FEED
        ========================================================
      */}
            <main className="flex-1 relative bg-[#F2F2ED] min-h-screen">
                {/* Floating / Sticky Top Bar */}
                <header className="sticky top-0 z-30 flex items-center justify-between p-6 md:p-8 lg:p-12 pointer-events-none">
                    <div className="pointer-events-auto">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-[#1A1A1A]/15 bg-[#F7F7F4]/90 backdrop-blur-md text-[11px] font-bold tracking-wider uppercase text-[#1A1A1A] shadow-sm">
                            <Sparkles className="w-3 h-3 text-amber-600 animate-spin" style={{ animationDuration: '4s' }} />
                            <span>LATEST DROP</span>
                        </span>
                    </div>

                    <div className="pointer-events-auto flex items-center gap-5 sm:gap-8 text-xs font-bold tracking-wider uppercase text-[#1A1A1A]">
                        <Link href="/" className="hover:opacity-60 transition-opacity hidden sm:inline-block">
                            HOME
                        </Link>
                        <button
                            onClick={() => setSelectedCategory("Featured")}
                            className={`hover:opacity-60 transition-opacity hidden sm:inline-block ${selectedCategory === "Featured" ? "underline underline-offset-4 decoration-2" : ""}`}
                        >
                            FEATURED
                        </button>
                        <button
                            onClick={() => setSelectedCategory("All")}
                            className={`hover:opacity-60 transition-opacity hidden sm:inline-block ${selectedCategory === "All" ? "underline underline-offset-4 decoration-2" : ""}`}
                        >
                            SHOP ALL
                        </button>

                        <button
                            onClick={() => setIsOpen(true)}
                            className="px-4 py-2 bg-[#1A1A1A] text-white rounded-full hover:bg-[#333] active:scale-95 transition-all flex items-center gap-2 shadow-md font-semibold"
                        >
                            <span className="tracking-widest">CART</span>
                            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">
                                {totalCartCount}
                            </span>
                        </button>
                    </div>
                </header>

                {/* Product Showcase Lookbook Feed */}
                <div className="pb-24">
                    {filteredProducts.length === 0 ? (
                        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
                            <p className="text-lg font-bold text-[#1A1A1A]/60 mb-2">해당 카테고리의 제품이 없습니다.</p>
                            <p className="text-sm text-[#1A1A1A]/40 mb-6">다른 카테고리를 선택하거나 전체 제품을 확인해보세요.</p>
                            <button
                                onClick={() => setSelectedCategory("All")}
                                className="px-6 py-2.5 bg-[#1A1A1A] text-white text-xs font-bold tracking-wider uppercase rounded-full hover:bg-black transition-colors"
                            >
                                전체 제품 보기
                            </button>
                        </div>
                    ) : (
                        filteredProducts.map((product, idx) => {
                            const isBestSeller = idx === 0 || idx === 2 || product.price.includes("8") || product.name.includes("골든아워");

                            return (
                                <section
                                    key={product.id}
                                    onClick={() => setSelectedProduct(product)}
                                    className="relative w-full min-h-[82vh] md:min-h-screen flex items-center justify-center p-6 sm:p-12 lg:p-20 border-b border-[#1A1A1A]/10 last:border-b-0 overflow-hidden group cursor-pointer"
                                >
                                    {/* Studio Product Presentation Image */}
                                    <div className="relative w-full max-w-[580px] lg:max-w-[680px] h-[400px] sm:h-[500px] md:h-[620px] transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                                        <Image
                                            src={product.image || "/images/collection/goldenhour/1.png"}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 70vw"
                                            className="object-contain drop-shadow-2xl transition-all duration-500 group-hover:drop-shadow-[0_25px_35px_rgba(0,0,0,0.2)]"
                                            priority={idx < 2}
                                        />
                                    </div>

                                    {/* Floating Product Info Card (Bottom Right inside Viewport) */}
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 md:bottom-14 md:right-14 z-10 w-[calc(100%-3rem)] sm:w-full max-w-[360px] md:max-w-[420px] bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-xl border border-black/5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:translate-y-[-4px]"
                                    >
                                        <div>
                                            {/* Badge */}
                                            <div className="flex items-center gap-2 mb-3">
                                                {isBestSeller ? (
                                                    <span className="inline-block px-3 py-1 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                                                        Best Seller
                                                    </span>
                                                ) : (
                                                    <span className="inline-block px-3 py-1 bg-[#1A1A1A]/10 text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider rounded-full">
                                                        Featured
                                                    </span>
                                                )}
                                                <span className="text-[11px] font-bold text-[#1A1A1A]/40 uppercase tracking-wider">
                                                    {Array.isArray(product.categories) ? product.categories[0] : product.categories}
                                                </span>
                                            </div>

                                            {/* Product Name */}
                                            <h3
                                                onClick={() => setSelectedProduct(product)}
                                                className="text-xl md:text-2xl font-black tracking-tight text-[#1A1A1A] mb-2 hover:underline decoration-2 underline-offset-4 cursor-pointer"
                                            >
                                                {product.name}
                                            </h3>

                                            {/* Product Description */}
                                            <p className="text-xs md:text-sm text-[#1A1A1A]/70 leading-relaxed line-clamp-2 mb-6 font-normal">
                                                {product.description || "자연스러운 텍스처와 감각적인 실루엣이 공간에 따뜻한 감성과 세련된 무드를 선사합니다."}
                                            </p>
                                        </div>

                                        {/* Price & Action Button */}
                                        <div className="flex items-center justify-between pt-4 border-t border-[#1A1A1A]/10">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-[#1A1A1A]/40 tracking-wider">Price</span>
                                                <span className="text-xl md:text-2xl font-black text-[#1A1A1A] tracking-tight">
                                                    {product.price}
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={(e) => handleAddToCart(product, e)}
                                                className="px-5 py-3 bg-[#1A1A1A] text-white text-xs font-bold tracking-wider uppercase rounded-xl hover:bg-black active:scale-95 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl group/btn"
                                            >
                                                <span>Add To Cart</span>
                                                <Plus className="w-4 h-4 transition-transform group-hover/btn:rotate-90 duration-300" />
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            );
                        })
                    )}
                </div>
            </main>

            {/* Product Detail Modal (Dialog wrapper for overlay rendering) */}
            <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
                <DialogContent className="w-screen h-[100dvh] max-w-none sm:w-[95vw] sm:h-auto sm:max-w-[90vw] lg:max-w-[1400px] sm:aspect-video overflow-y-auto bg-[#EBEBDF]/95 sm:border border-[#1A1A1A]/10 p-0 overflow-x-hidden rounded-none sm:rounded-lg z-50">
                    <DialogTitle className="sr-only">{selectedProduct?.name || "제품 상세"}</DialogTitle>
                    {selectedProduct && <ProductDetailModal product={selectedProduct} />}
                </DialogContent>
            </Dialog>
        </div>
    );
}
