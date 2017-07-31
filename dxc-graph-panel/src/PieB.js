function pieB(series, ctrlData) {
    let newArr = [];

    series.data.forEach((data, index) => {
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
				borderColor: '#1f1d1d',
			}
		},
        });
    });

    return newArr;
}
    
        function getSeriesData(seriesData, allData) {
            let newData = [];

            if (_.isArray(seriesData) && _.isArray(allData)) {
                // 匹配数据名称
                seriesData.forEach(sData => {
                    allData.forEach(aData => {
                        if (sData == aData.name) {
                            newData.push(angular.copy(aData));
                        }
                    });
                });
            }
            return newData;
        }
export { pieB };