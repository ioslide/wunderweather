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
        // updateTime = '10:55',
        curTime = Number(updateTime.slice(0, 2)) - Number(this.properties.sunrise.slice(0, 2)) ,
        allTime = Number(this.properties.sunset.slice(0, 2)) - Number(this.properties.sunrise.slice(0, 2)),
        rotateAangle = parseFloat((curTime / allTime) * 180)
      that.setData({
        rotateAangle:rotateAangle
      })
    }
  },
  methods: {

  }
})