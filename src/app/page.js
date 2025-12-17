"use client"; // Required for useState and useEffect
import { useState, useEffect } from 'react';
import axios from 'axios';

const apikey = process.env.NEXT_PUBLIC_API_KEY;

export default function WeatherPage() {
    const [city, setCity] = useState('');
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apikey}`;
                fetchInitialData(url);
            });
        }
    }, []);

    const fetchInitialData = async (url) => {
        try {
            const response = await axios.get(url);
            setCurrentWeather(response.data);
            fetchForecast(response.data.name);
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    };

    const fetchForecast = async (cityName) => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apikey}`;
            const response = await axios.get(url);
            setForecastData(response.data);
        } catch (error) {
            console.error('Error fetching forecast:', error);
        }
    };

    const searchByCity = async () => {
        if (!city) return;
        setLoading(true);
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}`;
            const response = await axios.get(url);
            setCurrentWeather(response.data);
            fetchForecast(response.data.name);
            setCity('');
        } catch (error) {
            alert("City not found");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <header className="header">
                <h1>Weather Dashboard</h1>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Enter city name..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && searchByCity()}
                    />
                    <button onClick={searchByCity} disabled={loading}>
                        {loading ? '...' : 'Search'}
                    </button>
                </div>
            </header>

            {currentWeather && (
                <main>
                    <div className="left-panel">
                        <section className="weather-card">
                            <h2>{currentWeather.name}, {currentWeather.sys.country}</h2>
                            <div className="temp-box">
                                <p className="main-temp">{Math.round(currentWeather.main.temp)}°C</p>
                                <img src="/sun.png" alt="Sun" className="sun-icon-custom" />
                            </div>
                            <span className="description">{currentWeather.weather[0].description}</span>
                        </section>

                        <section className="forecast-section" style={{marginTop: '2rem'}}>
                            <h3>Today's Timeline</h3>
                            <div className="forecast-grid-row">
                                {forecastData?.list.slice(0, 5).map((item, index) => (
                                    <div key={index} className="forecast-item-col">
                                        <p className="time">{new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <p className="temp-small">{Math.round(item.main.temp)}°C</p>
                                        <p className="desc-small">{item.weather[0].main}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className="forecast-section">
                        <h3>Next 4 Days</h3>
                        <div className="forecast-grid-vertical">
                            {forecastData?.list.filter((_, i) => i % 8 === 0).slice(1, 5).map((item, index) => (
                                <div key={index} className="forecast-item-row">
                                    <div>
                                        <p className="date">{new Date(item.dt * 1000).toLocaleDateString([], { weekday: 'short' })}</p>
                                        <p className="desc-small">{item.weather[0].description}</p>
                                    </div>
                                    <p className="temp-range">{Math.round(item.main.temp_max)}° / {Math.round(item.main.temp_min)}°</p>
                                </div>
                            ))}
                        </div>
                    </aside>
                </main>
            )}
        </div>
    );
}