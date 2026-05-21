import './Banner.css';
import { useState, useEffect, useRef, useCallback } from 'react';

function Banner() {
    // 🔧 Поднимаем константу за пределы компонента или используем useRef
    // Вариант 1: вынести за пределы компонента (рекомендуется)
    const INITIAL_TIME = { hours: 0, minutes: 59, seconds: 59 };
    
    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
    const [isRunning, setIsRunning] = useState(true);
    const [isExpired, setIsExpired] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const timerRef = useRef(null);
    // 🔧 Добавляем ref, чтобы избежать зависимости от INITIAL_TIME
    const initialTimeRef = useRef(INITIAL_TIME);

    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

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
    }, [stopTimer]);

    useEffect(() => {
        startTimer();
        
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [startTimer]);

    const handleToggleTimer = useCallback(() => {
        if (isExpired) return;
        if (isRunning) {
            stopTimer();
        } else {
            startTimer();
        }
        setIsRunning(!isRunning);
    }, [isExpired, isRunning, stopTimer, startTimer]);

    // 🔧 ИСПРАВЛЕННЫЙ handleRestart - используем ref вместо прямой зависимости
    const handleRestart = useCallback(() => {
        setTimeLeft(initialTimeRef.current);
        setIsExpired(false);
        
        stopTimer();
        startTimer();
        setIsRunning(true);
    }, [stopTimer, startTimer]); // ✅ INITIAL_TIME больше не в зависимостях

    const handleClose = useCallback(() => {
        setIsVisible(false);
    }, []);

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
                    {isRunning ? '⏸ Stop' : '▶ Resume'}
                </button>
                <button 
                    className={`control-btn restart-btn ${isExpired ? 'active' : ''}`}
                    onClick={handleRestart}
                >
                    🔄 Restart
                </button>
            </div>
        </div>
    );
}

export default Banner;