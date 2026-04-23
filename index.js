let currentWeatherData = null;

function fetchweather(city) {
  return fetch(`https://api.weatherapi.com/v1/current.json?key=${CONFIG.WEATHER_API_KEY}&q=${city}&aqi=yes`)
    .then(response => response.json());
}

function getweather(city) {
  fetchweather(city).then(data => {
    updateMap(data.location.lat, data.location.lon);

    let temp = document.getElementById(city + 'temp');
    let humidity = document.getElementById(city + 'humidity');
    let wind = document.getElementById(city + 'wind');
    let condition = document.getElementById(city + 'condition');
    let uv = document.getElementById(city + 'uv');
    let feellike = document.getElementById(city + 'feellike');

    temp.innerHTML = data.current.temp_c + " °C";
    humidity.innerHTML = data.current.humidity + " %";
    wind.innerHTML = data.current.wind_kph + " km/h";
    condition.innerHTML = data.current.condition.text;
    uv.innerHTML = data.current.uv;
    feellike.innerHTML = data.current.feelslike_c + " °C";

  }).catch(error => console.error("Error:", error));
}

getweather('karachi');
getweather('islamabad');
getweather('lahore');
getweather('peshawar');
getweather('sindh');

document.getElementById("subbutton").addEventListener("click", function(e) {
  e.preventDefault();
  let city = document.getElementById("submit").value;
  getweather(city);
  updatecard(city);
});

function updatecard(city) {
  fetchweather(city)
    .then(data => {
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
      document.getElementById('win').textContent = "UV Index: " + data.current.wind_kph + " km/h";
      document.getElementById('daynight').textContent = "Day/Night: " + (data.current.is_day ? "Day" : "Night");
    })
    .catch(error => console.error("Error:", error));
}

// ── Chat ──────────────────────────────────────────────
const chatToggle = document.getElementById("chatToggle");
const chatBox    = document.getElementById("chatBox");
const closeChat  = document.getElementById("closeChat");
const sendMsg    = document.getElementById("sendMsg");
const chatInput  = document.getElementById("chatInput");
const chatBody   = document.getElementById("chatBody");

chatToggle.addEventListener("click", () => { chatBox.style.display = "flex"; });
closeChat.addEventListener("click",  () => { chatBox.style.display = "none"; });
sendMsg.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") sendMessage();
});

async function askAI(userMessage) {
  if (!currentWeatherData) return "Weather data not loaded yet.";

  const city      = currentWeatherData.location.name;
  const temp      = currentWeatherData.current.temp_c;
  const condition = currentWeatherData.current.condition.text;
  const humidity  = currentWeatherData.current.humidity;

  const systemPrompt = `
You are a weather assistant.

Current weather in ${city}:
Temperature: ${temp} °C
Condition: ${condition}
Humidity: ${humidity} %

Note:
1. Mention if it's hot, cold, or any other temperature description.
2. If the user asks, suggest food popular in ${city}.
3. If the user asks, suggest 3 famous tourist places in ${city}.
4. Adapt suggestions according to the weather.
  `;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CONFIG.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.href,
        "X-OpenRouter-Title": "AI Weather App"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-small-3.2-24b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user",   content: userMessage }
        ]
      })
    });

    const data = await response.json();
    if (data.error) { console.error(data.error); return "API Error. Check console."; }
    return data.choices[0].message.content;

  } catch (error) {
    console.error(error);
    return "Something went wrong.";
  }
}

// ── Theme ─────────────────────────────────────────────
const themeBtn = document.getElementById("themeBtn");

function toggleTheme() {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    themeBtn.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    themeBtn.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
}

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeBtn.textContent = "☀️";
}

// ── Map ───────────────────────────────────────────────
function updateMap(lat, lon) {
  document.getElementById("weatherMapFrame").src =
    `https://maps.google.com/maps?q=${lat},${lon}&z=12&output=embed&hl=en`;
}

// ── Send message ──────────────────────────────────────
async function sendMessage() {
  const message = chatInput.value.trim();
  if (message === "") return;

  const userDiv = document.createElement("div");
  userDiv.classList.add("user-message");
  userDiv.innerText = message;
  chatBody.appendChild(userDiv);

  chatInput.value = "";

  const botDiv = document.createElement("div");
  botDiv.classList.add("bot-message");
  botDiv.innerText = "Typing...";
  chatBody.appendChild(botDiv);

  chatBody.scrollTop = chatBody.scrollHeight;

  const reply = await askAI(message);
  botDiv.innerText = reply;
}