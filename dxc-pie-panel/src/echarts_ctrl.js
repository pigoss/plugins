import { MetricsPanelCtrl } from 'app/plugins/sdk';
import _ from 'lodash';
import echarts from './libs/echarts.min';
import './libs/echarts-liquidfill.min';
import './libs/dark';
import './style.css!';
import { pieA } from './PieA';
import { pieB } from './PieB';
const pieTypeArr = [
    {
        name: '并列',
        func: pieA
    }, {
        name: '环形',
        func: pieB
    }
];

export class EchartsCtrl extends MetricsPanelCtrl {

    constructor($scope, $injector) {
        super($scope, $injector);

        const panelDefaults = {
            echartsOption: {
                bgColor: '#1f1d1d',
                colorArr: ['rgba(234,74,45,1)', '#FDB225', 'rgba(45,148,215,1)', '#16A59C', 'rgba(234,74,45,0.9)', '#b5c334'],
                title: '主机容量',
                subTitle: '',
                titleX: '65%',
                titleY: '20%',
                toolBoxShow: true,
                legendShow: true,
                legendOrient: 'vertical',
                legendTop: '65%',
                legendLeft: '65%',
                legendItemHeight:8,
                legendItemWidth:8,
                series: []
            },
            USE: 'FAKE_DATA',

            fakeData: '[{"target":"已用容量","datapoints":[["115",1499285716736]]},{"target":"剩余容量","datapoints":[["87",1499285716736]]}]',
            url: '',
            request: '',
            updateInterval: 10000
        };

        const seriesDefaults = [
            {
                name: '饼图1',
                pieType: '环形',
                roseType: false,
                minRadius: '50%',
                maxRadius: '70%',
                centerX: '30%',
                centerY: '50%',
                data: ['已用容量', '剩余容量']
            }
        ];

        _.defaultsDeep(this.panel, panelDefaults);

        if (this.panel.echartsOption.series.length == 0) {
            _.defaultsDeep(this.panel.echartsOption.series, seriesDefaults);
        }

        this.events.on('data-received', this.onDataReceived.bind(this));
        this.events.on('data-error', this.onDataError.bind(this));
        this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
        this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
        this.events.on('panel-initialized', this.render.bind(this));

        if (this.panel.USE === 'FAKE_DATA' && this.panel.fakeData) {
            let that = this;
            setTimeout(function () {
                that.onDataReceived(that.panel.fakeData);
            }, 500);
        } else {
            this.updateData();
        }
    }

    //post请求
    updateData() {
        let that = this, xmlhttp;

        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                that.UrlData = JSON.parse(xmlhttp.responseText);
                that.onDataReceived();
            }
        };

        if (that.panel.USE === 'URL' && that.panel.url && that.panel.request) {
            xmlhttp.open("POST", that.panel.url, true);
            xmlhttp.send(that.panel.request);
        } else {
            xmlhttp = null;
        }

        this.$timeout(() => { this.updateData(); }, that.panel.updateInterval);
    }

    onDataReceived(dataList) {
        this.dataList = this.panel.USE === 'URL' ? this.UrlData : dataList;

        if (this.panel.USE === 'FAKE_DATA' && this.panel.fakeData) {
            this.dataList = eval(this.panel.fakeData); // jshint ignore:line
        }

        this.data = this.translateData(this.dataList);
        this.onRender();
    }

    onRender() {
        this.IS_DATA_CHANGED = true;
        this.render();
        this.IS_DATA_CHANGED = false;
    }

    translateData(data) {
        let dataArr = [];
        if (_.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
                dataArr.push({
                    name: data[i].target,
                    value: data[i].datapoints[data[i].datapoints.length - 1][0]
                });
            }
        }
        return dataArr;
    }

    onDataError(err) {
        this.render();
    }

    onInitEditMode() {
        this.subTabIndex = 0;
        this.addEditorTab('数据配置', 'public/plugins/dxc-pie-panel/editer-metric.html', 2);
        this.addEditorTab('常规配置', 'public/plugins/dxc-pie-panel/editor-echarts.html', 3);
        this.addEditorTab('饼图配置', 'public/plugins/dxc-pie-panel/editor-pie.html', 4);
    }

    addColor() {
        this.panel.echartsOption.colorArr.push('rgba(255, 255, 255, 1)');
        this.onRender();
    }

    changeColor(colorIndex, color) {
        this.panel.echartsOption.colorArr[colorIndex] = color;
        this.onRender();
    }

     remove(obj, index) {
        obj.splice(index, 1);
        this.onRender();
    }

    addSeries() {
        this.panel.echartsOption.series.push({
            name: '饼图' + (this.panel.echartsOption.series.length + 1),
            pieType: '环形',
            roseType: false,
             minRadius: '50%',
                maxRadius: '70%',
                centerX: '30%',
                centerY: '50%',
            data: []
        });

        this.subTabIndex = this.panel.echartsOption.series.length - 1;

        this.onRender();
    }

    addData(dataArr) {
        dataArr.push(this.data[0].name);
        this.onRender();
    }

   

    getData() {
        return _.map(this.data, function (data) {
            return data.name;
        });
    }

    // invertColor() {
    //     this.panel.echartsOption.colorArr.reverse();
    //     this.onRender();
    // }

    link(scope, elem, attrs, ctrl) {
        const $panelContainer = elem.find('.echarts_container')[0];

        // 防止重复触发事件
        var callInterval = function callInterval() {
            var timeout, result;

            function func(callBack, interval) {
                var context = this; // jshint ignore:line
                var args = arguments;

                if (timeout) clearInterval(timeout);

                timeout = setInterval(function () {
                    result = callBack.apply(context, args);
                }, interval);

                return result;
            }

            return func;
        }();

        function setHeight() {
            let height = ctrl.height || panel.height || ctrl.row.height;
            if (_.isString(height)) {
                height = parseInt(height.replace('px', ''), 10);
            }
            $panelContainer.style.height = height + 'px';
        }

        setHeight();

        let myChart = echarts.init($panelContainer, 'dark');
        myChart.resize();

        ctrl.IS_DATA_CHANGED = true;

        function render() {
            if (!myChart) return;

            setHeight();
            myChart.resize();

            if (ctrl.IS_DATA_CHANGED) {
                myChart.clear();

                myChart.setOption({
                    backgroundColor: ctrl.panel.echartsOption.bgColor,
                    color: ctrl.panel.echartsOption.colorArr,
                    title: {
                        text: ctrl.panel.echartsOption.title,
                        subtext: ctrl.panel.echartsOption.subTitle,
                        x: ctrl.panel.echartsOption.titleX,
                        y: ctrl.panel.echartsOption.titleY
                    },
                    toolbox: {
                        show: ctrl.panel.echartsOption.toolBoxShow,
                        feature: {
                            dataView: {
                                show: true,
                                readOnly: false
                            },
                            saveAsImage: {
                                show: true
                            }
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        show: ctrl.panel.echartsOption.legendShow,
                        orient: ctrl.panel.echartsOption.legendOrient,
                        top: ctrl.panel.echartsOption.legendTop,
                        left: ctrl.panel.echartsOption.legendLeft,
                        itemWidth: ctrl.panel.echartsOption.legendItemWidth,
		itemHeight: ctrl.panel.echartsOption.legendItemHeight,
                        data: getLegend()
                    },
                    series: getSeries()
                });

                let count = 0;
                callInterval(function () {
                    myChart.dispatchAction({
                        type: 'downplay',
                        seriesIndex: 0
                    });
                    myChart.dispatchAction({
                        type: 'highlight',
                        seriesIndex: 0,
                        dataIndex: (count++) % getSeries()[0].data.length
                    });
                }, 2000);
            }
        }

        function getLegend() {
            let legend = [];

            ctrl.panel.echartsOption.series.forEach(series => {
                legend = _.uniq(legend.concat(series.data));
            });

            return legend;
        }

        function getSeries() {
            let seriesArr = [];

            if (_.isArray(ctrl.data)) {
                // 遍历保存的series
                ctrl.panel.echartsOption.series.forEach(series => {
                    //默认类型series
                    let newSeries = [];
                    let defaultSeries = [{
                        name: series.name,
                        type: 'pie',
                        radius: [series.minRadius, series.maxRadius],
                        center: [series.centerX, series.centerY],
                        roseType: series.roseType,
                        data: getDefaultSeriesData(series.data, ctrl.data),
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }];
                    // 匹配声明的饼图类型
                    pieTypeArr.forEach((type, tIndex) => {
                        // 如果匹配到了
                        if (series.pieType == type.name) {
                            // 赋值给newSeries
                            newSeries = pieTypeArr[tIndex].func(series, ctrl.data);
                        }
                    });
                    // 加入新series
                    seriesArr = seriesArr.concat(newSeries.length != 0 ? newSeries : defaultSeries);
                });
            }

            return seriesArr;
        }

        //默认样式获取数据
        function getDefaultSeriesData(seriesData, allData) {
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

        this.events.on('render', function () {
            render();
            ctrl.renderingCompleted();
        });
    }
}

EchartsCtrl.templateUrl = 'module.html';
