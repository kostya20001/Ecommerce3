import Container from './Container';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import WeatherWidget from './WeatherWidget';
import { useState } from 'react';
import './App.css';

function App() {
  const [isWeatherVisible, setIsWeatherVisible] = useState(true);

  return (
    <Container>
      <Header />
      <Content />
      {isWeatherVisible && (
        <WeatherWidget onClose={() => setIsWeatherVisible(false)} />
      )}
      <Footer />
    </Container>
  );
}

export default App;