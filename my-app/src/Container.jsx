import React from 'react';
import { CartProvider } from './CartContext';
import { PageProvider } from "./contexts/PageContext.jsx";

const Container = ({ children }) => {
  return (
    <CartProvider>
      <PageProvider>
        <div className="container">
          {children}
        </div>
      </PageProvider>
    </CartProvider>
  );
};

export default Container;