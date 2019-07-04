//function drawBarchart(data,filed){
    var myChart = echarts.init(document.getElementById('attri_chart'));

    var data = {"2":"100","3":"1000","4":"100","5":"1020","6":"30","7":"100","8":"100","9":"100","10":"100","11":"100","12":"100","13":"100","14":"12","15":"100","16":"100","17":"100","18":"100","19":"100","20":"100","21":"100","22":"100","23":"100","24":"100","25":"100"}
    
    //var data = attributeQuery;
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
            data: [data[11],data[10],data[9],data[8],data[7],data[6],data[5],data[2]]
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
//}