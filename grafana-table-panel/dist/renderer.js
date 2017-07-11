'use strict';

System.register(['lodash', 'moment', 'app/core/utils/kbn'], function (_export, _context) {
  "use strict";

  var _, moment, kbn, _createClass, TableRenderer;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_moment) {
      moment = _moment.default;
    }, function (_appCoreUtilsKbn) {
      kbn = _appCoreUtilsKbn.default;
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

      _export('TableRenderer', TableRenderer = function () {
        function TableRenderer(panel, table, isUtc, sanitize) {
          _classCallCheck(this, TableRenderer);

          this.panel = panel;
          this.table = table;
          this.isUtc = isUtc;
          this.sanitize = sanitize;

          this.initColumns();
        }

        _createClass(TableRenderer, [{
          key: 'setTable',
          value: function setTable(table) {
            this.table = table;

            this.initColumns();
          }
        }, {
          key: 'initColumns',
          value: function initColumns() {
            this.formatters = [];
            this.colorState = {};

            for (var colIndex = 0; colIndex < this.table.columns.length; colIndex++) {
              var column = this.table.columns[colIndex];
              column.title = column.text;

              for (var i = 0; i < this.panel.styles.length; i++) {
                var style = this.panel.styles[i];

                var regex = kbn.stringToJsRegex(style.pattern);
                if (column.text.match(regex)) {
                  column.style = style;

                  if (style.alias) {
                    column.title = column.text.replace(regex, style.alias);
                  }

                  break;
                }
              }

              this.formatters[colIndex] = this.createColumnFormatter(column);
            }
          }
        }, {
          key: 'getColorForValue',
          value: function getColorForValue(value, style) {
            if (!style.thresholds) {
              return null;
            }

            for (var i = style.thresholds.length; i > 0; i--) {
              if (value >= style.thresholds[i - 1]) {
                return style.colors[i];
              }
            }
            return _.first(style.colors);
          }
        }, {
          key: 'defaultCellFormatter',
          value: function defaultCellFormatter(v, style) {
            if (v === null || v === void 0 || v === undefined) {
              return '';
            }

            if (_.isArray(v)) {
              v = v.join(', ');
            }

            if (style && style.sanitize) {
              return this.sanitize(v);
            } else {
              return _.escape(v);
            }
          }
        }, {
          key: 'createColumnFormatter',
          value: function createColumnFormatter(column) {
            var _this = this;

            if (!column.style) {
              return this.defaultCellFormatter;
            }

            if (column.style.type === 'hidden') {
              return function (v) {
                return undefined;
              };
            }

            if (column.style.type === 'date') {
              return function (v) {
                if (v === undefined || v === null) {
                  return '-';
                }

                if (_.isArray(v)) {
                  v = v[0];
                }
                var date = moment(v);
                if (_this.isUtc) {
                  date = date.utc();
                }
                return date.format(column.style.dateFormat);
              };
            }

            if (column.style.type === 'number') {
              var valueFormatter = kbn.valueFormats[column.unit || column.style.unit];

              return function (v) {
                if (v === null || v === void 0) {
                  return '-';
                }

                if (_.isString(v)) {
                  return _this.defaultCellFormatter(v, column.style);
                }

                if (column.style.colorMode) {
                  _this.colorState[column.style.colorMode] = _this.getColorForValue(v, column.style);
                }

                return valueFormatter(v, column.style.decimals, null);
              };
            }

            if (column.style.type === 'percentage') {
              //　过滤
              var percentageReg = /%/;
              var reg = /(\d+(\.\d+)?\%)([^\.\%]*[^\d\.\%])?/g;
              return function (v) {
                if (v === null || v === void 0 || v === undefined) {
                  return '';
                }
                if (_.isArray(v)) {
                  v = v.join('<br>');
                }
                if (percentageReg.test(v)) {
                  var str = '';
                  var REG = [];
                  var regLength = v.match(reg).length;
                  for (var i = 0; i < regLength; i++) {
                    REG = reg.exec(v);
                    str += '<div class="table-panel-percentage"><span class="table-panel-bar"><span style="width:' + REG[1] + '"></span></span>' + REG[1];
                    str += REG[3] ? ' ' + REG[3] : '';
                    str += "</div>";
                  }
                  return str;
                } else {
                  return _this.defaultCellFormatter(v, column.style);
                }
              };
            }

            return function (value) {
              return _this.defaultCellFormatter(value, column.style);
            };
          }
        }, {
          key: 'formatColumnValue',
          value: function formatColumnValue(colIndex, value) {
            return this.formatters[colIndex] ? this.formatters[colIndex](value) : value;
          }
        }, {
          key: 'renderCell',
          value: function renderCell(columnIndex, value) {
            var addWidthHack = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            value = this.formatColumnValue(columnIndex, value);
            var style = '',
                point = '';
            if (this.colorState.cell) {
              style = ' style="background-color:' + this.colorState.cell + ';color: white"';
              this.colorState.cell = null;
            } else if (this.colorState.value) {
              style = ' style="color:' + this.colorState.value + '"';
              this.colorState.value = null;
            } else if (this.colorState.statePoint) {
              point = '<span class="state-point" style="background:' + this.colorState.statePoint + '"></span>';
              this.colorState.statePoint = null;
            }

            // because of the fixed table headers css only solution
            // there is an issue if header cell is wider the cell
            // this hack adds header content to cell (not visible)
            var widthHack = '';
            if (addWidthHack) {
              widthHack = '<div class="table-panel-width-hack">' + this.table.columns[columnIndex].title + '</div>';
            }

            if (value === undefined) {
              style = ' style="display:none;"';
              this.table.columns[columnIndex].hidden = true;
            } else {
              this.table.columns[columnIndex].hidden = false;
            }

            return '<td' + style + '>' + point + value + widthHack + '</td>';
          }
        }, {
          key: 'render',
          value: function render(page) {
            var pageSize = this.panel.pageSize || 100;
            var startPos = page * pageSize;
            var endPos = Math.min(startPos + pageSize, this.table.rows.length);
            var html = "";

            for (var y = startPos; y < endPos; y++) {
              var row = this.table.rows[y];
              var cellHtml = '';
              var rowStyle = '';
              for (var i = 0; i < this.table.columns.length; i++) {
                cellHtml += this.renderCell(i, row[i], y === startPos);
              }

              if (this.colorState.row) {
                rowStyle = ' style="background-color:' + this.colorState.row + ';color: white"';
                this.colorState.row = null;
              }

              html += '<tr ' + rowStyle + '>' + cellHtml + '</tr>';
            }

            return html;
          }
        }, {
          key: 'render_values',
          value: function render_values() {
            var rows = [];

            for (var y = 0; y < this.table.rows.length; y++) {
              var row = this.table.rows[y];
              var new_row = [];
              for (var i = 0; i < this.table.columns.length; i++) {
                new_row.push(this.formatColumnValue(i, row[i]));
              }
              rows.push(new_row);
            }
            return {
              columns: this.table.columns,
              rows: rows
            };
          }
        }]);

        return TableRenderer;
      }());

      _export('TableRenderer', TableRenderer);
    }
  };
});
//# sourceMappingURL=renderer.js.map
