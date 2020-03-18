var streets = L.tileLayer('http://mt1.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile')
var satellite = L.layerGroup([
  L.tileLayer('http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali'),
  L.tileLayer('http://mt1.google.cn/vt/imgtp=png32&lyrs=h@207000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil')
]);
var satellite_nomarker = L.tileLayer('http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali')
var baseLayers = {
  "街道图": streets,
  "影像图": satellite,
  "影像图(无地标)": satellite_nomarker
};
var map = L.map('map', {
  center: [36, 107.4],
  zoom: 4,
  layers: [streets]
});
L.control.layers(baseLayers).addTo(map);

var layerGroup = new L.LayerGroup();

// 空云图，仅作为全局变量
var CloudLayer = L.featureGroup([]).addTo(map);

var RainImgLayer = L.featureGroup([]).addTo(map);

var rainLevel = {
  0: '小雨',
  2.5: '小雨',
  5: '小雨',
  10: '中雨',
  25: '大雨',
  50: '暴雨',
  100: '大暴雨',
  250: '特大暴雨'
};


map.on('mousemove', function (e) {
  var x_location = e.latlng.lng.toFixed(2);
  var y_location = e.latlng.lat.toFixed(2);
  $('#location_show').val('lng:'+x_location+' lat:'+y_location)


});

function show_loction() {
  $.getJSON("../data/suqian_geojson.json", function (data) {

    var myStyle = {
      "color": "red",
      "weight": 1,
      "opacity": 0.8
    };
    var geo_border = L.geoJSON(data, {
      style: myStyle
    });
    geo_border.bindPopup(function (layer) {
      return 'name:' + layer.feature.properties.NAMEC + ' x:' + layer.feature.properties.x + ' y:' + layer.feature.properties.y
    });
    layerGroup.addLayer(geo_border);

    layerGroup.addTo(map);

    // map.fitBounds(geo_border.getBounds());

  })

}

function delete_loction() {
  map.removeLayer(layerGroup)
}

function show_cloud() {
  $.get("http://typhoon.zjwater.gov.cn/Api/LeastCloud",
    function (data) {

      var cloudfullpath = data[0].cloudFullPath
      var cloudname = data[0].cloudname
      var minLat = data[0].minLat
      var minLng = data[0].minLng
      var maxLat = data[0].maxLat
      var maxLng = data[0].maxLng
      var imageBounds = [
        [minLat, minLng],
        [maxLat, maxLng]
      ];
      map.removeLayer(CloudLayer);
      CloudLayer = L.imageOverlay(cloudfullpath + '/' + cloudname, imageBounds);
      CloudLayer.addTo(map);
    },
    "jsonp"
  );
}

function hide_cloud() {
  map.removeLayer(CloudLayer);
}

function show_rain(time_rain) {
  RainImgLayer.clearLayers();
  $.get("http://typhoon.zjwater.gov.cn/Api/LeastRain/" + time_rain,
    function (data) {
      var data_array = JSON.parse(data.contours);
      for (var i = 0; i < data_array.length; i++) {
        polygon_info = data_array[i]
        var polygon_color = polygon_info.color
        var polygon_points_array = polygon_info.latAndLong
        var rain_symbol = polygon_info.symbol

        var polygon_show = L.polygon(polygon_points_array, {
          fillOpacity: 0.5,
          fillColor: 'rgb(' + polygon_color + ')',
          weight: 0
        });
        polygon_show.bindTooltip(rainLevel[rain_symbol]);
        polygon_show.addTo(RainImgLayer);
      }
      RainImgLayer.addTo(map);
    },
    "jsonp"
  );
}

function delete_rain() {
  RainImgLayer.clearLayers()
}