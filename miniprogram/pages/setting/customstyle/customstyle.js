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
      'themeValue',
      'languageValue'
    ]
  },
  backPage: function () {
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
  switchChange(e) {
    const t = this
    const changeStyle = (target) => {
      t.store.data.style[target] = !t.store.data.style[target]
      app.changeStorageAsync('style', t.store.data.style)
      log(target,t.store.data.style[target])
    }
    const keepScreenOnSwitchChange = (keepScreenOnSwitch) => {
      wx.setKeepScreenOn({
        keepScreenOn: keepScreenOnSwitch
      })
    }
    let Tatget = e.currentTarget.dataset.cur
    let DetailValue = e.detail.value
    Tatget == 'KeepScreenOnSwitchChange'? (keepScreenOnSwitchChange(DetailValue),
    changeStyle(Tatget)):changeStyle(Tatget)
  }
})