document.addEventListener("DOMContentLoaded", () => {
  const sunlightSpan = document.getElementById("sunlight");
  const windSpan = document.getElementById("wind");

  // Replace with your API key and endpoint
  const API_KEY = '655b8dc70cdfccb236ba91a62f686d54'; // e.g., from OpenWeatherMap
  const LAT = 28.6139; // Example: Delhi latitude
  const LON = 77.2090; // Delhi longitude

  async function fetchWeatherData() {
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`);
      const data = await res.json();

      const sunlight = data.weather[0].description; // e.g., "clear sky"
      const windSpeed = data.wind.speed + ' m/s';

      sunlightSpan.textContent = sunlight;
      windSpan.textContent = windSpeed;
    } catch (error) {
      sunlightSpan.textContent = 'Error fetching data';
      windSpan.textContent = 'Error fetching data';
      console.error(error);
    }
  }

  fetchWeatherData();
});
