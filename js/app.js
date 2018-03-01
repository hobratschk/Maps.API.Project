//viewmodel - defines data and behavior
//function ViewModel() {
var map;

// Create a new blank array for all the listing markers.
var markers = [];

// Create placemarkers array to use in multiple functions to have control
// over the number of places that show.
//var placeMarkers = [];
//}
//this initMap is a massive function
function initMap() {
  //create new map instance
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 64.1265, lng: -21.8174},
    zoom: 12
  });
  // These are the locations that will be shown to the user.
  var locations = [
    {title: 'Hallgrims Church', location: {lat: 64.1417149, lng: -21.926637000000028}},
    {title: 'Sjavargrillid - Icelandic Fare', location: {lat: 64.1451621, lng: -21.931513799999948}},
    {title: 'Fish Company - Seafood', location: {lat: 64.148892, lng: -21.941663000000062}},
    {title: 'Gateway to Iceland', location: {lat: 64.0960051, lng: -21.88051740000003}},
    {title: 'Viking Horses', location: {lat: 64.0989867, lng: -21.741337199999975}},
    {title: 'Lebowski Bar', location: {lat: 64.1457063, lng: -21.929545500000017}},
    {title: 'Micro Bar', location: {lat: 64.148594, lng: -21.94075399999997}},
    {title: 'National Museum of Iceland', location: {lat: 64.14164629999999, lng: -21.948570099999984}},
    {title: 'The Settlement Exhibition', location: {lat: 64.147294, lng: -21.942686999999978}},
    {title: 'Open Air Museum', location: {lat: 64.118852, lng: -21.816203}},
    {title: 'Micro Bar', location: {lat: 64.148594, lng: -21.94075399999997}},
    {title: 'Eyja Guldsmeden Hotel', location: {lat: 64.142033, lng: -21.907347}},
    {title: 'Hote Kriunes', location: {lat: 64.088630, lng: -21.794383}},
    {title: 'Room With a View', location: {lat: 64.145732, lng: -21.930194}},
    {title: 'Discover Iceland Private Tours ', location: {lat: 64.127738, lng: -21.81591400000002}}
  ];

  //var largeInfowindow = new google.maps.InfoWindow();

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
    //create onclick event to open an infowindow at each marker
    //marker.addlistener('click', function() {
      //populateInfoWindow(this, largeInfowindow);
    };
}
//}
//ko.applybindings(new ViewModel());
