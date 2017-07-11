import _ from 'lodash';
import { MetricsPanelCtrl } from 'app/plugins/sdk';
import './css/state-panel.css!';

const panelDefaults = {
  // IS_POINT: true,
  // url: '',
  // request: '',
  // updateInterval: 10000,
  bgColor: [
    "linear-gradient(to bottom right, #3abac7, #a375b6)",
    "linear-gradient(to bottom right, #fcd98d, #f3b65b)",
    "linear-gradient(to bottom right, #ffb88c, #e5658f)"
  // ],
  // stateColor: [
  //   "linear-gradient(to bottom right, #4acda5, #3f74c6)",
  //   "linear-gradient(to bottom right, #3abac7, #a375b6)",
  //   "linear-gradient(to bottom right, #ffb88c, #e5658f)"
  ]
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

  onDataError(err) {
    this.dataList = data[0].dataList;
    this.transform(this.dataList);
    this.render();
  }

  onDataReceived(data) {
    if(data[0]) {
      if(data[0].dataList){
        this.dataList = data[0].dataList;
      } else {
        this.dataList = [{"name":"网上银行","state":"1"},{"name":"ITSM运维","state":"2"},{"name":"财务管理","state":"0"},{"name":"核心业务","state":"1"},{"name":"柜面业务","state":"2"},{"name":"二代支付","state":"2"},{"name":"贷记卡","state":"0"},{"name":"支付宝卡通","state":"0"},{"name":"黄金交易","state":"0"},{"name":"国际结算","state":"0"},{"name":"跨境收付","state":"0"},{"name":"电子汇票","state":"0"}];
      }
    } else {
      this.dataList = [{"name":"网上银行","state":"1"},{"name":"ITSM运维","state":"2"},{"name":"财务管理","state":"0"},{"name":"核心业务","state":"1"},{"name":"柜面业务","state":"2"},{"name":"二代支付","state":"2"},{"name":"贷记卡","state":"0"},{"name":"支付宝卡通","state":"0"},{"name":"黄金交易","state":"0"},{"name":"国际结算","state":"0"},{"name":"跨境收付","state":"0"},{"name":"电子汇票","state":"0"}];
    }
    this.transform(this.dataList);
    this.render();
  }

  transform(dataList) {
    let that = this;
    dataList.map(function(item){
      item.bgColor = that.panel.bgColor[item.state%3];
      // item.stateColor = that.panel.stateColor[item.state%3];
    })
  }

  //post请求
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
