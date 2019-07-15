function drawBarchart(){
    var myChart = echarts.init(document.getElementById('attri_chart'));

    $.get(url + '/attriquery', {
        level : map.getZoom(),
        bounds: bounds,
        time_from: time_from,
        time_to: time_to,
        datasetname: "NewYork_TS",
        arrtibutemode:"2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25"
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
            top: '5%',
            textStyle:{
                color: "#fff"
            },
            data: ['one man', 'two men','more than two']
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
            axisLine: {
                lineStyle: {
                    color: "#fff",
                }
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
                data: [data[11],data[10],data[9],data[8],data[7],data[6],data[5],data[2]]
            },
            {
                name: 'two men',
                type: 'bar',
                data: [data[18],data[17],data[16],data[15],data[14],data[13],data[12],data[3]]
            },
            {
                name: 'more than two',
                type: 'bar',
                data: [data[25],data[24],data[23],data[22],data[21],data[20],data[19],data[4]]
            }
        ],
            };

        myChart.setOption(option);
    };
    myChart.on('legendselectchanged', function (obj) {
        var selected = obj.selected
        var one = selected["one man"]
        var two = selected["two men"]
        var other = selected["more than two"]
        attrimode = "10";
        if(one){attrimode += ",2"}else{attrimode.replace(",2","")}
        if(two){attrimode += ",3"}else{attrimode.replace(",3","")}
        if(other){attrimode += ",4"}else{attrimode.replace(",4","")}
        attrimode.replace("1,","")
        timeQuery();
        console.log(attrimode)
    });
}