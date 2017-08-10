import _ from 'lodash';
import { MetricsPanelCtrl } from 'app/plugins/sdk';


const panelDefaults = {

};

export class TreeCtrl extends MetricsPanelCtrl {
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

  onDataReceived(dataList) {
  this.dataList = this.panel.USE === 'URL' ? this.UrlData : dataList;

        if (this.panel.USE === 'FAKE_DATA' && this.panel.fakeData) {
            this.dataList = eval(this.panel.fakeData); // jshint ignore:line
        }
        this.data = this.dataList;
        this.render();
  }

  

  onInitEditMode() {
       this.addEditorTab('数据配置', 'public/plugins/dxc-tree-panel/editer-metric.html', 2);
  
  }

  link(scope, elem, attrs, ctrl) {
    this.events.on('render', () => {
    });
  }
}

TreeCtrl.templateUrl = 'module.html';
