import { useState } from 'react';
import './App.css';
import ProductCard from './ProductCard';
import Counter from './Counter';
import Banner from './Banner';
import SortPanel from './SortPanel';
import Filters from './Filters';
import Container from './Container';
import productsData from './data/products';
// import { usePage } from './hooks/usePage';

function TechStore() {
  const [products] = useState(productsData);
  const [filteredProducts, setFilteredProducts] = useState(products);

  const applyFilters = (filters) => {
    let filtered = [...products];
    
    if (filters.brand) {
      filtered = filtered.filter(product => 
        product.make === filters.brand || product.brand === filters.brand
      );
    }
    
    if (filters.minPrice !== null && filters.minPrice !== '') {
      filtered = filtered.filter(product => product.price >= filters.minPrice);
    }
    
    if (filters.maxPrice !== null && filters.maxPrice !== '') {
      filtered = filtered.filter(product => product.price <= filters.maxPrice);
    }
    
    return filtered;
  };

  const handleFilterApply = (filters) => {
    const filtered = applyFilters(filters);
    setFilteredProducts(filtered);
  };

  const handleSortChange = (sortedProducts) => {
    setFilteredProducts(sortedProducts);
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <Filters onFilterApply={handleFilterApply} />
        <Banner />
      </aside>

      <div className="main-content">
        <div className="products-header">
          <div className="products-count">
            <Counter count={filteredProducts.length} />
            <div className='sort-panel'>
              <SortPanel 
                products={products} 
                onSortChange={handleSortChange} 
              />
            </div>
          </div>
        </div>
        
        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>No products found</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TechStore;