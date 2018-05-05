//viewmodel - defines data and behavior
var map;

// Create a new blank array for all the listing markers.
var markers = [];


//openweathermap.org api gets this var
var weather = {};

var locations = [];

var placesArray = [];

var allLocations = function(data) {
    this.title = data.title;
    this.location = data.location;
    this.marker = data.marker;
};

//this ViewModel implementation is influenced by https://jsfiddle.net/dy70fe16/1/

var ViewModel = function() {

  var self = this;

  //toggles side menu, if side menu hidden it moves map left, if side menu shown
  //moves map right - don't need bootstraps collapse function now
  self.toggleFunction = function () {
    if ($("#side-menu").is(":visible")) {
      $("#side-menu").hide();
      $("#map").css({"right": "25%"});
    } else {
      $("#side-menu").show();
      $("#map").css({"right": "0px"});
    }
  };

  self.listLoc = ko.observableArray();

  placesArray.forEach(function(locItem) {
    self.listLoc.push(new allLocations(locItem))
  });

  self.filter = ko.observable('');

  self.filteredItems = ko.computed(function() {
    var filter = self.filter().toLowerCase();
    if (!filter) {
    	ko.utils.arrayForEach(self.listLoc(), function (item) {
        item.marker.setVisible(true);
      });
      return self.listLoc();
    } else {
      return ko.utils.arrayFilter(self.listLoc(), function(item) {
        // set all markers visible (false)
        var result = (item.title.toLowerCase().search(filter) >= 0)
        item.marker.setVisible(result);
        return result;
      });
    }
  });

  self.setLoc = function(clickedLoc) {
    clickedLoc.marker.setAnimation(google.maps.Animation.BOUNCE);
  };
//closes ViewModel
}

//need function for building array on which list relies
//called in initMap
function buildShowPlacesArray(x) {
  for (var i = 0; i <x.length; i++) {
    placesArray.push({
      title: x[i].title,
      marker: x[i].marker
    });
  }
}

//this function toggles the bounce, and the setTimout piece limits to approx 3 bounces
//each bounce approx 700 ms
//source: https://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
function toggleBounce(marker) {
  if (marker.getAnimation() != null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      marker.setAnimation(null);
    }, 2090);
  }
}

//this initMap is a massive function
function initMap() {
  //create new map instance
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 32.7767, lng: -96.7970},
    zoom: 8,
    mapTypeControl: false
  });

  // These are the locations that will be shown to the user.
  var locations = [
    {title: 'Cidercade', location: {lat: 32.8056605, lng: -96.84654390000003}, type: "Entertainment"},
    {title: 'Gui Sushi Korean Japanese Bistro and Bar', location: {lat: 32.79848640000001, lng: -96.8014632}, type: "Restaurant"},
    {title: 'Meso Maya Comida Y Copas', location: {lat: 32.787801, lng: -96.80496040000003}, type: "Restaurant"},
    {title: 'The Mansion Restaurant', location: {lat: 32.8041117, lng: -96.80734359999997}, type: "Restaurant"},
    {title: 'Cane Rosso', location: {lat: 32.78248110000001, lng: -96.78549859999998}, type: "Restaurant"},
    {title: 'Grapevine Bar', location: {lat: 32.8053771, lng: -96.81501279999998}, type: "Bar"},
    {title: 'Bowen House', location: {lat: 32.7979765, lng: -96.80196539999997}, type: "Bar"},
    {title: 'Louie Louies Piano Bar', location: {lat: 32.7842788, lng: -96.78633539999998}, type: "Bar"},
    {title: 'Dallas Museum of Art', location: {lat: 32.7875631, lng: -96.80102369999997}, type: "Entertainment"},
    {title: 'The Samurai Collection', location: {lat: 32.7915351, lng: -96.8062554}, type: "Entertainment"},
    {title: 'Perot Museum of Nature and Science', location: {lat: 32.7868362, lng: -96.8066938}, type: "Entertainment"},
    {title: 'Reunion Tower', location: {lat: 32.7757814, lng: -96.809279}, type: "Entertainment"},
    {title: 'Crown Plaza Dallas Downtown', location: {lat: 32.7808672, lng: -96.80374710000001}, type: "Hotel"},
    {title: 'Magnolia Hotel', location: {lat: 32.7801662, lng: -96.7990567}, type: "Hotel"},
    {title: 'Aloft Dallas Downtown', location: {lat: 32.7771609, lng: -96.80106560000002}, type: "Hotel"}
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
    locations[i].marker = marker;
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

  //creates a list of location on left sidebar (this and createList defined above)
  buildShowPlacesArray(locations);

  ko.applyBindings(new ViewModel())
//closes initMap
}

//everything below is for openweather.org API
//used Captain Coder https://www.youtube.com/channel/UC06YNfpGTT93KxJBDF3wStg tutorials

function updateByZip(zip) {
    var url = "http://api.openweathermap.org/data/2.5/weather?" +
      "zip=75001" +
      "&APPID=b230ec4526e46a4e2bebac49a0fcf0a7";
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

window.onload = function() {
  var weather = {};
  weather.temp = 0;
  weather.humidity = 0;

  updateByZip(75001);
}
