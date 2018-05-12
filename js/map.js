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
      var iconHelp = new H.map.Icon('images/help.png');
      
      addMarker(39.4670, -0.4037);

      // Add a marker
      function addMarker(latitud, longitud){
        var myMarker = new H.map.Marker({ lat: latitud, lng: longitud }, { icon: iconHelp });
        map.addObject(myMarker);
      }
  

