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
    center: [39.9, 116.4],
    zoom: 6,
    layers: [streets]
});
L.control.layers(baseLayers).addTo(map);




// function show_loction(){

//     $.getJSON("../data/beijing_json.json", function (data) {

//         var points_list=data.features[0].geometry.coordinates[0][0]

//         var location_new_list=[]

//         for (var i =0;i<points_list.length;i++){
//             location_xy=points_list[i]
//             x=location_xy[0]
//             y=location_xy[1]
//             var location_new=[]
//             location_new.push(y)
//             location_new.push(x)
//             location_new_list.push(location_new)
//         };

//       //根据提供的三点坐标绘制折线
//      var polyline = L.polyline(location_new_list, { color: 'red' });
//      polyline.addTo(map);
//      var center_zoom=polyline.getBounds()
//      map.fitBounds(center_zoom);//缩放至屏幕
//     })

// }

function show_loction() {
    $.getJSON("../data/suqian_geojson.json", function (data) {

        var myStyle={
            "color": "red",
            "weight": 1,
            "opacity": 0.8
        };
        var geo_border = L.geoJSON(data, {style:myStyle});
        

        // geo_border.eachLayer(function (layer) {
        //     layer.bindPopup(layer.features.properties.NAMEC);
        // });
        
       
        geo_border.addTo(map);
        map.fitBounds(geo_border.getBounds());

    })

}