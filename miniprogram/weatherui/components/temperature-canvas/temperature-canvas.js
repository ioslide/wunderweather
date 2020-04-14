const log = console.log.bind(console)
const app = getApp()
// const F2 = require('@antv/wx-f2');
const computedBehavior = require('miniprogram-computed')
import lazyFunction from "../../../utils/lazyFunction"

let chart = null

function onInitChart(F2,config) {
  chart = new F2.Chart(config);
  var pages = getCurrentPages();
  var currPage = pages[pages.length - 1]
  var dailyWeather = currPage.data.forecastData.daily
  log('[onInitChart dailyWeather]', dailyWeather)
  for (var newData = [], s = dailyWeather, d = 1; d < 8; d++) {
    var u = {
      x: s[d].date,
      y: [s[d].min, s[d].max]
    };
    newData.push(u);
  }
  let data = newData
  chart.axis("y", !1)
  chart.axis("x", !1)
  chart.tooltip(false);
  // chart.tooltip({
  //   showItemMarker: false,
  //   alwaysShow: false, 
  //   background: {
  //     radius: 2,
  //     fill: '#1890FF',
  //     padding: [ 3, 5 ]
  //   },
  //   tooltipMarkerStyle: {
  //     fill: '#1890FF',
  //     fillOpacity: 0.1
  //   },
  //   onShow: function onShow(ev) {
  //     const items = ev.items;
  //     items[0].name = null;
  //     let value = items[0].origin.y;
  //     items[0].value = value[0] + ' 丨 ' + value[1];
  //   }
  // });
  const defs = {
    x: {
      tickCount: 14
    },
    y: {
      min: Math.min.apply(Math, dailyWeather.map(function (o) {
        return o.min
      })),
      max: Math.max.apply(Math, dailyWeather.map(function (o) {
        return o.max
      }))
    }
  };
  chart.source(data, defs);
  data.map(function (obj) {
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
  });
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
    .color('l(90) 0:#d5effc 1:#bcc8d4');
  chart.render();
}
// function rePaint(F2,config){
//   chart.clear();
//   chart = new F2.Chart(config);
//   var pages = getCurrentPages();
//   var currPage = pages[pages.length - 1]
//   var dailyWeather = currPage.data.forecastData.daily
//   log('[onInitChart dailyWeather]', dailyWeather)
//   for (var newData = [], s = dailyWeather, d = 1; d < 8; d++) {
//     var u = {
//       x: s[d].date,
//       y: [s[d].min, s[d].max]
//     };
//     newData.push(u);
//   }
//   let data = newData
//   chart.axis("y", !1)
//   chart.axis("x", !1)
//   chart.tooltip(false);
//   // chart.tooltip({
//   //   showItemMarker: false,
//   //   alwaysShow: false, 
//   //   background: {
//   //     radius: 2,
//   //     fill: '#1890FF',
//   //     padding: [ 3, 5 ]
//   //   },
//   //   tooltipMarkerStyle: {
//   //     fill: '#1890FF',
//   //     fillOpacity: 0.1
//   //   },
//   //   onShow: function onShow(ev) {
//   //     const items = ev.items;
//   //     items[0].name = null;
//   //     let value = items[0].origin.y;
//   //     items[0].value = value[0] + ' 丨 ' + value[1];
//   //   }
//   // });
//   const defs = {
//     x: {
//       tickCount: 14
//     },
//     y: {
//       min: Math.min.apply(Math, dailyWeather.map(function (o) {
//         return o.min
//       })),
//       max: Math.max.apply(Math, dailyWeather.map(function (o) {
//         return o.max
//       }))
//     }
//   };
//   chart.source(data, defs);
//   data.map(function (obj) {
//     chart.guide().text({
//       top: true,
//       position: [obj.x, obj.y[0]],
//       content: obj.y[0],
//       style: {
//         textAlign: 'center',
//         textBaseline: 'top',
//         fontSize: 12,
//         fill: '#8799a3'
//       },
//       offsetY: 10
//     });
//     chart.guide().text({
//       top: true,
//       position: [obj.x, obj.y[1]],
//       content: obj.y[1],
//       style: {
//         textAlign: 'center',
//         textBaseline: 'bottom',
//         fontSize: 12,
//         fill: '#8799a3'
//       },
//       offsetY: -10
//     });
//   });
//   chart.interval().position('x*y')
//     .animate({
//       appear: {
//         animation: 'shapesScaleInY'
//       }
//     })
//     .size(9)
//     .style({
//       radius: [4, 4, 4, 4]
//     })
//     .color('l(90) 0:#d5effc 1:#bcc8d4');
//   chart.render();
// }
Component({
  behaviors: [computedBehavior],
  properties: {
    refreshChart: {
      type: Boolean,
      value: !1
    },
    // isChangeChartData: {
    //   type: Boolean,
    //   value: !1
    // }
  },
  data: {
    opts:{
      lazyLoad: true
    },
    onInit:null,
    config:{
      appendPadding:[0,3,30,3],
      padding:[0,0,0,0],
      width:app.globalData.windowWidth,
      height:'260'
    },
    themeValue:app.globalData.themeValue
  },
  lifetimes: {
    attached: function () {
    },
    ready:function(){
      // const t = this
      // t.setData({
      //   opts: {
      //     onInit: onInitChart
      //   }
      // });
    }
  },
  pageLifetimes: {
    show: function () {
      // !this.data.refreshChart
      // this.setData({
      //   opts: {
      //     onInit: onInitChart
      //   }
      // });
    },
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
      log('[temperature refreshChart]',t.data.refreshChart)
      t.dailyChartComponent = t.selectComponent('#dailyChart');
      t.dailyChartComponent.init(onInitChart);
    }),
    // isChangeChartData: lazyFunction.throttle(function (e) {
    //   const t = this
    //   t.data.refreshChart && t.setData({
    //     opts: {
    //       onInit: rePaint
    //     },
    //     refreshChart: !1
    //   });
    //   log('[temperature refreshChart]',t.data.refreshChart)
    //   t.dailyChartComponent = t.selectComponent('#dailyChart');
    //   t.dailyChartComponent.init(rePaint);
    // })
  },
  methods: {

  }
})