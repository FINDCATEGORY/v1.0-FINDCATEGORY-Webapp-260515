"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { PackageOpen, Plus, Search, Image as ImageIcon, X, Edit2, Trash2 } from "lucide-react";
import { getProducts, addProduct, updateProduct, deleteProduct } from "@/app/actions/product";

export function InventorySection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(191);
  const [cnyInput, setCnyInput] = useState<string>("");
  const [priceInput, setPriceInput] = useState<string>("");

  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/CNY")
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates.KRW) setExchangeRate(data.rates.KRW);
      })
      .catch(err => console.error("Failed to fetch exchange rate:", err));
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const productsRes = await getProducts();
      if (productsRes.success) {
        let items = productsRes.data;
        if (productsRes.isFallback && typeof window !== "undefined") {
          const localFallback = localStorage.getItem("findcategory_fallback_products");
          if (localFallback) {
            try { items = JSON.parse(localFallback); } catch (e) { console.error(e); }
          }
        }
        setProducts(items);
        setIsFallback(productsRes.isFallback || false);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  const updateProductsState = (updater: (prev: any[]) => any[]) => {
    setProducts(prev => {
      const next = updater(prev);
      if (typeof window !== "undefined") {
        localStorage.setItem("findcategory_fallback_products", JSON.stringify(next));
      }
      return next;
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };


  const openAddModal = () => {
    setEditingProduct(null);
    setCnyInput("");
    setPriceInput("");
    setShowModal(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setCnyInput(product.cny_price?.toString() || "");
    setPriceInput(product.price?.replace('₩', '') || "");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    let result;

    if (isFallback) {
      if (editingProduct) {
        const updated = {
          ...editingProduct,
          name: formData.get("name") as string,
          price: formData.get("price") as string,
          cny_price: formData.get("cnyPrice") ? parseFloat(formData.get("cnyPrice") as string) : null,
          categories: [formData.get("itemType") as string].filter(Boolean),
          description: formData.get("description") as string,
        };
        updateProductsState(prev => prev.map(p => p.id === editingProduct.id ? updated : p));
        showToast("상품이 성공적으로 수정되었습니다. (정적 모드 동기화)", "success");
      } else {
        const newProd = {
          id: Date.now(),
          name: formData.get("name") as string,
          price: formData.get("price") as string,
          cny_price: formData.get("cnyPrice") ? parseFloat(formData.get("cnyPrice") as string) : null,
          categories: [formData.get("itemType") as string].filter(Boolean),
          description: formData.get("description") as string,
          image: "/images/collection/goldenhour/1.png"
        };
        updateProductsState(prev => [newProd, ...prev]);
        showToast("상품이 성공적으로 등록되었습니다. (정적 모드 동기화)", "success");
      }
      setShowModal(false);
      setIsSubmitting(false);
      return;
    }

    if (editingProduct) {
      result = await updateProduct(editingProduct.id, formData);
    } else {
      result = await addProduct(formData);
    }

    setIsSubmitting(false);

    if (result.success) {
      showToast(editingProduct ? "상품이 성공적으로 수정되었습니다." : "상품이 성공적으로 등록되었습니다.", "success");
      setShowModal(false);
      fetchProducts(); // 리스트 갱신
    } else {
      showToast((editingProduct ? "수정 실패: " : "등록 실패: ") + result.error, "error");
    }
  };

  const handleDelete = async (targetProduct?: any, e?: React.MouseEvent) => {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    const prodToDelete = (targetProduct && targetProduct.id) ? targetProduct : editingProduct;
    if (!prodToDelete) return;
    
    if (!window.confirm(`'${prodToDelete.name}' 상품을 정말로 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return;
    
    setIsSubmitting(true);

    if (isFallback) {
      updateProductsState(prev => prev.filter(p => p.id !== prodToDelete.id));
      showToast("상품이 성공적으로 삭제되었습니다. (카테고리 페이지 동기화 완료)", "success");
      if (editingProduct && editingProduct.id === prodToDelete.id) {
        setShowModal(false);
      }
      setIsSubmitting(false);
      return;
    }

    const result = await deleteProduct(String(prodToDelete.id));
    setIsSubmitting(false);

    if (result.success) {
      showToast("상품이 성공적으로 삭제되었습니다.", "success");
      if (editingProduct && editingProduct.id === prodToDelete.id) {
        setShowModal(false);
      }
      fetchProducts();
    } else {
      if (result.error?.includes("does not exist") || result.error?.includes("찾을 수 없거나") || result.error?.includes("권한")) {
        updateProductsState(prev => prev.filter(p => p.id !== prodToDelete.id));
        showToast("상품 삭제 및 카테고리 페이지 동기화 완료 (DB 미연동/불일치 상태)", "success");
        if (editingProduct && editingProduct.id === prodToDelete.id) {
          setShowModal(false);
        }
      } else {
        showToast("삭제 실패: " + result.error, "error");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#4C050C] font-sans">상품 관리</h2>
          <p className="text-[#4C050C]/60 text-sm mt-1 font-medium font-sans">
            개별 상품 및 원자재 라이브러리를 관리합니다.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#4C050C] text-[#EBEBDF] px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4C050C]/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>상품 등록</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`px-6 py-3 rounded-full shadow-lg font-bold font-sans text-sm ${toast.type === 'success' ? 'bg-[#4C050C] text-white' : 'bg-red-500 text-white'}`}>
            {toast.message}
          </div>
        </div>
      )}

      {isFallback && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm font-medium">
          ⚠️ 현재 데이터베이스(b2b_products)가 생성되지 않아 기본 제공되는 정적 상품 목록을 보여주고 있습니다. SQL 스크립트를 실행하여 DB 연동을 완료해주세요.
        </div>
      )}

      {/* Toolbar */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4C050C]/40" />
          <input
            type="text"
            placeholder="상품명 또는 카테고리 검색..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#4C050C]/10 bg-white focus:outline-none focus:ring-2 focus:ring-[#4C050C]/20 font-sans"
          />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="py-20 text-center text-[#4C050C]/60 font-medium">로딩 중...</div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-[#4C050C]/10 rounded-[24px] shadow-sm p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[#EBEBDF] rounded-full flex items-center justify-center mb-4">
            <PackageOpen className="w-8 h-8 text-[#4C050C]/40" />
          </div>
          <h3 className="text-xl font-bold text-[#4C050C] mb-2 font-sans">등록된 상품이 없습니다</h3>
          <p className="text-[#4C050C]/60 text-sm font-sans">우측 상단의 버튼을 눌러 첫 상품을 등록해보세요.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#4C050C]/10 rounded-[24px] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EBEBDF]/30 border-b border-[#4C050C]/10 text-[#4C050C]/60 text-[11px] font-black uppercase tracking-wider font-sans">
                  <th className="px-5 py-3.5">카테고리</th>
                  <th className="px-5 py-3.5">상품 정보</th>
                  <th className="px-5 py-3.5 text-right">원가 (¥)</th>
                  <th className="px-5 py-3.5 text-right">판매가 (₩)</th>
                  <th className="px-5 py-3.5 text-center">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4C050C]/5">
                {products.map((product) => {
                  const categoryArray = Array.isArray(product.categories) ? product.categories : (product.categories ? [product.categories] : []);
                  const mainCategory = categoryArray.find((c: string) => !c.includes("컬렉션") && !c.includes("콜렉션")) || (categoryArray[0] || "지정 안됨");
                  
                  return (
                    <tr key={product.id} className="hover:bg-[#EBEBDF]/20 transition-colors group">
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center px-2 py-1 rounded border border-[#4C050C]/10 bg-white text-[10px] font-black text-[#4C050C]/70">
                          {mainCategory}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#EBEBDF]/50 flex-shrink-0 flex items-center justify-center border border-[#4C050C]/10">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-[#4C050C]/20" />
                          )}
                        </div>
                        <div>
                          <div 
                            className="font-bold text-[#4C050C] text-sm font-sans mb-0.5 group-hover:underline decoration-2 underline-offset-4 decoration-[#4C050C]/30 cursor-pointer" 
                            onClick={() => openEditModal(product)}
                          >
                            {product.name}
                          </div>
                          <div className="text-[11px] text-[#4C050C]/40 truncate max-w-[200px] font-medium">{product.description || "설명 없음"}</div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="text-xs font-bold text-[#4C050C]/60">
                          {product.cny_price ? `¥${product.cny_price}` : "-"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-black text-[#4C050C] text-sm font-sans">
                        {product.price || "-"}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button 
                            type="button"
                            onClick={() => openEditModal(product)} 
                            className="p-1.5 text-[#4C050C]/40 hover:text-[#4C050C] hover:bg-[#4C050C]/10 rounded-lg transition-colors inline-flex items-center justify-center"
                            title="수정"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            type="button"
                            onClick={(e) => handleDelete(product, e)} 
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center justify-center"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Registration/Edit Modal via Portal */}
      {showModal && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[80vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-[#4C050C]/40 hover:text-[#4C050C] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8">
              <h3 className="text-xl font-black text-[#4C050C] mb-1 font-sans">
                {editingProduct ? "상품 수정" : "상품 등록"}
              </h3>
              <p className="text-[#4C050C]/60 text-xs mb-5 font-sans">
                {editingProduct ? "선택한 상품의 정보를 수정합니다." : "새로운 상품을 라이브러리에 추가합니다."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {editingProduct && <input type="hidden" name="existingImage" value={editingProduct.image || ""} />}

                <div>
                  <label className="block text-xs font-bold text-[#4C050C] mb-1.5">상품명 <span className="text-red-500">*</span></label>
                  <input name="name" defaultValue={editingProduct?.name} required type="text" className="w-full px-3 py-2.5 rounded-xl border border-[#4C050C]/20 bg-[#EBEBDF]/30 focus:outline-none focus:ring-2 focus:ring-[#4C050C]/30 font-sans text-sm" placeholder="예: 골든아워 플라워 냅킨" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#4C050C] mb-1.5 flex justify-between">
                      <span>원가 (¥)</span>
                      <span className="font-medium text-[#4C050C]/40">1¥={exchangeRate.toFixed(1)}₩</span>
                    </label>
                    <input 
                      name="cnyPrice" 
                      value={cnyInput} 
                      onChange={(e) => setCnyInput(e.target.value)} 
                      type="number" 
                      step="0.01" 
                      className="w-full px-3 py-2.5 rounded-xl border border-[#4C050C]/20 bg-[#EBEBDF]/30 focus:outline-none focus:ring-2 focus:ring-[#4C050C]/30 font-sans text-sm" 
                      placeholder="위안화 입력" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#4C050C] mb-1.5">판매가 (₩) <span className="text-red-500">*</span></label>
                    <input 
                      name="price" 
                      value={cnyInput ? (Math.ceil(Number(cnyInput) * exchangeRate * 4 / 1000) * 1000).toLocaleString() : priceInput} 
                      onChange={(e) => setPriceInput(e.target.value)}
                      readOnly={!!cnyInput}
                      required 
                      type="text" 
                      className="w-full px-3 py-2.5 rounded-xl border border-[#4C050C]/20 bg-[#EBEBDF]/30 focus:outline-none focus:ring-2 focus:ring-[#4C050C]/30 font-sans text-sm" 
                      placeholder="자동 계산" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#4C050C] mb-1.5">품목 <span className="text-red-500">*</span></label>
                    <select name="itemType" defaultValue={editingProduct ? (Array.isArray(editingProduct.categories) ? editingProduct.categories.find((c: string) => !c.includes("컬렉션") && !c.includes("콜렉션")) || editingProduct.categories[0] : (editingProduct.categories?.includes("컬렉션") || editingProduct.categories?.includes("콜렉션") ? "" : editingProduct.categories)) : ""} required className="w-full px-3 py-2.5 rounded-xl border border-[#4C050C]/20 bg-[#EBEBDF]/30 focus:outline-none focus:ring-2 focus:ring-[#4C050C]/30 font-sans text-sm appearance-none">
                      <option value="">품목 선택</option>
                      <optgroup label="플레이트">
                        <option value="플레이트">플레이트 (공통)</option>
                        <option value="플레이트 > 디너">디너 플레이트</option>
                        <option value="플레이트 > 샐러드·디저트">샐러드·디저트 플레이트</option>
                        <option value="플레이트 > 볼">볼</option>
                      </optgroup>
                      <optgroup label="커트러리">
                        <option value="커트러리">커트러리 (공통/세트)</option>
                        <option value="커트러리 > 디너 나이프">디너 나이프</option>
                        <option value="커트러리 > 포크">포크</option>
                        <option value="커트러리 > 스푼">스푼</option>
                      </optgroup>
                      <optgroup label="소품">
                        <option value="소품">소품 (공통)</option>
                        <option value="소품 > 테이블 매트">테이블 매트·코스터</option>
                        <option value="소품 > 냅킨·패브릭">냅킨·테이블클로스</option>
                        <option value="소품 > 서빙웨어">서빙웨어·플래터</option>
                      </optgroup>
                      <optgroup label="오브제">
                        <option value="오브제">오브제 (공통)</option>
                        <option value="오브제 > 화병·센터피스">화병·센터피스</option>
                        <option value="오브제 > 테이블 데코">테이블 데코·캔들 홀더</option>
                      </optgroup>
                      <optgroup label="글라스">
                        <option value="글라스">글라스 (공통)</option>
                        <option value="글라스 > 와인잔">와인잔</option>
                        <option value="글라스 > 음료잔">음료잔</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4C050C] mb-1.5">상세 설명</label>
                  <textarea name="description" defaultValue={editingProduct?.description} rows={2} className="w-full px-3 py-2.5 rounded-xl border border-[#4C050C]/20 bg-[#EBEBDF]/30 focus:outline-none focus:ring-2 focus:ring-[#4C050C]/30 font-sans resize-none text-sm" placeholder="상품에 대한 상세 설명을 입력하세요." />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4C050C] mb-1.5">대표 이미지</label>
                  <div className="w-full px-4 py-4 border-2 border-dashed border-[#4C050C]/20 rounded-xl bg-[#EBEBDF]/10 flex flex-col items-center justify-center hover:bg-[#EBEBDF]/30 transition-colors cursor-pointer relative overflow-hidden">
                    <input type="file" name="image" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    {editingProduct?.image ? (
                      <>
                        <div className="absolute inset-0 opacity-20 bg-cover bg-center filter blur-sm" style={{ backgroundImage: `url(${editingProduct.image})` }} />
                        <ImageIcon className="w-6 h-6 text-[#4C050C]/80 mb-1 relative z-10" />
                        <span className="text-xs font-bold text-[#4C050C] font-sans relative z-10">클릭하여 이미지 변경</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-6 h-6 text-[#4C050C]/40 mb-1" />
                        <span className="text-xs font-medium text-[#4C050C]/60 font-sans">파일 선택 또는 드래그</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  {editingProduct && (
                    <button type="button" onClick={handleDelete} disabled={isSubmitting} className="px-5 py-3 rounded-xl font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 text-sm">
                      삭제
                    </button>
                  )}
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl font-bold text-[#4C050C] bg-[#EBEBDF] hover:bg-[#EBEBDF]/80 transition-colors text-sm">
                    취소
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-3 rounded-xl font-bold text-white bg-[#4C050C] hover:bg-[#4C050C]/90 transition-colors disabled:opacity-50 text-sm">
                    {isSubmitting ? "처리 중..." : (editingProduct ? "수정하기" : "등록하기")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
