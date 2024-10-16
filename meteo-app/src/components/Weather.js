import React, { useState, useEffect } from 'react';
import '../App.css';

const Weather = () => {
  const [forecastData, setForecastData] = useState(null);
  const [city, setCity] = useState('Lyon');                                                                             // Ville par défaut
  const [latLon, setLatLon] = useState({ lat: null, lon: null });
  const API_KEY = '13c963555badbceeef2991fffe14082a'; 

  const fetchLatLon = async (cityName) => {
    if (!cityName) {
      console.error('City name is empty');
      return;
    }

    console.log(`Fetching lat/lon for city: ${cityName}`);
    try {
      const response = await fetch(
         `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
      );
      const data = await response.json();
      console.log(`Data from geocoding API:`, data);

      if (data.length > 0) {
        setLatLon({ lat: data[0].lat, lon: data[0].lon });
        console.log(`Latitude`, data[0].lat, `Longitude`, data[0].lon);
      } else {
        console.error('City not found');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des coordonnées', error);
    }
  };

  useEffect(() => {
    const fetchForecastData = async () => {
      if (latLon.lat && latLon.lon) {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latLon.lat}&lon=${latLon.lon}&units=metric&appid=${API_KEY}&lang=fr`
          );
          const data = await response.json();
          setForecastData(data); 
        } catch (error) {
          console.error('Erreur lors de la récupération des données météo', error);
        }   
      }
    };

    fetchForecastData();
  }, [latLon]);

  const handleSearch = () => {
    if (city.trim() !== '') {
      fetchLatLon(city);
    } else {
      console.error('City input is empty');
    }
  };

  const handleKeyDown = (event) => {
    if(event.key === 'Enter') {
      handleSearch();
    }
  };

  const groupForecastByDay = () => {
    if (!forecastData || !forecastData.list) return {};

    return forecastData.list.reduce((acc, forecast) => {
      const date = new Date(forecast.dt_txt);
      const dateKey = date.toISOString().split('T')[0]; // Extrait la date au format YYYY-MM-DD

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(forecast);
      return acc;
    }, {});
  };

  const groupedForecasts = groupForecastByDay();

  /*
  const formatDate = (dateString) => {
    const options = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const getDailyForecast = () => {
    if (!forecastData || !forecastData.list) return [];
    return forecastData.list.filter((item) => item.dt_txt.includes('12:00:00'));
  };
  */

  return (
    <div>
      <h1>Prévisions météo sur 5 jours</h1>

      <input
        type="text"
        placeholder="Entrez une ville"
        value={city}  
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyDown} 
      />
      <button onClick={handleSearch}>Rechercher</button>

      {Object.keys(groupedForecasts).length > 0 ? (
        <div>
        <h2>Prévision pour {city}</h2>
        <div className="forecast-container">
          {Object.entries(groupedForecasts).map(([date, forecasts]) => (
            <div key={date} className="forecast-day">
              <h3>{new Date(date).toLocaleDateString('fr-FR', { weekday: 'long' })}</h3>
              {forecasts.map((forecast, index) => (
                <div key={index} className="forecast-time">
                  <p>{new Date(forecast.dt_txt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                  <p>Température: {forecast.main.temp}°C</p>
                  <p>Description: {forecast.weather[0].description}</p>
                  <img
                    src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                    alt="Weather icon"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      ) : (
        <p>Chargement des données météo...</p>
      )}
    </div>
  );
};

export default Weather;