const log = console.log.bind(console)
const app = getApp()
const computedBehavior = require('miniprogram-computed')
import lazyFunction from "../../../utils/lazyFunction"
// import _ from "../../../utils/lodash"
const util = require('../../../utils/util.js')
import create from '../../../utils/create'
import store from '../../../store/index'

// Component({
create.Component(store,{
  behaviors: [computedBehavior],
  properties: {
    refreshSunset: {
      type: Boolean
    },
    sunrise: {
      type: String,
      value: "06:25"
    },
    sunset: {
      type: String,
      value: "19:34"
    }
  },
  data: {
    sunIconLef: 0,
    sunIconBottm: 0,
    rotateAangle:0,
    use: ['themeValue']
  },
  lifetimes: {
    attached: function () {},
    ready: function () {}
  },
  pageLifetimes: {
    show: function () {},
    hide: function () {}
  },
  watch: {
    refreshSunset() {
      const that = this
      log('[refreshSunset]',this.properties.sunrise,this.properties.sunset)
      let
        updateTime = util.formatHourTime(new Date()),
        // updateTime = '17:55',
        curTime = Number(updateTime.slice(0, 2)) - Number(this.properties.sunrise.slice(0, 2)) ,
        allTime = Number(this.properties.sunset.slice(0, 2)) - Number(this.properties.sunrise.slice(0, 2)),
        rotateAangle = parseFloat((curTime / allTime).toFixed(2)) * 180,
        sunriseHour = Number(this.properties.sunrise.slice(0, 2)),
        sunsetHour = Number(this.properties.sunset.slice(0, 2)),
        sunsetMinutes = 60 * sunsetHour + Number(this.properties.sunset.slice(3, 5)),
        updateTimeHour = Number(updateTime.slice(0, 2)),
        updateTimeMinutes = 60 * updateTimeHour + Number(updateTime.slice(3, 5)),
        extMintures = 60 * (sunsetHour - sunriseHour) + (Number(this.properties.sunset.slice(3, 5)) - Number(this.properties.sunrise.slice(3, 5)));
       
      if (updateTimeMinutes > sunsetMinutes) {
        return that.setData({
          sunIconLef: 183,
          rotateAangle:rotateAangle
        }),
        void(this.isSunSet = 1);
      }
      var r = 190 * (60 * (updateTimeHour - sunriseHour) + Number(updateTime.slice(3, 5)) - Number(this.properties.sunrise.slice(3, 5))) / extMintures
      var o = Math.abs(95 - (190 - r));
      var sunIconBottm = (Math.sqrt(9025 - o * o) - 4).toFixed(2)
      var sunIconLef = (r > 0 ? r : "").toFixed(2)
      console.log(sunIconLef)
      // var sunIconBgLef = -(186 - sunIconLef)
      that.setData({
        // sunIconBgLef:sunIconBgLef,
        sunIconBottm: sunIconBottm,
        sunIconLef: sunIconLef,
        rotateAangle:rotateAangle
      })
    }
  },
  methods: {

  }
})