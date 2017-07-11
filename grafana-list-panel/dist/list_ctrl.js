'use strict';

System.register(['app/plugins/sdk', 'lodash', './css/list-panel.css!'], function (_export, _context) {
  "use strict";

  var PanelCtrl, _, _createClass, panelDefaults, ListCtrl;

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
      PanelCtrl = _appPluginsSdk.PanelCtrl;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_cssListPanelCss) {}],
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
        IS_ROW: true,
        cards: []
      };

      _export('ListCtrl', ListCtrl = function (_PanelCtrl) {
        _inherits(ListCtrl, _PanelCtrl);

        function ListCtrl($scope, $injector) {
          _classCallCheck(this, ListCtrl);

          var _this = _possibleConstructorReturn(this, (ListCtrl.__proto__ || Object.getPrototypeOf(ListCtrl)).call(this, $scope, $injector));

          _.defaultsDeep(_this.panel, panelDefaults);

          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
          _this.events.on('panel-teardown', _this.onPanelTeardown.bind(_this));
          _this.events.on('panel-initialized', _this.render.bind(_this));

          return _this;
        }

        _createClass(ListCtrl, [{
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.addEditorTab('Options', 'public/plugins/grafana-list-panel/editor.html', 2);
          }
        }, {
          key: 'onPanelTeardown',
          value: function onPanelTeardown() {
            this.$timeout.cancel(this.nextTickPromise);
          }
        }, {
          key: 'addCard',
          value: function addCard() {
            this.panel.cards.push({
              color: 'rgb(20,70,181)',
              title: 'Card',
              items: [{
                value: '',
                info: ''
              }]
            });
          }
        }, {
          key: 'removeCard',
          value: function removeCard(card) {
            this.panel.cards = _.without(this.panel.cards, card);
          }
        }, {
          key: 'addItem',
          value: function addItem(index) {
            this.panel.cards[index].items.push({ value: '', info: '' });
          }
        }, {
          key: 'removeItem',
          value: function removeItem(index, item) {
            this.panel.cards[index].items = _.without(this.panel.cards[index].items, item);
          }
        }, {
          key: 'link',
          value: function link(scope, elem) {
            this.events.on('render', function () {
              var $panelContainer = elem.find('.list-container');
              // this.panel.IS_ROW=this.panel.span>3.5?true:false;
            });
          }
        }]);

        return ListCtrl;
      }(PanelCtrl));

      _export('ListCtrl', ListCtrl);

      ListCtrl.templateUrl = 'module.html';
    }
  };
});
//# sourceMappingURL=list_ctrl.js.map
