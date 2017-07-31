'use strict';

System.register([], function (_export, _context) {
    "use strict";

    function pieB(series, ctrlData) {
        var newArr = [];

        series.data.forEach(function (data, index) {
            newArr.push({
                name: series.name,
                type: 'pie',
                radius: [series.minRadius, series.maxRadius],
                center: [series.centerX, series.centerY],

                data: getSeriesData(series.data, ctrlData),
                avoidLabelOverlap: false,
                startAngle: 20,
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        },
                        borderWidth: 10,
                        borderColor: '#1f1d1d'
                    }
                }
            });
        });

        return newArr;
    }

    function getSeriesData(seriesData, allData) {
        var newData = [];

        if (_.isArray(seriesData) && _.isArray(allData)) {
            // 匹配数据名称
            seriesData.forEach(function (sData) {
                allData.forEach(function (aData) {
                    if (sData == aData.name) {
                        newData.push(angular.copy(aData));
                    }
                });
            });
        }
        return newData;
    }
    return {
        setters: [],
        execute: function () {
            _export('pieB', pieB);
        }
    };
});
//# sourceMappingURL=PieB.js.map
