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
      'languageValue'
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