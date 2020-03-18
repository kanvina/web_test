function show_basemap(n) {
  if (n == "2D") {
    require([
      "esri/Map",
      "esri/views/MapView",
      "esri/widgets/BasemapToggle",
      "esri/widgets/BasemapGallery"
    ], 
    function (Map, MapView,BasemapToggle, BasemapGallery) {
      var map = new Map({
        basemap: "topo-vector"//topo-vector,dark-gray-vector,dark-gray-vector，satellite，streets-relief-vector，streets-navigation-vector
      });

      var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [107.4, 36], // longitude, latitude
        zoom: 3
      });
      // var basemapToggle = new BasemapToggle({
      //   view: view,
      //   nextBasemap: "satellite"
      // });
      // view.ui.add(basemapToggle, "bottom-right");
      var basemapGallery = new BasemapGallery({
        view: view,
        source: {
          portal: {
            url: "https://www.arcgis.com",
            useVectorBasemaps: false  // true: Load vector tile basemaps ;false: Load raster tile basemaps 
          }
        }
      });
      view.ui.add(basemapGallery, "bottom-right");

    });
  };

  if (n == "3D") {
    require([
      "esri/Map",
      "esri/views/SceneView"
    ], function (Map, SceneView) {

      var map = new Map({
        basemap: "topo-vector",//topo-vector,dark-gray-vector
        ground: "world-elevation" // show elevation
      });

      var view = new SceneView({
        container: "viewDiv",
        map: map,
        camera: {
          position: { // observation point
            x: 107.4,
            y: 36,
            z: 25000 // altitude in meters
          },
          tilt: 0 // perspective in degrees
        }
      });
    });
  }

};

