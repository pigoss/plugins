import { MetricsPanelCtrl } from 'app/plugins/sdk';
import _ from 'lodash';
import echarts from './libs/echarts.min';
import './libs/echarts-liquidfill.min';
import './libs/dark';
import './style.css!';

export class EchartsCtrl extends MetricsPanelCtrl {

    constructor($scope, $injector) {
        super($scope, $injector);

        const panelDefaults = {
            echartsOption: {
                colorArr: ['#85b6b2', '#6d4f8d', '#cd5e7e', '#e38980', '#f7db88'],
                title: '主机容量',
                subTitle: '',
                titleX: 'center',
                titleY: '',
                toolBoxShow: true,
                legendShow: true,
                legendOrient: 'vertical',
                legendTop: '',
                legendLeft: 'left',
                IS_CONCENTRIC: true,
                roseType: 'area',
                minRadius: '0%',
                maxRadius: '75%',
                centerX: '50%',
                centerY: '50%'
            },
            USE_URL: false,
            USE_FAKE_DATA: true,
            fakeData: '[{"target":"已用容量","datapoints":[["115",1499285716736]]},{"target":"剩余容量","datapoints":[["87",1499285716736]]}]',
            url: '',
            request: '',
            updateInterval: 10000
        };

        _.defaultsDeep(this.panel, panelDefaults);

        this.events.on('data-received', this.onDataReceived.bind(this));
        this.events.on('data-error', this.onDataError.bind(this));
        this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
        this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
        this.events.on('panel-initialized', this.render.bind(this));

        if (this.panel.USE_URL && this.panel.USE_FAKE_DATA && this.panel.fakeData) {
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

        if (that.panel.USE_URL && !that.panel.USE_FAKE_DATA && that.panel.url && that.panel.request) {
            xmlhttp.open("POST", that.panel.url, true);
            xmlhttp.send(that.panel.request);
        } else {
            xmlhttp = null;
        }

        this.$timeout(() => { this.updateData(); }, that.panel.updateInterval);
    }

    onDataReceived(dataList) {
        this.data = this.panel.USE_URL ? this.UrlData : dataList;

        if (this.panel.USE_URL && this.panel.USE_FAKE_DATA && this.panel.fakeData) {
            this.data = eval(this.panel.fakeData); // jshint ignore:line
        }

        this.data = this.translateData(this.data);
        this.onRender();
    }

    onRender() {
        this.IS_DATA_CHANGED = true;
        this.render();
        this.IS_DATA_CHANGED = false;
    }

    translateData(data) {
        if (data.length) {
            let dataArr = [];
            for (let i = 0; i < data.length; i++) {
                dataArr.push({
                    name: data[i].target,
                    value: data[i].datapoints[data[i].datapoints.length - 1][0]
                });
            }
            return dataArr;
        } else {
            return [];
        }
    }

    onDataError(err) {
        this.render();
    }

    onInitEditMode() {
        this.subTabIndex = 0;
        this.addEditorTab('数据', 'public/plugins/dxc-pie-panel/editer-metric.html', 2);
        this.addEditorTab('Echarts配置', 'public/plugins/dxc-pie-panel/editor-echarts.html', 3);
    }

    changeColor(colorIndex, color) {
        this.panel.echartsOption.colorArr[colorIndex] = color;
        this.onRender();
    }

    removeColor(colorIndex) {
        this.panel.echartsOption.colorArr.splice(colorIndex, 1);
        this.onRender();
    }

    addColor() {
        this.panel.echartsOption.colorArr.push('rgba(255, 255, 255, 1)');
        this.onRender();
    }

    // invertColor() {
    //     this.panel.echartsOption.colorArr.reverse();
    //     this.onRender();
    // }

    link(scope, elem, attrs, ctrl) {
        const $panelContainer = elem.find('.echarts_container')[0];

        ctrl.IS_DATA_CHANGED = true;

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

        function render() {
            if (!myChart) return;

            setHeight();
            myChart.resize();

            if (ctrl.IS_DATA_CHANGED) {
                myChart.clear();

                myChart.setOption({
                    backgroundColor: '#1f1d1d',
                    color: ctrl.panel.echartsOption.colorArr,
                    title: {
                        text: ctrl.panel.echartsOption.title,
                        subtext: ctrl.panel.echartsOption.subTitle,
                        x: ctrl.panel.echartsOption.titleX,
                        y: ctrl.panel.echartsOption.titleY,
                        textStyle: {
                            // fontWeight: 'normal'
                        }
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
                        data: getLegend()
                    },
                    series: getSeries()
                });
            }
        }

        function getLegend() {
            if (ctrl.data) {
                let legend = [];
                for (let i = 0; i < ctrl.data.length; i++) {
                    legend.push(ctrl.data[i].name);
                }
                return legend;
            }
        }

        function getSeries() {
            let seriesArr = [];

            if (!ctrl.panel.echartsOption.IS_CONCENTRIC) {
                seriesArr.push({
                    name: ctrl.panel.echartsOption.title,
                    type: 'pie',
                    radius: [ctrl.panel.echartsOption.minRadius, ctrl.panel.echartsOption.maxRadius],
                    center: [ctrl.panel.echartsOption.centerX, ctrl.panel.echartsOption.centerY],
                    roseType: ctrl.panel.echartsOption.roseType,
                    data: ctrl.data,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                });
            } else {
                if (ctrl.data) {
                    for (let i = 0; i < Math.floor(ctrl.data.length / 2); i++) {
                        seriesArr.push({
                            name: ctrl.panel.echartsOption.title,
                            type: 'pie',
                            clockWise: false,
                            hoverAnimation: false,
                            radius: getRadius(i, ctrl.panel.echartsOption.minRadius, ctrl.panel.echartsOption.maxRadius),
                            center: [ctrl.panel.echartsOption.centerX, ctrl.panel.echartsOption.centerY],
                            data: [
                                ctrl.data[2 * i],
                                {
                                    name: '',
                                    value: ctrl.data[2 * i + 1].value,
                                    itemStyle: {
                                        normal: {
                                            color: 'rgba(0,0,0,0)',
                                            label: { show: false },
                                            labelLine: { show: false }
                                        },
                                        emphasis: {
                                            color: 'rgba(0,0,0,0)'
                                        }
                                    }
                                }
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        });
                    }
                } else {
                    seriesArr = [];
                }
            }

            return seriesArr;
        }

        function getRadius(index, min, max) {
            const reg = /%+/;
            let unit = reg.test(min) && reg.test(max) ? '%' : 0;
            let interval = (parseFloat(max) - parseFloat(min)) / ctrl.data.length;
            return [(interval * index + parseFloat(min) + unit), (interval * (index + 1) + parseFloat(min) + unit)];
        }

        this.events.on('render', function () {
            render();
            ctrl.renderingCompleted();
        });
    }
}

EchartsCtrl.templateUrl = 'module.html';
