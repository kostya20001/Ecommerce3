import React, { useState } from 'react';
import './SortPanel.css'

const SortPanel = ({ products, onSortChange }) => {
  const [sortType, setSortType] = useState('default');

  const handleSort = (e) => {
    const sortValue = e.target.value;
    setSortType(sortValue);
    
    let sortedProducts = [...products];
    
    switch(sortValue) {
      case 'brand':
        sortedProducts.sort((a, b) => {
          const brandA = (a.make || a.brand || '').toLowerCase();
          const brandB = (b.make || b.brand || '').toLowerCase();
          return brandA.localeCompare(brandB);
        });
        break;
      case 'price-low':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        sortedProducts.sort((a, b) => a.id - b.id);
    }
    
    onSortChange(sortedProducts);
  };

  return ( 
    <select
      value={sortType}
      onChange={handleSort}
      className="sort"
    >
      <option value="default"></option>
      <option value="brand">Sort by Brand</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
    </select>
  );
};

export default SortPanel;