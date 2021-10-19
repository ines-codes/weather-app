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

/// Fixing the days on the forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

/// Display the forecast

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast-display");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
            <div class="col" id="forecast">
              <br />
              <p id="next">${formatDay(forecastDay.dt)}</p>
              
              <p><img src="icons/${
                forecastDay.weather[0].icon
              }.png" alt="" class="forecast-icons" /></p>
              <p><span class="weather-forecast-temperature-max"><strong> ${Math.round(
                forecastDay.temp.max
              )}°</strong> </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
            forecastDay.temp.min
          )}° </span></p>
            </div>
          `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

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
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
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

  // For the conversion
  celsiusTemperature = response.data.main.temp;
  // End

  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;

  showIcon(response);

  /// Getting lat and lon for the forecast
  getForecast(response.data.coord);
  ///end

  //Calling function
  changingBackground();
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

/// Receiving coords for the forecast
function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "836945bb1ae780c68d086d693cfcb666";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

// Changing today's icon according to the description

function showIcon(response) {
  let iconElement = document.querySelector("#today-icon");

  iconElement.setAttribute("src", `icons/${response.data.weather[0].icon}.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

// Changing from Fahrenheit to Celsius and Vice Versa

function displayFahrenheit(event) {
  event.preventDefault();
  let fahrenheitValue = (celsiusTemperature * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitValue);
  // Remove active class from Celsius link
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  //end
}

function displayCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  // Add active class from Celsius link
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  //end
}

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-button");
fahrenheitLink.addEventListener("click", displayFahrenheit);

let celsiusLink = document.querySelector("#celsius-button");
celsiusLink.addEventListener("click", displayCelsius);

search("Lisboa");

// Changing colors
function changingBackground() {
  let description = document.querySelector("#description");
  let descriptionBox = document.querySelector(".description-box");
  let temperatureBox = document.querySelector(".temperature-box");
  let temperature = document.querySelector(".temperature");
  let currentLocationButton = document.querySelector(
    "#current-location-button"
  );

  // Cloudy

  if (description.innerHTML === "Clouds") {
    document.body.style.background = `linear-gradient(#F717CF #F3E2F6)`;
    document.body.style.backgroundAttachment = `fixed`;
    temperatureBox.style.backgroundColor = `#800000`;
  } else if (description.innerHTML === "Fog") {
    temperatureBox.style.backgroundColor = `#FF99CC`;
  } else if (description.innerHTML === "Snow") {
    temperatureBox.style.backgroundColor = `#33FF99`;
  } else if (description.innerHTML === "Clear") {
    temperatureBox.style.backgroundColor = `#42bff5`;
  }
}
