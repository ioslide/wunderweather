const app = getApp();
const log = console.log.bind(console)
const error = console.error.bind(console)
const warn = console.warn.bind(console)
import create from '../../utils/create'
import store from '../../store/index'
create(store, {
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    use:[
      'languageValue',
      'themeValue'
    ]
  },
  onLoad: function (options) {
    const i = getCurrentPages()[0].data.moonPhaseLists
    console.log(i)
    this.setData({
      moonPhaseLists: i
    })
  },
  onShow:function(){
    const t = this
  },
  backPage: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  NavChange(e) {
    console.log(e.currentTarget.dataset.cur)
    wx.navigateTo({
      url: e.currentTarget.dataset.cur + '/' + e.currentTarget.dataset.cur
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