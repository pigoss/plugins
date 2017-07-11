'use strict';

System.register(['lodash', 'moment', 'app/core/utils/flatten', 'app/core/time_series2', 'app/core/table_model', 'angular'], function (_export, _context) {
  "use strict";

  var _, moment, flatten, TimeSeries, TableModel, angular, transformers;

  function transformDataToTable(data, panel) {
    var model = new TableModel();

    if (!data || data.length === 0) {
      return model;
    }

    var transformer = transformers[panel.transform];
    if (!transformer) {
      throw { message: 'Transformer ' + panel.transform + ' not found' };
    }

    transformer.transform(data, panel, model);
    return model;
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_moment) {
      moment = _moment.default;
    }, function (_appCoreUtilsFlatten) {
      flatten = _appCoreUtilsFlatten.default;
    }, function (_appCoreTime_series) {
      TimeSeries = _appCoreTime_series.default;
    }, function (_appCoreTable_model) {
      TableModel = _appCoreTable_model.default;
    }, function (_angular) {
      angular = _angular.default;
    }],
    execute: function () {
      _export('transformers', transformers = {});

      transformers['timeseries_to_rows'] = {
        description: 'Time series to rows',
        getColumns: function getColumns() {
          return [];
        },
        transform: function transform(data, panel, model) {
          model.columns = [{ text: 'Time', type: 'date' }, { text: 'Metric' }, { text: 'Value' }];

          for (var i = 0; i < data.length; i++) {
            var series = data[i];
            for (var y = 0; y < series.datapoints.length; y++) {
              var dp = series.datapoints[y];
              model.rows.push([dp[1], series.target, dp[0]]);
            }
          }
        }
      };

      transformers['timeseries_to_columns'] = {
        description: 'Time series to columns',
        getColumns: function getColumns() {
          return [];
        },
        transform: function transform(data, panel, model) {
          model.columns.push({ text: 'Time', type: 'date' });

          // group by time
          var points = {};

          for (var i = 0; i < data.length; i++) {
            var series = data[i];
            model.columns.push({ text: series.target });

            for (var y = 0; y < series.datapoints.length; y++) {
              var dp = series.datapoints[y];
              var timeKey = dp[1].toString();

              if (!points[timeKey]) {
                points[timeKey] = { time: dp[1] };
                points[timeKey][i] = dp[0];
              } else {
                points[timeKey][i] = dp[0];
              }
            }
          }

          for (var time in points) {
            var point = points[time];
            var values = [point.time];

            for (var _i = 0; _i < data.length; _i++) {
              var value = point[_i];
              values.push(value);
            }

            model.rows.push(values);
          }
        }
      };

      transformers['timeseries_aggregations'] = {
        description: 'Time series aggregations',
        getColumns: function getColumns() {
          return [{ text: 'Avg', value: 'avg' }, { text: 'Min', value: 'min' }, { text: 'Max', value: 'max' }, { text: 'Total', value: 'total' }, { text: 'Current', value: 'current' }, { text: 'Count', value: 'count' }];
        },
        transform: function transform(data, panel, model) {
          var i, y;
          model.columns.push({ text: 'Metric' });

          for (i = 0; i < panel.columns.length; i++) {
            model.columns.push({ text: panel.columns[i].text });
          }

          for (i = 0; i < data.length; i++) {
            var series = new TimeSeries({
              datapoints: data[i].datapoints,
              alias: data[i].target
            });

            series.getFlotPairs('connected');
            var cells = [series.alias];

            for (y = 0; y < panel.columns.length; y++) {
              cells.push(series.stats[panel.columns[y].value]);
            }

            model.rows.push(cells);
          }
        }
      };

      transformers['annotations'] = {
        description: 'Annotations',
        getColumns: function getColumns() {
          return [];
        },
        transform: function transform(data, panel, model) {
          model.columns.push({ text: 'Time', type: 'date' });
          model.columns.push({ text: 'Title' });
          model.columns.push({ text: 'Text' });
          model.columns.push({ text: 'Tags' });

          if (!data || !data.annotations || data.annotations.length === 0) {
            return;
          }

          for (var i = 0; i < data.annotations.length; i++) {
            var evt = data.annotations[i];
            model.rows.push([evt.min, evt.title, evt.text, evt.tags]);
          }
        }
      };

      transformers['table'] = {
        description: 'Table',
        getColumns: function getColumns(data) {
          if (!data || data.length === 0) {
            return [];
          }
        },
        transform: function transform(data, panel, model) {
          if (!data || data.length === 0) {
            return;
          }

          if (data[0].type !== 'table') {
            throw { message: 'Query result is not in table format, try using another transform.' };
          }

          model.columns = data[0].columns;
          model.rows = data[0].rows;
        }
      };

      transformers['json'] = {
        description: 'JSON Data',
        getColumns: function getColumns(data) {
          if (!data || data.length === 0) {
            return [];
          }

          var names = {};
          for (var i = 0; i < data.length; i++) {
            var series = data[i];
            if (series.type !== 'docs') {
              continue;
            }

            // only look at 100 docs
            var maxDocs = Math.min(series.datapoints.length, 100);
            for (var y = 0; y < maxDocs; y++) {
              var doc = series.datapoints[y];
              var flattened = flatten(doc, null);
              for (var propName in flattened) {
                names[propName] = true;
              }
            }
          }

          return _.map(names, function (value, key) {
            return { text: key, value: key };
          });
        },
        transform: function transform(data, panel, model) {
          var i, y, z;
          for (i = 0; i < panel.columns.length; i++) {
            model.columns.push({ text: panel.columns[i].text });
          }

          if (model.columns.length === 0) {
            model.columns.push({ text: 'JSON' });
          }

          for (i = 0; i < data.length; i++) {
            var series = data[i];

            for (y = 0; y < series.datapoints.length; y++) {
              var dp = series.datapoints[y];
              var values = [];

              if (_.isObject(dp) && panel.columns.length > 0) {
                var flattened = flatten(dp, null);
                for (z = 0; z < panel.columns.length; z++) {
                  values.push(flattened[panel.columns[z].value]);
                }
              } else {
                values.push(JSON.stringify(dp));
              }

              model.rows.push(values);
            }
          }
        }
      };
      _export('transformers', transformers);

      _export('transformDataToTable', transformDataToTable);
    }
  };
});
//# sourceMappingURL=transformers.js.map