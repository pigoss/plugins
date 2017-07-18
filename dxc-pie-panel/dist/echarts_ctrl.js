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

                    _.defaultsDeep(_this.panel, panelDefaults);

                    _this.events.on('data-received', _this.onDataReceived.bind(_this));
                    _this.events.on('data-error', _this.onDataError.bind(_this));
                    _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    _this.events.on('panel-initialized', _this.render.bind(_this));

                    if (_this.panel.USE_URL && _this.panel.USE_FAKE_DATA && _this.panel.fakeData) {
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

                        if (that.panel.USE_URL && !that.panel.USE_FAKE_DATA && that.panel.url && that.panel.request) {
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
                        this.data = this.panel.USE_URL ? this.UrlData : dataList;

                        if (this.panel.USE_URL && this.panel.USE_FAKE_DATA && this.panel.fakeData) {
                            this.data = eval(this.panel.fakeData); // jshint ignore:line
                        }

                        this.data = this.translateData(this.data);
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
                        if (data.length) {
                            var dataArr = [];
                            for (var i = 0; i < data.length; i++) {
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
                }, {
                    key: 'onDataError',
                    value: function onDataError(err) {
                        this.render();
                    }
                }, {
                    key: 'onInitEditMode',
                    value: function onInitEditMode() {
                        this.subTabIndex = 0;
                        this.addEditorTab('数据', 'public/plugins/dxc-pie-panel/editer-metric.html', 2);
                        this.addEditorTab('Echarts配置', 'public/plugins/dxc-pie-panel/editor-echarts.html', 3);
                    }
                }, {
                    key: 'changeColor',
                    value: function changeColor(colorIndex, color) {
                        this.panel.echartsOption.colorArr[colorIndex] = color;
                        this.onRender();
                    }
                }, {
                    key: 'removeColor',
                    value: function removeColor(colorIndex) {
                        this.panel.echartsOption.colorArr.splice(colorIndex, 1);
                        this.onRender();
                    }
                }, {
                    key: 'addColor',
                    value: function addColor() {
                        this.panel.echartsOption.colorArr.push('rgba(255, 255, 255, 1)');
                        this.onRender();
                    }
                }, {
                    key: 'link',
                    value: function link(scope, elem, attrs, ctrl) {
                        var $panelContainer = elem.find('.echarts_container')[0];

                        ctrl.IS_DATA_CHANGED = true;

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
                                var legend = [];
                                for (var i = 0; i < ctrl.data.length; i++) {
                                    legend.push(ctrl.data[i].name);
                                }
                                return legend;
                            }
                        }

                        function getSeries() {
                            var seriesArr = [];

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
                                    for (var i = 0; i < Math.floor(ctrl.data.length / 2); i++) {
                                        seriesArr.push({
                                            name: ctrl.panel.echartsOption.title,
                                            type: 'pie',
                                            clockWise: false,
                                            hoverAnimation: false,
                                            radius: getRadius(i, ctrl.panel.echartsOption.minRadius, ctrl.panel.echartsOption.maxRadius),
                                            center: [ctrl.panel.echartsOption.centerX, ctrl.panel.echartsOption.centerY],
                                            data: [ctrl.data[2 * i], {
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
                                            }],
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
                            var reg = /%+/;
                            var unit = reg.test(min) && reg.test(max) ? '%' : 0;
                            var interval = (parseFloat(max) - parseFloat(min)) / ctrl.data.length;
                            return [interval * index + parseFloat(min) + unit, interval * (index + 1) + parseFloat(min) + unit];
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
