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
  zoomSnap: 0.25,
  layers: [streets]
});

L.control.layers(baseLayers).addTo(map);

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
        var rain_symbol=polygon_info.symbol

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



// // 雨水等级
// var rainLevel = {
//   0: '小雨',
//   2.5: '小雨',
//   5: '小雨',
//   10: '中雨',
//   25: '大雨',
//   50: '暴雨',
//   100: '大暴雨',
//   250: '特大暴雨'
// };
// var imageBounds = [];
// var infowin = null;
// // 新增雨水图层组
// // var RainLayer = L.featureGroup([]).addTo(map);
// var RainImgLayer = L.featureGroup([]).addTo(map);
// // 云图
// var CloudLayer = L.featureGroup([]).addTo(map);

// // 隐藏雨水图层
// function hideRainLayer() {
//   map.removeLayer(RainImgLayer);
// }
// // 隐藏云图图层
// function hideClouds() {
//   map.removeLayer(CloudLayer);
// }

// /**
//  * 获取雨水数据并渲染
//  * @param {*} a
//  */
// function displayRainPublic(a) {
//   try {
//     $.ajax({
//       type: 'GET',
//       url: 'http://typhoon.zjwater.gov.cn/Api/LeastRain/' + a,
//       dataType: 'jsonp',
//       jsonp: 'callback',
//       success: function(a) {
//         var b, c, d, e, f, g, h, i, j, k;
//         for (
//           RainImgLayer.clearLayers(), b = JSON.parse(a.contours), c = 0;
//           c < b.length;
//           c++
//         ) {
//           for (d = [], e = b[c], f = 0; f < e.latAndLong.length; f++) {
//             d.push([e.latAndLong[f][0], e.latAndLong[f][1]]);
//           }
//           g = b[c].color.substring(0, b[c].color.lastIndexOf(','));
//           h = L.polygon(d, {
//             fillOpacity: 0.5,
//             color: 'rgb(' + g + ')',
//             weight: 0
//           }).bindLabel(rainLevel[e.symbol], {
//             pane: 'popupPane'
//           });
//           h.addTo(RainImgLayer);
//         }
//         RainImgLayer.addTo(map);
//         toastr.options = {
//           closeButton: true,
//           progressBar: true,
//           showMethod: 'slideDown',
//           positionClass: 'toast-top-right',
//           timeOut: 4e3
//         };
//         i = moment(new Date(a.time)).format('M月DD日HH时');
//         toastr.info(
//           '',
//           '&nbsp;&nbsp;数据来源：中央气象台<br/><p/>&nbsp;&nbsp;发布时间：' + i
//         );
//       }
//     });
//   } catch (b) {}
// }
// /**
//  * 获取云图数据并渲染
//  * @param {*} a
//  */
// function displayCloud(a) {
//   $.ajax({
//     type: 'GET',
//     url: 'http://typhoon.zjwater.gov.cn/Api/LeastCloud',
//     dataType: 'jsonp',
//     jsonp: 'callback',
//     success: function(b) {
//       var c, d, f, g, h, i, j;
//       if (b.length === 0) {
//         toastr.options = {
//           closeButton: true,
//           progressBar: true,
//           showMethod: 'slideDown',
//           positionClass: 'toast-bottom-right',
//           timeOut: 4e3
//         };
//         toastr.error('', '获取云图失败！');
//         return;
//       }
//       c = b[0].cloudFullPath;
//       d = '';
//       if ('1' == a) d = b[0].cloud1h;
//       if ('3' == a) d = b[0].cloud3h;
//       if ('6' == a) d = b[0].cloud6h;
//       if ('30' == a) d = b[0].cloudname;
//       b[0].cloudtime;
//       f = b[0].diffTime;
//       g = b[0].minLng;
//       h = b[0].maxLng;
//       i = b[0].minLat;
//       j = b[0].maxLat;
//       if (parseFloat(f) < 3) {
//         map.removeLayer(CloudLayer);
//         imageBounds = [[i, g], [j, h]];
//         CloudLayer = L.imageOverlay(c + '/' + d, imageBounds, {
//           maxZoom: 11
//         });
//         CloudLayer.addTo(map);
//         map._panes.overlayPane.children[0].style.zIndex = '2';
//         map._panes.overlayPane.children[1].style.zIndex = '-1';
//         toastr.options = {
//           closeButton: true,
//           progressBar: true,
//           showMethod: 'slideDown',
//           positionClass: 'toast-bottom-right',
//           timeOut: 4e3
//         };
//         var d2 = `${d.substring(0, 4)}/${d.substring(4, 6)}/${d.substring(
//           6,
//           8
//         )} ${d.substring(8, 10)}:${d.substring(10, 12)}`;
//         var timeStr = moment(new Date(d2)).format('M月DD日HH时');
//         toastr.info('', '数据发布时间：' + timeStr);
//       } else {
//         toastr.options = {
//           closeButton: true,
//           progressBar: true,
//           showMethod: 'slideDown',
//           positionClass: 'toast-bottom-right',
//           timeOut: 4e3
//         };
//         toastr.warning('', '无最新云图！');
//       }
//     }
//   }
//   );
// }

// function stringTodate(a, b) {
//   try {
//     var c = new Date(a.replace(/-/g, '/')).Format(b);
//     return c;
//   } catch (d) {
//     return '';
//   }
// }

// displayRainPublic(72);

// $('#hide-cloud').hide();
// $('#show-cloud').click(function() {
//   displayCloud(1);
//   $('#hide-cloud').show();
//   $('#show-cloud').hide();
// });
// $('#hide-cloud').click(function() {
//   hideClouds();
//   $('#hide-cloud').hide();
//   $('#show-cloud').show();
// });

// $('.rain-btn').click(function(e) {
//   var target = e.target;
//   var hour = $(target).attr('data-hour');
//   displayRainPublic(hour);
// });