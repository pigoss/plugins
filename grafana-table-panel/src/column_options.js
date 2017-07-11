import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment';
import angular from 'angular';

import kbn from 'app/core/utils/kbn';

export class ColumnOptionsCtrl {
  /** @ngInject */
  constructor($scope, $q, uiSegmentSrv) {
    $scope.editor = this;
    this.activeStyleIndex = 0;
    this.panelCtrl = $scope.ctrl;
    this.panel = this.panelCtrl.panel;
    this.unitFormats = kbn.getUnitFormats();
    this.colorModes = [
      {text: '无', value: null},
      {text: '单元格', value: 'cell'},
      {text: '内容', value: 'value'},
      {text: '行', value: 'row'},
      {text: '状态点', value: 'statePoint'}
    ];
    this.columnTypes = [
      {text: '百分百', value: 'percentage'},
      {text: '数字', value: 'number'},
      {text: '文字', value: 'string'},
      {text: '日期', value: 'date'},
      {text: '隐藏', value: 'hidden'}
    ];
    this.fontSizes = ['80%', '90%', '100%', '110%', '120%', '130%', '150%', '160%', '180%', '200%', '220%', '250%'];
    this.dateFormats = [
      {text: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss'},
      {text: 'MM/DD/YY h:mm:ss a', value: 'MM/DD/YY h:mm:ss a'},
      {text: 'MMMM D, YYYY LT',  value: 'MMMM D, YYYY LT'},
    ];

    this.getColumnNames = () => {
      if (!this.panelCtrl.table) {
        return [];
      }
      return _.map(this.panelCtrl.table.columns, function(col) {
        return col.text;
      });
    };
  }

  render() {
    this.panelCtrl.render();
  }

  setUnitFormat(column, subItem) {
    column.unit = subItem.value;
    this.panelCtrl.render();
  }

  addColumnStyle() {
    var newStyleRule = {
      unit: 'short',
      type: 'number',
      alias: '',
      decimals: 2,
      headerColor: "rgba(51, 181, 229, 1)",
      colors: ["rgba(245, 54, 54, 0.9)", "rgba(237, 129, 40, 0.89)", "rgba(50, 172, 45, 0.97)"],
      colorMode: null,
      pattern: '',
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      thresholds: [],
    };

    var styles = this.panel.styles;
    var stylesCount = styles.length;
    var indexToInsert = stylesCount;

    // check if last is a catch all rule, then add it before that one
    if (stylesCount > 0) {
      var last = styles[stylesCount-1];
      if (last.pattern === '/.*/') {
        indexToInsert = stylesCount-1;
      }
    }

    styles.splice(indexToInsert, 0, newStyleRule);
    this.activeStyleIndex = indexToInsert;
  }

  removeColumnStyle(style) {
    this.panel.styles = _.without(this.panel.styles, style);
  }

  invertColorOrder(index) {
    var ref = this.panel.styles[index].colors;
    var copy = ref[0];
    ref[0] = ref[2];
    ref[2] = copy;
    this.panelCtrl.render();
  }
}

/** @ngInject */
export function columnOptionsTab($q, uiSegmentSrv) {
  'use strict';
  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'public/plugins/grafana-table-panel/column_options.html',
    controller: ColumnOptionsCtrl,
  };
}
