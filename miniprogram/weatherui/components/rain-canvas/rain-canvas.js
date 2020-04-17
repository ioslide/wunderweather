const log = console.log.bind(console)
const app = getApp()
const computedBehavior = require('miniprogram-computed')
import lazyFunction from "../../../utils/lazyFunction"
// import _ from "../../../utils/lodash"

let chart = null

function getChartData(){
  var chartData = []
  var pages = getCurrentPages();
  var currPage = pages[pages.length - 1]
  var hourly = currPage.data.forecastData.hourly
  for (var s = hourly, d = 0; d < 48; d++) {
    var u = {
      time: s[d].precipitation.datetime,
      value: s[d].precipitation.value,
    };
    chartData.push(u);
  }
  return chartData  
}

function onInitChart(F2, config) {
  chart = new F2.Chart(config);
  let chartData = getChartData()
  log('[onInitChart hourly]', chartData)
  chart.source(chartData, {
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
      log(items[0].origin)
      items[0].value = items[0].origin.time +'/ 降水强度:'
    }
  });
  chart.area()
    .position('time*value')
    .color('l(90) 0:#1890FF 1:#f7f7f7')
    .shape('smooth');
  chart.line()
    .position('time*value')
    .color('l(90) 0:#1890FF 1:#8dd9f7')
    .shape('smooth');
  chart.render();
  return chart;
}
Component({
  behaviors: [computedBehavior],
  properties: {
    initChart: {
      type: Boolean,
      value: !1
    },
    refreshChart: {
      type: Boolean,
      value: !1
    },
    themeValue: {
      type: String
    }
  },
  data: {
    opts: {
      lazyLoad: true
    },
    config: {
      appendPadding: [15, 15, 15, 15],
      padding: [30, 'auto', 20, 'auto'],
      pixelRatio : app.globalData.pixelRatio,
      width: app.globalData.windowWidth,
      height: 200
    }
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
    initChart: lazyFunction.throttle(function (e) {
      const t = this
      t.data.initChart && t.setData({
        initChart: !1
      });
      log('[rain initChart]', t.data.initChart)
      t.rainChartComponent = t.selectComponent('#rainChart');
      t.rainChartComponent.init(onInitChart);
    }),
    refreshChart() {
      let chartData = getChartData()
      log('[rain refreshChart]',chartData)
      chart.changeData(chartData)
    }
  },
  methods: {
  }
})