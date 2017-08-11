'use strict';

System.register(['app/plugins/sdk', 'lodash', './libs/echarts.min', './libs/echarts-liquidfill.min', './libs/dark', './style.css!'], function (_export, _context) {
    "use strict";

    var MetricsPanelCtrl, _, echarts, _createClass, EchartsCtrl;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    return {
        setters: [function (_appPluginsSdk) {
            MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
        }, function (_lodash) {
            _ = _lodash.default;
        }, function (_libsEchartsMin) {
            echarts = _libsEchartsMin.default;
        }, function (_libsEchartsLiquidfillMin) {}, function (_libsDark) {}, function (_styleCss) {}],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            _export('EchartsCtrl', EchartsCtrl = function (_MetricsPanelCtrl) {
                _inherits(EchartsCtrl, _MetricsPanelCtrl);

                function EchartsCtrl($scope, $injector) {
                    _classCallCheck(this, EchartsCtrl);

                    var _this = _possibleConstructorReturn(this, (EchartsCtrl.__proto__ || Object.getPrototypeOf(EchartsCtrl)).call(this, $scope, $injector));

                    var panelDefaults = {
                        echartsOption: {
                            bgColor: '#1f1d1d',
                            colorArr: ['rgba(234,74,45,1)', '#FDB225', 'rgba(45,148,215,1)', '#16A59C', 'rgba(234,74,45,0.9)', '#b5c334'],
                            title: '主机容量',
                            subTitle: '',
                            titleX: '6%',
                            titleY: '2%',
                            toolBoxShow: true,
                            legendShow: true,
                            legendOrient: 'horizontal',
                            legendTop: '4%',
                            legendLeft: '78%',
                            legendItemHeight: 8,
                            legendItemWidth: 8,
                            gridTop: '20%',
                            gridBottom: '20%',
                            gridLeft: '7%',
                            gridRight: '7%',
                            xAxisShow: true,
                            xAxisName: '',
                            xAxisLineShow: true,
                            xAxisLineColor: 'rgba(255,255,255,0.8)',
                            xAxisTickShow: true,
                            xAxisTickAlign: true,
                            xSplitLineShow: false,
                            yAxisShow: true,
                            yAxisName: '',
                            yAxisLineShow: true,
                            yAxisLineColor: 'rgba(255,255,255,0.8)',
                            yAxisTickShow: true,
                            yAxisTickAlign: true,
                            ySplitLineShow: false,
                            line: [],
                            series: []
                        },
                        USE: 'FAKE_DATA',
                        fakeData: '[{"name":"容量","columns":["time","last","last_1"],"values":[490,1399,1657]},{"name":"内存","values":[1920,199,67]}]',
                        url: '',
                        request: '',
                        updateInterval: 10000
                    };

                    var seriesDefaults = [{
                        name: '图形1',
                        type: 'bar',
                        barWidth: '',
                        stack: '',
                        symbol: '',
                        symbolSize: '',
                        labelShow: false,
                        animationShow: true,
                        labelPosition: 'inside',
                        labelFormatter: '{c}',
                        smooth: '',
                        step: '',
                        data: []
                    }];

                    _.defaultsDeep(_this.panel, panelDefaults);

                    if (_this.panel.echartsOption.series.length == 0) {
                        _.defaultsDeep(_this.panel.echartsOption.series, seriesDefaults);
                    }

                    _this.events.on('data-received', _this.onDataReceived.bind(_this));
                    _this.events.on('data-error', _this.onDataError.bind(_this));
                    _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    _this.events.on('panel-initialized', _this.render.bind(_this));

                    if (_this.panel.USE === 'FAKE_DATA' && _this.panel.fakeData) {
                        var that = _this;
                        setTimeout(function () {
                            that.onDataReceived(that.panel.fakeData);
                        }, 500);
                    } else {
                        _this.updateData();
                    }
                    return _this;
                }

                //post请求


                _createClass(EchartsCtrl, [{
                    key: 'updateData',
                    value: function updateData() {
                        var _this2 = this;

                        var that = this,
                            xmlhttp = void 0;

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

                        this.$timeout(function () {
                            _this2.updateData();
                        }, that.panel.updateInterval);
                    }
                }, {
                    key: 'onDataReceived',
                    value: function onDataReceived(dataList) {

                        this.dataList = this.panel.USE === 'URL' ? this.UrlData : dataList;

                        if (this.panel.USE === 'FAKE_DATA' && this.panel.fakeData) {
                            this.dataList = eval(this.panel.fakeData); // jshint ignore:line
                        }

                        this.data = this.translateData(this.dataList);
                        console.log(this.data);
                        this.onRender();
                    }
                }, {
                    key: 'onRender',
                    value: function onRender() {
                        this.IS_DATA_CHANGED = true;
                        this.render();
                        this.IS_DATA_CHANGED = false;
                    }
                }, {
                    key: 'translateData',
                    value: function translateData(data) {
                        var dataArr = [];
                        if (_.isArray(data)) {
                            for (var i = 0; i < data.length; i++) {
                                dataArr.push({
                                    name: data[i].name,
                                    columns: data[i].columns,
                                    value: data[i].values
                                });
                            }
                        }
                        return dataArr;
                    }
                }, {
                    key: 'onDataError',
                    value: function onDataError(err) {
                        this.render();
                    }
                }, {
                    key: 'onInitEditMode',
                    value: function onInitEditMode() {
                        this.subTabIndex = 0;
                        this.addEditorTab('数据配置', 'public/plugins/dxc-graph-panel/editer-metric.html', 2);
                        this.addEditorTab('常规配置', 'public/plugins/dxc-graph-panel/editor-echarts.html', 3);
                        this.addEditorTab('直角坐标系配置', 'public/plugins/dxc-graph-panel/editor-grid.html', 4);
                        this.addEditorTab('柱形图配置', 'public/plugins/dxc-graph-panel/editor-graph.html', 5);
                    }
                }, {
                    key: 'addColor',
                    value: function addColor() {
                        this.panel.echartsOption.colorArr.push('rgba(255, 255, 255, 1)');
                        this.onRender();
                    }
                }, {
                    key: 'changeColor',
                    value: function changeColor(colorIndex, color) {
                        this.panel.echartsOption.colorArr[colorIndex] = color;
                        this.onRender();
                    }
                }, {
                    key: 'addSeries',
                    value: function addSeries() {
                        this.panel.echartsOption.series.push({
                            name: this.panel.echartsOption.series.name,
                            type: 'bar',
                            data: []
                        });

                        // this.subTabIndex = this.panel.echartsOption.series.length - 1;

                        this.onRender();
                    }
                }, {
                    key: 'remove',
                    value: function remove(obj, index) {
                        obj.splice(index, 1);
                        this.onRender();
                    }
                }, {
                    key: 'getData',
                    value: function getData(dataArr) {
                        return _.map(this.data, function (data) {
                            return data.name;
                        });
                    }
                }, {
                    key: 'link',
                    value: function link(scope, elem, attrs, ctrl) {
                        var $panelContainer = elem.find('.echarts_container')[0];

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
                            var height = ctrl.height || panel.height || ctrl.row.height;
                            if (_.isString(height)) {
                                height = parseInt(height.replace('px', ''), 10);
                            }
                            $panelContainer.style.height = height + 'px';
                        }

                        setHeight();

                        var myChart = echarts.init($panelContainer, 'dark');
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
                                        formatter: "{a} : {c} "
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
                                    grid: {
                                        top: ctrl.panel.echartsOption.gridTop,
                                        bottom: ctrl.panel.echartsOption.gridBottom,
                                        left: ctrl.panel.echartsOption.gridLeft,
                                        right: ctrl.panel.echartsOption.gridRight
                                    },
                                    xAxis: [{
                                        name: ctrl.panel.echartsOption.xAxisName,
                                        show: ctrl.panel.echartsOption.xAxisShow,
                                        axisLine: {
                                            show: ctrl.panel.echartsOption.xAxisLineShow,
                                            lineStyle: {
                                                color: ctrl.panel.echartsOption.xAxisLineColor
                                            }
                                        },
                                        axisTick: {
                                            show: ctrl.panel.echartsOption.xAxisTickShow,
                                            alignWithLabel: ctrl.panel.echartsOption.xAxisTickAlign,
                                            lineStyle: {
                                                color: ctrl.panel.echartsOption.xAxisLineColor
                                            }
                                        },
                                        axisLabel: {
                                            textStyle: {
                                                color: ctrl.panel.echartsOption.xAxisLineColor
                                            }
                                        },
                                        splitLine: {
                                            show: ctrl.panel.echartsOption.xSplitLineShow,
                                            lineStyle: {
                                                color: ctrl.panel.echartsOption.xAxisLineColor
                                            }
                                        },
                                        data: getLine()
                                    }],
                                    yAxis: [{
                                        name: ctrl.panel.echartsOption.yAxisName,
                                        show: ctrl.panel.echartsOption.yAxisShow,
                                        axisLine: {
                                            show: ctrl.panel.echartsOption.yAxisLineShow,
                                            lineStyle: {
                                                color: ctrl.panel.echartsOption.yAxisLineColor
                                            }
                                        },
                                        axisTick: {
                                            show: ctrl.panel.echartsOption.yAxisTickShow,
                                            alignWithLabel: ctrl.panel.echartsOption.yAxisTickAlign,
                                            lineStyle: {
                                                color: ctrl.panel.echartsOption.yAxisLineColor
                                            }
                                        },
                                        axisLabel: {
                                            textStyle: {
                                                color: ctrl.panel.echartsOption.xAxisLineColor
                                            }
                                        },
                                        splitLine: {
                                            show: ctrl.panel.echartsOption.ySplitLineShow,
                                            lineStyle: {
                                                color: ctrl.panel.echartsOption.yAxisLineColor
                                            }
                                        }
                                        // data: getLine()
                                    }],

                                    series: getSeries()
                                });

                                // let count = 0;
                                // callInterval(function () {
                                //     myChart.dispatchAction({
                                //         type: 'downplay',
                                //         seriesIndex: 0
                                //     });
                                //     myChart.dispatchAction({
                                //         type: 'highlight',
                                //         seriesIndex: 0,
                                //         dataIndex: (count++) % getSeries()[0].data.length
                                //     });
                                // }, 2000);
                            }
                        }

                        function getLine() {
                            return ctrl.data[0].columns;
                        }

                        function getLegend() {
                            var legend = [];

                            ctrl.panel.echartsOption.series.forEach(function (series) {
                                legend = _.uniq(legend.concat(series.name));
                            });

                            return legend;
                        }

                        function getSeries() {
                            var seriesArr = [];

                            if (_.isArray(ctrl.data)) {
                                // 遍历保存的series
                                ctrl.panel.echartsOption.series.forEach(function (series) {
                                    // 默认类型series
                                    // let newSeries = [];
                                    var defaultSeries = [{
                                        name: series.name,
                                        type: series.type,
                                        barWidth: series.barWidth,
                                        stack: series.stack,
                                        symbol: series.symbol,
                                        symbolSize: series.symbolSize,
                                        label: {
                                            normal: {
                                                show: series.labelShow,
                                                position: series.labelPosition,
                                                formatter: series.labelFormatter
                                            }
                                        },
                                        smooth: series.smooth,
                                        step: series.step,
                                        animation: series.animationShow,
                                        data: getDefaultSeriesData(series.name, ctrl.data)
                                    }];
                                    // // 匹配声明的饼图类型
                                    // pieTypeArr.forEach((type, tIndex) => {
                                    //     // 如果匹配到了
                                    //     if (series.pieType == type.name) {
                                    //         // 赋值给newSeries
                                    //         newSeries = pieTypeArr[tIndex].func(series, ctrl.data);
                                    //     }
                                    // });
                                    // 加入新series
                                    // seriesArr = seriesArr.concat(newSeries.length != 0 ? newSeries : defaultSeries);
                                    seriesArr = seriesArr.concat(defaultSeries);
                                });
                            }

                            return seriesArr;
                        }

                        //默认样式获取数据
                        function getDefaultSeriesData(seriesName, ctrlData) {
                            var newData = [];
                            // 匹配所有数据
                            if (_.isArray(ctrlData)) {
                                ctrlData.forEach(function (cData) {
                                    // 如果相等
                                    if (seriesName == cData.name) {
                                        // 复制到newData，遍历结束后newData便包含当前series的所有数据

                                        newData = angular.copy(cData.value);
                                        console.log(newData);
                                    }
                                });
                            }
                            return newData;
                        }

                        this.events.on('render', function () {
                            render();
                            ctrl.renderingCompleted();
                        });
                    }
                }]);

                return EchartsCtrl;
            }(MetricsPanelCtrl));

            _export('EchartsCtrl', EchartsCtrl);

            EchartsCtrl.templateUrl = 'module.html';
        }
    };
});
//# sourceMappingURL=echarts_ctrl.js.map
