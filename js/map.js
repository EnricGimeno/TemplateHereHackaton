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
var groupHelped = new H.map.Group(); map.addObject(groupHelped); addInfoBubbleListener(groupHelped);
var groupHelper = new H.map.Group(); map.addObject(groupHelper); addInfoBubbleListener(groupHelper);
var groupError = new H.map.Group(); map.addObject(groupError); addInfoBubbleListener(groupError);


function addInfoBubbleListener(group) {
  group.addEventListener('tap', function (evt) {
    // event target is the marker itself, group is a parent event target
    // for all objects that it contains
    var bubble =  new H.ui.InfoBubble(evt.target.getPosition(), {
      // read custom data
      content: evt.target.getData()
    });
    // show info bubble
    ui.addBubble(bubble);
  }, false);
}


addMarker(39.4670, -0.4037, 'helped');
addMarker(39.4600, -0.4007, 'helper');
addMarker(39.4690, -0.4097, 'whatever');


// Isoline route
var routingParams = createRoutingParams(39.4670, -0.4037);

function createRoutingParams(latitud, longitud){
  var start = 'geo!'+ latitud + ',' + longitud
  return routingParams = {
    'mode': 'fastest;pedestrian;',
    'start': start,
    'range': '900',
    'rangetype': 'time'
  };

}

// Define a callback function to process the isoline response.
var onResult = function(result) {
  var center = new H.geo.Point(
      result.response.center.latitude,
      result.response.center.longitude),
    isolineCoords = result.response.isoline[0].component[0].shape,
    linestring = new H.geo.LineString(),
    isolinePolygon,
    isolineCenter;

  // Add the returned isoline coordinates to a linestring:
  isolineCoords.forEach(function(coords) {
  linestring.pushLatLngAlt.apply(linestring, coords.split(','));
  });

  // Create a polygon representing the isoline:
  isolinePolygon = new H.map.Polygon(linestring);

  // Add the polygon and marker to the map:
  map.addObjects([isolineCenter, isolinePolygon]);

  // Center and zoom the map so that the whole isoline polygon is
  // in the viewport:
  //map.setViewBounds(isolinePolygon.getBounds());
};

// Get an instance of the routing service:
var router = platform.getRoutingService();

// Call the Routing API to calculate an isoline:
var isoline = router.calculateIsoline(
  routingParams,
  onResult,
  function(error) {
  alert(error.message);
  }
);

function inside(point, vs) {
  // ray-casting algorithm based on
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

  var x = point[0], y = point[1];

  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i][0], yi = vs[i][1];
      var xj = vs[j][0], yj = vs[j][1];

      var intersect = ((yi > y) != (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
  }
  return inside;
}


function readTextFile(file) {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function ()
  {
    if(rawFile.readyState === 4)
    {
      if(rawFile.status === 200 || rawFile.status == 0)
      {
        var allText = rawFile.responseText;
        console.log(allText);
      }
    }
  }
  rawFile.send(null);
}



console.log(readTextFile("file:///D:/user/Documents/GitHub/TemplateHereHackatonV/json/hihelpers.json"));

// Add a marker
function addMarker(latitud, longitud, type){
  var myMarker = new H.map.Marker({ lat: latitud, lng: longitud });
  if (type == 'helped') {
    myMarker.setIcon(iconHelped);
    myMarker.setData('<div>Hello</div>');
    groupHelped.addObject(myMarker);
  } else if (type == 'helper'){
    myMarker.setIcon(iconHelper);
    myMarker.setData('<div>Hello</div>');
    groupHelper.addObject(myMarker);
  } else {
    groupError.addObject(myMarker);
    myMarker.setData('<div>Hello</div>');
  }
}
