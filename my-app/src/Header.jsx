import './Header.css';
import cart from './assets/cart.svg';
import person from './assets/person.svg';
import { useCart } from './hooks/useCart';
import { usePage } from './hooks/usePage';  // ← добавить импорт
import React from 'react';

const Header = () => {
  const { getCartTotalCount } = useCart();  // ← убрать pageType, setPageType
  const { pageType, setPageType } = usePage();  // ← добавить эту строку
  
  return (
    <header className='header'>
      <div>
        <div>
          <button
            className={pageType === 'techstore' ? 'active' : ''}
            onClick={() => setPageType('techstore')}
          >
            TechStore
          </button>
          <nav className={pageType === 'cart' ? 'hidden' : ''}>
            <button 
              className={pageType === 'tv' ? 'active' : ''}
              onClick={() => setPageType('tv')}
            >
              TV
            </button>
            <button 
              className={pageType === 'phone' ? 'active' : ''}
              onClick={() => setPageType('phone')}
            >
              Phones
            </button>
            <button 
              className={pageType === 'laptop' ? 'active' : ''}
              onClick={() => setPageType('laptop')}
            >
              Laptops
            </button>
          </nav>
        </div>
        <div className="cart-button-wrapper">
          <button 
            className="cart-button"
            onClick={() => setPageType('cart')}
          >
            <img
              src={cart}
              alt="Cart"
              style={{ width: '20px', height: '20px' }}
            />
            {getCartTotalCount() > 0 && (
              <span className="cart-badge">{getCartTotalCount()}</span>
            )}
          </button>
          <button>
            <img
              src={person}
              alt="Person"
              style={{ width: '20px', height: '20px' }}
            />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;