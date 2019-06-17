function setBarChart(data, field) {

    var margin = {top : 20, right : 20, bottom : 20, left : 40};
    var div = d3.select(field);
    var width = div.node().getBoundingClientRect().width - margin.left - margin.right;
    var height = div.node().getBoundingClientRect().height - margin.top - margin.bottom;

    var svg = div.selectAll('svg').data([data]);
	
    var svg = svg.enter()
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var minX = d3.min(data, function(d) {
        return parseInt(d[0]);
    })
    var maxX = d3.max(data, function(d) {
        return parseInt(d[0]);
    })
    var minY = d3.min(data, function(d) {
        return parseInt(d[1]);
    })
    var maxY = d3.max(data, function(d) {
        return parseInt(d[1]);
    })
    
    var x =  d3.scaleLinear()
            .domain(d3.extent(data, function(d){ return d[0]; }))
            .range([0, width]);
    
    var y = d3.scaleLinear()
            .domain([minY, maxY])
			.range([height, 0]);

    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y)
                .ticks(5);
    svg.append("g")
        .attr("class","axis axis--x")
        .attr("transform","translate(" + 0 + "," + height + ")")
        .attr("fill", "#fff")
        .call(xAxis);

    svg.append("g")
        .attr("class","axis axis--y")
        .attr("fill", "#fff")
        .call(yAxis);
    
    var linePath = d3.line()
        .x(function (d) { return x(d[0]); })
        .y(function (d) { return y(d[1]); });
    

    svg.append('g')
        .append('path')
        .attr('class', 'line-path')
        .attr('d', linePath(data))
        .attr('fill', 'none')
        .attr('stroke-width', 3)
        .attr('stroke', 'steelblue');
        
    svg.append('g')
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('r', 5)
        // .attr('transform', function(d){
        //     return 'translate(' + x(d[0]) + ',' + y(d[1]) + ')'
        // })
        .attr("cx", function(d){ return x(d[0]); })
        .attr("cy", function(d){ return y(d[1]); })
        .attr('fill', 'steelblue');

    svg.append('g')
        .selectAll("circle")
        .data(data)
        .enter()
        .append("text")
        .attr("x", function(d, i){ return x(d[0]) - 10; })
        .attr("y", function(d, i){ return y(d[1]) - 10; })
        .text(function(d, i){  return d[1];})
        .attr("fill", "#fff")
        .attr("font-family", "@Microsoft Yahei")
        .attr("font-size", "10pt")
        .attr("text-align", "center");
}