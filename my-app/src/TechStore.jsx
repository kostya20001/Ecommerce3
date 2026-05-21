// import { useState, useEffect } from 'react';
// import './App.css';
// import ProductCard from './ProductCard';
// import Counter from './Counter';
// import Banner from './Banner';
// import SortPanel from './SortPanel';
// import Filters from './Filters';
// import productsData from './data/products';

// function TechStore({ category }) {
//   const [products] = useState(productsData);
//   const [filteredProducts, setFilteredProducts] = useState(products);
//   const [appliedFilters, setAppliedFilters] = useState({});

//   // Функция для определения категории товара (пробует разные поля)
//   const getProductCategory = (product) => {
//     // Пробуем разные возможные названия полей
//     return product.category || 
//            product.type || 
//            product.productType || 
//            product.make?.toLowerCase() ||
//            product.brand?.toLowerCase() ||
//            null;
//   };

//   const applyAllFilters = (filters = appliedFilters, categoryFilter = category) => {
//     let filtered = [...products];
    
//     console.log('🔵 Applying filters - category:', categoryFilter);
//     console.log('🔵 Products before filter:', filtered.length);
    
//     // 1. Фильтрация по категории (из хедера)
//     if (categoryFilter && categoryFilter !== 'techstore') {
//       filtered = filtered.filter(product => {
//         const productCat = getProductCategory(product);
//         const match = productCat === categoryFilter;
//         console.log(`🔵 Product: ${product.name}, category: ${productCat}, match: ${match}`);
//         return match;
//       });
//       console.log('🔵 After category filter:', filtered.length);
//     }
    
//     // 2. Фильтрация по бренду
//     if (filters.brand) {
//       filtered = filtered.filter(product => 
//         (product.make && product.make.toLowerCase() === filters.brand.toLowerCase()) ||
//         (product.brand && product.brand.toLowerCase() === filters.brand.toLowerCase())
//       );
//       console.log('🔵 After brand filter:', filtered.length);
//     }
    
//     // 3. Фильтрация по минимальной цене
//     if (filters.minPrice !== null && filters.minPrice !== '' && filters.minPrice !== undefined) {
//       filtered = filtered.filter(product => product.price >= Number(filters.minPrice));
//       console.log('🔵 After minPrice filter:', filtered.length);
//     }
    
//     // 4. Фильтрация по максимальной цене
//     if (filters.maxPrice !== null && filters.maxPrice !== '' && filters.maxPrice !== undefined) {
//       filtered = filtered.filter(product => product.price <= Number(filters.maxPrice));
//       console.log('🔵 After maxPrice filter:', filtered.length);
//     }
    
//     return filtered;
//   };

//   useEffect(() => {
//     console.log('🔵 useEffect triggered - category changed to:', category);
//     const filtered = applyAllFilters(appliedFilters, category);
//     setFilteredProducts(filtered);
//   }, [category, products]); // Убрал appliedFilters из зависимостей чтобы избежать цикла

//   const handleFilterApply = (filters) => {
//     console.log('🔵 Filters applied:', filters);
//     setAppliedFilters(filters);
//     const filtered = applyAllFilters(filters, category);
//     setFilteredProducts(filtered);
//   };

//   const handleSortChange = (sortedProducts) => {
//     setFilteredProducts(sortedProducts);
//   };

//   // Если нет товаров - показываем заглушку
//   if (!products || products.length === 0) {
//     return <div>Loading products...</div>;
//   }

//   return (
//     <div className="app-container">
//       <aside className="sidebar">
//         <Filters onFilterApply={handleFilterApply} />
//         <Banner />
//       </aside>

//       <div className="main-content">
//         <div className="products-header">
//           <div className="products-count">
//             <Counter count={filteredProducts.length} />
//             <div className='sort-panel'>
//               <SortPanel 
//                 products={filteredProducts}
//                 onSortChange={handleSortChange} 
//               />
//             </div>
//           </div>
//         </div>
        
//         <div className="products-grid">
//           {filteredProducts.length === 0 ? (
//             <div className="no-products">
//               <p>No products found</p>
//               <p style={{ fontSize: '12px', color: 'gray' }}>
//                 Category: {category || 'techstore'} | Total products: {products.length}
//               </p>
//             </div>
//           ) : (
//             filteredProducts.map(product => (
//               <ProductCard key={product.id} product={product} />
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TechStore;


import { useState, useCallback, useMemo } from 'react';
import './App.css';
import ProductCard from './ProductCard';
import Counter from './Counter';
import Banner from './Banner';
import SortPanel from './SortPanel';
import Filters from './Filters';
import productsData from './data/products';

function TechStore({ category }) {
  const [products] = useState(productsData);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [sortedProducts, setSortedProducts] = useState(null);

  // Функция для определения категории товара
  const getProductCategory = useCallback((product) => {
    return product.category || 
           product.type || 
           product.productType || 
           product.make?.toLowerCase() ||
           product.brand?.toLowerCase() ||
           null;
  }, []);

  // Функция применения всех фильтров (категория + бренд + цена)
  const applyAllFilters = useCallback((filters, categoryFilter) => {
    let filtered = [...products];
    
    // 1. Фильтрация по категории (из хедера)
    if (categoryFilter && categoryFilter !== 'techstore') {
      filtered = filtered.filter(product => {
        const productCat = getProductCategory(product);
        return productCat === categoryFilter;
      });
    }
    
    // 2. Фильтрация по бренду
    if (filters.brand) {
      filtered = filtered.filter(product => 
        (product.make && product.make.toLowerCase() === filters.brand.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase() === filters.brand.toLowerCase())
      );
    }
    
    // 3. Фильтрация по минимальной цене
    if (filters.minPrice && filters.minPrice !== '') {
      filtered = filtered.filter(product => product.price >= Number(filters.minPrice));
    }
    
    // 4. Фильтрация по максимальной цене
    if (filters.maxPrice && filters.maxPrice !== '') {
      filtered = filtered.filter(product => product.price <= Number(filters.maxPrice));
    }
    
    return filtered;
  }, [products, getProductCategory]);

  // 🎯 ГЛАВНОЕ: вычисляем отфильтрованные товары напрямую (без useEffect)
  const filteredByCategoryAndFilters = useMemo(() => {
    return applyAllFilters(appliedFilters, category);
  }, [applyAllFilters, appliedFilters, category]);

  // 🎯 Итоговые товары: либо отсортированные, либо отфильтрованные
  const finalProducts = sortedProducts || filteredByCategoryAndFilters;

  const handleFilterApply = useCallback((filters) => {
    setAppliedFilters(filters);
    // При применении новых фильтров сбрасываем сортировку
    setSortedProducts(null);
  }, []);

  const handleSortChange = useCallback((newSortedProducts) => {
    setSortedProducts(newSortedProducts);
  }, []);

  // Если нет товаров - показываем заглушку
  if (!products || products.length === 0) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <Filters onFilterApply={handleFilterApply} />
        <Banner />
      </aside>

      <div className="main-content">
        <div className="products-header">
          <div className="products-count">
            <Counter count={finalProducts.length} />
            <div className='sort-panel'>
              <SortPanel 
                products={filteredByCategoryAndFilters}
                onSortChange={handleSortChange} 
              />
            </div>
          </div>
        </div>
        
        <div className="products-grid">
          {finalProducts.length === 0 ? (
            <div className="no-products">
              <p>No products found</p>
              <p style={{ fontSize: '12px', color: 'gray' }}>
                Category: {category || 'techstore'} | Total products: {products.length}
              </p>
            </div>
          ) : (
            finalProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TechStore;