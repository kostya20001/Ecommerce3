import React from 'react';
import { usePage } from './hooks/usePage';
import TechStore from './TechStore';
import CartPage from './CartPage';

const Content = () => {
  const { pageType } = usePage();
  
  if (pageType === 'cart') {
    return <CartPage />;
  }
  
  // Передаем category в TechStore для фильтрации
  let category = null;
  if (pageType === 'tv') category = 'tv';
  if (pageType === 'phone') category = 'phone';
  if (pageType === 'laptop') category = 'laptop';
  
  return <TechStore category={category} />;
};

export default Content;