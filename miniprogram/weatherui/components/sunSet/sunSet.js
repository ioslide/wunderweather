const log = console.log.bind(console)
const app = getApp()
// const computedBehavior = require('miniprogram-computed')
import lazyFunction from "../../../utils/lazyFunction"
// import _ from "../../../utils/lodash"
const util = require('../../../utils/util.js')
import create from '../../../utils/create'
import store from '../../../store/index'

// Component({
create.Component(store,{
  // behaviors: [computedBehavior],
  properties: {
    refreshSunset: {
      type: Boolean,
      observer: function(newVal, oldVal){
        const that = this
        log(that)
        // let updateTime = util.formatHourTime(new Date())
        let updateTime = '02:55'
        let curTime = Number(updateTime.slice(0, 2)) - Number(this.properties.sunrise.slice(0, 2)) + Number(updateTime.slice(3, 5))/60 - Number(this.properties.sunrise.slice(3, 5))/60
        let allTime = Number(this.properties.sunset.slice(0, 2)) - Number(this.properties.sunrise.slice(0, 2)) + Number(this.properties.sunset.slice(3, 5))/60 - Number(this.properties.sunrise.slice(3, 5))/60
        let rotateAangle = parseFloat((curTime / allTime) * 180)
        rotateAangle < 180 && rotateAangle >=0 ? rotateAangle=rotateAangle : rotateAangle = 180
        that.setData({
          rotateAangle : rotateAangle
        })
        log('[rotateAangle]',rotateAangle,updateTime,curTime,allTime)
          //TODO
          // https://iknow-pic.cdn.bcebos.com/6f061d950a7b020866f6f65d6bd9f2d3572cc84b?x-bce-process=image/resize,m_lfit,w_600,h_800,limit_1 日出日落3D
      }
    },
    sunrise: {
      type: String
    },
    sunset: {
      type: String
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
  // watch: {
  //   refreshSunset() {
  //     const that = this
  //     let updateTime = util.formatHourTime(new Date())
  //       // updateTime = '10:55',
  //     let curTime = Number(updateTime.slice(0, 2)) - Number(this.properties.sunrise.slice(0, 2)) 
  //     let allTime = Number(this.properties.sunset.slice(0, 2)) - Number(this.properties.sunrise.slice(0, 2))
  //     let rotateAangle = parseFloat((curTime / allTime) * 180)
  //       // log('[refreshSunset]',updateTime,this.properties.sunrise,this.properties.sunset)
  //     log('[rotateAangle]',rotateAangle,updateTime,curTime,allTime)
  //       rotateAangle >= 180 ? that.setData({
  //         rotateAangle: 180
  //       }) : that.setData({
  //         rotateAangle:rotateAangle
  //       })
  //       //TODO
  //       // https://iknow-pic.cdn.bcebos.com/6f061d950a7b020866f6f65d6bd9f2d3572cc84b?x-bce-process=image/resize,m_lfit,w_600,h_800,limit_1 日出日落3D
  //   }
  // },
  methods: {

  }
})