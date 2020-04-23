const log = console.log.bind(console)
const app = getApp()
const computedBehavior = require('miniprogram-computed')
const config = require('../../../weatherui/config/config.js')
// import _ from "../../../utils/lodash"
import create from '../../../utils/create'
import store from '../../../store/index'

// Component({
create.Component(store,{
  behaviors: [computedBehavior],
  properties: {
    refreshRadar: {
      type: Boolean
    },
    longitude: {
      type: String
    },
    latitude:{
      type: String
    }
  },
  data: {
    windowWidth: app.globalData.windowWidth,
    radar:{
      coverImage:"",
      images:{},
      forecast_images:{}
    },
    use: ['themeValue']
  },
  lifetimes: {
    attached: function () {
      const t = this
      var createObv = wx.createIntersectionObserver();
      var ani = wx.createAnimation({
        duration: 700,
        timingFunction: 'ease-in-out',
        delay: 500,
      });
      createObv.relativeToViewport().observe('#radarObserver', (res) => {
        if (res.boundingClientRect.top > 0) {
          log('[radarObserver] => start')
            let radarApiHost = config.default.weatherApiHost + "/" + config.default.radarApiVersion + "/radar/fine_images?lat=" + this.properties.latitude + "&lon=" + this.properties.longitude + "&level=1&token=" + config.default.radarApiToken
            log('[reqRadarImage] => radarApiHost',radarApiHost)
            wx.request({
              url: radarApiHost,
              success: (result) => {
                log('radar',result)
                let radarImg = result.data.images[result.data.images.length - 1][0]
                t.setData({
                  'longitude':this.properties.longitude,
                  'latitude':this.properties.latitude,
                  'radar.coverImage':radarImg,
                  'radar.images': result.data.images,
                  'radar.forecast_images': result.data.forecast_images
                })
              },
              fail: (res) => {
              },
              complete:()=>{
                ani.opacity(1).step()
                t.setData({
                  radarObserverAni: ani.export()
                })
              }
            })
        }
        if (res.boundingClientRect.top < 0) {
          // log('[radarObserver] => end')
        }
      })
    },
    ready: function () {}
  },
  pageLifetimes: {
    show: function () {},
    hide: function () {}
  },
  watch: {
    refreshRadar() {
      const that = this

    }
  },
  methods: {

  }
})