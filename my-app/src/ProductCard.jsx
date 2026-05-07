import React, { useState } from 'react';
import { useCart } from './Container';
import './ProductCard.css'

const ProductCard = ({ product }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const { cart, addToCart, updateCartQuantity } = useCart();

    const quantity = cart.get(product.id) || 0;

    const {
        id,
        category,
        make,
        brand,
        model,
        price,
        isSpecialOffer,
        images = []
    } = product;

    const productImages = images.length > 0 ? images : [
        "https://img.mvideo.ru/Big/10033004bb6.jpg",
        "https://img.mvideo.ru/Big/10033004bb1.jpg",
        "https://img.mvideo.ru/Big/10033004bb2.jpg",
        "https://img.mvideo.ru/Big/10033004bb3.jpg",
        "https://img.mvideo.ru/Big/10033004bb4.jpg"
    ]

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % productImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + productImages.length) % productImages.length);
    };

    const toggleLike = (e) => {
        e.stopPropagation(); // Чтобы событие не всплывало
        setIsLiked(!isLiked);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

     const handleAddToCart = () => {
        setQuantity(1);
        if (onQuantityChange) {
            onQuantityChange(id, 1);
        }
    };

    const handleIncrement = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        if (onQuantityChange) {
            onQuantityChange(id, newQuantity);
        }
    };

    const handleDecrement = () => {
        const newQuantity = quantity - 1;
        if (newQuantity === 0) {
            setQuantity(0);
            if (onQuantityChange) {
                onQuantityChange(id, 0);
            }
        } else {
            setQuantity(newQuantity);
            if (onQuantityChange) {
                onQuantityChange(id, newQuantity);
            }
        }
    };

    // Рендер кнопки в зависимости от количества
    const renderCartButton = () => {
        if (quantity === 0) {
      return (
        <button className='ButtonCard' onClick={() => addToCart(product.id)}>
          Add to Cart
        </button>
      );
    } else {
      return (
        <div className="cart-controls">
          <button onClick={() => updateCartQuantity(product.id, quantity - 1)}>−</button>
          <span>{quantity} in cart</span>
          <button onClick={() => updateCartQuantity(product.id, quantity + 1)}>+</button>
        </div>
      );
    }
    };

    return(
        <div className="Card" data-id={id} data-category={category} data-make={make || brand}>
            <div className='CardImage'>
                <button 
                    className={`like-button ${isLiked ? 'liked' : ''}`}
                    onClick={toggleLike}
                    aria-label="Добавить в избранное"
                >
                    {isLiked ? '❤️' : '🤍'}
                </button>

                 {isSpecialOffer && (
                    <div className="special-offer-badge">
                        Special Offer
                    </div>
                )}

                <img 
                    className="product-image"
                    src={productImages[currentImageIndex]} 
                    alt={`${make || brand} ${model}`}
                />

                {productImages.length > 1 && (
                    <>
                        <button 
                            className="nav-button nav-button-left"
                            onClick={prevImage}
                            aria-label="Предыдущее изображение"
                        >
                            ‹
                        </button>
                        <button 
                            className="nav-button nav-button-right"
                            onClick={nextImage}
                            aria-label="Следующее изображение"
                        >
                            ›
                        </button>
                    </>
                )}

                {productImages.length > 1 && (
                    <div className="image-counter">
                        {currentImageIndex + 1} / {productImages.length}
                    </div>
                )}
            </div>

            <div className='CardBody'>
                <div className="brand-category">
                    <p className='brand'>{make || brand}</p>
                </div>
                <p className='model'>{model}</p>
                <p className='price'>{formatPrice(price)}</p>
            {renderCartButton()}
            </div>
        </div>
    );
}

export default ProductCard;