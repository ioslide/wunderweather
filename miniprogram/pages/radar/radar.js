const app = getApp()
const log = console.log.bind(console)
const error = console.error.bind(console)
import create from '../../utils/create'
import store from '../../store/index'
create(store, {
  data: {
    use: [
      'themeValue'
    ]
  },
  onLoad: function (options) {
    const t = this
    // crontab -e
    // rm /www/wwwroot/earth.weather.ioslide.com/data/gfs/current/current-wind-surface-level-gfs-0.5.epak -f;wget -P /www/wwwroot/earth.weather.ioslide.com/data/gfs/current/ https://gaia.nullschool.net/data/gfs/current/current-wind-surface-level-gfs-0.5.epak
    let
    pages = getCurrentPages(),
    prevPage = pages[0];
    // https://earth.weather.ioslide.com/#current/wind/surface/level/orthographic=-242.82,42.39,1719/loc=113.797,43.518
    let radarSrc = ''
    if(t.store.data.themeValue == 'light'){
      radarSrc = 'https://map.weather.ioslide.com/index-light.html#' + prevPage.data.longitude + ',' + prevPage.data.latitude
    }else{
      radarSrc = 'https://map.weather.ioslide.com/index.html#' + prevPage.data.longitude + ',' + prevPage.data.latitude
    }
    log('[radarSrc]',radarSrc)
    t.setData({
      radarSrc : radarSrc
    })
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
})