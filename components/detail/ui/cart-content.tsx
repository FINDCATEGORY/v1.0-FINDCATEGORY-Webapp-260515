"use client";
import { createContext, useContext, useState, type ReactNode, type Dispatch, type SetStateAction } from "react";

type CartContextValue = {
  items: any[];
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  addToCart: (product: any) => void;
  // 모달 제어용
  detailProduct: any | null;
  setDetailProduct: (product: any | null) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<any | null>(null);

  const addToCart = (product: any) => {
    setItems((prev) => [...prev, product]);
    setIsOpen(true);
  };

  return (
    <CartContext.Provider value={{ items, isOpen, setIsOpen, addToCart, detailProduct, setDetailProduct }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};