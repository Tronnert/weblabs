const btn = document.getElementById("searchBtn")
const cityInput = document.getElementById("cityInput")

btn.onclick = searchWeather

async function searchWeather() {
    const city = cityInput.value
    if (!city) return

    // get coordinates from city name
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    const geoRes = await fetch(geoUrl)
    const geoData = await geoRes.json()

    if (!geoData.results) {
        alert("City not found")
        return
    }

    const { latitude, longitude, name } = geoData.results[0]

    // get weather with daily forecast
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,relative_humidity_2m_max,wind_speed_10m_max`
    const weatherRes = await fetch(weatherUrl)
    const weatherData = await weatherRes.json()

    displayWeather(name, weatherData.current_weather, weatherData.daily)
}

function displayWeather(city, current, daily) {
    document.getElementById("cityName").textContent = city
    document.getElementById("temp").textContent = current.temperature
    document.getElementById("wind").textContent = current.windspeed
    document.getElementById("code").textContent = current.weathercode

    // Clear previous forecast
    const forecastContainer = document.getElementById("forecast")
    forecastContainer.innerHTML = ""

    // Show forecast for next two days
    for (let i = 1; i <= 2; i++) {
        const day = daily.time[i]
        const temp = daily.temperature_2m_max[i]
        const humidity = daily.relative_humidity_2m_max[i]
        const wind = daily.wind_speed_10m_max[i]

        const dayDiv = document.createElement("div")
        dayDiv.className = "forecast-day"
        dayDiv.innerHTML = `
            <h3>${day}</h3>
            <p>Max Temp: ${temp} °C</p>
            <p>Max Humidity: ${humidity} %</p>
            <p>Max Wind: ${wind} km/h</p>
        `
        forecastContainer.appendChild(dayDiv)
    }

    document.getElementById("weather").classList.remove("hidden")
}