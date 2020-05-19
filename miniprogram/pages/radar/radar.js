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
    
    // https://earth.weather.ioslide.com/#current/wind/surface/level/orthographic=-242.82,42.39,1719/loc=113.797,43.518
    let radarSrc = 'https://earth.weather.ioslide.com/#current/wind/surface/level/orthographic=-242.82,42.39,1719/loc=' + options.longitude + ',' + options.latitude
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
  onShareAppMessage: function (a) {
    return {
      title: '奇妙天气',
      imageUrl: 'https://weather.ioslide.com/shareimg.png',
      path: "/pages/index/index"
    };
  },
})