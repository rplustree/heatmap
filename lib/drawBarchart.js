function drawBarchart(){
    var myChart = echarts.init(document.getElementById('attri_chart'));

    $.get(url + '/attriquery', {
        level : map.getZoom(),
        bounds: bounds,
        time_from: time_from,
        time_to: time_to,
        datasetname: "HeatMap_TS",
        arrtibutemode:"1"
    }, function(data, textStatus){
        var jsonObj =  JSON.parse(data);
        draw(jsonObj);
    });

    function draw(data){
        var option = {
        title: {
        //text: 'NewYork Taxi properties',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            textStyle:{
                color: "#fff"
            },
            data: ['one man', 'two men','three men']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            lineStyle:{
                color:'#fff',
            }
        },
        yAxis: {
            type: 'category',
            data: ['Sun','Sat','Fri','Thur','Wed','Tues','Mon','Total'],
            axisLine: {
                lineStyle: {
                    color: "#fff",
                }
            }
        },
        series: [
            {
                name: 'one man',
                type: 'bar',
                data: [data[11],data[10],data[9],data[8],data[7],data[6],data[5],data[1]]
            },
            {
                name: 'two men',
                type: 'bar',
                data: [data[18],data[17],data[16],data[15],data[14],data[13],data[12],data[3]]
            },
            {
                name: 'three men',
                type: 'bar',
                data: [data[25],data[24],data[23],data[22],data[21],data[20],data[19],data[4]]
            }
        ],
            };

        myChart.setOption(option);
    };
}