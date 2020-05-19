const app = getApp();
import create from '../../../utils/create'
import store from '../../../store/index'
create(store, {
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
  },
  BackPage: function () {
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
  themeRadioChange: function (e) {
    var t = this
    console.log('icon radio change', e.detail.value, e.detail.value.toString())
    this.setData({
      themeValue: e.detail.value.toString(),
      modalName: null
    })
  },
})