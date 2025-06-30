import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind } from 'lucide-react';

const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    temperature: 22,
    condition: 'sunny',
    humidity: 45,
    windSpeed: 8,
    location: 'Addis Ababa'
  });

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'cloudy': return <Cloud className="w-5 h-5 text-gray-500" />;
      case 'rainy': return <CloudRain className="w-5 h-5 text-blue-500" />;
      default: return <Sun className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            {getWeatherIcon(weather.condition)}
            <span className="text-2xl font-bold text-text-primary">{weather.temperature}°C</span>
          </div>
          <p className="text-sm text-text-secondary">{weather.location}</p>
          <p className="text-xs text-text-secondary capitalize">{weather.condition}</p>
        </div>
        <div className="text-right text-sm text-text-secondary">
          <div className="flex items-center space-x-1">
            <Wind className="w-3 h-3" />
            <span>{weather.windSpeed} km/h</span>
          </div>
          <p>Humidity: {weather.humidity}%</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;