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
      let bgColor = "";
      if (forecastDay.weather[0].main === "Clear") {
        bgColor = "#5ADFD1";
      } else if (forecastDay.weather[0].main === "Clouds") {
        bgColor = "#63c8f4";
      } else if (forecastDay.weather[0].main === "Rain") {
        bgColor = "#d1a4ff";
      } else if (forecastDay.weather[0].main === "Fog") {
        bgColor = "#8AAED1";
      } else if (forecastDay.weather[0].main === "Snow") {
        bgColor = "#b3f0ea";
      }

      forecastHTML =
        forecastHTML +
        `
            <div class="col" id="forecast" style="background-color: ${bgColor}">
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

  //Calling function
  changingBackground();
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
  let temperatureBox = document.querySelectorAll(".temperature-box");
  let temperature = document.querySelector(".temperature");
  let currentLocationButton = document.querySelector(
    "#current-location-button"
  );
  let cityName = document.querySelector(".city-name");
  let date = document.querySelector("#date");

  ///Clouds
  if (description.innerHTML === "Clouds") {
    document.body.style.background = `linear-gradient(#3183ec, #69caf2)`;
    document.body.style.backgroundAttachment = `fixed`;
    temperatureBox.forEach(function (temperatureElement) {
      temperatureElement.style.backgroundColor = `#42bff5`;
    });
    temperature.style.color = `#FFFFFF`;
    cityName.style.color = `#8ad8f8`;
    cityName.style.boxShadow = `-0.5rem -0.5rem #8ad8f8`;
    descriptionBox.style.background = `#d2efff`;
    description.style.color = `#4fa5d5`;
    currentLocationButton.style.background = `#42bff5`;
    date.style.color = `#FFFFFF`;

    /// clear
  } else if (description.innerHTML === "Clear") {
    document.body.style.background = `linear-gradient(#00d4ff, #cfed00
)`;
    document.body.style.backgroundAttachment = `fixed`;
    temperatureBox.forEach(function (temperatureElement) {
      temperatureElement.style.backgroundColor = `#7fd569`;
    });
    cityName.style.color = `#9dd98d`;
    cityName.style.boxShadow = `-0.5rem -0.5rem #9dd98d`;
    descriptionBox.style.background = `#d0fcc5`;
    description.style.color = `#2ca15a`;
    currentLocationButton.style.background = `#7fd569`;
    document.a.style.color = "#000000";
    date.style.color = `#FFFFFF`;

    ///snow
  } else if (description.innerHTML === "Snow") {
    document.body.style.background = `linear-gradient(#ace8e2, #7ee4d9)`;
    document.body.style.backgroundAttachment = `fixed`;
    temperatureBox.forEach(function (temperatureElement) {
      temperatureElement.style.backgroundColor = `#effffb`;
    });
    temperature.style.color = `#00736e`;
    descriptionBox.style.background = `#effffb`;
    description.style.color = `#00a19a`;
    currentLocationButton.style.background = `#00736e`;
    currentLocationButton.style.color = `#FFFFFF`;
    cityName.style.color = `#00a19a`;
    cityName.style.boxShadow = `-0.5rem -0.5rem #00a19a`;
    date.style.color = `#01625e`;

    /// rain
  } else if (description.innerHTML === "Rain") {
    document.body.style.background = `linear-gradient(#7f00ff, #edd4ff)`;
    document.body.style.backgroundAttachment = `fixed`;
    temperatureBox.forEach(function (temperatureElement) {
      temperatureElement.style.backgroundColor = `#9300fc`;
    });
    temperature.style.color = `#FFFFFF`;
    descriptionBox.style.background = `#e0c2fe`;
    description.style.color = `#4c0082`;
    currentLocationButton.style.background = `#9865cb`;
    currentLocationButton.style.color = `#FFFFFF`;
    cityName.style.color = `#a65dda`;
    cityName.style.boxShadow = `-0.5rem -0.5rem #a65dda`;
    date.style.color = `#FFFFFF`;

    /// Fog
  } else if (description.innerHTML === "Fog") {
    document.body.style.background = `linear-gradient(#6198cc, #a7bfd5)`;
    document.body.style.backgroundAttachment = `fixed`;
    temperatureBox.forEach(function (temperatureElement) {
      temperatureElement.style.backgroundColor = `#56a0bd`;
    });
    temperature.style.color = `#FFFFFF`;
    currentLocationButton.style.background = `#56a0bd`;
    currentLocationButton.style.color = `#FFFFFF`;
    currentLocationButton.style.border = `#FFFFFF`;
    description.style.color = `#76a2cc`;
    descriptionBox.style.background = `#e1edf2`;
    cityName.style.color = `#94c2d5`;
    cityName.style.boxShadow = `-0.5rem -0.5rem #94c2d5`;
    date.style.color = `#FFFFFF`;

    ///Mist
  } else if (description.innerHTML === "Mist") {
    document.body.style.background = `linear-gradient(#7f00ff, #edd4ff)`;
    document.body.style.backgroundAttachment = `fixed`;
    temperatureBox.forEach(function (temperatureElement) {
      temperatureElement.style.backgroundColor = `#9300fc`;
    });
    temperature.style.color = `#FFFFFF`;
    descriptionBox.style.background = `#e0c2fe`;
    description.style.color = `#4c0082`;
    currentLocationButton.style.background = `#9865cb`;
    currentLocationButton.style.color = `#FFFFFF`;
    cityName.style.color = `#a65dda`;
    cityName.style.boxShadow = `-0.5rem -0.5rem #a65dda`;
    date.style.color = `#FFFFFF`;

    /// Haze
  } else if (
    (description.innerHTML === "Haze",
    "Smoke",
    "Dust",
    "Sand",
    "Ash",
    "Squall",
    "Tornado")
  ) {
    document.body.style.background = `linear-gradient(#6198cc, #a7bfd5)`;
    document.body.style.backgroundAttachment = `fixed`;
    temperatureBox.forEach(function (temperatureElement) {
      temperatureElement.style.backgroundColor = `#56a0bd`;
    });
    temperature.style.color = `#FFFFFF`;
    currentLocationButton.style.background = `#56a0bd`;
    currentLocationButton.style.color = `#FFFFFF`;
    currentLocationButton.style.border = `#FFFFFF`;
    description.style.color = `#76a2cc`;
    descriptionBox.style.background = `#e1edf2`;
    cityName.style.color = `#94c2d5`;
    cityName.style.boxShadow = `-0.5rem -0.5rem #94c2d5`;
    date.style.color = `#FFFFFF`;
  }
  /// Drizzle
  else if (description.innerHTML === "Drizzle") {
    document.body.style.background = `linear-gradient(#4f1ffb, #edd4ff)`;
    document.body.style.backgroundAttachment = `fixed`;
    temperatureBox.forEach(function (temperatureElement) {
      temperatureElement.style.backgroundColor = `#9300fc`;
    });
    temperature.style.color = `#FFFFFF`;
    descriptionBox.style.background = `#e0c2fe`;
    description.style.color = `#4c0082`;
    currentLocationButton.style.background = `#9865cb`;
    currentLocationButton.style.color = `#FFFFFF`;
    cityName.style.color = `#a65dda`;
    cityName.style.boxShadow = `-0.5rem -0.5rem #a65dda`;
    date.style.color = `#FFFFFF`;
  }
  /// Thunderstorm
  else if (description.innerHTML === "Thunderstorm") {
    document.body.style.background = `linear-gradient(#7f00ff, #edd4ff)`;
    document.body.style.backgroundAttachment = `fixed`;
    temperatureBox.forEach(function (temperatureElement) {
      temperatureElement.style.backgroundColor = `#9300fc`;
    });
    temperature.style.color = `#FFFFFF`;
    descriptionBox.style.background = `#e0c2fe`;
    description.style.color = `#4c0082`;
    currentLocationButton.style.background = `#9865cb`;
    currentLocationButton.style.color = `#FFFFFF`;
    cityName.style.color = `#a65dda`;
    cityName.style.boxShadow = `-0.5rem -0.5rem #a65dda`;
    date.style.color = `#FFFFFF`;
  }
}
