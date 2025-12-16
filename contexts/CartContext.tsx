"use client";

import { ProductVariant, Product } from "@/lib/products/products";
import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  product: Product;
  variant: ProductVariant;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, variant: ProductVariant) => void;
  removeFromCart: (productId: number, productUid: string) => void;
  updateQuantity: (productId: number, productUid: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Filter out any invalid items (migration from old structure)
        const validCart = parsedCart.filter((item: unknown) => 
          item && 
          typeof item === 'object' && 
          'product' in item && 
          'variant' in item && 
          item.variant && 
          typeof item.variant === 'object' &&
          'price' in item.variant &&
          item.variant.price !== undefined
        ) as CartItem[];
        if (validCart.length > 0) {
          setTimeout(() => {
            setCartItems(validCart);
          }, 0);
        }
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        localStorage.removeItem("cart");
      }
    }
  }, [setCartItems]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, variant: ProductVariant) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id && item.variant.productUid === variant.productUid
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id && item.variant.productUid === variant.productUid
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, variant, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number, productUid: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => 
        !(item.product.id === productId && item.variant.productUid === productUid)
      )
    );
  };

  const updateQuantity = (productId: number, productUid: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, productUid);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId && item.variant.productUid === productUid
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      if (!item.variant || item.variant.price === undefined) {
        return total;
      }
      const discountedPrice = item.variant.price - item.variant.price * 0.25;
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

