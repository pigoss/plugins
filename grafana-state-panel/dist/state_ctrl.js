'use strict';

System.register(['lodash', 'app/plugins/sdk', './css/state-panel.css!'], function (_export, _context) {
  "use strict";

  var _, MetricsPanelCtrl, _createClass, panelDefaults, StateCtrl;

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
    }, function (_cssStatePanelCss) {}],
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
        // IS_POINT: true,
        // url: '',
        // request: '',
        // updateInterval: 10000,
        bgColor: ["linear-gradient(to bottom right, #3abac7, #a375b6)", "linear-gradient(to bottom right, #fcd98d, #f3b65b)", "linear-gradient(to bottom right, #ffb88c, #e5658f)"
        // ],
        // stateColor: [
        //   "linear-gradient(to bottom right, #4acda5, #3f74c6)",
        //   "linear-gradient(to bottom right, #3abac7, #a375b6)",
        //   "linear-gradient(to bottom right, #ffb88c, #e5658f)"
        ]
      };

      _export('StateCtrl', StateCtrl = function (_MetricsPanelCtrl) {
        _inherits(StateCtrl, _MetricsPanelCtrl);

        function StateCtrl($scope, $injector) {
          _classCallCheck(this, StateCtrl);

          var _this = _possibleConstructorReturn(this, (StateCtrl.__proto__ || Object.getPrototypeOf(StateCtrl)).call(this, $scope, $injector));

          _.defaultsDeep(_this.panel, panelDefaults);

          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('data-error', _this.onDataError.bind(_this));
          _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));

          // this.update();
          return _this;
        }

        _createClass(StateCtrl, [{
          key: 'onDataError',
          value: function onDataError(err) {
            this.dataList = data[0].dataList;
            this.transform(this.dataList);
            this.render();
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(data) {
            if (data[0]) {
              if (data[0].dataList) {
                this.dataList = data[0].dataList;
              } else {
                this.dataList = [{ "name": "网上银行", "state": "1" }, { "name": "ITSM运维", "state": "2" }, { "name": "财务管理", "state": "0" }, { "name": "核心业务", "state": "1" }, { "name": "柜面业务", "state": "2" }, { "name": "二代支付", "state": "2" }, { "name": "贷记卡", "state": "0" }, { "name": "支付宝卡通", "state": "0" }, { "name": "黄金交易", "state": "0" }, { "name": "国际结算", "state": "0" }, { "name": "跨境收付", "state": "0" }, { "name": "电子汇票", "state": "0" }];
              }
            } else {
              this.dataList = [{ "name": "网上银行", "state": "1" }, { "name": "ITSM运维", "state": "2" }, { "name": "财务管理", "state": "0" }, { "name": "核心业务", "state": "1" }, { "name": "柜面业务", "state": "2" }, { "name": "二代支付", "state": "2" }, { "name": "贷记卡", "state": "0" }, { "name": "支付宝卡通", "state": "0" }, { "name": "黄金交易", "state": "0" }, { "name": "国际结算", "state": "0" }, { "name": "跨境收付", "state": "0" }, { "name": "电子汇票", "state": "0" }];
            }
            this.transform(this.dataList);
            this.render();
          }
        }, {
          key: 'transform',
          value: function transform(dataList) {
            var that = this;
            dataList.map(function (item) {
              item.bgColor = that.panel.bgColor[item.state % 3];
              // item.stateColor = that.panel.stateColor[item.state%3];
            });
          }
        }, {
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            // this.addEditorTab('Options', 'public/plugins/grafana-state-panel/editor.html', 2);
          }
        }, {
          key: 'link',
          value: function link(scope, elem, attrs, ctrl) {
            this.events.on('render', function () {
              // const $panelContainer = elem.find('.list-container');
            });
          }
        }]);

        return StateCtrl;
      }(MetricsPanelCtrl));

      _export('StateCtrl', StateCtrl);

      StateCtrl.templateUrl = 'module.html';
    }
  };
});
//# sourceMappingURL=state_ctrl.js.map
