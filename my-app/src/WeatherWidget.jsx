import { useState, useEffect, useRef } from 'react';
import './WeatherWidget.css';

const WeatherWidget = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [cityInput, setCityInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const abortControllerRef = useRef(null);

  // Получение погоды через wttr.in
  const fetchWeatherFromWttr = async (cityName) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    try {
      // wttr.in возвращает JSON с погодой без ключа
      const response = await fetch(
        `https://wttr.in/${encodeURIComponent(cityName)}?format=j1&lang=ru`,
        { signal: controller.signal }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      // Парсим данные из ответа
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
  };

  // Преобразование кода погоды в иконку
  const getWeatherIcon = (code) => {
    const iconMap = {
      113: '01d', // Ясно
      116: '02d', // Малооблачно
      119: '03d', // Облачно
      122: '04d', // Пасмурно
      143: '50d', // Туман
      176: '09d', // Небольшой дождь
      179: '13d', // Небольшой снег
      182: '09d', // Дождь со снегом
      185: '09d', // Небольшой ледяной дождь
      200: '11d', // Гроза
      227: '13d', // Снегопад
      230: '13d', // Сильный снегопад
      248: '50d', // Туман
      260: '50d', // Густой туман
      263: '09d', // Небольшая морось
      266: '09d', // Морось
      281: '09d', // Небольшая морось с замерзанием
      284: '09d', // Морось с замерзанием
      293: '09d', // Небольшой дождь
      296: '09d', // Дождь
      299: '09d', // Умеренный дождь
      302: '09d', // Сильный дождь
      305: '09d', // Небольшие дождевые осадки
      308: '09d', // Сильные дождевые осадки
      311: '09d', // Небольшой ледяной дождь
      314: '09d', // Ледяной дождь
      317: '09d', // Сильный ледяной дождь
      320: '13d', // Небольшой снегопад
      323: '13d', // Снегопад
      326: '13d', // Умеренный снегопад
      329: '13d', // Сильный снегопад
      332: '13d', // Небольшой дождь с градом
      335: '13d', // Дождь с градом
      338: '13d', // Сильный дождь с градом
      350: '09d', // Небольшая морось с ледяными кристаллами
      353: '09d', // Небольшой дождь
      356: '09d', // Умеренный дождь
      359: '09d', // Сильный дождь
      362: '09d', // Небольшой дождь с градом
      365: '09d', // Дождь с градом
      368: '13d', // Небольшой дождь со снегом
      371: '13d', // Дождь со снегом
      374: '09d', // Небольшой град
      377: '09d', // Град
      386: '11d', // Гроза с небольшим дождем
      389: '11d'  // Гроза с сильным дождем
    };
    const iconCode = iconMap[code] || '01d';
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Основная функция загрузки погоды
  const fetchWeather = async (cityName, isInitialLoad = false) => {
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
  };

  // Загрузка погоды для Тюмени при монтировании
  useEffect(() => {
    fetchWeather('Tyumen', true);
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Обработчик кнопки "Получить погоду"
  const handleFetchWeather = () => {
    if (!cityInput.trim()) {
      setErrorMessage('Введите название города');
      return;
    }
    fetchWeather(cityInput.trim(), false);
  };

  // Геолокация
  const getUserLocation = () => {
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
          // Получаем название города по координатам
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
  };

  // Форматирование
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
            📍 Моя геолокация
          </button>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;