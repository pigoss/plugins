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
        bgColor: ['linear-gradient(to bottom right, #3abac7, #a375b6)', 'linear-gradient(to bottom right, #fcd98d, #f3b65b)', 'linear-gradient(to bottom right, #ffb88c, #e5658f)'

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
          value: function onDataError() {
            this.render();
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(data) {
            var datajson = [{ 'name': '兖矿电邮', 'state': '1' }, { 'name': '人力资源', 'state': '2' }, { 'name': '兖矿OA', 'state': '0' }, { 'name': '全面预算系统', 'state': '0' }, { 'name': '内部市场化系统', 'state': '0' }, { 'name': '呼叫中心', 'state': '0' }, { 'name': '地测部GIS', 'state': '0' }, { 'name': '基建PMIS', 'state': '0' }, { 'name': '安监局安全信息联网', 'state': '0' }, { 'name': '实时数据联网', 'state': '1' }, { 'name': '审计系统', 'state': '2' }, { 'name': '总院PACS', 'state': '1' }, { 'name': '煤业资金', 'state': '0' }, { 'name': '煤化工能源管控', 'state': '0' }, { 'name': '物资商城', 'state': '0' }, { 'name': '环保节能系统', 'state': '1' }, { 'name': '短信平台', 'state': '2' }, { 'name': '矿井微震联网系统', 'state': '0' }, { 'name': '纪委网上举报', 'state': '1' }, { 'name': '综合调度管理信息系统', 'state': '0' }, { 'name': '综合运营', 'state': '0' }, { 'name': '考勤', 'state': '0' }, { 'name': '矿井微震联网系统', 'state': '0' }, { 'name': '计划生育', 'state': '0' }, { 'name': '集团风险管理', 'state': '0' }];

            if (data[0]) {
              if (data[0].dataList) {
                this.dataList = data[0].dataList;
              } else {
                this.dataList = datajson;
              }
            } else {
              this.dataList = datajson;
            }
            // this.transform(this.dataList);
            this.render();
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
