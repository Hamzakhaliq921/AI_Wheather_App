let currentWeatherData = null;


function fetchweather(city) {
  return fetch(`https://api.weatherapi.com/v1/current.json?key=fbbfb41ac89345d795745250262502&q=${city}&aqi=yes`)
    .then(response => response.json())
}
function getweather(city) {
  fetchweather(city).then(data => {
 
updateMap(data.location.lat, data.location.lon);

    let temp = document.getElementById(city + 'temp')
    let humidity = document.getElementById(city + 'humidity')
    let wind = document.getElementById(city + 'wind')
    let condition = document.getElementById(city + 'condition')
    let uv = document.getElementById(city + 'uv')
    let feellike = document.getElementById(city + 'feellike')


    temp.innerHTML = data.current.temp_c + " °C";
    humidity.innerHTML = data.current.humidity + " %";
    wind.innerHTML = data.current.wind_kph + " km/h";
    condition.innerHTML = data.current.condition.text;
    uv.innerHTML = data.current.uv;
    feellike.innerHTML = data.current.feelslike_c + " °C";

    

  }
  ).catch(error => console.error("Error:", error));

}
 

