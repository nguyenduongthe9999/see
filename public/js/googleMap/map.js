require([
          "esri/config",
          "esri/Map",
          "esri/views/MapView",
          "esri/widgets/Locate",

          "esri/widgets/Track",
	      "esri/Graphic",
    	  "esri/layers/GraphicsLayer"

        ], function(
            esriConfig,
            Map,
            MapView,
            Locate,

            Track,
            Graphic,
			 GraphicsLayer

        ) {

        esriConfig.apiKey = "AAPK1afc5c7b61074c27a00c07f1e0309606aZu0N8gXjosgsivD91-BKqRYFfV8B3Iy0-2vmLipTMaFJW8DrOQNW3mhCIbzncn5";

        const map = new Map({
		basemap: "arcgis-topographic" //Basemap layer service
	  	});

         const view = new MapView({
		map: map,
		center: [105.804817,21.028511], //Longitude, latitude
		zoom: 8,
		container: "map"
	 });

        const track = new Track({
          view: view,
          graphic: new Graphic({
            symbol: {
              type: "simple-marker",
              size: "12px",
              color: "green",
              outline: {
                color: "#efefef",
                width: "1.5px"
              }
            }
          }),
          useHeadingEnabled: false
        });
        view.ui.add(track, "top-left");
	
		const graphicsLayer = new GraphicsLayer();
 map.add(graphicsLayer);

 const point = { //Create a point
    type: "point",
    longitude: 105.811417,
    latitude: 20.993776
 };
 const simpleMarkerSymbol = {
    type: "simple-marker",
    color: [226, 119, 40],  // Orange
    outline: {
        color: [255, 255, 255], // White
        width: 1
    }
 };

 const pointGraphic = new Graphic({
    geometry: point,
    symbol: simpleMarkerSymbol
 });
 graphicsLayer.add(pointGraphic);
	const point1 = { //Create a point
    type: "point",
    longitude: 105.756366,
    latitude: 20.955835
 };
 const simpleMarkerSymbol1 = {
    type: "simple-marker",
    color: [226, 119, 40],  // Orange
    outline: {
        color: [255, 255, 255], // White
        width: 1
    }
 };

 const pointGraphic1 = new Graphic({
    geometry: point1,
    symbol: simpleMarkerSymbol1
 });
 graphicsLayer.add(pointGraphic1);


      });


