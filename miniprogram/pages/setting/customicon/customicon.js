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
  onShareAppMessage(a) {
    const t = this
    return {
      title: '奇妙天气',
      path: "/pages/index/index",
      imageUrl:"https://weather.ioslide.com/weather/onShareAppMessage.png"
    };
  },
  onShareTimeline: function () {
		return {
	      title: '奇妙天气',
	      query: {
	        key: '奇妙天气'
	      },
        imageUrl:"https://weather.ioslide.com/weather/onShareAppMessage.png"
	    }
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