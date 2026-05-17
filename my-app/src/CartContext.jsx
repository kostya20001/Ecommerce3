import React, { useReducer, useCallback, useMemo } from 'react';
import { CartContext } from './contexts/CartContext';

const cartReducer = (state, action) => {
  const newCart = new Map(state);
  
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { productId, quantity = 1 } = action.payload;
      const currentQuantity = newCart.get(productId) || 0;
      newCart.set(productId, currentQuantity + quantity);
      return newCart;
    }
    
    case 'REMOVE_FROM_CART': {
      newCart.delete(action.payload.productId);
      return newCart;
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        newCart.delete(productId);
      } else {
        newCart.set(productId, quantity);
      }
      return newCart;
    }
    
    case 'CLEAR_CART': {
      return new Map();
    }
    
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, new Map());

  const addToCart = useCallback((productId, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { productId, quantity } });
  }, []);

  const removeFromCart = useCallback((productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
  }, []);

  const updateCartQuantity = useCallback((productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const getCartTotalCount = useCallback(() => {
    let total = 0;
    for (const quantity of cart.values()) {
      total += quantity;
    }
    return total;
  }, [cart]);

  const getCartItems = useCallback(() => {
    return Array.from(cart.entries()).map(([id, quantity]) => ({ id, quantity }));
  }, [cart]);

  const getCartTotalPrice = useCallback((products) => {
    let total = 0;
    for (const [id, quantity] of cart.entries()) {
      const product = products.find(p => p.id === id);
      if (product) {
        total += product.price * quantity;
      }
    }
    return total;
  }, [cart]);

  const contextValue = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotalCount,
    getCartItems,
    getCartTotalPrice,
  }), [cart, addToCart, removeFromCart, updateCartQuantity, clearCart, getCartTotalCount, getCartItems, getCartTotalPrice]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};