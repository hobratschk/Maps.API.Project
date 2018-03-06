//viewmodel - defines data and behavior
//function ViewModel() {
var map;

// Create a new blank array for all the listing markers.
var markers = [];

// Create placemarkers array to use in multiple functions to have control
// over the number of places that show.
var placeMarkers = [];
//}
//this initMap is a massive function
function initMap() {
  //create new map instance
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 32.7767, lng: -96.7970},
    zoom: 13
  });
  // These are the locations that will be shown to the user.
  var locations = [
    {title: 'Cidercade', location: {lat: 32.8056605, lng: -96.84654390000003}},
    {title: 'Koryo Kalbi Korean BBQ', location: {lat: 32.895487, lng: -96.89316259999998}},
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
  }

  //this function populates infowindow when marker is clicked. only allow one
  //infowindow and populate based on marker's position
  function populateInfoWindow(marker, infowindow) {
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      //make sure marker property is cleared if infowindow is closed
      infowindow.addListener('closeclick', function(){
        infowindow.setContent(null);
      });
    }
    map.fitBounds(bounds);
  }

//thg\is function toggles the bounce, and the setTimout piece limits to approx 5 bounces
//each bounce approx 700 ms
//source: https://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
  function toggleBounce(marker) {
    if (marker.getAnimation() != null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
        marker.setAnimation(null);
      }, 3500);
    }
  }
}

//ko.applybindings(new ViewModel());
