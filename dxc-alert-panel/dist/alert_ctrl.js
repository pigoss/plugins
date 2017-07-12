'use strict';

System.register(['lodash', 'app/plugins/sdk', './css/alert-panel.css!'], function (_export, _context) {
  "use strict";

  var _, MetricsPanelCtrl, _createClass, AlertCtrl;

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
    }, function (_cssAlertPanelCss) {}],
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

      _export('AlertCtrl', AlertCtrl = function (_MetricsPanelCtrl) {
        _inherits(AlertCtrl, _MetricsPanelCtrl);

        function AlertCtrl($scope, $injector) {
          _classCallCheck(this, AlertCtrl);

          var _this = _possibleConstructorReturn(this, (AlertCtrl.__proto__ || Object.getPrototypeOf(AlertCtrl)).call(this, $scope, $injector));

          var panelDefaults = {
            USE_FAKE_DATA: true,
            USE_URL: false,
            url: '',
            request: '',
            updateInterval: 10000
          };

          _.defaultsDeep(_this.panel, panelDefaults);

          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('data-error', _this.onDataError.bind(_this));
          _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));

          _this.bgColor = [
          // "linear-gradient(to bottom right, #3abac7, #a375b6)",
          // "linear-gradient(to bottom right, #fcd98d, #f3b65b)",
          // "linear-gradient(to bottom right, #ffb88c, #e5658f)",
          // "linear-gradient(to bottom right, #4acda5, #3f74c6)",
          '#EA4A2D', '#2D94D7', '#fdb225'];

          _this.updateData();
          return _this;
        }

        //post请求


        _createClass(AlertCtrl, [{
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

            xmlhttp.onreadystatuschange = function () {
              if (xmlhttp.readyStatue == 4 && xmlhttp.status == 200) {
                that.UrlData = JSON.parse(xmlhttp.responseText);
                that.onDataReceived();
              }
            };

            if (that.panel.USE_URL && that.panel.url && that.panel.request) {
              xmlhttp.open("POST", that.panel.url, true);
              xmlhttp.send(that.panel.request);
            }

            this.$timeout(function () {
              _this2.updateData();
            }, that.panel.updateInterval);
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(data) {
            this.dataList = this.panel.USE_URL ? this.UrlData : data;
            if (this.panel.USE_FAKE_DATA) {
              this.dataList = [{
                time: '2017-05-06 12:39',
                statue: '0',
                info: [{
                  name: '告警信息',
                  value: 'daidjaoesiadasdfdsafgsdfsdafdsfa'
                }, {
                  name: '告警源',
                  value: '192.168.24.223'
                }]
              }, {
                time: '2017-05-06 12:45',
                statue: '1',
                info: [{
                  name: '告警信息',
                  value: 'daidjaossfasfasdfafsafasfsafsafsafs'
                }, {
                  name: '告警源',
                  value: '192.168.24.223'
                }]
              }, {
                time: '2017-05-06 12:48',
                statue: '2',
                info: [{
                  name: '告警信息',
                  value: 'daidjaosfasdfasfasfsafsdfsafasfsafassi'
                }, {
                  name: '告警源',
                  value: '192.168.24.223'
                }]
              }];
            }
            this.transform();
            this.render();
          }
        }, {
          key: 'transform',
          value: function transform() {
            var that = this;
            that.dataList.map(function (item) {
              item.bgColor = that.bgColor[item.statue % 3];
            });
          }
        }, {
          key: 'onDataError',
          value: function onDataError(err) {
            this.render();
          }
        }, {
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.addEditorTab('设置', 'public/plugins/dxc-alert-panel/editor.html', 2);
          }
        }, {
          key: 'link',
          value: function link(scope, elem, attrs, ctrl) {
            // const $panelContainer = elem.find('.list-container');

            function render() {}

            this.events.on('render', function () {
              render();
              ctrl.renderingCompleted();
            });
          }
        }]);

        return AlertCtrl;
      }(MetricsPanelCtrl));

      _export('AlertCtrl', AlertCtrl);

      AlertCtrl.templateUrl = 'module.html';
    }
  };
});
//# sourceMappingURL=alert_ctrl.js.map
