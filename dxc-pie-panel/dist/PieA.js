'use strict';

System.register([], function (_export, _context) {
    "use strict";

    function pieA(series, ctrlData) {
        var newArr = [];

        series.data.forEach(function (data, index) {
            newArr.push({
                name: series.name,
                type: 'pie',
                clockWise: false,
                hoverAnimation: false,
                radius: getRadius(index, series.data.length, series.minRadius, series.maxRadius),
                center: [series.centerX, series.centerY],
                data: getSeriesData(index, series.data, ctrlData),
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            });
        });

        return newArr;
    }

    function getRadius(index, length, min, max) {
        var reg = /%+/;
        var unit = reg.test(min) && reg.test(max) ? '%' : 0;
        var interval = (parseFloat(max) - parseFloat(min)) / length;
        return [interval * index + parseFloat(min) + unit, interval * (index + 1) + parseFloat(min) + unit];
    }

    function getSeriesData(index, seriesData, ctrlData) {
        var newData = [];
        var hiddenStyle = {
            normal: {
                color: 'rgba(0,0,0,0)',
                label: { show: false },
                labelLine: { show: false }
            },
            emphasis: {
                color: 'rgba(0,0,0,0)'
            }
        };

        if (_.isArray(seriesData) && _.isArray(ctrlData)) {
            // 匹配所有数据
            seriesData.forEach(function (sData) {
                ctrlData.forEach(function (cData) {
                    // 如果相等
                    if (sData == cData.name) {
                        // 复制到newData，遍历结束后newData便包含当前series的所有数据
                        newData.push(angular.copy(cData));
                    }
                });
            });
            // 隐藏newData中除第dIndex条以外的其他数据
            // 将第dIndex条数据移动到第一个
            newData.map(function (data, dIndex) {
                if (dIndex != index) {
                    data.name = '';
                    data.itemStyle = hiddenStyle;
                }
                return data;
            });
            newData.unshift(newData[index]);
            newData.splice(index + 1, 1);
        }

        return newData;
    }

    return {
        setters: [],
        execute: function () {
            _export('pieA', pieA);
        }
    };
});
//# sourceMappingURL=PieA.js.map
