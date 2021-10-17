// Displaying the current date and time

function formatDate() {
  let now = new Date();
  let date = now.getDate();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let year = now.getFullYear();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hours < 10) {
    hours = `0${hours}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[now.getDay()];
  return `${day}, ${hours}:${minutes}`;
}

let currentTime = document.querySelector("#date");
currentTime.innerHTML = formatDate();

/// Display a city and weather on load
function search(city) {
  let apiKey = "836945bb1ae780c68d086d693cfcb666";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
}

// Display the city name in H1 after searching
// Make an API call to open WeatherMap API
// Dsplay the city name once we get a response

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input-text").value;
  search(city);
}

//Showing the temperature after getting a response from the form
function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);

  let temperatureToday = document.querySelector("#temperature");
  temperatureToday.innerHTML = `${temperature}`;

  let cityName = document.querySelector("h1");
  cityName.innerHTML = response.data.name;

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;

  showIcon(response);
}

// Displaying current data after response from the button
function searchLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiCurrentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=836945bb1ae780c68d086d693cfcb666&units=metric`;

  axios.get(apiCurrentUrl).then(showTemperature);
}
function getCurrentLocation(event) {
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let form = document.querySelector("form");
form.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

search("Lisboa");

// Changing today's icon according to the description

function showIcon(response) {
  let iconElement = document.querySelector("#today-icon");

  iconElement.setAttribute("src", `icons/${response.data.weather[0].icon}.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description);
}
