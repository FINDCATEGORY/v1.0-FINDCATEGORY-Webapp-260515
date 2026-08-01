"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Plus, X, Layers } from "lucide-react";
import { addCollection } from "@/app/actions/collection";

export function AddCollectionSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number>(191);
  const MAJOR_CATEGORIES = ["플레이트", "커트러리", "글라스웨어", "서빙웨어", "페브릭", "오브제"];
  const MINOR_CATEGORIES: Record<string, string[]> = {
    "플레이트": ["디너", "샐러드·디저트 플레이트", "볼"],
    "커트러리": ["디너 나이프", "포크", "스푼"],
    "글라스웨어": ["잔", "와인잔", "음료잔"],
    "서빙웨어": ["메인 플래터·서빙 볼·소스"],
    "페브릭": ["테이블클로스·테이블 매트·냅킨"],
    "오브제": ["테이블 데코", "센터피스", "캔들 홀더", "조형물"]
  };

  const [productsToAdd, setProductsToAdd] = useState<{id: string, major: string, minor: string, cny: string}[]>([]);

  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/CNY")
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates.KRW) setExchangeRate(data.rates.KRW);
      })
      .catch(err => console.error("Failed to fetch exchange rate:", err));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const res = await addCollection(formData);
      if (res.success) {
        setProductsToAdd([]);
        e.currentTarget.reset();
        alert("컬렉션 및 포함 상품이 성공적으로 등록되었습니다!");
      } else {
        alert("컬렉션 등록에 실패했습니다: " + res.error);
      }
    } catch (error) {
      console.error(error);
      alert("알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const addProductRow = () => {
    setProductsToAdd([...productsToAdd, { id: `custom_${Date.now()}`, major: "", minor: "", cny: "" }]);
  };
  
  const removeProductRow = (id: string) => {
    setProductsToAdd(productsToAdd.filter(p => p.id !== id));
  };

  const updateProductCny = (id: string, val: string) => {
    setProductsToAdd(productsToAdd.map(p => p.id === id ? { ...p, cny: val } : p));
  };

  const updateProductCategory = (id: string, field: 'major' | 'minor', val: string) => {
    setProductsToAdd(productsToAdd.map(p => {
      if (p.id !== id) return p;
      if (field === 'major') {
        return { ...p, major: val, minor: "" };
      }
      return { ...p, minor: val };
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#1A1A1A]/10 rounded-[24px] shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-[#1A1A1A]/10 bg-white/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#1A1A1A]/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#1A1A1A] font-sans">컬렉션 기본 정보</h3>
              <p className="text-[#1A1A1A]/60 text-xs font-sans mt-0.5">새로운 라인업을 위한 정보를 입력합니다.</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#1A1A1A] mb-2">컬렉션 명 <span className="text-red-500">*</span></label>
                <input name="name" required type="text" className="w-full px-4 py-3 rounded-xl border border-[#1A1A1A]/20 bg-white/30 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/30 font-sans text-sm" placeholder="예: 시그니처 컬렉션" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#1A1A1A] mb-2">컬렉션 테마 (설명) <span className="text-red-500">*</span></label>
                <input name="theme" required type="text" className="w-full px-4 py-3 rounded-xl border border-[#1A1A1A]/20 bg-white/30 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/30 font-sans text-sm" placeholder="예: 자연을 닮은 편안함" />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1A1A1A] mb-2">컬렉션 컬러셋</label>
                <select name="imageColor" className="w-full px-4 py-3 rounded-xl border border-[#1A1A1A]/20 bg-white/30 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/30 font-sans text-sm appearance-none">
                  <option value="bg-amber-100 text-amber-700">앰버 (Amber)</option>
                  <option value="bg-emerald-100 text-emerald-700">에메랄드 (Emerald)</option>
                  <option value="bg-blue-100 text-blue-700">블루 (Blue)</option>
                  <option value="bg-rose-100 text-rose-700">로즈 (Rose)</option>
                  <option value="bg-purple-100 text-purple-700">퍼플 (Purple)</option>
                  <option value="bg-white text-[#1A1A1A]">기본 (Default)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1A1A1A] mb-2">대표 이미지 (선택)</label>
                <div className="w-full px-4 py-3 h-[46px] border-2 border-dashed border-[#1A1A1A]/20 rounded-xl bg-white/10 flex flex-row items-center justify-center hover:bg-white/30 transition-colors cursor-pointer relative overflow-hidden gap-2">
                  <input type="file" name="image" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <ImageIcon className="w-4 h-4 text-[#1A1A1A]/40" />
                  <span className="text-xs font-medium text-[#1A1A1A]/60 font-sans">클릭하여 파일 선택 (또는 드래그)</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-[#1A1A1A]/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1A1A1A] font-sans">포함 상품 일괄 등록</h3>
                  <p className="text-xs text-[#1A1A1A]/60 mt-1 font-sans">이 컬렉션에 포함될 상품들을 한 번에 등록하세요.</p>
                </div>
                <button type="button" onClick={addProductRow} className="text-xs font-bold bg-[#1A1A1A] text-white px-4 py-2.5 rounded-xl hover:bg-[#1A1A1A]/90 transition-colors flex items-center gap-1.5 shadow-sm">
                  <Plus className="w-4 h-4" /> 품목 추가
                </button>
              </div>
              
              <div className="overflow-x-auto border border-[#1A1A1A]/10 rounded-xl bg-gray-50/50 min-h-[250px]">
                {/* Table Header */}
                <div className="min-w-[800px] grid grid-cols-[minmax(200px,2fr)_minmax(200px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_60px_40px] gap-3 p-4 text-[13px] font-black text-[#1A1A1A]/60 border-b border-[#1A1A1A]/10 bg-white sticky top-0 z-10 shadow-sm">
                  <div>품목 (대분류 / 소분류) <span className="text-red-500">*</span></div>
                  <div>상품명 <span className="text-red-500">*</span></div>
                  <div>원가 (¥) <span className="text-red-500">*</span></div>
                  <div>판매가 (₩)</div>
                  <div className="text-center">사진</div>
                  <div></div>
                </div>
                
                <div className="min-w-[800px] p-2 space-y-2">
                  {productsToAdd.map((p, index) => {
                    const rawKrw = Number(p.cny) * exchangeRate * 4;
                    const calculatedKrw = p.cny && !isNaN(Number(p.cny)) ? (Math.ceil(rawKrw / 1000) * 1000).toLocaleString() : "";
                    const itemTypeValue = p.major && p.minor ? `${p.major} > ${p.minor}` : "";
                    
                    return (
                      <div key={p.id} className="grid grid-cols-[minmax(200px,2fr)_minmax(200px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_60px_40px] gap-3 items-center p-2 bg-white rounded-xl border border-[#1A1A1A]/5 hover:border-[#1A1A1A]/20 transition-colors group shadow-sm">
                        <input type="hidden" name="productIds" value={p.id} />
                        <input type="hidden" name={`productItemType_${p.id}`} value={itemTypeValue} />
                        
                        {/* 품목 드롭다운 (대/소분류) */}
                        <div className="flex gap-2">
                          <select 
                            value={p.major}
                            onChange={(e) => updateProductCategory(p.id, 'major', e.target.value)}
                            required
                            className="w-1/2 px-2.5 py-2.5 rounded-lg border border-[#1A1A1A]/20 bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/30 font-sans text-xs"
                          >
                            <option value="">대분류</option>
                            {MAJOR_CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                          
                          <select 
                            value={p.minor}
                            onChange={(e) => updateProductCategory(p.id, 'minor', e.target.value)}
                            required
                            disabled={!p.major}
                            className="w-1/2 px-2.5 py-2.5 rounded-lg border border-[#1A1A1A]/20 bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/30 font-sans text-xs disabled:bg-gray-100 disabled:text-gray-400"
                          >
                            <option value="">소분류</option>
                            {p.major && MINOR_CATEGORIES[p.major]?.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>

                        {/* 상품명 */}
                        <div>
                          <input name={`productName_${p.id}`} required type="text" className="w-full px-3 py-2.5 rounded-lg border border-[#1A1A1A]/20 bg-white/10 focus:outline-none focus:border-[#1A1A1A]/50 font-sans text-xs" placeholder="예: 시그니처 접시" />
                        </div>

                        {/* 원가 (위안화) */}
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40 font-bold text-xs">¥</span>
                          <input name={`productCnyPrice_${p.id}`} required value={p.cny} onChange={(e) => updateProductCny(p.id, e.target.value)} type="number" step="0.01" className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-[#1A1A1A]/20 bg-white/10 focus:outline-none focus:border-[#1A1A1A]/50 font-sans text-xs" placeholder="100" />
                        </div>

                        {/* 판매가 (KRW) */}
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40 font-bold text-xs">₩</span>
                          <input name={`productKrwPrice_${p.id}`} value={calculatedKrw} readOnly type="text" className="w-full pl-7 pr-3 py-2.5 rounded-lg bg-white/30 border border-transparent text-[#1A1A1A] font-bold focus:outline-none font-sans text-xs" placeholder="자동" />
                        </div>

                        {/* 이미지 */}
                        <div className="h-[42px] rounded-lg border-2 border-[#1A1A1A]/20 border-dashed flex items-center justify-center hover:bg-white/50 cursor-pointer relative transition-colors bg-white/10">
                          <input type="file" name={`productImage_${p.id}`} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" title="이미지 업로드" />
                          <ImageIcon className="w-5 h-5 text-[#1A1A1A]/40" />
                        </div>

                        {/* 삭제 버튼 */}
                        <div className="flex justify-center">
                          <button type="button" onClick={() => removeProductRow(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#1A1A1A]/30 hover:bg-red-50 hover:text-red-500 transition-colors" title="행 삭제">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {productsToAdd.length === 0 && (
                    <div className="text-center py-16">
                      <p className="text-sm font-bold text-[#1A1A1A]/40 mb-2">등록할 상품이 없습니다.</p>
                      <p className="text-xs text-[#1A1A1A]/40">우측 상단의 '품목 추가' 버튼을 눌러 행을 추가하세요.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#1A1A1A]/10 flex justify-end">
              <button type="submit" disabled={isSubmitting} className="px-8 py-3.5 rounded-xl font-bold text-white bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 transition-colors disabled:opacity-50 text-sm shadow-md">
                {isSubmitting ? "저장 중..." : "새 컬렉션 및 상품 등록하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
