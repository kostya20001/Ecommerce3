import React from 'react';
import './Counter.css'

function Counter ({ count }) {
    return(
        <div>
            <p className='count-products'>{count} products</p>
        </div>
    );
}

export default Counter;