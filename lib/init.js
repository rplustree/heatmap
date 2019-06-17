var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    osm = L.tileLayer(osmUrl, { maxZoom: 18, attribution: osmAttrib,opacity:0.5,nowrap:true });
    
var mapboxurl = "https://{s}.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?&access_token=pk.eyJ1IjoiZmFuZmFuMDEiLCJhIjoiY2l3enBpcXZpMDBrMjJ1cWh3ZXM2Nm1qdyJ9.zJaMthXYv3M3h1UF1c31eQ",
    mapbox = L.tileLayer(mapboxurl, { maxZoom: 18, opacity: 0.8, nowrap:true });

/*添加底图*/
var map =L.map("map",{
    maxZoom: 17,
    minZoom: 2,
    maxBounds: [
        //south west
        [-85, -180],
        //north east
        [85, 180]
        ],
    noWrap: true,
    layers: mapbox
}).setView([41.873,-87.628],11);

var baseMaps = {
    "<span style='color: black'>Mapbox</span>": mapbox,
    "Osm": osm
};
L.control.layers(baseMaps).addTo(map);

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
    position: 'topleft',
    draw: {
        polyline: false,
        polygon: true,
        circle: false,
        marker: false,
        circlemarker:false,
    },
    edit: {
        featureGroup: drawnItems,
        remove: true
    }
});
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function (e) {
    var type = e.layerType,
        layer = e.layer;

    if (type === 'marker') {
        layer.bindPopup('A popup!');
    }
    drawnItems.addLayer(layer);

    var min = e.layer.getBounds().getSouthWest();
    var max = e.layer.getBounds().getNorthEast();
    range = min.lng.toFixed(2)+","+ min.lat.toFixed(2)+","+max.lng.toFixed(2)+","+max.lat.toFixed(2);
   
    spatialQuery();
});

map.on(L.Draw.Event.EDITED, function (e) {
    var layers = e.layers;
    var countOfEditedLayers = 0;
    layers.eachLayer(function (layer) {
        countOfEditedLayers++;
    });
    //console.log("Edited " + countOfEditedLayers + "layers");
});

var sw = map.getBounds().getSouthWest();
var ne = map.getBounds().getNorthEast(); 
bounds = sw.lng.toFixed(4)+","+ sw.lat.toFixed(4)+","+ne.lng.toFixed(4)+","+ne.lat.toFixed(4);

map.on('moveend zoomend', function() {	
    timeSeriesQuery();
});

function nextColor(){
    var c =colors.shift();
    colors.push(c);
    return c;
};

function drawCreated(e){
    //add the layer
    map.drawnItems.addLayer(e.layer);
	//set next color
    if (e.layerType == 'rectangle'){
		map.editControl.setDrawingOptions({
			rectangle:{shapeOptions:{color: this.nextColor(),weight: 2,
				     opacity:.9}}
		});
    }

    if (e.layerType == 'polygon'){
		map.editControl.setDrawingOptions({
	    polygon:{shapeOptions:{color: this.nextColor(),weight: 2,
				   opacity:.9}}
		});
    }
};

function drawstop(e){	
	console.log(bounds);
	//getHeatMap(this.bounds,time_from,time_to);
};

// var ST = document.getElementById("start_time");
// var ET = document.getElementById("end_time");
var time_from = "2017-06-11 00:00:00";
var time_to = "2019-05-17 00:00:00";
var finaltime = time_to;
var datasetname = "Crimes";
var rgb = 2;
$("#dataset").change(function(){
    var val = $(this).val();
    datasetname = val;
    timeQuery();
});

$("input[type='radio']").change(function(){
    var checkValue = $(this).val();
    rgb = checkValue;
    timeQuery();
});

var info = document.getElementById("info");

function timeQuery(){
    var lat;
    var lon;
    var level = 11;
    if(datasetname == "Crimes"){lat = 41.873,lon = -87.629,level = 11,time_from = "2017-06-11 00:00:00",time_to = "2019-05-17 00:00:00"};
    if(datasetname == "Brightkite"){lat = 50.971,lon = 10.290,level = 5,time_from = "2008-04-01 00:00:00",time_to = "2010-10-01 00:00:00"};
    if(datasetname == "Gowalla"){lat = 38.981,lon = -97.414,level = 5,time_from = "2009-02-01 00:00:00",time_to = "2010-10-01 00:00:00"};
    if(datasetname == "HeatMap_TS"){lat = 40.740,lon = -73.962,level = 12,time_from = "2015-01-01 00:00:00",time_to = "2015-02-01 00:00:00"};
    if(datasetname == "enterprise"){lat = 34.314,lon = 108.708,level = 5,time_from = "1985-01-01 00:00:00",time_to = "2010-12-01 00:00:00"};
    map.setView([lat, lon],level);
    // time_from = ST.value;
    // time_to = ET.value;

    var heat = new L.stHeatmap().addTo(map);
    heat.setZIndex(2);

    timeSeriesQuery();
    

}
var Inputflag = false;
function OnInput(event){
    Inputflag = true;
}
var flagTime = false;
$(".tablinksTime").click(function(){
    if(flagTime == false){
        $("#Time").hide();
        flagTime = true;
    } else {
        $("#Time").show();
        flagTime = false;
    }
})

var flagBar = false;
$(".tablinksBar").click(function(){
    if(flagBar == false){
        $("#Bar").hide();
        flagBar = true;
    } else {
        $("#Bar").show();
        flagBar = false;
    }
})

//var url = "http://47.112.97.110:3001";
var url = "http://192.168.0.119:3000";
var mode;
function timeSeriesQuery() {
    var sw = map.getBounds().getSouthWest();
    var ne = map.getBounds().getNorthEast(); 
    bounds = sw.lng.toFixed(4)+","+ sw.lat.toFixed(4)+","+ne.lng.toFixed(4)+","+ne.lat.toFixed(4);
    var dateFrom = time_from.split(' ');
    var YMDFrom = dateFrom[0].split('-');
    var HFrom = dateFrom[1].split(':');
    var dateTo = time_to.split(' ');
    var YMDTo = dateTo[0].split('-');
    var HTo = dateTo[1].split(':');
    var yearDuration = parseInt(YMDTo[0] - YMDFrom[0]);
    var monthDuration = parseInt(YMDTo[1] - YMDFrom[1]);
    var dateDuration = parseInt(YMDTo[2] - YMDFrom[2]);
    var hourDuration = parseInt(HTo[0] - HFrom[0]);
    var duration = parseInt(yearDuration * 365 + monthDuration * 30 + dateDuration); 
    if(duration < 30){
            mode = 3;
    } else if(duration >= 30 && duration < 240){
        mode = 2;
    } else if(duration >= 240 && duration < 730){
        mode = 1;
    } else{
        mode = 0;
    }

    var startTime = new Date().getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
    $.get(url + '/tsQuery', {
        level: map.getZoom(),
        bounds: bounds,
        time_from: time_from,
        time_to: time_to,
        datasetname: datasetname,
        mode: mode
    }, function (data, textStatus) {
        
        var jsonObj =  JSON.parse(data);
        var tsQuery = []; 
        for(let day in jsonObj){
            tsQuery.push([day, jsonObj[day]]);
        }
        tsQuery.sort(function(a, b){
            return d3.ascending(a[0], b[0]);
        });
        //console.log(tsQuery);
        d3.selectAll("svg").remove();
        loadLineChart(tsQuery, "timeSeries");
    });
    var endTime = new Date().getTime();
    var timeSeriesT = endTime - startTime;
    //console.log("画时间轴: " + timeSeriesT + " ms"); 
}

timeSeriesQuery();
