function attributeQuery(){
    $.get(url + '/attriquery', {
        level : map.getZoom(),
        bounds: range,
        time_from: time_from,
        time_to: time_to,
        datasetname: HeatMap_TS,
        arrtibutemode:attri[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],
    }, function(data, textStatus){
        var jsonObj =  JSON.parse(data);
        return jsonObj;
    });
}