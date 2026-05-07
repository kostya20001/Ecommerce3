import './Banner.css'
import { useState, useEffect } from 'react';

function Banner () {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 53,
        seconds: 50
    });

     useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
                    clearInterval(timer);
                    return prev;
                }
                
                let { hours, minutes, seconds } = prev;
                
                if (seconds > 0) {
                    seconds--;
                } else {
                    seconds = 59;
                    if (minutes > 0) {
                        minutes--;
                    } else if (hours > 0) {
                        hours--;
                        minutes = 59;
                    }
                }
                
                return { hours, minutes, seconds };
            });
        }, 1000);
        
        return () => clearInterval(timer);
    }, []);

    return (
        <div className='banner'> 
            <button className='close'>✕</button>
            <h3 className='title text'>Special Deal!</h3>
            <p className='text'>Register now to unlock exclusive offers and discounts</p>
            <p className='text timer'>Offer expires in: {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
            </p>
        </div>
    );
}

export default Banner;