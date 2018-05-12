// Initialize the platform object:
var platform = new H.service.Platform({
  'app_id': 'taQaDxUhv6uR26t2Z4s7',
  'app_code': 'yl5CDqRbwFRI-WPW1sLNDA'
});

// Obtain the default map types from the platform object
var maptypes = platform.createDefaultLayers();

// Instantiate (and display) a map object:
var map = new H.Map(
document.getElementById('mapContainer'),
maptypes.normal.map,
{
  zoom: 13,
  center: { lng: -0.38, lat: 39.47 }
});


// Create the default UI:
var ui = H.ui.UI.createDefault(map, maptypes, 'es-ES');

 // Enable the event system on the map instance:
var mapEvents = new H.mapevents.MapEvents(map);

// Add event listener:
map.addEventListener('tap', function(evt) {
  // Log 'tap' and 'mouse' events:
  console.log(evt.type, evt.currentPointer.type);
});

// Instantiate the default behavior, providing the mapEvents object: (Zoom and move map)
var behavior = new H.mapevents.Behavior(mapEvents);

 // Create a marker icon from an image URL:
var iconHelped = new H.map.Icon('images/helped.png');
var iconHelper = new H.map.Icon('images/helper.png');

// Create groups to get the markers categorised
var groupHelped = new H.map.Group(); map.addObject(groupHelped);
var groupHelper = new H.map.Group(); map.addObject(groupHelper);

addMarker(39.4670, -0.4037, 'helped');
addMarker(39.4600, -0.4007, 'helper');

// Add a marker
function addMarker(latitud, longitud, type){
  var myMarker = new H.map.Marker({ lat: latitud, lng: longitud });
  if (type == 'helped') {
    myMarker.setIcon(iconHelped);
    groupHelped.addObject(myMarker);
  } else if (type == 'helper'){
    myMarker.setIcon(iconHelper);
    groupHelper.addObject(myMarker);
  } else {
    map.addObject(myMarker);
  }
}
