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
        zoom: 10,
        center: { lng: 13.4, lat: 52.51 }
      });