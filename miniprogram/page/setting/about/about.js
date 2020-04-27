const app = getApp();
import create from '../../../utils/create'
import store from '../../../store/index'
create(store, {
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    use:[
      'themeValue',
      'languageValue'
    ]
  },
  handleContact(e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
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