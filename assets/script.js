// Adding Live Clock to header
const headingDiv = document.querySelector("#heading");
function renderHeader() {
}
let renderClock = function () {
  document.querySelector("clock-div")
  $("#currentDay").text(moment().format("MMMM Do YYYY, h:mm:ss a"))
};
renderHeader();
renderClock();
setInterval(renderClock, 1000);

function createCityList(citySearchList) {
  $("#city-list").empty();
// Returning an array from strings
  var keys = Object.keys(citySearchList);
  for (var i = 0; i < keys.length; i++) {
    var cityListEntry = $("<button>");
    cityListEntry.addClass("list-group-item list-group-item-action");

    var splitStr = keys[i].toLowerCase().split(" ");
    for (var j = 0; j < splitStr.length; j++) {
      splitStr[j] =
        splitStr[j].charAt(0).toUpperCase() + splitStr[j].substring(1);
    }
    var titleCasedCity = splitStr.join(" ");
    cityListEntry.text(titleCasedCity);

    $("#city-list").append(cityListEntry);
  }
}
// Linking API's for current weather and 5 day forecast
function populateCityWeather(city, citySearchList) {
  createCityList(citySearchList);

  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?&units=imperial&appid==" +
    city;

  var queryURL2 =
    "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid==" +
    city;

  $.ajax({
    url: queryURL,
    method: "GET"
  })
    // Store all retrieved data inside of "weather"
    .then(function (weather) {
      // Log the queryURL
      console.log(queryURL);

      // Log the result
      console.log(weather);

      var nowMoment = moment();

      var displayMoment = $("<h3>");
      $("#city-name").empty();
      $("#city-name").append(
        displayMoment.text("(" + nowMoment.format("M/D/YYYY") + ")")
      );

      var cityName = $("<h3>").text(weather.name);
      $("#city-name").prepend(cityName);

      var weatherIcon = $("<img>");
      weatherIcon.attr(
        "src",
        "https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"
      );
      $("#current-icon").empty();
      $("#current-icon").append(weatherIcon);

      $("#current-temp").text("Temperature: " + weather.main.temp + " °F");
      $("#current-humidity").text("Humidity: " + weather.main.humidity + "%");
      $("#current-wind").text("Wind Speed: " + weather.wind.speed + " MPH");

      latitude = weather.coord.lat;
      longitude = weather.coord.lon;
      // Linking UV index API
      var queryURL3 =
        "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid==" +
        "&lat=" +
        latitude +
        "&lon=" +
        longitude;

      $.ajax({
        url: queryURL3,
        method: "GET"
        // Store retrieved data inside uvIndex
      }).then(function (uvIndex) {
        console.log(uvIndex);

        var uvIndexDisplay = $("<button>");
        uvIndexDisplay.addClass("btn btn-danger");

        $("#current-uv").text("UV Index: ");
        $("#current-uv").append(uvIndexDisplay.text(uvIndex[0].value));
        console.log(uvIndex[0].value);

        $.ajax({
          url: queryURL2,
          method: "GET"
          // Store all of the retrieved data inside "forecast"
        }).then(function (forecast) {
          console.log(queryURL2);

          console.log(forecast);
          // Loop through the forecast list array and display a single forecast entry/time
          for (var i = 6; i < forecast.list.length; i += 8) {

            var forecastDate = $("<h5>");

            var forecastPosition = (i + 2) / 8;

            console.log("#forecast-date" + forecastPosition);

            $("#forecast-date" + forecastPosition).empty();
            $("#forecast-date" + forecastPosition).append(
              forecastDate.text(nowMoment.add(1, "days").format("M/D/YYYY"))
            );
            //  Forecast icons
            var forecastIcon = $("<img>");
            forecastIcon.attr(
              "src",
              "https://openweathermap.org/img/w/" +
              forecast.list[i].weather[0].icon +
              ".png"
            );

            $("#forecast-icon" + forecastPosition).empty();
            $("#forecast-icon" + forecastPosition).append(forecastIcon);

            console.log(forecast.list[i].weather[0].icon);

            $("#forecast-temp" + forecastPosition).text(
              "Temp: " + forecast.list[i].main.temp + " °F"
            );
            $("#forecast-humidity" + forecastPosition).text(
              "Humidity: " + forecast.list[i].main.humidity + "%"
            );
            $("#forecast-wind" + forecastPosition).text(
              "Wind: " + forecast.list[i].main.humidity + "MPH"
            );
          }
        });
      });
    });
}

$(document).ready(function () {
  var citySearchListStringified = localStorage.getItem("citySearchList");

  var citySearchList = JSON.parse(citySearchListStringified);

  if (citySearchList == null) {
    citySearchList = {};
  }

  createCityList(citySearchList);

  $("#current-weather").hide();
  $("#forecast-weather").hide();



  $("#search-button").on("click", function (event) {
    event.preventDefault();
    var city = $("#city-input")
      .val()
      .trim()
      .toLowerCase();

    //Check to see if text has been entered
    if (city != "") {

      citySearchList[city] = true;
      localStorage.setItem("citySearchList", JSON.stringify(citySearchList));

      populateCityWeather(city, citySearchList);

      $("#current-weather").show();
      $("#forecast-weather").show();
    }
  });

  $("#city-list").on("click", "button", function (event) {
    event.preventDefault();
    var city = $(this).text();

    populateCityWeather(city, citySearchList);

    $("#current-weather").show();
    $("#forecast-weather").show();
  });
});
