//viewmodel - defines data and behavior
//function ViewModel() {
var map;

// Create a new blank array for all the listing markers.
var markers = [];

// Create placemarkers array to use in multiple functions to have control
// over the number of places that show - separate from locations that load with
//page
var placeMarkers = [];
//}

//openweathermap.org api gets this var
var weather = {};

//this initMap is a massive function
function initMap() {
  //create new map instance
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 32.7767, lng: -96.7970},
    zoom: 8,
    mapTypeControl: false
  });

  //searchbox to execute a places search
  var searchBox = new google.maps.places.SearchBox(
    document.getElementById('places-search'));
    //bias the boundaries within the map
    searchBox.setBounds(map.getBounds());

  // These are the locations that will be shown to the user.
  var locations = [
    {title: 'Cidercade', location: {lat: 32.8056605, lng: -96.84654390000003}},
    {title: 'Gui Sushi Korean Japanese Bistro and Bar', location: {lat: 32.79848640000001, lng: -96.8014632}},
    {title: 'Meso Maya Comida Y Copas', location: {lat: 32.787801, lng: -96.80496040000003}},
    {title: 'The Mansion Restaurant', location: {lat: 32.8041117, lng: -96.80734359999997}},
    {title: 'Cane Rosso', location: {lat: 32.78248110000001, lng: -96.78549859999998}},
    {title: 'Grapevine Bar', location: {lat: 32.8053771, lng: -96.81501279999998}},
    {title: 'Bowen House', location: {lat: 32.7979765, lng: -96.80196539999997}},
    {title: 'Louie Louies Piano Bar', location: {lat: 32.7842788, lng: -96.78633539999998}},
    {title: 'Dallas Museum of Art', location: {lat: 32.7875631, lng: -96.80102369999997}},
    {title: 'The Samurai Collection', location: {lat: 32.7915351, lng: -96.8062554}},
    {title: 'Perot Museum of Nature and Science', location: {lat: 32.7868362, lng: -96.8066938}},
    {title: 'Reunion Tower', location: {lat: 32.7757814, lng: -96.809279}},
    {title: 'Crown Plaza Dallas Downtown', location: {lat: 32.7808672, lng: -96.80374710000001}},
    {title: 'Magnolia Hotel', location: {lat: 32.7801662, lng: -96.7990567}},
    {title: 'Aloft Dallas Downtown', location: {lat: 32.7771609, lng: -96.80106560000002}}
  ];

  //var largeInfowindow = new google.maps.InfoWindow();
  var infowindow = new google.maps.InfoWindow();

  //adjust boundaries of map to fit filtered places, this creates new LatLng
  //instance which captures SW and NE corners of viewport
  var bounds = new google.maps.LatLngBounds();

  //use location array to create an array of markers on initMap
  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var title = locations[i].title;
    //create marker per location and put into markers array
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    })
    //push marker to array of markers
    markers.push(marker);

    //extend boundaries of map for each marker
    bounds.extend(marker.position);

    marker.addListener ('click', function() {
      toggleBounce(this);
    });

    //create onclick event to open an infowindow at each marker
    marker.addListener('click', function() {
      populateInfoWindow(this, infowindow);
    });
    map.fitBounds(bounds);
  }

  //this function populates infowindow when marker is clicked. only allow one
  //infowindow and populate based on marker's position
  function populateInfoWindow(marker, infowindow) {
    infowindow.marker = marker;
    infowindow.setContent('');
    //make sure marker property is cleared if infowindow is closed
    infowindow.addListener('closeclick', function(){
      infowindow.setContent(null);
    });
    //use temp and humidity from openweather.org API
    //var weather = weather;
    //set latlng var to pass into geocoder - required for geocoder
    var latlng = marker.position;
    var geocoder = new google.maps.Geocoder();
    //geocoder needs {'latLng': xyz} and results and status since your working
    //with results and status in the function
      geocoder.geocode({'latLng': latlng}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          infowindow.setContent('<div>' + marker.title + '</div>' + '<div>' +
          results[0].formatted_address + '</div>' + '<div>' + "Temp: " + weather.temp +
          "&deg;F" + '</div>' + '<div>' + "Humidity: " + weather.humidity + "%" + '</div>');
        } else {
          infowindow.setContent('<div>' + marker.title + '</div>' + '<div>' +
          "Temp: " + weather.temp + "&deg;F" + '</div>' + '<div>' + "Humidity: "
          + weather.humidity + "%" + '</div>' + '<div>' + "No Address Found" + '</div>');
        }
      })
    infowindow.open(map, marker);
    map.fitBounds(bounds);
  }

//this function toggles the bounce, and the setTimout piece limits to approx 4 bounces
//each bounce approx 700 ms
//source: https://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
  function toggleBounce(marker) {
    if (marker.getAnimation() != null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
        marker.setAnimation(null);
      }, 2800);
    }
  }

  //toggles side menu, if side menu hidden it moves map left, if side menu shown
  //moves map right - don't need bootstraps collapse function now
  $("#button1").click(function(){
    if ($("#side-menu").is(":visible")) {
      $("#side-menu").hide();
      $("#map").css({"right": "25%"});
    } else {
      $("#side-menu").show();
      $("#map").css({"right": "0px"});
    }
  });

  //listen for event fired when user selects a prediction from picklist
  //and retrieve more details for that place
  searchBox.addListener('places_changed', function() {
    searchBoxPlaces(this);
  });

  //listen for event fired when user selects prediction and clicks "go"
  document.getElementById('go-places').addEventListener('click', textSearchPlaces);
  //creates a list of location on left sidebar (createsList function defined at bottom)
  createListInit(locations);
//closes initMap
}

//loops thru and hides markers
function hideMarkers(x) {
  for (var i = 0; i < x.length; i++) {
    x[i].setMap(null);
  }
}

function searchBoxPlaces(searchBox) {
  hideMarkers(markers);
  hideMarkers(placeMarkers);
  //getPlaces is a searchBox method
  var places = searchBox.getPlaces();
  createListForClickAndGo(places);
  console.log(places);
  //for each place, get the icon, name and location
  createMarkersForPlaces(places);
  if (places.length == 0) {
    window.alert('We did not find any places matching that search!');
  }
}

//function fires when user selects "go" on the places search, uses query string
function textSearchPlaces() {
  var bounds = map.getBounds();
  hideMarkers(markers);
  hideMarkers(placeMarkers);
  var placesService = new google.maps.places.PlacesService(map);
  placesService.textSearch({
    query: document.getElementById('places-search').value,
    bounds: bounds
  }, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      createMarkersForPlaces(results);
    }
    createListForClickAndGo(results);
  });
}

//creates markers for each place found in either places search
function createMarkersForPlaces(places) {
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < places.length; i++) {
    var place = places[i];
    var icon = {
      url: place.icon,
      size: new google.maps.Size(35, 35),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(15, 34),
      scaledSize: new google.maps.Size(25, 25)
    };
    //create marker for each place
    var marker = new google.maps.Marker({
      map: map,
      icon: icon,
      title: place.name,
      position: place.geometry.location,
      id: place.id
    });
    placeMarkers.push(marker);
    if (place.geometry.viewport) {
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }
  }
  map.fitBounds(bounds);
}

function createListInit(x) {
  var placesLength = x.length;
  var listOfPlaces = document.getElementById('placesList');
  for (var i = 0; i < placesLength; i++) {
    var newLi = document.createElement('li');
    newLi.innerHTML = x[i].title;
    newLi.title = x[i].title;
    //newLi.setAttribute("a", x[i].title);
    listOfPlaces.appendChild(newLi);
    console.log(newLi.title);
  }
}

function createListForClickAndGo(x) {
  clearList();
  var placesLength = x.length;
  var listOfPlaces = document.getElementById('placesList');
  for (var i = 0; i < placesLength; i++) {
    var newDiv = document.createElement('div');
    newDiv.innerHTML = x[i].name;
    listOfPlaces.appendChild(newDiv);
  }
}

function filterFunction() {
  var input, filter, placeList, li, a, i, html;
  input = document.getElementById('myInput');
  filter = input.value.toUpperCase();
  placeList = document.getElementById("placesList");
  li = placeList.getElementsByTagName('li');

  for (i = 0; i < li.length; i++) {
    a = li[i].getAttribute("title")[0];
    if (a.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function clearList() {
  $('#placesList').empty();
}

//everything below is for openweather.org API
//used Captain Coder https://www.youtube.com/channel/UC06YNfpGTT93KxJBDF3wStg tutorials

var APPID = "b230ec4526e46a4e2bebac49a0fcf0a7";
var temp;
var humidity;

function updateByZip(zip) {
    var url = "http://api.openweathermap.org/data/2.5/weather?" +
      "zip=75001" +
      "&APPID=" + APPID;
      sendRequest(url);
}

function sendRequest(url) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var data = JSON.parse(xmlhttp.responseText);
      //var weather = {};
      weather.temp = K2F (data.main.temp);
      weather.humidity = data.main.humidity;
      //update(weather);
    }
  };
  xmlhttp.open("GET", url, true);
  //send constructs URL, sends it off to open weathermap.org, when openweather
  //responds it runs onreadystatechange function above to construct weather object
  //pass it to update function which updates UI
  xmlhttp.send();
}

function K2F (k) {
  return Math.round(((9/5)*(k-273)) + 32);
}

/*function update(weather) {
  temp = weather.temp;
  humidity = weather.humidity;
}*/

window.onload = function() {
  var weather = {};
  weather.temp = 0;
  weather.humidity = 0;

  updateByZip(75001);
}

//ko.applybindings(new ViewModel());
