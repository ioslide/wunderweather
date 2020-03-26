const app = getApp()
const log = console.log.bind(console)
const error = console.error.bind(console)
const warn = console.warn.bind(console)
var $$ = wx.getStorageSync('$$')
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
  onShow: function () {
    const t = this
    if (t.store.data.themeValue == '明亮') {
      log('[setBackgroundColor] => light')
      // t.setData({
      //   pageBg: 'background:#F5F6F7'
      // })
      wx.setBackgroundColor({
        backgroundColor: '#F5F6F7',
        backgroundColorTop: '#F5F6F7',
        backgroundColorBottom: '#F5F6F7'
      })
      wx.setBackgroundTextStyle({
        textStyle: 'dark'
      })
    } else {
      log('[setBackgroundColor] => dark')
      // t.setData({
      //   pageBg: 'background:#010101'
      // })
      wx.setBackgroundColor({
        backgroundColor: '#010101',
        backgroundColorTop: '#010101',
        backgroundColorBottom: '#010101'
      })
      wx.setBackgroundTextStyle({
        textStyle: 'light'
      })
    }
  },
  switchChange(e) {
    const changeStyle = (target,result) =>{
      let style = wx.getStorageSync("$$").style
      style[target] = result
      app.changeStorage('style', style)
    }
    const keepScreenOnSwitchChange = (keepScreenOnSwitch) =>{
      wx.setKeepScreenOn({
        keepScreenOn: keepScreenOnSwitch
      })
    }
    const event = (target,result) => {
      switch (true) {
        case (target == 'KeepScreenOnSwitchChange'):
          keepScreenOnSwitchChange(result),
          changeStyle(target,result)
          break
        default:
          changeStyle(target,result)
          break
      }
    }
    event(e.currentTarget.dataset.cur,e.detail.value)
    log('[switchChange] =>',e)
  },
  onHide: function () {
    const t = this
    t.store.data.style = wx.getStorageSync("$$").style
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
})