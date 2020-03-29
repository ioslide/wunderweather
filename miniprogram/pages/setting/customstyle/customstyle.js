const app = getApp()
const log = console.log.bind(console)
const error = console.error.bind(console)
const warn = console.warn.bind(console)
import create from '../../../utils/create'
import store from '../../../store/index'
create(store, {
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    use: [
      'style',
      'themeValue'
    ]
  },
  backPage: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  onShareAppMessage: function (a) {
    return {
      title: '奇妙天气',
      imageUrl: 'https://weather.ioslide.com/shareimg.png',
      path: "/pages/index/index"
    };
  },
  switchChange(e) {
    const t = this
    const changeStyle = (target) => {
      t.store.data.style[target] = !t.store.data.style[target]
      app.changeStorage('style', t.store.data.style)
      log(target,t.store.data.style[target])
    }
    const keepScreenOnSwitchChange = (keepScreenOnSwitch) => {
      wx.setKeepScreenOn({
        keepScreenOn: keepScreenOnSwitch
      })
    }
    const event = (target, result) => {
      switch (true) {
        case (target == 'KeepScreenOnSwitchChange'):
          keepScreenOnSwitchChange(result),
            changeStyle(target, result)
          break
        default:
          changeStyle(target, result)
          break
      }
    }
    event(e.currentTarget.dataset.cur, e.detail.value)
    console.log('[switchChange] =>', e)
  }
})