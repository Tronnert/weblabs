const locationErrorDiv = document.getElementById("locationError");
const cityInput = document.getElementById("cityInput");
const addCityBtn = document.getElementById("addCityBtn");
const cityError = document.getElementById("cityError");
const citiesContainer = document.getElementById("citiesContainer");
const refreshBtn = document.getElementById("refreshBtn");

let cities = []; 

async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,relative_humidity_2m_max,wind_speed_10m_max`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("weather query error");
        return await res.json();
    } catch (e) {
        console.error(e);
        return null;
    }
}

function createCityCard(city, data, idx) {
    const div = document.createElement("div");
    div.className = "city-weather";

    let title = city.isCurrentLocation ? "Current location" : city.name;
    div.innerHTML = `<h2>${title}</h2>
        <p>Temp:: ${data.current_weather.temperature} °C</p>
        <p>Wind: ${data.current_weather.windspeed} km/h</p>`;

    for (let i = 0; i < 3; i++) {
        div.innerHTML += `
        <div class="forecast-day">
            <strong>${data.daily.time[i]}</strong> - 
            Temp: ${data.daily.temperature_2m_max[i]} °C, 
            Wind: ${data.daily.wind_speed_10m_max[i]} km/h, 
            Humidity: ${data.daily.relative_humidity_2m_max[i]} %
        </div>`;
    }

    if (!city.isCurrentLocation) {
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "remove";
        deleteBtn.style.background = "red";
        deleteBtn.style.marginTop = "5px";
        deleteBtn.addEventListener("click", () => {
            cities.splice(idx, 1);
            updateWeather();
        });
        div.appendChild(deleteBtn);
    }

    return div;
}

async function updateWeather() {
    citiesContainer.innerHTML = "";

    for (let i = 0; i < cities.length; i++) {
        const city = cities[i];
        const data = await fetchWeather(city.latitude, city.longitude);
        if (!data) {
            const errorDiv = document.createElement("div");
            errorDiv.textContent = `error ${city.name || "current location"}`;
            errorDiv.className = "error";
            citiesContainer.appendChild(errorDiv);
            continue;
        }
        const card = createCityCard(city, data, i);
        citiesContainer.appendChild(card);
    }

    saveCities();
}

function init() {
    const stored = localStorage.getItem("weatherCities");
    if (stored) {
        cities = JSON.parse(stored);
        updateWeather();
        return;
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            cities.push({ latitude, longitude, isCurrentLocation: true });
            updateWeather();
        }, () => {
            locationErrorDiv.classList.remove("hidden");
        });
    } else {
        locationErrorDiv.classList.remove("hidden");
    }
}

addCityBtn.onclick = async () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`;
    const res = await fetch(geoUrl);
    const data = await res.json();
    if (!data.results) {
        cityError.textContent = "city not found";
        cityError.classList.remove("hidden");
        return;
    }
    cityError.classList.add("hidden");

    const { latitude, longitude, name } = data.results[0];
    cities.push({ name, latitude, longitude, isCurrentLocation: false });
    cityInput.value = "";
    updateWeather();
};

const clearBtn = document.getElementById("clearBtn");

clearBtn.onclick = () => {
    if (confirm("Are you sure you want to clear data?")) {
        localStorage.clear();
        window.location.reload();
    }
};

refreshBtn.onclick = () => {
    updateWeather();
};

function saveCities() {
    localStorage.setItem("weatherCities", JSON.stringify(cities));
}

init();