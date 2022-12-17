let _lat = 0;
let _lng = 0;
let weather = {
    apiKey: "8ca78e034a25bdeac5ce35d208c2941c",
    fetchWeather: function (city) {
      fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
          city +
          "&units=metric&appid=" +
          this.apiKey
      )
        .then((response) => {
          if (!response.ok) {
            alert("Cuaca tidak ditemukan.");
            throw new Error("Cuaca tidak ditemukan.");
          }
          return response.json();
        })
        .then((data) => {
          this.displayWeather(data)
          this.displayMaps(data)
        });
    },

    displayMaps: function (data) {
      const latitude = data.coord.lat;
      const longitude = data.coord.lon;
      const { name } = data;
      _lat = latitude;
      _lng = longitude;
      document.querySelector(".map").innerHTML = ""
      document.querySelector(".map").innerHTML = `<div id="map"></div>`
      generateMaps(_lat,_lng,name)
    },

    displayWeather: function (data) {
      const { name } = data;
      const { icon, description } = data.weather[0];
      const { temp, humidity } = data.main;
      const { speed } = data.wind;
      console.log(data.coord)
      document.querySelector(".city").innerText = "Cuaca di " + name;
      document.querySelector(".icon").src =
        "https://openweathermap.org/img/wn/" + icon + "@2x.png";
      document.querySelector(".description").innerText = description;
      document.querySelector(".temp").innerText = temp + "°C";
      document.querySelector(".humidity").innerText =
        "Kelembapan: " + humidity + "%";
      document.querySelector(".wind").innerText =
        "Kecepatan Angin: " + speed + " km/h";
      document.querySelector(".weather").classList.remove("loading");
      document.body.style.backgroundImage =
        "url('https://source.unsplash.com/1600x900/?" + name + "')";
    },
    search: function () {
      this.fetchWeather(document.querySelector(".search-bar").value);
    },
  };
  
  document.querySelector(".search button").addEventListener("click", function () {
    weather.search();

  });
  
  document
    .querySelector(".search-bar")
    .addEventListener("keyup", function (event) {
      if (event.key == "Enter") {
        weather.search();
      }
    });


    function showPosition(position) {
      let lat = position.coords.latitude;
      let lng = position.coords.longitude;
     console.log(lat,lng)
     fetchLatLng(lat,lng)
     generateMaps(lat,lng,"Your Location")
    }
    
    
  function fetchLatLng(latitude,longitude,name) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
        latitude +
        "&lon=" + longitude + "&units=metric&appid=" +
        weather.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("Cuaca tidak ditemukan.");
          throw new Error("Cuaca tidak ditemukan.");
        }
        let res = response;
        console.log("res: ",res)
        return response.json();
      }).then((data)=>{
        console.log(data)
        weather.displayWeather(data)
      })
  }

  function generateMaps(lat,lng) {
    
    var map = L.map('map', {
      center: [lat, lng],
      zoom: 11
    });
    // Create a Tile Layer and add it to the map
    var tiles = new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: '15'}).addTo(map);

    var marker = L.marker(
    [lat, lng],
    { 
      draggable: true,
      title: "location",
      opacity: 0.75
    });

    marker.addTo(map);
    marker.on("dragend",function (e) {
      console.log(e)
      let lat = e.target._latlng.lat
      let lng = e.target._latlng.lng
     fetchLatLng(lat,lng)
    })
  }

    function showTime(){
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
    var session = "AM";
    
    if(h == 0){
        h = 12;
    }
    
    if(h > 12){
        h = h - 12;
        session = "PM";
    }
    
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    
    var time = h + ":" + m + ":" + s + " " + session;
    document.getElementById("MyClockDisplay").innerText = time;
    document.getElementById("MyClockDisplay").textContent = time;
    
    setTimeout(showTime, 1000);
    
}

showTime();
