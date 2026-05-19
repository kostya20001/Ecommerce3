import './Banner.css';
import { useState, useEffect, useRef, useCallback } from 'react';

function Banner() {
    const INITIAL_TIME = { hours: 0, minutes: 59, seconds: 59 };
    
    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
    const [isRunning, setIsRunning] = useState(true);
    const [isExpired, setIsExpired] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const timerRef = useRef(null);

    // 🔧 1. stopTimer - уже стабильная (не требует useCallback, т.к. не зависит от пропсов/стейта)
    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []); // Пустой массив - функция никогда не меняется

    // 🔧 2. startTimer - оборачиваем в useCallback
    const startTimer = useCallback(() => {
        if (timerRef.current) stopTimer();
        
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                const { hours, minutes, seconds } = prev;
                
                if (hours === 0 && minutes === 0 && seconds === 0) {
                    stopTimer();
                    setIsExpired(true);
                    setIsRunning(false);
                    return prev;
                }
                
                let newHours = hours;
                let newMinutes = minutes;
                let newSeconds = seconds;
                
                if (newSeconds > 0) {
                    newSeconds--;
                } else {
                    newSeconds = 59;
                    if (newMinutes > 0) {
                        newMinutes--;
                    } else if (newHours > 0) {
                        newHours--;
                        newMinutes = 59;
                    }
                }
                
                const newTime = { hours: newHours, minutes: newMinutes, seconds: newSeconds };
                
                if (newHours === 0 && newMinutes === 0 && newSeconds === 0) {
                    stopTimer();
                    setIsExpired(true);
                    setIsRunning(false);
                }
                
                return newTime;
            });
        }, 1000);
    }, [stopTimer]); // ✅ Зависит только от stopTimer

    // 🔧 3. ИСПРАВЛЕННЫЙ useEffect
    useEffect(() => {
        startTimer();
        
        return () => {
            // Cleanup: останавливаем таймер при размонтировании компонента
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [startTimer]); // ✅ Теперь зависимость указана правильно

    // 🔧 4. handleToggleTimer - оборачиваем в useCallback
    const handleToggleTimer = useCallback(() => {
        if (isExpired) return;
        if (isRunning) {
            stopTimer();
        } else {
            startTimer();
        }
        setIsRunning(!isRunning);
    }, [isExpired, isRunning, stopTimer, startTimer]);

    // 🔧 5. handleRestart - оборачиваем в useCallback
    const handleRestart = useCallback(() => {
        setTimeLeft(INITIAL_TIME);
        setIsExpired(false);
        
        stopTimer();
        startTimer();
        setIsRunning(true);
    }, [stopTimer, startTimer]); // Зависит от stopTimer и startTimer

    // 🔧 6. handleClose - стабильная
    const handleClose = useCallback(() => {
        setIsVisible(false);
    }, []);

    // formatTime - не требует useCallback (чистая функция)
    const formatTime = () => {
        const { hours, minutes, seconds } = timeLeft;
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className='banner'>
            <button className='close' onClick={handleClose}>✕</button>
            <h3 className='title text'>Special Deal!</h3>
            <p className='text'>Register now to unlock exclusive offers and discounts</p>
            
            {isExpired ? (
                <p className='text expired'>Timer expired!</p>
            ) : (
                <p className='text timer'>Offer expires in: {formatTime()}</p>
            )}
            
            <div className="banner-controls">
                <button 
                    className={`control-btn ${isExpired ? 'disabled' : ''}`}
                    onClick={handleToggleTimer}
                    disabled={isExpired}
                >
                    {isRunning ? ' Stop' : ' Resume'}
                </button>
                <button 
                    className={`control-btn restart-btn ${isExpired ? 'active' : ''}`}
                    onClick={handleRestart}
                >
                     Restart
                </button>
            </div>
        </div>
    );
}

export default Banner;