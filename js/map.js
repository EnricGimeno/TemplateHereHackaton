var app_id = 'taQaDxUhv6uR26t2Z4s7';
var app_code = 'yl5CDqRbwFRI-WPW1sLNDA';

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
// Instantiate the default behavior, providing the mapEvents object: (Zoom and move map)
var behavior = new H.mapevents.Behavior(mapEvents);

//////////////////// DOWNLOADED FUNCTIONS
function calculateIsolineMarker (marker){
  var routingParams = createRoutingParams(marker.lat, marker.lng);
  var onResult = function(result) { //para calculateIsolineMarker
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
  var router = platform.getRoutingService();
  var isoline = router.calculateIsoline(
    routingParams,
    onResult,
    function(error) {
    alert(error.message);
    }
  );
}

var dataFromText;

function readJSONFile(file) {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function ()
  {
    if(rawFile.readyState === 4)
    {
      if(rawFile.status === 200 || rawFile.status == 0)
      {
        var JSONdata = rawFile.responseText;
        dataFromText = JSON.parse(JSONdata);
      }
    }
  }
  rawFile.send(null);
}

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


//////////////////// CUSTOM FUNCTIONS
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

function createRoutingParams(latitud, longitud){ //set params for calculateIsolineMarker
  var start = 'geo!'+ latitud + ',' + longitud
  return routingParams = {
    'mode': 'fastest;pedestrian;',
    'start': start,
    'range': '900',
    'rangetype': 'time'
  };
}

function createHelperMarkers(datosHelper){
  for (var i = 0; i < datosHelper.length; i++) {
    console.log(datosHelper[i].NOMBRE);
    var objeto = datosHelper[i];
    addMarker(datosHelper[i].LON, datosHelper[i].LAT, 'helper', datosHelper[i].NOMBRE);
  }
}

function createHelpedMarkers(datosHelped){
  for (var i = 0; i < datosHelped.length; i++) {
    console.log(datosHelped[i].NOMBRE);
    var objeto = datosHelped[i];
    addMarker(datosHelped[i].LON, datosHelped[i].LAT, 'helped', datosHelped[i].NOMBRE);
  }
}

// Add a marker
function addMarker(latitud, longitud, type, data){
  var myMarker = new H.map.Marker({ lat: latitud, lng: longitud });
  if (type == 'helped') {
    myMarker.setIcon(iconHelped);
    myMarker.setData(data);
    groupHelpedHidden.addObject(myMarker);
  } else if (type == 'helper'){
    myMarker.setIcon(iconHelper);
    myMarker.setData(data);
    groupHelper.addObject(myMarker);
  } else {
    groupError.addObject(myMarker);
    myMarker.setData(data);
  }
}

function calculateIsolineForEach (marker, index, group){
  //calculateIsolineMarker(marker);
  var coords = marker.getPosition();
  var urlCall = 'https://isoline.route.cit.api.here.com/routing/7.2/calculateisoline.json?app_id='.concat(app_id,'&app_code=',app_code,'&mode=fastest;pedestrian&start=geo!',coords.lat,',',coords.lng,'&range=900&rangetype=time');
  readJSONFile(urlCall);
  var isoline = dataFromText.response.isoline[0].component[0].shape;
  var linestring = new H.geo.LineString();
  for (i=0; i<isoline.length; i++) {
    isoline[i] = isoline[i].split(',');
    linestring.pushLatLngAlt(isoline[i][0],isoline[i][1]);
  }
  console.log(linestring);
  var isolinePolygon = new H.map.Polygon(linestring);
  isolinePolygon.setData(isoline);
  groupIsolines.addObject(isolinePolygon);
}

var actualIsoline;
function showHelpedInTheAreaForEach(isoline, index, group){
  actualIsoline = isoline;
  groupHelpedHidden.forEach(showHelpedInTheArea, false, isoline);
}

function showHelpedInTheArea(marker, index, group){
  console.log(marker);
  console.log(index);
  console.log(group);
  var point = marker.getPosition();
  point = [point.lat,point.lng];
  vs = actualIsoline.getData();
  if (inside(point,vs)){
    groupHelped.addObject(marker);
  }
}

//////////////////// CALLS
// Create a marker icon from an image URL:
var iconHelped = new H.map.Icon('images/helped.png');
var iconHelper = new H.map.Icon('images/helper.png');

// Create groups to get the markers categorised
var groupHelped = new H.map.Group(); map.addObject(groupHelped); addInfoBubbleListener(groupHelped);
var groupHelper = new H.map.Group(); map.addObject(groupHelper); addInfoBubbleListener(groupHelper);
var groupError = new H.map.Group(); map.addObject(groupError); addInfoBubbleListener(groupError);
var groupIsolines = new H.map.Group(); map.addObject(groupIsolines); addInfoBubbleListener(groupIsolines);
var groupHelpedHidden = new H.map.Group(); map.addObject(groupHelpedHidden); addInfoBubbleListener(groupHelpedHidden);

groupHelpedHidden.setVisibility(false);

readJSONFile("https://raw.githubusercontent.com/vicmonf1/TemplateHereHackaton/pr/1/json/hihelpers.json");
createHelpedMarkers(dataFromText);

readJSONFile("https://raw.githubusercontent.com/vicmonf1/TemplateHereHackaton/pr/1/json/helper.json");
createHelperMarkers(dataFromText);

groupHelper.forEach(calculateIsolineForEach);

groupIsolines.forEach(showHelpedInTheAreaForEach);


