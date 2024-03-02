//Variables for the if statments 
let x = 0;
let y = 0;
//TODO change to array system
let temperatureDataF1 = 0;
let temperatureData1 = 0;
let temperatureDataF2 = 0;
let temperatureData2 = 0;

// Exit button for navigation bar 
$(".navigation p").click(function() {
  if (y == 0) {
    $(".openNav").hide(500);
    $(".navigation p").html("=")
    $(".navigation").css("background-color", "rgba(0,0,0,0)");
    $(".navigation p").css("margin-left", "2");
    $(".navigation p").css("margin-right", "auto");
    y = 1;
  } else {
    $(".openNav").show(500);
    $(".navigation p").html("X")
    if ($(document).width() >= 650)
      $(".navigation").css("background-color", "#6272a4");
    $(".navigation p").css("margin-right", "2");
    $(".navigation p").css("margin-left", "auto");
    y = 0;
  }
});

// API Call and temperature handling
$.getJSON("https://api.weather.gc.ca/collections/climate-hourly/items?f=json&lang=en-CA&limit=10&properties=TEMP&sortby=-LOCAL_DATE&STATION_NAME=VICTORIA%20UNIVERSITY%20CS", function(data) {
  temperatureData1 = data.features[0].properties.TEMP;
  $("#temperature").html(temperatureData1 + " °C");
  temperatureDataF1 = Math.round((temperatureData1 * 9 / 5 + 32) * 10) / 10
});

// Calls weather bit
const settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://weatherbit-v1-mashape.p.rapidapi.com/current?lon=-123.407244&lat=48.656176",
  "method": "GET",
  "headers": {
    "X-RapidAPI-Key": "9ce83c4ad2msh8593035ddfc894bp170785jsn255091e660dd",
    "X-RapidAPI-Host": "weatherbit-v1-mashape.p.rapidapi.com"
  }
};

$.ajax(settings).done(function(response) {
  temperatureData2 = response.data[0].temp;

  $("#temperature2").html(temperatureData2 + " °C");
  temperatureDataF2 = Math.round((temperatureData2 * 9 / 5 + 32) * 10) / 10

  // sets the weather logo
  $("#templogo").attr("src", "icons/" + response.data[0].weather.icon + ".png");
  //sets the slogon
  //TODO set up cases so that the slogan always displays correctly, even if it doesnt know what to do.
  slogans(response.data[0].weather.description);
});

// Cheesy Slogans
function slogans(current_weather) {
  switch (current_weather) {
    case "scattered clouds":
      $("#description").html("The clouds. The're scattered.");
      break;

    case "Clear sky":
      $("#description").html("Nothing but good old blue and sun up there");
      break;

    case "Broken clouds":
      $("#description").html("Last night the clouds spent too much money. Today they are broken clouds");
      break;

    case "Few clouds":
      $("#description").html("Just a few clouds here and there");
      break;

    default:
      $("#description").html(current_weather);
  }
}

// C to F feature
$("#weather").click(function() {

  if (x == 0) {
    $("#temperature").html(temperatureDataF1 + " °F");
    $("#temperature2").html(temperatureDataF2 + " °F");
    x = 1;
  } else {
    $("#temperature").html(temperatureData1 + " °C");
    $("#temperature2").html(temperatureData2 + " °C");
    x = 0;
  }
});

//24 Hour prediction handling. 
const daysettings = {
  "async": true,
  "crossDomain": true,
  "url": "https://weatherbit-v1-mashape.p.rapidapi.com/forecast/hourly?lat=48.655402&lon=-123.432621&hours=24",
  "method": "GET",
  "headers": {
    "X-RapidAPI-Key": "9ce83c4ad2msh8593035ddfc894bp170785jsn255091e660dd",
    "X-RapidAPI-Host": "weatherbit-v1-mashape.p.rapidapi.com"
  }
};

$.ajax(daysettings).done(function(response) {
  dayforcast(response.data);
});

function dayforcast(data) {

  for (let i = 0; i < data.length; i++) {
    var hour = document.createElement("div");

    //time
    var tag = document.createElement("p");
    tag.id = "time";
    tag.append(document.createTextNode(parsetime(data[i].timestamp_local)));
    hour.appendChild(tag);

    //Icon
    tag = document.createElement("img");
    tag.width = 50;
    tag.height = 50;
    tag.src = "icons/" + data[i].weather.icon + ".png";
    tag.alt = "Icon";
    hour.appendChild(tag);

    //Temp
    tag = document.createElement("p");
    tag.append(document.createTextNode(leadzero(data[i].temp) + "°C"));
    hour.appendChild(tag);

    //UV
    tag = document.createElement("p");
    tag.append(document.createTextNode("UV: " + uvclass(data[i].uv)));
    hour.appendChild(tag);

    //Rain
    tag = document.createElement("p");
    tag.append(document.createTextNode("Rain: " + leadzero(data[i].precip) + "%"));
    hour.appendChild(tag);

    //Wind
    tag = document.createElement("p");
    tag.append(document.createTextNode("Wind: " + leadzero(data[i].wind_spd) + " km/h"));
    hour.appendChild(tag);


    document.getElementById("dayforcast").appendChild(hour);
  }
}

//Rounds and ADDS leading space
function leadzero(x) {
  x = Math.round(x);
  if (x > 9 || x < 0)
    return x;

  x.toString();
  return " " + x;
}

//Determines UV rating according to https://www.canada.ca/en/environment-climate-change/services/weather-health/uv-index-sun-safety.html
function uvclass(uv) {
  if (uv <= 2.0)
    return "Low      ";
  if (uv <= 5.0)
    return "Moderate ";
  if (uv <= 7.0)
    return "High     ";
  if (uv <= 10)
    return "Very High";
  return "Extreme    ";
}
// This changes String from having full date to only having hour and minutes
function parsetime(time) {
  time = time.split("T");
  time[1] = time[1].slice(0, 5);
  return time[1];
}

//sets the settings before calling api
const weeksettings = {
  "async": true,
  "crossDomain": true,
  "url": "https://weatherbit-v1-mashape.p.rapidapi.com/forecast/daily?lat=48.655402&lon=-123.432621",
  "method": "GET",
  "headers": {
    "X-RapidAPI-Key": "9ce83c4ad2msh8593035ddfc894bp170785jsn255091e660dd",
    "X-RapidAPI-Host": "weatherbit-v1-mashape.p.rapidapi.com"
  }
};

//Calls API and trigers actions
$.ajax(weeksettings).done(function(response) {
  weekforcast(response.data);
});

function weekforcast(data) {
  for (let i = 0; i < 7; i++) {
    var day = document.createElement("div");

    //Day of the week
    var tag = document.createElement("p");
    tag.append(document.createTextNode(getday(data[i].datetime)));
    day.appendChild(tag);

    //Icon
    tag = document.createElement("img");
    tag.src = "icons/" + data[i].weather.icon + ".png";
    tag.alt = "Icon";
    day.appendChild(tag);

    //High
    tag = document.createElement("p");
    tag.append(document.createTextNode("High: " + data[i].max_temp + "°C"));
    day.appendChild(tag);

    //Low
    tag = document.createElement("p");
    tag.append(document.createTextNode("Low: " + data[i].min_temp + "°C"));
    day.appendChild(tag);

    //Rain
    tag = document.createElement("p");
    tag.append(document.createTextNode("Rain: " + data[i].precip + "%"));
    day.appendChild(tag);


    document.getElementById("weekforcast").appendChild(day);

  }
}

//This returns the day of the week
function getday(day) {
  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [y, m, d] = day.split('-');
  let x = new Date();
  x.setDate(d);
  x.setMonth(m - 1);
  x.setFullYear(y);
  return weekday[x.getDay()];
}
