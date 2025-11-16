var day = document.getElementById('day');
var day_month = document.getElementById('date');
var country = document.getElementById('country');
var weather = document.getElementById('weather');
var condition = document.getElementById('condition');
var icon_condition = document.getElementById('icon');
var searchinput = document.getElementById('searchinput');
var searchbtn = document.getElementById('button-addon1');

function getWeather(city) {
  var myhttp = new XMLHttpRequest();
  myhttp.open(
    'GET',
    `https://api.weatherapi.com/v1/forecast.json?key=05857d93d3b844d9963162527250211&q=${city}&days=3`
  );
  myhttp.send();

  myhttp.addEventListener('load', function () {
    if (myhttp.status == 200) {
      var response = JSON.parse(myhttp.response);
      updateWeatherCards(response);
    }
  });
}

function getWeatherByLocation(lat, lon) {
  var myhttp = new XMLHttpRequest();
  myhttp.open(
    'GET',
    `https://api.weatherapi.com/v1/forecast.json?key=05857d93d3b844d9963162527250211&q=${lat},${lon}&days=3`
  );
  myhttp.send();

  myhttp.addEventListener('load', function () {
    if (myhttp.status == 200) {
      var response = JSON.parse(myhttp.response);
      updateWeatherCards(response);
    }
  });
}

function updateWeatherCards(response) {
  var apidate = response.location.localtime;
  var dateobject = new Date(apidate);
  var dayobject = dateobject.toLocaleDateString('en-US', { weekday: 'long' });
  var monthobject = dateobject.toLocaleDateString('en-US', { month: 'long' });

  day.innerHTML = dayobject;
  day_month.innerHTML = dateobject.getDate() + ' ' + monthobject;
  country.innerHTML = response.location.name;
  weather.innerHTML = response.current.temp_c + '°C';
  condition.innerHTML = response.current.condition.text;
  icon_condition.innerHTML = `<img src="https:${response.current.condition.icon}" alt="Weather Icon">`;

  var forecast = response.forecast.forecastday;

  for (var i = 1; i < 3; i++) {
    var date = new Date(forecast[i].date);
    var dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    var monthName = date.toLocaleDateString('en-US', { month: 'long' });

    var card = document.getElementsByClassName('col-4')[i];
    var header = card.querySelector('.card-header');
    var h6 = header.getElementsByTagName('h6');
    var content = card.querySelector('.content');

    h6[0].innerHTML = dayName;
    h6[1].innerHTML = date.getDate() + ' ' + monthName;
    content.innerHTML = `
       <img src="https:${forecast[i].day.condition.icon}" alt="Weather Icon" style="width:50px; height:50px;" class="my-3">
      <h1 style="font-size: 40px;">${forecast[i].day.maxtemp_c}°C</h1>
      <p>${forecast[i].day.mintemp_c}°C</p>
      <span>${forecast[i].day.condition.text}</span>
    `;
  }
}

window.addEventListener('load', function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByLocation(lat, lon);
      },
      function (error) {
        alert("Please allow location access to show weather for your area.");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
    getWeather('Cairo');
  }
});

searchbtn.addEventListener('click', function () {
  var city = searchinput.value.trim();
  if (city !== '') {
    getWeather(city);
  }
});

searchinput.addEventListener('input', function () {
  var city = searchinput.value.trim();
  if (city.length > 0) {
    getWeather(city);
  }
});

