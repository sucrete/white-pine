const LAT = 39.263;
const LON = -114.858;

const apiUrl =
  `https://api.open-meteo.com/v1/forecast` +
  `?latitude=${LAT}&longitude=${LON}` +
  `&current=temperature_2m,weather_code,wind_speed_10m` +
  `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
  `&temperature_unit=fahrenheit&wind_speed_unit=mph` +
  `&timezone=America%2FLos_Angeles&forecast_days=5`;

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

var weatherData;

async function getWeather() {
  try {
    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error('Network response was not ok');
    weatherData = await res.json();
  } catch (error) {
    console.error('Error:', error);
  }
}

async function populateDOM() {
  await getWeather();

  //~ grab all DOM elements
  // today
  const weatherIcon     = document.getElementsByClassName('icon-img')[0];
  const theTemp         = document.getElementsByClassName('the-temp')[0];
  const weather         = document.getElementsByClassName('what-weather')[0];
  const windSpeed       = document.getElementsByClassName('wind')[0];

  // tomorrow
  const tomorrowDay         = document.getElementsByClassName('tomorrow')[0];
  const tomorrowWeatherIcon = document.getElementsByClassName('tomorrow-icon')[0];
  const tomorrowHi          = document.getElementsByClassName('future-row-1')[0].getElementsByClassName('hi')[0];
  const tomorrowLo          = document.getElementsByClassName('future-row-1')[0].getElementsByClassName('lo')[0];

  // day after tomorrow
  const dayAfterTomorrowDay  = document.getElementsByClassName('day-after-tomorrow')[0];
  const dayAfterTomorrowIcon = document.getElementsByClassName('day-after-tomorrow-icon')[0];
  const dayAfterTomorrowHi   = document.getElementsByClassName('future-row-2')[0].getElementsByClassName('hi')[0];
  const dayAfterTomorrowLo   = document.getElementsByClassName('future-row-2')[0].getElementsByClassName('lo')[0];

  // three days from today
  const threeDaysFromTodayDay  = document.getElementsByClassName('three-days-from-today')[0];
  const threeDaysFromTodayIcon = document.getElementsByClassName('three-days-from-today-icon')[0];
  const threeDaysFromTodayHi   = document.getElementsByClassName('future-row-3')[0].getElementsByClassName('hi')[0];
  const threeDaysFromTodayLo   = document.getElementsByClassName('future-row-3')[0].getElementsByClassName('lo')[0];

  //~ Set Today's Weather
  const current = weatherData.current;
  weatherIcon.src      = `./assets/images/icons/${assignIcon(current.weather_code, current.wind_speed_10m)}.png`;
  theTemp.innerHTML    = Math.ceil(current.temperature_2m);
  weather.innerHTML    = weatherLabel(current.weather_code, current.wind_speed_10m);
  windSpeed.innerHTML  = Math.ceil(current.wind_speed_10m);

  //~ Set Forecast
  const daily = weatherData.daily;

  const setForecast = (index, dayEl, iconEl, hiEl, loEl) => {
    dayEl.innerHTML  = days[dayFromISO(daily.time[index])];
    iconEl.src       = `./assets/images/icons/${assignIcon(daily.weather_code[index])}.svg`;
    hiEl.innerHTML   = Math.ceil(daily.temperature_2m_max[index]);
    loEl.innerHTML   = Math.ceil(daily.temperature_2m_min[index]);
  };

  setForecast(1, tomorrowDay,         tomorrowWeatherIcon, tomorrowHi,         tomorrowLo);
  setForecast(2, dayAfterTomorrowDay, dayAfterTomorrowIcon, dayAfterTomorrowHi, dayAfterTomorrowLo);
  setForecast(3, threeDaysFromTodayDay, threeDaysFromTodayIcon, threeDaysFromTodayHi, threeDaysFromTodayLo);
}

populateDOM();

// WMO weather code → icon filename
function assignIcon(code, wind = 0) {
  if (wind > 20)       return 'wind';
  if (code === 0)      return 'sun';
  if (code <= 2)       return 'part-cloud';
  if (code === 3)      return 'cloudy';
  if (code <= 48)      return 'foggy';
  if (code <= 67)      return 'rain';   // drizzle + rain
  if (code <= 77)      return 'snow';   // snow/sleet
  if (code <= 82)      return 'rain';   // rain showers
  if (code <= 86)      return 'snow';   // snow showers
  return                      'rain';   // thunderstorm
}

// WMO weather code → human-readable label
function weatherLabel(code, wind = 0) {
  if (wind > 20)       return 'Windy';
  if (code === 0)      return 'Clear';
  if (code <= 2)       return 'Partly Cloudy';
  if (code === 3)      return 'Cloudy';
  if (code <= 48)      return 'Foggy';
  if (code <= 57)      return 'Drizzle';
  if (code <= 67)      return 'Rainy';
  if (code <= 77)      return 'Snowy';
  if (code <= 82)      return 'Showers';
  if (code <= 86)      return 'Snow Showers';
  return                      'Stormy';
}

// Parse ISO date string (YYYY-MM-DD) to day-of-week index without UTC shift
function dayFromISO(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
}
