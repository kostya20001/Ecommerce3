import React, { useState } from 'react';
import './Filters.css';

function Filters({ onFilterApply }) {
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const brands = [
    'Samsung',
    'LG', 
    'Sony',
    'Google',
    'Apple',
    'Xiaomi',
    'Lenovo',
    'HP',
    'ASUS',
    'Acer'
  ];

  const handleApplyFilters = () => {
    const filters = {
      brand: selectedBrand || null,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null
    };
    
    if (onFilterApply) {
      onFilterApply(filters);
    }
    
  };

  return (
    <div className="filters-container">
      <h3 className="filters-title">Filters</h3>
      
      <div className="filter-group">
        <label className="filter-label">Brand</label>
        <div className="dropdown">
          <button 
            className="dropdown-button"
            onClick={() => setIsBrandOpen(!isBrandOpen)}
          >
            {selectedBrand || 'Select brand'} 
            <span className="dropdown-arrow">{isBrandOpen ? '▲' : '▼'}</span>
          </button>
          
          {isBrandOpen && (
            <div className="dropdown-menu">
              <div 
                className={`dropdown-item ${!selectedBrand ? 'active' : ''}`}
                onClick={() => {
                  setSelectedBrand('');
                  setIsBrandOpen(false);
                }}
              >
                All brands
              </div>
              {brands.map((brand) => (
                <div
                  key={brand}
                  className={`dropdown-item ${selectedBrand === brand ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedBrand(brand);
                    setIsBrandOpen(false);
                  }}
                >
                  {brand}
                  {selectedBrand === brand && <span className="checkmark">✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Price Range</label>
        <div className="price-inputs">
          <div className="price-input-wrapper">
            <span className="currency-symbol"></span> {/*попробуем заменить*/}
            <input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="price-input"
            />
          </div>
          <span className="price-separator">—</span>
          <div className="price-input-wrapper">
            <span className="currency-symbol"></span> {/*попробуем заменить*/}
            <input
              type="number"
              placeholder="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="price-input"
            />
          </div>
        </div>
      </div>

      <div className="filter-actions">
        <button className="apply-button" onClick={handleApplyFilters}>
          Apply Filters
        </button>
      </div>
    </div>
  );
}

export default Filters;