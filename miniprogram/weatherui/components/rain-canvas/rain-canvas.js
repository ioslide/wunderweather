const log = console.log.bind(console)
const app = getApp()
// const F2 = require('@antv/wx-f2');
const computedBehavior = require('miniprogram-computed')
import lazyFunction from "../../../utils/lazyFunction"
// import _ from "../../../utils/lodash"

let chart = null

function onInitChart(F2, config) {
  chart = new F2.Chart(config);
  var pages = getCurrentPages();
  var currPage = pages[pages.length - 1]
  var hourly = currPage.data.forecastData.hourly
  for (var newData = [], s = hourly, d = 0; d < 48; d++) {
    var u = {
      time: s[d].precipitation.datetime,
      value: s[d].precipitation.value,
    };
    newData.push(u);
  }
  log('[onInitChart hourly]', newData)
  let data = newData
  chart.source(data, {
    time: {
      type: 'timeCat',
      tickCount: 5
    },
    value: {
      tickCount: 2,
      min: 0,
      range: [0, 1]
    }
  });
  chart.axis('time', false)
  // chart.axis('time', {
  //   label: function label(text, index, total) {
  //     const textCfg = {};
  //     if (index === 0) {
  //       textCfg.textAlign = 'left';
  //     } else if (index === total - 1) {
  //       textCfg.textAlign = 'right';
  //     }
  //     return textCfg;
  //   }
  // });
  // chart.tooltip({
  //   showCrosshairs: true
  // });
  chart.tooltip({
    showCrosshairs: true,
    showItemMarker: false,
    alwaysShow: false,
    triggerOn: ['touchstart', 'touchmove'],
    triggerOff: 'touchend',
    background: {
      radius: 2,
      fill: '#4AA2FC',
      padding: [3, 5]
    },
    showCrosshairs: true, // 是否显示辅助线，点图、路径图、线图、面积图默认展示
    crosshairsStyle: {
      stroke: 'rgba(71,231,255,1)',
      lineWidth: 1
    },
    tooltipMarkerStyle: {
      fill: '#4AA2FC',
      fillOpacity: 0.2
    },
    onShow: function onShow(ev) {
      const items = ev.items;
      items[0].name = null;
      // log(items[0].origin)
      items[0].value = '降水强度' + items[0].origin.value
    }
  });
  chart.area()
    .position('time*value')
    .color('l(90) 0:#1890FF 1:#f7f7f7')
    .shape('smooth');
  chart.line()
    .position('time*value')
    .color('l(90) 0:#1890FF 1:#f7f7f7')
    .shape('smooth');
  chart.render();
  return chart;
}
Component({
  behaviors: [computedBehavior],
  properties: {
    refreshChart: {
      type: Boolean,
      value: !1
    }
  },
  data: {
    opts: {
      lazyLoad: true
    },
    onInit: null,
    config: {
      appendPadding: [15, 15, 15, 15],
      padding: [30, 'auto', 20, 'auto'],
      width: app.globalData.windowWidth,
      height: 200
    },
    themeValue: app.globalData.themeValue
  },
  lifetimes: {
    attached: function () {},
    ready: function () {}
  },
  pageLifetimes: {
    show: function () {},
    hide: function () {}
  },
  watch: {
    refreshChart: lazyFunction.throttle(function (e) {
      const t = this
      t.data.refreshChart && t.setData({
        opts: {
          onInit: onInitChart
        },
        refreshChart: !1
      });
      log('[rain refreshChart]', t.data.refreshChart)
      t.rainChartComponent = t.selectComponent('#rainChart');
      t.rainChartComponent.init(onInitChart);
    })
  },
  methods: {

  }
})