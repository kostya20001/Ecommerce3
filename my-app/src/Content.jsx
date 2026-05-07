import React from 'react';
import { useCart } from './Container';
import productsData from './data/products';
import ProductCard from './ProductCard';
import TechStore from './TechStore';
import TvListing from './TvListing';
import PhoneListing from './PhoneListing';
import LaptopListing from './LaptopListing';
import CartPage from './CartPage';

const Content = () => {
  const { pageType } = useCart();
  
  
    switch(pageType) {
      case 'techstore':
      return <TechStore />;
      case 'tv':
        return <TvListing />;
      case 'phone':
        return <PhoneListing />;
      case 'laptop':
        return <LaptopListing />;
      case 'cart':
        return <CartPage />;
      default:
        return <TechStore />;
    }

};

export default Content;