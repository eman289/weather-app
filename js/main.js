document.addEventListener("DOMContentLoaded", function () {
  var data = [];
  var locationInput = document.getElementById("locationInput");
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  async function searchByCoordinates(latitude, longitude) {
    var weatherApi = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=6c4b854f8b4b4f7eb42214015230608&q=${latitude},${longitude}&days=3`
    );
    var apiResponse = await weatherApi.json();
    data = apiResponse;

    displayWeather();
  }

  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          searchByCoordinates(latitude, longitude);
        },
        function (error) {
          console.error("Error getting user location:", error);
          searchByCoordinates(30.0444, 31.2357); // Cairo's coordinates
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      searchByCoordinates(30.0444, 31.2357); // Cairo's coordinates
    }
  }

  getUserLocation();

  async function searchCity(cityName) {
    var weatherApi = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=6c4b854f8b4b4f7eb42214015230608&q=${cityName}&days=3`
    );
    var apiResponse = await weatherApi.json();
    data = apiResponse;

    displayWeather(cityName);
  }

  locationInput.addEventListener("input", function () {
    var city = locationInput.value;
    if (city.length >= 3) {
      searchCity(city);
    } else {
      return;
    }
  });

function displayWeather() {
  const today = data.forecast.forecastday[0];
  const tomorrow = data.forecast.forecastday[1];
  const dayAfterTomorrow = data.forecast.forecastday[2];
  const todayDate = new Date(today.date);
  const tomorrowDate = new Date(tomorrow.date);
  const dayAfterTomorrowDate = new Date(dayAfterTomorrow.date);
  // =============  today
  var dayOfWeek = daysOfWeek[todayDate.getDay()];
  var dayNumber = todayDate.getDate();
  var month = monthNames[todayDate.getMonth()];
  // =============  tomorrow
  var nextDay = daysOfWeek[tomorrowDate.getDay()];
  // =============  tomorrowAfter
  var nextDayAfter = daysOfWeek[dayAfterTomorrowDate.getDay()];
  // =============  Data
  var weatherData = "";
  weatherData += `
    <div class="col-lg-4">
              <div class="card bg-dark text-white ">
                <div class="card-header d-flex justify-content-between">
                  <span class="day">${dayOfWeek}</span
                  ><span class="date">${dayNumber} ${month}</span>
                </div>
                <div class="card-body p-4 text-center d-flex flex-column justify-content-center gap-2">
                  <h5 class="location" title="City">${data.location.name}</h5>
                  <div class="degree d-flex gap-2 justify-content-center align-items-center">
                    <h4 class="h1 mb-0" title="Temperature">${today.day.maxtemp_c}°C</h4>
                    <img src="${today.day.condition.icon}" alt="" />
                  </div>
                  <p class="status">${today.day.condition.text}</p>
                  <div class="info d-flex gap-4 justify-content-center">
                    <span title="Chance of rain"><i class="fa-solid fa-umbrella pe-1"></i>${today.day.daily_chance_of_rain}%</span
                    ><span title="Wind speed"><i class="fa-solid fa-wind pe-1"></i>${today.day.maxwind_kph}km/h</span
                    ><span title="Humidity"><i class="fa-solid fa-droplet pe-1"></i>${today.day.avghumidity}%</span>
                  </div>
                </div>
              </div>
            </div>
              <div class="col-lg-4">
              <div class="card bg-dark text-white text-center">
                <div class="card-header">
                  <span class="day">${nextDay}</span>
                </div>
                <div class="card-body p-4 d-flex flex-column justify-content-center gap-2 ">
                  <div class="degree mt-3">
                  <img src="${tomorrow.day.condition.icon}" alt="" />
                    <h4 class="h3" title="Temperature">${tomorrow.day.maxtemp_c}°C</h4>
                  </div>
                  <p class="status">${tomorrow.day.condition.text}</p>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="card bg-dark text-white text-center">
                <div class="card-header">
                  <span class="day">${nextDayAfter}</span>
                </div>
                <div class="card-body p-4 d-flex flex-column justify-content-center gap-2">
                  <div class="degree mt-3">
                  <img src="${dayAfterTomorrow.day.condition.icon}" alt="" />
                    <h4 class="h3" title="Temperature">${dayAfterTomorrow.day.maxtemp_c}°C</h4>
                  </div>
                  <p class="status">${dayAfterTomorrow.day.condition.text}</p>
                </div>
              </div>
            </div>
    `;

  document.getElementById("dataRow").innerHTML = weatherData;
}

});
