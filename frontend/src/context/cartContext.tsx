"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { Product } from "@/app/interfaces/product";
import { CartItem } from "@/app/interfaces/cartItem";
import { postToCart, clearBackendCart } from "@/actions/cart/cartActions";

interface CartContextType {
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;
  // La función principal que el componente llamará
  calculateAndSetOptimalCart: (
    allProducts: Product[],
    budget: number
  ) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateAndSetOptimalCart = async (
    allProducts: Product[],
    budget: number
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      let bestCombination: Product[] = [];
      let maxPrice = 0;
      //  (O(2^n))
      const numCombinations = 1 << allProducts.length;

      for (let i = 0; i < numCombinations; i++) {
        let currentCombination: Product[] = [];
        let currentPrice = 0;
        for (let j = 0; j < allProducts.length; j++) {
          if ((i >> j) & 1) {
            currentCombination.push(allProducts[j]);
            currentPrice += allProducts[j].price;
          }
        }
        if (currentPrice <= budget && currentPrice > maxPrice) {
          maxPrice = currentPrice;
          bestCombination = currentCombination;
        }
      }

      await clearBackendCart();

      let finalCartState: CartItem[] = [];
      for (const product of bestCombination) {
        finalCartState = await postToCart(product.id, 1);
      }

      setCart(finalCartState);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    cart,
    isLoading,
    error,
    calculateAndSetOptimalCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
