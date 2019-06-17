

var inter = 0;

function loadLineChart(data, field_Name) {
    if (data.length <= 1) {
		return;
	}
	var div = d3.select("#" + field_Name);
		
	//  定义时间解析函数
	var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
			 
	var margin = {top: 10, right: 40, bottom: 40, left: 25},
		//margin2 = {top: 150, right: 40, bottom: 20, left: 20},
	    width = div.node().getBoundingClientRect().width - margin.left - margin.right,
        height = div.node().getBoundingClientRect().height - margin.top - margin.bottom,
		// height2 = div.node().getBoundingClientRect().height -margin2.top - margin2.bottom;
		margin2 = {top: height+20, right: 40, bottom: 20, left: 25},
		height2 = div.node().getBoundingClientRect().height -margin2.top - margin2.bottom;
	
	var svg = div.selectAll('svg').data([data]);
	
    var svg = svg.enter()
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	
	//scale
	var x = d3.scaleTime()
		.domain([parseTime(time_from), parseTime(time_to)]) // 值域
		.range([0, width]); // 定义域
	
	// data二维数组，每个子数组中都是string 所以在求最大最小值是要转换成number
	var min = d3.min(data, function(d) {
		return parseInt(d[1]);
	})
	var max = d3.max(data, function(d) {
		return parseInt(d[1]);
	})
	var y = d3.scaleLinear()
		.domain([min, max])
		.range([height, 0]);
	
	var brushx = d3.scaleTime()
		.domain([parseTime(time_from), parseTime(time_to)])
		.range([0, width]);
	
	var brushy = d3.scaleLinear()
		//.domain(d3.extent(data, function(d){ return d[1]; }))
		.domain([min, max])
		.range([height, 0]);
	
	var xz = x;
	//Axis
	var xAxis = d3.axisBottom(x);

	var yAxis = d3.axisLeft(y)
				.ticks(5);

	var xbrushAxis = d3.axisBottom(brushx);
	


	//创建一个新的一维的 x-方向的刷取交互
	var brush = d3.brushX()
		.extent([[0, 0], [width, height]]) //.extent()属性指定可以刷的区域：矩形的左上角和右下角
		.on("brush end", brushed);

	var area = d3.area()
        .curve(d3.curveMonotoneX)
        //.interpolate("monotone")
        .x(function (d) { return x(parseTime(d[0])); })
		//.y0(y(0))
		.y0(height)
		.y1(function (d) { return y(d[1]); });
	
	var area2 = d3.area()
        .curve(d3.curveMonotoneX)
        .x(function (d) { return brushx(parseTime(d[0])); })
		.y0(height)
        .y1(function (d) { return brushy(d[1]); });

	
	// 添加方块(width, height)主要作用就是防止部分元素通过定义的剪切区域来显示，在这里是作为折线图显示边界框来定义
	svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);
		
	var focus = svg.append("g")
		.attr("class", "focus")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	// var context = svg.append("g")
	// 	.attr("class", "context")
	// 	.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

	focus.append("path")
		.datum(data)
		.attr("class", "area")
		.attr("clip-path", "url(#clip)") //这里用来防止图形越界
		.style("fill", "url(#gradient)") //这里设置渐变颜色
		.attr("width",width)
		.attr("height", height)
		.attr("d", area);
	
	// 在svg中放入坐标
	focus.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.attr("fill", "#fff")
		.call(xAxis);
  
	focus.append("g")
		.attr("class", "axis axis--y")
		.call(yAxis) // 添加y轴文本
		.append("text")
		.text("Count")
		.attr("transform", "translate(50, -30)")
		.attr("y", 0)
		.attr("dy", "2em") //沿y轴平移2个字体的大小
		.attr("font-size", "14px")
		.attr("fill", "#fff");
  
	// context.append("path")
	// 	.datum(data)
	// 	.attr("class", "area")
	// 	.attr("clip-path", "url(#clip)") //这里用来防止图形越界
	// 	.style("fill", "url(#gradient)")
	// 	.attr("width",width)
	// 	.attr("height", height2)
	// 	.attr("d", area2);
  
	// context.append("g")
	// 	.attr("class", "axis axis--x")
	// 	.attr("transform", "translate(0," + height2 + ")")
	// 	.call(xbrushAxis);
  
	focus.append("g")
		.attr("class", "brush")
		.call(brush)
		.call(brush.move, brushx.range());

	// context.append("path")
	// 	.attr("fill", "blue")
	// 	.attr("stroke", "red")
	// 	.attr("stroke-width", 0.5)
	// 	.attr("clip-path", "url(#clip)") //这里用来防止图形越界
    //  .style("fill", "url(#gradient)")
	// 	.attr("d", area2(data));
	
	// context.append("g")
	// 	.attr("class", "brush")
	// 	.attr("fill", "red")
	// 	.call(brush)
	// 	.call(brush.move, x.range())
	// 	.selectAll("rect")
	// 	.attr("width", width)
	// 	.attr("height", height2);
	
	// context.append("g")
	// 	.attr("transform", "translate(0, 0)")
	// 	.call(xbrushAxis);

	// context.append("g")
	// 	.call(ybrushAxis)
	// 	.append("text")
	// 	.attr("fill", "#000")
	// 	.attr("transform", "rotate(-90)")
	// 	.attr("y", 0)
	// 	.attr("dy", "1em")
	// 	.attr("text-anchor", "end")
	// 	.text("total_count");
		
	var gradient = svg.append("defs")
		.append("linearGradient")
        .attr("id", "gradient")
        .attr("x2", "0%")
		.attr("y2", "100%");
		
	gradient.append("stop")
        .attr("offset", "10%")
        .attr("stop-color", "red")
		.attr("stop-opacity", 1);
		
    gradient.append("stop")
        .attr("offset", "30%")
        .attr("stop-color", "#f4e541")
        .attr("stop-opacity", 1);

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#007399")
        .attr("stop-opacity", 1);
	
   focus.append("text")
      .attr("x", width/2 )
      .attr("y", margin.top)
	  .attr("dy", "1em")
      .text(""); // 图标题

	//定义一个透明正方形用来更好的进行缩放，缩放功能在这里实现，如果不定义这个方块也是可以的
	//但是缩放操作起来变得很困难
	var zoom = d3.zoom()
		.scaleExtent([1 / 4, 8]) //缩放比例范围
		// .scaleExtent([1, 16]) // 缩放，当取1时，无法缩小或放大
		.translateExtent([[0, 0], [width, height]])
		.extent([[0, 0], [width, height]])
		.on("zoom", draw)
		//.on("end",update_linechart);
		.on("end", update);
	
	svg.append("rect")
		.attr("class", "zoom")
		.attr("width", width)
		.attr("height", height)
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.attr("fill", "none")
		.attr("pointer-events", "all")
		.attr("cursor", "move")
		.call(zoom);
		
	function brushed() {
		//if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;
		if(!d3.event.sourceEvent) return;
		//var s = d3.event.selection || brushx.range();
		
		if(d3.event.selection){
			var sel = d3.event.selection || brushx.range();
			brush.selection = sel.map(xz.invert);
			x.domain(sel.map(brushx.invert, brushx));
		} else {
			delete brush.selection;
		}
		//x.domain(s.map(brushx.invert, brushx));
		focus.select("path.area").attr("d", area);
		focus.select(".axis--x").call(xAxis);
		//svg.select(".zoom").call(zoom.transform, d3.zoomIdentity.scale(width / (s[1] - s[0])).translate(-s[0], 0));
		//匹配折线图显示范围
		//console.log(_encodeArgs());
	}
	
	function draw() {
		if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return;
		xz = d3.event.transform.rescaleX(x);
		//x.domain(d3.event.transform.rescaleX(brushx).domain());
		//svg.select("g.axis.axis--x").call(xAxis.scale(xz));
		//svg.select("path.line").attr("d", line.x(function(d) { return xz(parseTime(d[0]))}));
		svg.select("path.area").attr("d", area.x(function(d) { return xz(parseTime(d[0]))}));
		focus.select("path.area").attr("d", area);
		focus.select(".axis--x").call(xAxis.scale(xz));
		if(brush.selection){
			focus.select(".brush")
				.call(brush.move, brush.selection.map(xz));
		}
		// context.select(".brush")
		//     .call(brush.move,x.range().map(d3.event.transform.invertX,d3.event.transform))
		
	}
	
	// funcxtion update_linechart() {
	// 	var lower_bound = xAxis.scale().domain()[0];
    //         upper_bound = xAxis.scale().domain()[1];
		
	// 	time_from = moment(lower_bound).format("YYYY-MM-DD HH:mm:ss");
	// 	time_to = moment(upper_bound).format("YYYY-MM-DD HH:mm:ss");
		
	// 	var sw = map.getBounds().getSouthWest();
	// 	var ne = map.getBounds().getNorthEast(); 
	// 	var bounds = sw.lng.toFixed(4)+","+ sw.lat.toFixed(4)+","+ne.lng.toFixed(4)+","+ne.lat.toFixed(4);
		
	// 	timeSeriesQuery();
	// 	heat.redraw();
	// }

	function update(){
		var sel = getSelection();
		if(sel.brush){
			var sd = sel.brush.start;
			var ed = sel.brush.end;
		} else {
			var sd = sel.global.start;
			var ed = sel.global.end;
		}
		
		time_from = moment(sd).format("YYYY-MM-DD HH:mm:ss");
		time_to = moment(ed).format("YYYY-MM-DD HH:mm:ss");
		//console.log(ST.value, ET.value);
		timeInfo.style.marginLeft = "10vw";
		timeInfo.innerHTML = time_from + " - " + time_to;
		btnGroup.style.marginLeft = (55 - timeInfo.innerHTML.length) + "vw" ;
		var sw = map.getBounds().getSouthWest();
		var ne = map.getBounds().getNorthEast(); 
		var bounds = sw.lng.toFixed(4)+","+ sw.lat.toFixed(4)+","+ne.lng.toFixed(4)+","+ne.lat.toFixed(4);
		
		timeSeriesQuery();
		heat.redraw();
	}

	function getSelection(){
		var sel = {};
		var timedom = xz.domain();
		sel.global = {start:timedom[0], end:timedom[1]};
		
		if (brush.selection){
			var bext = brush.selection;
			sel.brush = {start:bext[0], end:bext[1]};
		}
		return sel;
	}
	
	var stepsize;
	function moveOneStep(){
		if(stepsize == undefined){
            stepsize = brush.selection[1] - brush.selection[0];
		}

		//move the selection
        var sel = [brush.selection[0].getTime()+stepsize,
				   brush.selection[1].getTime()+stepsize];
 
		//make Dates
        var newsel = [Math.min.apply(null, sel),
					  Math.max.apply(null, sel)].map(function(d){
						return new Date(d);
					});

		brush.selection = newsel; 

		//move the domain if needed
		//use "+" to convert dates to int for date arithmetic
		var xzdom = xz.domain();
		if(xzdom[1] < newsel[1]){
			xz.domain([+newsel[1]-(xzdom[1]-xzdom[0]), newsel[1]]);
		}

		if(xzdom[0] > newsel[0]){
			xz.domain([newsel[0], +newsel[0]+(xzdom[1]-xzdom[0])]);
		}

		//move the brush
		svg.select('.brush')
			.call(brush.move, brush.selection.map(xz));

		update(); //redraw itself
	}

	var timeRuning = {
		flag: false,
		timer: null,
		startTimer: function(){
			if(!brush.selection){ //no selection
				return false;
			}
			timeRuning.timer = setInterval(function(){
				moveOneStep();
				if(time_to >= finaltime){
					clearInterval(timeRuning.timer);  // 清空定时器
				}
			}, 2000);
		},

		pauseTimer: function(){
			clearInterval(timeRuning.timer);
		},

		suspendTimer: function (){
			// console.log(timeRuning.flag);
			if(timeRuning.flag){
				timeRuning.startTimer();
				sButton.innerHTML = "<i class='fas fa-pause'></i>";
				timeRuning.flag = false;
			} else {
				timeRuning.pauseTimer();
				sButton.innerHTML = "<i class='fas fa-play'></i>";
				timeRuning.flag = true;
			}
		}
	}

	var timeInfo = document.getElementById("timeInfo");
	var btnGroup = document.getElementsByClassName("btn_group")[0];

	var sButton = document.getElementById("sBtn");
	if(sButton){
		sButton.addEventListener("click", timeRuning.suspendTimer, false);
	}

	// var resetButton = document.getElementById("resetBtn");
	// if(resetButton){
	// 	resetButton.addEventListener("click", reset, false);
	// }

	// function reset(){
	// 	// ST.value = "2015-01-01 00:00:00";
	// 	// ET.value = "2015-02-01 00:00:00";
		
	// 	// timeQuery();
	// 	console.log(info.style.display);
	// 	if(info.style.display == "none"){
	// 		info.style.display = "block";
	// 	} else{
	// 		info.style.display = "none";
	// 	}
		
	// }

}