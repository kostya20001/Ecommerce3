import { useState } from 'react';
import './App.css';
import ProductCard from './ProductCard';
import Counter from './Counter';
import Banner from './Banner';
import SortPanel from './SortPanel';
import Filters from './Filters';
import productsData from './data/products';

function TvListing() {
  const [products] = useState(productsData);
  const tvProducts = products.filter(product => product.category === 'tv');
  const [filteredProducts, setFilteredProducts] = useState(tvProducts);

  const applyFilters = (filters) => {
    let filtered = [...tvProducts];
    
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
          <div className="products-count">
            <Counter count={filteredProducts.length} />
            <div className='sort-panel'>
              <SortPanel 
                products={tvProducts} 
                onSortChange={handleSortChange} 
              />
            </div>
          </div>
          
          <div className="products-grid">
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>No TVs found</p>
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

export default TvListing;