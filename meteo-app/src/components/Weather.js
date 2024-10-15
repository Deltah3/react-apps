import React, { useState, useEffect } from 'react';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('Lyon'); // Ville par défaut
  const [query, setQuery] = useState('');
  const API_KEY = '13c963555badbceeef2991fffe14082a'; 

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&lang=fr`
      );
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données météo', error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  const handleSearch = () => {
    if (city.trim() != '') {
      setQuery(city);
    }
  }

  const handleKeyDown = (event) => {
    if(event.key === 'Enter') {
      handleSearch();
    }
  }

  return (
    <div>
      <h1>Météo du jour</h1>

      <input
        type="text"
        placeholder="Entrez une ville"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyDown} 
      />
      <button onClick={handleSearch}>Rechercher</button>

      {weatherData && weatherData.main ? (
        <div>
          <h2>{weatherData.name}</h2>
          <p>Température: {weatherData.main.temp}°C</p>
          <p>Description: {weatherData.weather[0].description}</p>
          <img
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt="Weather icon"
          />
        </div>
      ) : (
        <p>Chargement des données météo...</p>
      )}
    </div>
  );
};

export default Weather;
