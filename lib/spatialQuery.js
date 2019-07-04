function spatialQuery(){
    $.get(url + '/squery', {
        level : map.getZoom(),
        bounds: range,
        time_from: time_from,
        time_to: time_to,
        datasetname: datasetname,
        mode: mode
    }, function(data, textStatus){
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
}