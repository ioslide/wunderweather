const log = console.log.bind(console)
const app = getApp()
// const F2 = require('@antv/wx-f2');
const computedBehavior = require('miniprogram-computed')
import lazyFunction from "../../../utils/lazyFunction"

let chart = null
function getChartData(){
  var chartData = []
  var pages = getCurrentPages();
  var currPage = pages[pages.length - 1]
  var dailyWeather = currPage.data.forecastData.daily
  for (var s = dailyWeather, d = 1; d < 8; d++) {
    var u = {
      x: s[d].date,
      y: [s[d].min, s[d].max]
    };
    chartData.push(u);
  }
  let range = {
      max : Math.max.apply(Math, dailyWeather.map(function (o) {
      return o.max
     })),
      min:Math.min.apply(Math, dailyWeather.map(function (o) {
        return o.min
      }))
  }
  // log('[getChartData dailyWeather]', chartData,range)
  return {chartData,range}
}

function onInitChart(F2,config) {
  let chartData = getChartData().chartData
  let range = getChartData().range
  log('[onInitChart]', getChartData())
  chart = new F2.Chart(config);
  return chart.clear(), chart.legend(!1),
  chart.axis("y", !1),
  chart.axis("x", !1),
  chart.tooltip(false),
  chart.source(chartData, {
    x: {
      tickCount: 7
    },
    y: {
      min: range.min,
      max: range.max
    }
  }),
  chartData.map(function (obj) {
    chart.guide().text({
      top: true,
      position: [obj.x, obj.y[0]],
      content: obj.y[0],
      style: {
        textAlign: 'center',
        textBaseline: 'top',
        fontSize: 12,
        fill: '#8799a3'
      },
      offsetY: 10
    });
    chart.guide().text({
      top: true,
      position: [obj.x, obj.y[1]],
      content: obj.y[1],
      style: {
        textAlign: 'center',
        textBaseline: 'bottom',
        fontSize: 12,
        fill: '#8799a3'
      },
      offsetY: -10
    });
  }),
  chart.interval().position('x*y')
    .animate({
      appear: {
        animation: 'shapesScaleInY'
      }
    })
    .size(9)
    .style({
      radius: [4, 4, 4, 4]
    })
    .color('l(90) 0:#d5effc 1:#bcc8d4'),
    chart.render(),
    chart;
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
    opts:{
      lazyLoad: true
    },
    config:{
      appendPadding:[0,0,0,0],
      padding:[0,0,25,0],
      pixelRatio : app.globalData.pixelRatio,
      width: app.globalData.windowWidth,
      height: 200
    },
    themeValue:app.globalData.themeValue
  },
  lifetimes: {
    attached: function () {
    },
    ready:function(){
    }
  },
  pageLifetimes: {
    show: function () {
    },
    hide: function () {}
  },
  watch: {
    initChart: lazyFunction.throttle(function (e) {
      const t = this
      t.data.initChart && t.setData({
        initChart: !1
      });
      log('[temperature initChart]', t.data.initChart)
      t.dailyChartComponent = t.selectComponent('#dailyChart');
      t.dailyChartComponent.init(onInitChart);
    }),
    refreshChart() {
      const t = this
      let chartData = getChartData()
      log('[temperature refreshChart]',chartData)
      t.dailyChartComponent = t.selectComponent('#dailyChart');
      t.dailyChartComponent.init(onInitChart);
    }
  },
  methods: {

  }
})