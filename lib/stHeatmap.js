var timeSpend = [];
var pngT = 0;
var num = 0;

L.stHeatmap = L.GridLayer.extend({
    createTile: function(coords,done){
        var error;
        
        // 创建画布
        var tile = L.DomUtil.create('canvas', 'leaflet-tile');
        // 获取Tile尺寸
        var size = this.getTileSize();
        tile.width = size.x;
        tile.height = size.y;
       // 得到画布上下文，通过coords的x,y,z进行绘制
        var context = tile.getContext('2d');
        
        // context.fillStyle = 'white';
        // context.fillRect(0, 0, size.x, 25);
        // context.fillStyle = 'black';
        // context.fillText('x: ' + coords.x + ', y: ' + coords.y + ', zoom: ' + coords.z, 20, 20);
        // context.beginPath();
        // context.moveTo(0, 0);
        // context.lineTo(size.x-1, 0);
        // context.lineTo(size.x-1, size.y-1);
        // context.lineTo(0, size.y-1);
        // context.closePath();
        // context.stroke();

        var st_tileId = coords.x + '' + coords.y + ' '+ coords.z + ' ' + time_from + ' ' + time_to;
        
        if (heatmapCache(st_tileId) !== undefined) {
            var data = heatmapCache(st_tileId);
			var entry = {
                data:data,
                context: context,
                tileSize: size,
                tile_x: coords.x,
                tile_y: coords.y,
                tile_zoom: coords.z
            };
			color_tile(entry);	
        } else{
            timeSpend = [];
            num = 0;
            context.clearRect(0,0,tile.width,tile.height);
            var startT = new Date().getTime();
            $.get(url + '/tiles', {
                level : coords.z,
                x     : coords.x,
                y     : coords.y,
                datasetname: datasetname,
                time_from: time_from,
                time_to: time_to
            }, function(data, textStatus){
                //console.log(data); 
                var count = Object.keys(data).length;
                if(count > 1000){
                    heatmapCache(st_tileId,data);
                }
                if (count != 0) {			
                    entry = {
                        data:data,
                        context: context,
                        tileSize: size,
                        tile_x: coords.x,
                        tile_y: coords.y,
                        tile_zoom: coords.z
                    };
                    color_tile(entry);
                }
                var endT = new Date().getTime();
                pngT = endT - startT;
                timeSpend.push([++num, pngT]); 
                //console.log(timeSpend);
                //setBarChart(timeSpend,"#barChart");

            }, "json");	
        }

        // timeSpend = [];
        // i = 0;
        // var startT = new Date().getTime();
        // var URL = url + '/tiles';
        // var queryString = "?level=" + coords.z + "&x=" + coords.x  
        // + "&y=" + coords.y  + "&time_from=" + ST.value  + "&time_to=" + ET.value;
        // var xhr = new XMLHttpRequest(); 
        // xhr.open('GET', URL+queryString, true);
        // xhr.responseType = "blob";
        // xhr.setRequestHeader("Content-type","application/x-plt");
        // xhr.onload = function(){
        //     if(this.status == 200){
        //         var blob = this.response;
        //         var imgObj = new Image();
        //         imgObj.src = window.URL.createObjectURL(blob);
        //         imgObj.onload = function(){
        //             context.drawImage(this, 0, 0); 
        //         }
        //     }
        //     var endT = new Date().getTime();
        //     pngT = endT - startT;
        //     timeSpend.push([++i, pngT]); 
        //     console.log(timeSpend);
            
        //     // oLi.innerHTML = timeSpend[timeSpend.length-1];
        //     // oUl.appendChild(oLi);
        //     // barEle.appendChild(oUl);
        //     setBarChart(timeSpend,"#barChart");
            
        // }
        // xhr.send();
        
        // timeSpend = [];
        // num = 0;
        // context.clearRect(0,0,tile.width,tile.height);
        // var startT = new Date().getTime();
        // $.get(url + '/tiles', {
        //     level : coords.z,
        //     x     : coords.x,
        //     y     : coords.y,
        //     time_from: ST.value,
        //     time_to: ET.value
        // }, function(data, textStatus){

        //     var count = Object.keys(data).length;
        //     if ( count != 0) {			
        //         entry = {
        //             data:data,
        //             context: context,
        //             tileSize: size,
        //             tile_x: coords.x,
        //             tile_y: coords.y,
        //             tile_zoom: coords.z
        //         };
                
        //         color_tile(entry);
        //     }
            
        //     var endT = new Date().getTime();
        //     pngT = endT - startT;
        //     timeSpend.push([++num, pngT]); 
        //     // console.log(timeSpend);
        //     setBarChart(timeSpend,"#barChart");

        // }, "json");	
        
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
        var duration = parseInt((yearDuration * 365 + monthDuration * 30 + dateDuration) * 24 + hourDuration);

        var timeRun = {
            flag: 0,
            timer: null,
            endEach: time_from,
            startTimer: function(){
                var start = '';
                var end = time_from;
                if(startButton){
                    end = time_from;
                }
                if(pauseButton){
                    end = timeRun.endEach;
                }
               
                if(Inputflag){
                    duration =  yearDuration * 365 + monthDuration * 30 + dateDuration * 24 + hourDuration;
                    end = time_from;
                }
                
                timeRun.timer = setInterval(function(){
                    start = end;
                    var dateFrom = start.split(' ');
                    var YMDFrom = dateFrom[0].split('-');
                    var HFrom = dateFrom[1].split(':');
                    var tmp = parseInt(HFrom[0]) + inter;

                    if(tmp < 24){
                        tmp = parseInt(HFrom[0]) + inter;
                    } else {
                        tmp = parseInt(HFrom[0]) + inter - 24;
                        YMDFrom[2] = parseInt(YMDFrom[2]) + 1;
                    }
                    if(parseInt(YMDFrom[2]) > 30){
                        YMDFrom[2] = parseInt(YMDFrom[2]) - 30;
                        YMDFrom[1] = parseInt(YMDFrom[1]) + 1;
                    }
                    if(parseInt(YMDFrom[1]) > 12){
                        YMDFrom[1] = parseInt(YMDFrom[1]) - 12;
                        YMDFrom[0] = parseInt(YMDFrom[0]) + 1;
                    }
                    if(parseInt(YMDFrom[2]) < 10){
                        YMDFrom[2] = '0' + parseInt(YMDFrom[2]);
                    }
                    if(parseInt(YMDFrom[1]) < 10){
                        YMDFrom[1] = '0' + parseInt(YMDFrom[1]);
                    }
                    // 计算下一帧的结束时间
                    end = YMDFrom[0] + '-' + YMDFrom[1] + '-' + YMDFrom[2] + ' ' + tmp + ':00' + ':00';

                    time_from = start;
                    time_to = end;
                   
                    timeRun.endEach = end;
                    
                    // 清空当前画布
                    // context.clearRect(0,0,tile.width,tile.height);
                    
                    // $.get(url + '/tiles', {
                    //     level : coords.z,
                    //     x     : coords.x,
                    //     y     : coords.y,
                    //     time_from: ST.value,
                    //     time_to: ET.value,
                    // }, function(data, textStatus){  
                    //     var count = Object.keys(data).length;
                    //     if ( count != 0) {			
                    //         entry = {
                    //             data:data,
                    //             context: context,
                    //             tileSize: size,
                    //             tile_x: coords.x,
                    //             tile_y: coords.y,
                    //             tile_zoom: coords.z
                    //         };
                    //         color_tile(entry);
                    //     }
                       
                    // }, "json");
                    // var URL = url + '/tiles';
                    // var queryString = "?level=" + coords.z + "&x=" + coords.x  
                    // + "&y=" + coords.y  + "&time_from=" + ST.value  + "&time_to=" + ET.value;  
                    // var xhr = new XMLHttpRequest(); 
                    // xhr.open('GET', URL+queryString, true);
                    // xhr.responseType = "blob";
                    // xhr.setRequestHeader("Content-type","application/x-plt");
                    // xhr.onload = function(){
                    //     // 清空当前画布
                    //     context.clearRect(0,0,tile.width,tile.height);
                    //     if(this.status == 200){
                    //         var blob = this.response;
                    //         var imgObj = new Image();
                    //         imgObj.src = window.URL.createObjectURL(blob);
                    //         imgObj.onload = function(){
                    //             context.drawImage(this, 0, 0); 
                    //         }
                    //     }
                    // }
                    // xhr.send();
                    
                    duration = duration - inter;
                    if(duration <=  0){
                        clearInterval(timeRun.timer);  // 清空定时器
                    }

                }, 2000);
               
            },
            pauseTimer: function(){
                clearInterval(timeRun.timer);
                
            },
            suspendTimer: function(){
                if(timeRun.flag == 0){
                    timeRun.flag = 1;
                    pauseButton.innerHTML = "继续";
                    timeRun.pauseTimer();
                } else {
                    timeRun.flag = 0;
                    pauseButton.innerHTML = "暂停";
                    timeRun.startTimer();
                }
            }
        }

        // var startButton = document.getElementById("startBtn");
        // if(startButton){
        //     startButton.addEventListener("click", timeRun.startTimer, false);
        // }

        // var pauseButton = document.getElementById("pauseBtn");
        // if(pauseButton){
        //     pauseButton.addEventListener("click", timeRun.suspendTimer, false);
        // }

        // 异步绘制
        setTimeout(function() {
            done(null, tile);
        }, 200);

        return tile;
    }
});

var BRIGHTNESS = -13;
var PLOTTING_MODE = "rect";
var PLOTTING_COLOR_SCALE = "ryw";
var PLOTTING_TRANSFORM = "density_scaling";

function color_tile(entry) {
    if(entry !== null){
        var area_sum = Object.keys(entry.data).length;
        var fs = pickDrawFuncs();

        for (i in entry.data  ) {
            i = parseInt(i);  
            x = (i) %256 ;
            y = (i)/256 ;
            
            x > 256 ? x=256: x=x;
            x < 0 ? x=0: x=x;
            
            y > 256 ? y=256: y=y;
            y < 0 ? y=0: y=y;
            
            count = entry.data[i];
            
            var datum = {	  
                count: count,
                tile_zoom: entry.tile_zoom,
                area_sum: area_sum,
                x: x,
                y: y
            };
            
            if(count>1){
                entry.context.fillStyle = fs.color(datum.count);
                fs.draw(entry.context, datum);
            }
            
        }
    }
}

function pickDrawFuncs() {
    var colormaps = {
        ryw: function (count) {
				var lc = Math.log(count) / Math.log(10);
				var r = Math.floor(255 * Math.min(1, lc));
				var g = Math.floor(255 * Math.min(1, Math.max(0, lc - 1)));
				var b = Math.floor(255 * Math.min(1, Math.max(0, lc - 2)));
                var a = Math.min(1, lc);
                if(rgb == 1){return "rgba(" + r + "," + g + "," + b + "," + a + ")"};
                if(rgb == 2){return "rgba(" + b + "," + g + "," + r + "," + a + ")"};
                if(rgb == 3){return "rgba(" + g + "," + b + "," + r + "," + a + ")"};			
        },
    };


    var drawfuncs = {
        circle: function draw_circle(context, datum) {
            var radius = 3.0;
			
            // var midx = (datum.x0 + datum.x1) / 2;
            // var midy = (datum.y0 + datum.y1) / 2;
            context.beginPath();
            context.arc( datum.x, datum.y, radius, 0, 2 * Math.PI);
            context.fill();
        },
        rect: function draw_rect(context, datum) {
            // var width = datum.x1 - datum.x0;
            // var height = datum.y1 - datum.y0;
			var radius = 1.0;
			
            if(datum.tile_zoom >= 14){
                radius = 1.5;
            }
            if(datum.tile_zoom >= 16){
                radius = 2.0;
            } 
			
            context.fillRect(datum.x, datum.y, radius, radius);
        }
    };

    var transforms = {
        density_scaling: function (datum) {
			return 1;
        },
        no_scaling: function () {
            return 1;
        }
    };

    return {
        draw: drawfuncs[PLOTTING_MODE],
        count_transform: transforms[PLOTTING_TRANSFORM],
        color: colormaps[PLOTTING_COLOR_SCALE]
    };
}
