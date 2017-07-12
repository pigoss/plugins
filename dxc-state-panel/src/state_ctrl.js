import _ from 'lodash';
import { MetricsPanelCtrl } from 'app/plugins/sdk';
import './css/state-panel.css!';

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
    // stateColor: [
    //   "linear-gradient(to bottom right, #4acda5, #3f74c6)",
    //   "linear-gradient(to bottom right, #3abac7, #a375b6)",
    //   "linear-gradient(to bottom right, #ffb88c, #e5658f)"
  ],
 };

export class StateCtrl extends MetricsPanelCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);

    _.defaultsDeep(this.panel, panelDefaults);

    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));

    // this.update();
  }

  onDataError() {
    this.render();
  }

  onDataReceived(data) {
    var datajson = [{ 'name': '兖矿电邮', 'state': '1' },{ 'name': '人力资源', 'state': '2' },{ 'name': '兖矿OA', 'state': '0' },{ 'name': '全面预算系统', 'state': '0' },{ 'name': '内部市场化系统', 'state': '0' },{ 'name': '呼叫中心', 'state': '0' },{ 'name': '地测部GIS', 'state': '0' },{ 'name': '基建PMIS', 'state': '0' },{ 'name': '安监局安全信息联网', 'state': '0' },{ 'name': '实时数据联网', 'state': '1' },{ 'name': '审计系统', 'state': '2' },{ 'name': '总院PACS', 'state': '1' },{ 'name': '煤业资金', 'state': '0' },{ 'name': '煤化工能源管控', 'state': '0' },{ 'name': '物资商城', 'state': '0' },{ 'name': '环保节能系统', 'state': '1' },{ 'name': '短信平台', 'state': '2' },{ 'name': '矿井微震联网系统', 'state': '0' },{ 'name': '纪委网上举报', 'state': '1' },{ 'name': '综合调度管理信息系统', 'state': '0' },{ 'name': '综合运营', 'state': '0' },{ 'name': '考勤', 'state': '0' },{ 'name': '矿井微震联网系统', 'state': '0' },{ 'name': '计划生育', 'state': '0' },{ 'name': '集团风险管理', 'state': '0' }];

    if (data[0]) {
      if (data[0].dataList) {
        this.dataList = data[0].dataList;
      } else {
        this.dataList =datajson  }
    } else {
      this.dataList = datajson    }
    // this.transform(this.dataList);
    this.render();
  }

  // transform(dataList) {
  //   const that = this;
  //   dataList.map(item => {
  //     item.bgColor = that.panel.bgColor[item.state % 3];
  //     // item.stateColor = that.panel.stateColor[item.state%3];
  //   });
  // }

  // post请求
  // update() {
  //   let that = this, xmlhttp;

  //   if (window.XMLHttpRequest) {
  //     xmlhttp = new XMLHttpRequest();
  //   } else {
  //     xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  //   }

  //   xmlhttp.onreadystatechange = function () {
  //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
  //       that.dataList = JSON.parse(xmlhttp.responseText).dataList;
  //       that.render();
  //     } 
  //   }

  //   if (that.panel.url && that.panel.request) {
  //     xmlhttp.open("POST", that.panel.url, true);
  //     xmlhttp.send(that.panel.request);
  //   }

  //   this.$timeout(() => { this.update(); }, that.panel.updateInterval);
  // }

  onInitEditMode() {
    // this.addEditorTab('Options', 'public/plugins/grafana-state-panel/editor.html', 2);
  }

  link(scope, elem, attrs, ctrl) {
    this.events.on('render', () => {
      // const $panelContainer = elem.find('.list-container');
    });
  }
}

StateCtrl.templateUrl = 'module.html';
