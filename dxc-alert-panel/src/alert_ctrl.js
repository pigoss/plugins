import _ from 'lodash';
import { MetricsPanelCtrl } from 'app/plugins/sdk';
import './css/alert-panel.css!';

export class AlertCtrl extends MetricsPanelCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);

    const panelDefaults = {
      USE_FAKE_DATA: true,
      USE_URL: false,
      url: '',
      request: '',
      updateInterval: 10000
    };

    _.defaultsDeep(this.panel, panelDefaults);

    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));

    this.bgColor = [
      // "linear-gradient(to bottom right, #3abac7, #a375b6)",
      // "linear-gradient(to bottom right, #fcd98d, #f3b65b)",
      // "linear-gradient(to bottom right, #ffb88c, #e5658f)",
      // "linear-gradient(to bottom right, #4acda5, #3f74c6)",
      '#EA4A2D',
      '#2D94D7',
      '#fdb225'
    ];

    this.updateData();
  }

  //post请求
  updateData() {
    let that = this, xmlhttp;

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

    this.$timeout(() => { this.updateData(); }, that.panel.updateInterval);
  }

  onDataReceived(data) {
    this.dataList = this.panel.USE_URL ? this.UrlData : data;
    if(this.panel.USE_FAKE_DATA) { 
      this.dataList = [
        {
          time: '2017-05-06 12:39',
          statue: '0',
          info: [
            {
              name: '告警信息',
              value: 'daidjaoesiadasdfdsafgsdfsdafdsfa'
            },
            {
              name: '告警源',
              value: '192.168.24.223'
            }
          ]
        },
        {
          time: '2017-05-06 12:45',
          statue: '1',
          info: [
            {
              name: '告警信息',
              value: 'daidjaossfasfasdfafsafasfsafsafsafs'
            },
            {
              name: '告警源',
              value: '192.168.24.223'
            }
          ]
        },
        {
          time: '2017-05-06 12:48',
          statue: '2',
          info: [
            {
              name: '告警信息',
              value: 'daidjaosfasdfasfasfsafsdfsafasfsafassi'
            },
            {
              name: '告警源',
              value: '192.168.24.223'
            }
          ]
        }
      ]
    }
    this.transform();
    this.render();
  }

  transform() {
    let that = this;
    that.dataList.map(item => {
      item.bgColor = that.bgColor[item.statue % 3];
    });
  }

  onDataError(err) {
    this.render();
  }

  onInitEditMode() {
    this.addEditorTab('设置', 'public/plugins/dxc-alert-panel/editor.html', 2);
  }

  link(scope, elem, attrs, ctrl) {
    // const $panelContainer = elem.find('.list-container');

    function render() {

    }

    this.events.on('render', () => {
      render();
      ctrl.renderingCompleted();
    });
  }
}

AlertCtrl.templateUrl = 'module.html';
