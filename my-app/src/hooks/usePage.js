import { useContext } from 'react';
import { PageContext } from '../contexts/PageContext';  // ← убрать .jsx, оставить .js

export const usePage = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePage must be used within PageProvider');
  }
  return context;
};