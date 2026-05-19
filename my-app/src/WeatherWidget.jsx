import { useState, useEffect, useRef, useCallback } from 'react';
import './WeatherWidget.css';

const WeatherWidget = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [cityInput, setCityInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const abortControllerRef = useRef(null);

  // 🔧 1. Обернем getWeatherIcon в useCallback (хотя она не зависит от пропсов)
  const getWeatherIcon = useCallback((code) => {
    const iconMap = {
      113: '01d', 116: '02d', 119: '03d', 122: '04d', 143: '50d',
      176: '09d', 179: '13d', 182: '09d', 185: '09d', 200: '11d',
      227: '13d', 230: '13d', 248: '50d', 260: '50d', 263: '09d',
      266: '09d', 281: '09d', 284: '09d', 293: '09d', 296: '09d',
      299: '09d', 302: '09d', 305: '09d', 308: '09d', 311: '09d',
      314: '09d', 317: '09d', 320: '13d', 323: '13d', 326: '13d',
      329: '13d', 332: '13d', 335: '13d', 338: '13d', 350: '09d',
      353: '09d', 356: '09d', 359: '09d', 362: '09d', 365: '09d',
      368: '13d', 371: '13d', 374: '09d', 377: '09d', 386: '11d', 389: '11d'
    };
    const iconCode = iconMap[code] || '01d';
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }, []); // Пустой массив, т.к. функция не зависит от пропсов

  // 🔧 2. Обернем fetchWeatherFromWttr в useCallback
  const fetchWeatherFromWttr = useCallback(async (cityName) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    try {
      const response = await fetch(
        `https://wttr.in/${encodeURIComponent(cityName)}?format=j1&lang=ru`,
        { signal: controller.signal }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const current = data.current_condition[0];
      const location = data.nearest_area[0];
      
      return {
        city: location.areaName[0].value,
        temperature: Math.round(parseInt(current.temp_C)),
        feelsLike: Math.round(parseInt(current.FeelsLikeC)),
        description: current.weatherDesc[0].value,
        humidity: current.humidity,
        windSpeed: current.windspeedKmph,
        pressure: current.pressure,
        icon: getWeatherIcon(current.weatherCode)
      };
    } catch (error) {
      if (error.name === 'AbortError') return null;
      throw error;
    }
  }, [getWeatherIcon]); // Зависит от getWeatherIcon

  // 🔧 3. Обернем основную fetchWeather в useCallback
  const fetchWeather = useCallback(async (cityName, isInitialLoad = false) => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const weather = await fetchWeatherFromWttr(cityName);
      
      if (!weather) {
        setErrorMessage(`Не удалось получить данные для города ${cityName}`);
        if (!isInitialLoad) setCityInput('');
        setIsLoading(false);
        return;
      }
      
      setWeatherData(weather);
      setCityInput(weather.city);
      
    } catch (error) {
      console.error('Error fetching weather:', error);
      setErrorMessage('Не удалось получить данные. Проверьте подключение к интернету.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchWeatherFromWttr]); // Зависит от fetchWeatherFromWttr

  // 🔧 4. ИСПРАВЛЕННЫЙ useEffect с правильными зависимостями
  useEffect(() => {
    fetchWeather('Tyumen', true);
    
    return () => {
      // Cleanup: отменяем запрос при размонтировании
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchWeather]); // ✅ Теперь зависимость указана правильно

  // 🔧 5. Обработчики не требуют useCallback (они не передаются в дочерние компоненты)
  const handleFetchWeather = () => {
    if (!cityInput.trim()) {
      setErrorMessage('Введите название города');
      return;
    }
    fetchWeather(cityInput.trim(), false);
  };

  // 🔧 6. Геолокация - обернем в useCallback
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setErrorMessage('Геолокация не поддерживается вашим браузером');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ru`
          );
          const data = await response.json();
          const city = data.address.city || data.address.town || data.address.village;
          
          if (city) {
            await fetchWeather(city, false);
          } else {
            throw new Error('City not found');
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          setErrorMessage('Не удалось определить город по геолокации');
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        if (error.code === 1) {
          setErrorMessage('Разрешите доступ к геолокации');
        } else {
          setErrorMessage('Ошибка при определении местоположения');
        }
        setIsLoading(false);
      }
    );
  }, [fetchWeather]); // Зависит от fetchWeather

  // Форматирование (они чистые функции, не требуют useCallback)
  const formatTemperature = (temp) => `${temp > 0 ? '+' : ''}${temp}°C`;
  const formatWindSpeed = (speed) => `${Math.round(speed * 0.621371)} mph`;

  return (
    <div className="weather-widget">
      <button className="weather-close-btn" onClick={onClose}>✕</button>
      
      {isLoading ? (
        <div className="weather-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-temp"></div>
          <div className="skeleton-details"></div>
        </div>
      ) : (
        <div className="weather-content">
          <div className="weather-input-section">
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Введите город"
              disabled={isLoading}
              className="weather-input"
            />
            <button 
              onClick={handleFetchWeather}
              disabled={isLoading}
              className="weather-button"
            >
              Получить погоду
            </button>
          </div>
          
          {errorMessage && (
            <div className="weather-error">{errorMessage}</div>
          )}
          
          {weatherData && !errorMessage && (
            <div className="weather-info">
              <div className="weather-main">
                <img 
                  src={weatherData.icon} 
                  alt={weatherData.description}
                  className="weather-icon"
                />
                <div className="weather-temp">
                  {formatTemperature(weatherData.temperature)}
                </div>
                <div className="weather-feels-like">
                  ощущается как {formatTemperature(weatherData.feelsLike)}
                </div>
                <div className="weather-city">{weatherData.city}</div>
                <div className="weather-description">
                  {weatherData.description}
                </div>
              </div>
              
              <div className="weather-details">
                <div className="weather-detail">
                  <span className="detail-label">💧 Влажность</span>
                  <span className="detail-value">{weatherData.humidity}%</span>
                </div>
                <div className="weather-detail">
                  <span className="detail-label">🌬️ Ветер</span>
                  <span className="detail-value">{formatWindSpeed(weatherData.windSpeed)}</span>
                </div>
                <div className="weather-detail">
                  <span className="detail-label">📊 Давление</span>
                  <span className="detail-value">{weatherData.pressure} hPa</span>
                </div>
              </div>
            </div>
          )}
          
          <button 
            onClick={getUserLocation}
            className="location-button"
          >
            Моя геолокация
          </button>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;