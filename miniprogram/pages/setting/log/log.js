const app = getApp()
const log = console.log.bind(console)
const error = console.error.bind(console)
const warn = console.warn.bind(console)
import create from '../../../utils/create'
import store from '../../../store/index'
create(store, {
  data: {
    logList: [{
      version: "ToDo Lists",
      date: "2020",
      log: ["本项目稳定后，会同步更新到支付宝小程序，百度小程序，头条小程序等"]
    }, {
      version: "Bug",
      date: "截止2020-06-01",
      log: ["1.F2数据刷新，图表重绘问题", "2.低端机型较卡顿问题"]
    }].reverse(),
    use:[
      'themeValue',
      'languageValue'
    ]
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})