//local storage declaration condition statement
let cities;
if (localStorage.getItem("cities")) {
  cities = JSON.parse(localStorage.getItem("cities"));
} else {
  cities = [];
}
let buttonFunction = JSON.parse(localStorage.getItem("cities"));
console.log(buttonFunction);
for (let i = 0; i < 10; i++) {
  const newDiv = $("<div>");
  const newSearch = $("<button>")
    .text(buttonFunction[i])
    .attr("class", "btn btn-warning")
    .attr("id", `newBtn`);
  newDiv.prepend(newSearch);
  $("#visits").prepend(newDiv);
}
$(newBtn).on("click", () => {});

$(submitBtn).on("click", function (event) {
  event.preventDefault();

  //empty contents of table so data does not add on
  $("thead").empty();
  $("tbody").empty();

  //api query initialized
  const apiKey = `781966aaf116c3e54cb3db0f70d397fe`;
  const newValue = $("#cityInput").val();

  //local storage functions
  localStorage.setItem("cities", JSON.stringify(cities));
  var retrievedData = localStorage.getItem("cities");
  var newData = JSON.parse(retrievedData);
  if (cities.length >= 10) {
    cities.shift();
    cities.push(newValue);
  } else {
    cities.push(newValue);
  }

  var queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${newValue},us&appid=${apiKey}`;
  //   //ajax call to pull current weather data for submitted city
  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (res) {
    //city that has been searched will be displayed in header
    const newHeader = $("<tr>");
    const newCity = $("<h2>").text(res.name);
    const currentIcon = $("<img>").attr(
      "src",
      "https://openweathermap.org/img/w/" + res.weather[0].icon + ".png"
    );
    const currentTitle = $("<h4>").text("Current Weather");
    newHeader.prepend(newCity, currentTitle, currentIcon);
    $("thead").prepend(newHeader);

    //display current conditions
    const currentTemp = ((Number(res.main.temp) - 273.15) * 9) / 5 + 32;
    const newTemp = Math.trunc(currentTemp);
    const currentHumidity = res.main.humidity;
    const currentWind = res.wind.speed;
    const appendTemp = $("<tr>").append(`Temperature: ${newTemp}F`);
    const appendHumidity = $("<tr>").append(`Humidity: ${currentHumidity}%`);
    const appendWind = $("<tr>").append(`Wind Speed: ${currentWind}MPH`);
    $("tbody").append(appendTemp, appendHumidity, appendWind);
  });

  //ajax call for forecast
  let newQuery = `https://api.openweathermap.org/data/2.5/forecast?q=${newValue}&appid=${apiKey}`;

  $.ajax({
    url: newQuery,
    method: "GET",
  }).then((res) => {
    console.log(res);
    var latLocate = res.city.coord.lat;
    var lonLocate = res.city.coord.lon;
    var uvQuery = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${latLocate}&lon=${lonLocate}`;
    $.ajax({
      url: uvQuery,
      method: "GET",
    }).then((res) => {
      if (res.value >= 8) {
        var uvLevel = "red";
      } else if (res.value >= 6) {
        var uvLevel = "orange";
      } else if (res.value >= 3) {
        var uvLevel = "yellow";
      } else {
        var uvLevel = "green";
      }
      const uvIndex = $("<tr>")
        .append(`UV Index: ${res.value}`)
        .attr("style", `background-color: ${uvLevel}`);
      $("tbody").append(uvIndex);
    });

    //for loops to populate the weather cards
    var j = 0;
    for (let i = 0; i < 40; i += 8) {
      //break apart date and input into cards
      let dateMonth = res.list[i].dt_txt.slice(5, 7);
      let dateDay = res.list[i].dt_txt.slice(8, 10);
      let newDate = `${dateMonth}-${dateDay}`;
      let forecastHeader = $("<tr>");
      forecastHeader.prepend(newDate);
      j += 1;
      $(`#card${j}`).prepend(forecastHeader);

      //create row for image and populate into cards
      let iconRow = $("<tr>");
      let forecastIcon = $("<img>").attr(
        "src",
        "https://openweathermap.org/img/w/" +
          res.list[i].weather[0].icon +
          ".png"
      );
      iconRow.append(forecastIcon);
      $(`#card${j}`).append(iconRow);

      //populate card with temperature and humidity items
      let forecastTemp =
        ((Number(res.list[i].main.temp) - 273.15) * 9) / 5 + 32;
      let farenheitTemp = Math.trunc(forecastTemp);
      let forecastHumidity = res.list[i].main.humidity;
      let finalTemp = $("<tr>").append(`Temperature: ${farenheitTemp}F`);
      let finalHumidity = $("<tr>").append(`Humidity: ${forecastHumidity}%`);
      $(`#card${j}`).append(finalTemp, finalHumidity);
    }
  });
});
