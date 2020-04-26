const app = getApp();
const log = console.log.bind(console)
const error = console.error.bind(console)
const warn = console.warn.bind(console)
import create from '../../../../utils/create'
import store from '../../../../store/index'
create(store, {
  data: {
    use:[
      'themeValue'
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
  goBackHome: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  getQueryCallback: function(e) {
  },
  // 点击机器人回答里的链接跳转webview,需要开发者自己配置一个承载webview的页面,url字段对应的小程序页面需要开发者自己创建
  // 开发者需要在小程序后台配置相应的域名
  // 1.1.7版本开始支持
  openWebview: function(e) {
    let url = e.detail.weburl
    wx.navigateTo({
      url: `/pages/webviewPage/webviewPage?url=${url}`
    })
  },
  // 点击机器人回答中的小程序，需要在开发者自己的小程序内做跳转
  // 开发者需要在小程序配置中指定跳转小程序的appId
  // 1.1.7版本开始支持
  openMiniProgram(e) {
    let {appid, pagepath} = e.detail
    wx.navigateToMiniProgram({
      appId: appid,
      path: pagepath,
      extraData: {
      },
      envVersion: '',
      success(res) {
        // 打开成功
      }
    })
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})