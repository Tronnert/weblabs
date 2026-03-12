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

    // get weather
    const weatherUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`

    const weatherRes = await fetch(weatherUrl)
    const weatherData = await weatherRes.json()

    displayWeather(name, weatherData.current_weather)

}

function displayWeather(city, data) {

    document.getElementById("cityName").textContent = city
    document.getElementById("temp").textContent = data.temperature
    document.getElementById("wind").textContent = data.windspeed
    document.getElementById("code").textContent = data.weathercode

    document.getElementById("weather").classList.remove("hidden")

}