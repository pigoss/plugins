'use strict';

System.register(['app/plugins/sdk', 'lodash', './libs/echarts.min', './libs/echarts-liquidfill.min', './libs/dark', './style.css!', './PieA', './PieB'], function (_export, _context) {
    "use strict";

    var MetricsPanelCtrl, _, echarts, pieA, pieB, _createClass, pieTypeArr, EchartsCtrl;

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
        }, function (_libsEchartsLiquidfillMin) {}, function (_libsDark) {}, function (_styleCss) {}, function (_PieA) {
            pieA = _PieA.pieA;
        }, function (_PieB) {
            pieB = _PieB.pieB;
        }],
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

            pieTypeArr = [{
                name: '并列',
                func: pieA
            }, {
                name: '环形',
                func: pieB
            }];

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
                            titleX: '65%',
                            titleY: '20%',
                            toolBoxShow: true,
                            legendShow: true,
                            legendOrient: 'vertical',
                            legendTop: '65%',
                            legendLeft: '65%',
                            legendItemHeight: 8,
                            legendItemWidth: 8,
                            series: []
                        },
                        USE: 'FAKE_DATA',

                        fakeData: '[{"target":"已用容量","datapoints":[["115",1499285716736]]},{"target":"剩余容量","datapoints":[["87",1499285716736]]}]',
                        url: '',
                        request: '',
                        updateInterval: 10000
                    };

                    var seriesDefaults = [{
                        name: '饼图1',
                        pieType: '环形',
                        roseType: false,
                        minRadius: '50%',
                        maxRadius: '70%',
                        centerX: '30%',
                        centerY: '50%',
                        data: ['已用容量', '剩余容量']
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
                                    name: data[i].target,
                                    value: data[i].datapoints[data[i].datapoints.length - 1][0]
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
                        this.addEditorTab('数据配置', 'public/plugins/dxc-pie-panel/editer-metric.html', 2);
                        this.addEditorTab('常规配置', 'public/plugins/dxc-pie-panel/editor-echarts.html', 3);
                        this.addEditorTab('饼图配置', 'public/plugins/dxc-pie-panel/editor-pie.html', 4);
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
                }, {
                    key: 'addData',
                    value: function addData(dataArr) {
                        dataArr.push(this.data[0].name);
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
                    value: function getData() {
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

                                var count = 0;
                                callInterval(function () {
                                    myChart.dispatchAction({
                                        type: 'downplay',
                                        seriesIndex: 0
                                    });
                                    myChart.dispatchAction({
                                        type: 'highlight',
                                        seriesIndex: 0,
                                        dataIndex: count++ % getSeries()[0].data.length
                                    });
                                }, 2000);
                            }
                        }

                        function getLegend() {
                            var legend = [];

                            ctrl.panel.echartsOption.series.forEach(function (series) {
                                legend = _.uniq(legend.concat(series.data));
                            });

                            return legend;
                        }

                        function getSeries() {
                            var seriesArr = [];

                            if (_.isArray(ctrl.data)) {
                                // 遍历保存的series
                                ctrl.panel.echartsOption.series.forEach(function (series) {
                                    //默认类型series
                                    var newSeries = [];
                                    var defaultSeries = [{
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
                                    pieTypeArr.forEach(function (type, tIndex) {
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
