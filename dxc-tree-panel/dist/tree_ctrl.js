'use strict';

System.register(['lodash', 'app/plugins/sdk'], function (_export, _context) {
    "use strict";

    var _, MetricsPanelCtrl, _createClass, panelDefaults, TreeCtrl;

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
        setters: [function (_lodash) {
            _ = _lodash.default;
        }, function (_appPluginsSdk) {
            MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
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

            panelDefaults = {
                fakedata: '',
                url: '',
                USE: 'FAKE_DATA',
                request: '',
                updateInterval: 10000
            };

            _export('TreeCtrl', TreeCtrl = function (_MetricsPanelCtrl) {
                _inherits(TreeCtrl, _MetricsPanelCtrl);

                function TreeCtrl($scope, $injector) {
                    _classCallCheck(this, TreeCtrl);

                    var _this = _possibleConstructorReturn(this, (TreeCtrl.__proto__ || Object.getPrototypeOf(TreeCtrl)).call(this, $scope, $injector));

                    _.defaultsDeep(_this.panel, panelDefaults);

                    _this.events.on('data-received', _this.onDataReceived.bind(_this));
                    _this.events.on('data-error', _this.onDataError.bind(_this));
                    _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));

                    // this.update();
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

                _createClass(TreeCtrl, [{
                    key: 'onDataError',
                    value: function onDataError() {
                        this.render();
                    }
                }, {
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
                        this.data = this.dataList;
                        this.render();
                    }
                }, {
                    key: 'onInitEditMode',
                    value: function onInitEditMode() {
                        this.addEditorTab('数据配置', 'public/plugins/dxc-tree-panel/editer-metric.html', 2);
                    }
                }, {
                    key: 'link',
                    value: function link(scope, elem, attrs, ctrl) {
                        this.events.on('render', function () {});
                    }
                }]);

                return TreeCtrl;
            }(MetricsPanelCtrl));

            _export('TreeCtrl', TreeCtrl);

            TreeCtrl.templateUrl = 'module.html';
        }
    };
});
//# sourceMappingURL=tree_ctrl.js.map
