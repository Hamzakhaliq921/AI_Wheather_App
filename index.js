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
 
  getweather('karachi')
getweather('islamabad')
getweather('lahore')
getweather('peshawar')
getweather('sindh')
document.getElementById("subbutton").addEventListener("click", function(e){
  e.preventDefault();
  let city = document.getElementById("submit").value;
  getweather(city);
  updatecard(city);
});


function updatecard(city) {
  fetchweather(city)
    .then(data => {
//i will do this to use data in chatbotdata
    currentWeatherData = data;

      document.getElementById('h1').textContent = data.current.temp_c + " °C";
      document.getElementById('location1').textContent = "Location: " + data.location.name;
      document.getElementById('country1').textContent = "Country: " + data.location.country;
      document.getElementById('condition1').textContent = "Condition: " + data.current.condition.text;
      document.getElementById('feellike1').textContent = "Feel Like: " + data.current.feelslike_c + " °C";

      document.getElementById('condition2').textContent = data.current.condition.text;
      document.getElementById('Pressure').textContent = "Pressure: " + data.current.pressure_mb + " mb";
      document.getElementById('Visibility').textContent = "Visibility: " + data.current.vis_km + " km";
      document.getElementById('Cloud').textContent = "Cloud Cover: " + data.current.cloud + " %";
      document.getElementById('dew').textContent = "Dew Point: " + data.current.dewpoint_c + " °C";

      document.getElementById('Wind').textContent = data.current.wind_kph + " km/h";
      document.getElementById('Gust').textContent = "Gust: " + data.current.gust_kph + " km/h";
      document.getElementById('UV').textContent = "UV Index: " + data.current.uv;
      document.getElementById('win').textContent ="UV Index: "+ data.current.wind_kph + " km/h";
      document.getElementById('daynight').textContent = "Day/Night: " + (data.current.is_day ? "Day" : "Night");
    })
    .catch(error => console.error("Error:", error));
}


const chatToggle = document.getElementById("chatToggle");
const chatBox = document.getElementById("chatBox");
const closeChat = document.getElementById("closeChat");
const sendMsg = document.getElementById("sendMsg");
const chatInput = document.getElementById("chatInput");
const chatBody = document.getElementById("chatBody");

// Open chat
chatToggle.addEventListener("click", () => {
  chatBox.style.display = "flex";
});

// Close chat
closeChat.addEventListener("click", () => {
  chatBox.style.display = "none";
});

