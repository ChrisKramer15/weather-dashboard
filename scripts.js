var apiKey = "b3d4ffb82a70ee7f0cd14ee1afcc08c9";
var weatherKey = "&units=imperial&APPID=b3d4ffb82a70ee7f0cd14ee1afcc08c9";
var today = moment().format("MM/DD/YYYY");
var cities = [];

function alertCityName() {
  var cityName = $(this).attr("data-name");
  alert(cityName);
}

function displayCityWeather(city) {
  $("#currentWeather").empty();
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&APPID=b3d4ffb82a70ee7f0cd14ee1afcc08c9";
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    var iconCode = response.weather[0].icon;
    var iconUrl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
    var currentTemp = Math.round(response.main.temp);
    var currentHumid = Math.round(response.main.humidity);

    $("#current-city").html(
      response.name + " (" + today + ")" + "<img src=" + iconUrl + ">"
    );
    $("#current-temp").text(`Temperature: ${currentTemp}° F`);
    $("#current-hum").text("Humidity: " + currentHumid + " %");
    $("#current-wind").text("Wind Speed: " + response.wind.speed + " MPH");
    var lat = response.coord.lat;
    var lon = response.coord.lon;
    var queryURL =
      "https://api.openweathermap.org/data/2.5/uvi?&APPID=b3d4ffb82a70ee7f0cd14ee1afcc08c9&lat=" +
      lat +
      "&lon=" +
      lon;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      var uvIndex = response.value;
      var uvColorCode = "";
      if (uvIndex <= 1) {
        uvColorCode = "#228B22";
      } else if (uvIndex <= 2) {
        uvColorCode = "#006400";
      } else if (uvIndex <= 3) {
        uvColorCode = "#FFFF66";
      } else if (uvIndex <= 4) {
        uvColorCode = "#FFFF33";
      } else if (uvIndex <= 5) {
        uvColorCode = "#FFFF00";
      } else if (uvIndex <= 6) {
        uvColorCode = "#ffa500";
      } else if (uvIndex <= 7) {
        uvColorCode = "#FF8c00";
      } else if (uvIndex <= 8) {
        uvColorCode = "#FF4500";
      } else if (uvIndex <= 9) {
        uvColorCode = "#ff0000";
      } else if (uvIndex <= 10) {
        uvColorCode = "#8b0000";
      } else if (uvIndex <= 11) {
        uvColorCode = "#9370DB";
      } else if ((uvIndex) => 11) {
        uvColorCode = "#800080";
      }
      $("#current-uv")
        .text(uvIndex)
        .attr("style", "background-color: " + uvColorCode);
    });
  });
}

function renderFiveDayForecast(city) {
  $("#five-day-forecast").empty();

  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial&APPID=b3d4ffb82a70ee7f0cd14ee1afcc08c9";
  console.log(queryURL + " is OpenWeatherMap City 5 day forecast info");

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    $("#five-day-forecast").empty();

    for (var i = 0; i <= 4; i++) {
      console.log(i);

      var nextDay = moment()
        .add(1 + i, "days")
        .format("MM/DD/YYY");
      var cityIconForecastCode = response.list[i].weather[0].icon;
      var iconForecastURL =
        "http://openweathermap.org/img/wn/" + cityIconForecastCode + "@2x.png";
      var cityTemperatureForecast = Math.round(response.list[i].main.temp);
      var cityHumidityForecast = response.list[i].main.humidity;

      $("#five-day-forecast").append(
        $("<div>")
          .addClass("card text-white bg-primary float-left")
          .attr("id", "forecast-card")
          .attr("style", "max-width: 10rem; margin-left: 23px")
          .append($("<p>").html(nextDay))
          .append(
            $("<img src=" + iconForecastURL + ">")
              .attr("height", "50px")
              .attr("width", "50px")
          )
          .append(
            $("<p>").html("Temperature: " + cityTemperatureForecast + "° F")
          )
          .append($("<p>").html("Humidity: " + cityHumidityForecast + " %"))
      );
      $("#five-day-forecast").append;
      console.log(
        nextDay + ", " + cityTemperatureForecast + ", " + cityHumidityForecast
      );
    }
  });
}

function renderButtons() {
  const cities = JSON.parse(localStorage.getItem("cities"));
  if (!localStorage.getItem("cities")) {
    localStorage.setItem("cities", JSON.stringify([]));
  }
  $("#buttons-view").empty();
  var searchListLength = cities.length;
  if (searchListLength >= 8) {
    searchListLength -= 8;
  } else {
    searchListLength = 0;
  }
  for (var i = searchListLength; i <= cities.length; i++) {
    var a = $("<button>");
    a.attr("type", "button");
    a.addClass("list-group-item");
    a.addClass("city");
    a.attr("data-name", cities[i]);
    a.text(cities[i]);
    $("#buttons-view").prepend(a);
  }
}

$("#add-city").on("click ", function (event) {
  event.preventDefault();
  var city = $("#city-input").val().trim();
  const cities = JSON.parse(localStorage.getItem("cities"));
  cities.push(city);
  localStorage.setItem("cities", JSON.stringify(cities));
  displayCityWeather(city);
  renderFiveDayForecast(city);
  renderButtons();
  $("#city-input").val("");
  console.log("#add-city was clicked");
});

$(document).on("click", ".city", function () {
  var city = $(this).attr("data-name");
  displayCityWeather(city);
  renderFiveDayForecast(city);
});

function start() {
  renderButtons();
  const stored_cities = JSON.parse(localStorage.getItem("cities"));
  displayCityWeather(stored_cities[stored_cities.length - 1]);
  renderFiveDayForecast(stored_cities[stored_cities.length - 1]);
}

start();
