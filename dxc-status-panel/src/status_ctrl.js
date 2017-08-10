import _ from 'lodash';
import { MetricsPanelCtrl } from 'app/plugins/sdk';
import './css/status-panel.css!';

const panelDefaults = {
  // IS_POINT: true,
  // url: '',
  // request: '',
  // updateInterval: 10000,
  bgColor: [
    'linear-gradient(to bottom right, #3abac7, #a375b6)',
    'linear-gradient(to bottom right, #fcd98d, #f3b65b)',
    'linear-gradient(to bottom right, #ffb88c, #e5658f)'
    // ],
    // statusColor: [
    //   "linear-gradient(to bottom right, #4acda5, #3f74c6)",
    //   "linear-gradient(to bottom right, #3abac7, #a375b6)",
    //   "linear-gradient(to bottom right, #ffb88c, #e5658f)"
  ],
  fakeData: "[{ 'name': '兖矿电邮', 'status': '1' }, { 'name': '人力资源', 'status': '2' }, { 'name': '兖矿OA', 'status': '0' }, { 'name': '全面预算系统', 'status': '0' }, { 'name': '内部市场化系统', 'status': '0' }, { 'name': '呼叫中心', 'status': '0' }, { 'name': '地测部GIS', 'status': '0' }, { 'name': '基建PMIS', 'status': '0' }, { 'name': '安监局安全信息联网', 'status': '0' }, { 'name': '实时数据联网', 'status': '1' }, { 'name': '审计系统', 'status': '2' }, { 'name': '总院PACS', 'status': '1' }, { 'name': '煤业资金', 'status': '0' }, { 'name': '煤化工能源管控', 'status': '0' }, { 'name': '物资商城', 'status': '0' }, { 'name': '环保节能系统', 'status': '1' }, { 'name': '短信平台', 'status': '2' }, { 'name': '矿井微震联网系统', 'status': '0' }, { 'name': '纪委网上举报', 'status': '1' }, { 'name': '综合调度管理信息系统', 'status': '0' }, { 'name': '综合运营', 'status': '0' }, { 'name': '考勤', 'status': '0' }, { 'name': '矿井微震联网系统', 'status': '0' }, { 'name': '计划生育', 'status': '0' },{ 'name': '集团风险管理', 'status': '0' }]",
  url: '',
  USE: 'FAKE_DATA',
  request: '',
  updateInterval: 10000
};

export class StatusCtrl extends MetricsPanelCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);

    _.defaultsDeep(this.panel, panelDefaults);

    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));

    // this.update();
    if (this.panel.USE === 'FAKE_DATA' && this.panel.fakeData) {
      let that = this;
      setTimeout(function () {
        that.onDataReceived(that.panel.fakeData);
      }, 500);
    } else {
      this.updateData();
    }
  }

  onDataError() {
    this.render();
  }
  onDataReceived(dataList) {
    this.dataList = this.panel.USE === 'URL' ? this.UrlData : dataList;

    if (this.panel.USE === 'FAKE_DATA' && this.panel.fakeData) {
      this.dataList = eval(this.panel.fakeData); // jshint ignore:line
    }
    this.data = this.dataList;
    this.render();
  }

  //post请求
  updateData() {
    let that = this, xmlhttp;

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

    this.$timeout(() => { this.updateData(); }, that.panel.updateInterval);
  }


  onInitEditMode() {
    this.addEditorTab('数据配置', 'public/plugins/dxc-status-panel/editer-metric.html', 2);
  }

  link(scope, elem, attrs, ctrl) {
    this.events.on('render', () => {
      // const $panelContainer = elem.find('.list-container');
    });
  }
}

StatusCtrl.templateUrl = 'module.html';
