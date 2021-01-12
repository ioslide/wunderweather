const log = console.log.bind(console)
const app = getApp()
// const computedBehavior = require('miniprogram-computed')
const sunCalc = require('../../../utils/sunCalc.js')
const dayjs = require('../../../weatherui/assets/lib/day/day.js')

// import _ from "../../../utils/lodash"
// const util = require('../../../utils/util.js')
import create from '../../../utils/create'
import store from '../../../store/index'

// Component({
create.Component(store,{
  // behaviors: [computedBehavior],
  properties: {
    refreshSunset: {
      type: Boolean,
      observer: function(newVal, oldVal){
        const t = this

        const rotatePlanet = (planetRise,planetSet) =>{
          let updateTime = dayjs(new Date()).format('H:mm')
          // let updateTime = '02:55'
          let curTime = Number(updateTime.slice(0, 2)) - Number(planetRise.slice(0, 2)) + Number(updateTime.slice(3, 5))/60 - Number(planetRise.slice(3, 5))/60
          let allTime = Number(planetSet.slice(0, 2)) - Number(planetRise.slice(0, 2)) + Number(planetSet.slice(3, 5))/60 - Number(planetRise.slice(3, 5))/60
          let rotateAangle = parseFloat((curTime / allTime) * 180)
          rotateAangle < 180 && rotateAangle >=0 ? rotateAangle=rotateAangle : rotateAangle = 180
          log('[rotateAangle]',rotateAangle,updateTime,curTime,allTime)
          return rotateAangle
        }
        var planetRise = ''
        var planetSet = ''
        var planetInfo = ''
        var rotateAangle = ''
        let sunTimes = sunCalc.getTimes(new Date(), t.properties.latitude, t.properties.longitude)
        let moonTimes = sunCalc.getMoonTimes(new Date(), t.properties.latitude, t.properties.longitude)

        if(t.properties.planetName == 'moon'){
          log('[moonTimes] =>',moonTimes.rise,moonTimes.set,moonTimes)
          if(moonTimes.alwaysDown == true){
            planetRise = ''
            planetSet = ''
            planetInfo = 'Moon AlwaysDown'
          }else if(moonTimes.alwaysUp == true){
            planetRise = ''
            planetSet = ''
            planetInfo = 'Moon AlwaysUp'
          }else{
            planetRise = dayjs(moonTimes.rise).format('HH:mm')
            planetSet = dayjs(moonTimes.set).format('HH:mm')
            rotateAangle = rotatePlanet(planetRise,planetSet)
          }
        }else if(t.properties.planetName == 'sun'){
          log('[sunTimes] =>',sunTimes,sunTimes.sunrise,sunTimes.sunset)
          if(sunTimes.sunrise == 'Invalid Date' || sunTimes.sunset == 'Invalid Date' && moonTimes.alwaysDown == true){
            planetRise = ''
            planetSet = ''
            planetInfo = 'Polar Night'
          }if(sunTimes.sunrise == 'Invalid Date' || sunTimes.sunset == 'Invalid Date' && moonTimes.alwaysUp == true){
            planetRise = ''
            planetSet = ''
            planetInfo = 'Polar Day'
          }else{
            planetRise = dayjs(sunTimes.sunrise).format('HH:mm')
            planetSet = dayjs(sunTimes.sunset).format('HH:mm')
            rotateAangle = rotatePlanet(planetRise,planetSet)
          }
        }
        log('[planetRise ---  planetSet ]',planetRise,planetSet)
        t.setData({
          planetInfo : planetInfo,
          planetRise:planetRise,
          planetSet:planetSet,
          planetName : t.properties.planetName,
          rotateAangle : rotateAangle
        })
        log('properties',this.properties)
        //   //TODO
        //   // https://iknow-pic.cdn.bcebos.com/6f061d950a7b020866f6f65d6bd9f2d3572cc84b?x-bce-process=image/resize,m_lfit,w_600,h_800,limit_1 日出日落3D
      }
    },
    planetName: {
      type: String,
      observer: function(newVal, oldVal){
        const t = this
        
        var planetRise = ''
        var planetSet = ''
        var planetInfo = ''
        var rotateAangle = ''
        let moonTimes = sunCalc.getMoonTimes(new Date(), t.properties.latitude, t.properties.longitude)
        let sunTimes = sunCalc.getTimes(new Date(), t.properties.latitude, t.properties.longitude)

        const rotatePlanet = (planetRise,planetSet) =>{
          let updateTime = dayjs(new Date()).format('H:mm')
          let curTime = Number(updateTime.slice(0, 2)) - Number(planetRise.slice(0, 2)) + Number(updateTime.slice(3, 5))/60 - Number(planetRise.slice(3, 5))/60
          let allTime = Number(planetSet.slice(0, 2)) - Number(planetRise.slice(0, 2)) + Number(planetSet.slice(3, 5))/60 - Number(planetRise.slice(3, 5))/60
          let rotateAangle = parseFloat((curTime / allTime) * 180)
          rotateAangle < 180 && rotateAangle >=0 ? rotateAangle=rotateAangle : rotateAangle = 180
          return rotateAangle
        }

        if(newVal == 'moon'){
          log('[moonTimes] =>',moonTimes,moonTimes.rise,moonTimes.set,moonTimes.alwaysUp,moonTimes.alwaysDown)
          if(moonTimes.alwaysDown == true){
            planetRise = ''
            planetSet = ''
            planetInfo = 'Moon AlwaysDown'
          }else if(moonTimes.alwaysUp == true){
            planetRise = ''
            planetSet = ''
            planetInfo = 'Moon AlwaysUp'
          }else{
            planetRise = dayjs(moonTimes.rise).format('HH:mm')
            planetSet = dayjs(moonTimes.set).format('HH:mm')
            rotateAangle  = rotatePlanet(planetRise,planetSet)
            log('[moon rotateAangle]',rotateAangle)
          }
        }else if(newVal == 'sun'){
          log('[sunTimes] =>',sunTimes.sunrise,sunTimes.sunset)
          if(sunTimes.sunrise == 'Invalid Date' || sunTimes.sunset == 'Invalid Date' && moonTimes.alwaysDown == true){
            planetRise = ''
            planetSet = ''
            planetInfo = 'Polar Night'
          }if(sunTimes.sunrise == 'Invalid Date' || sunTimes.sunset == 'Invalid Date' && moonTimes.alwaysUp == true){
            planetRise = ''
            planetSet = ''
            planetInfo = 'Polar Day'
          }else{
            planetRise = dayjs(sunTimes.sunrise).format('HH:mm')
            planetSet = dayjs(sunTimes.sunset).format('HH:mm')
            rotateAangle  = rotatePlanet(planetRise,planetSet)
            log('[sun rotateAangle]',rotateAangle)
          }
        }
        t.setData({
          planetInfo : planetInfo,
          planetRise : planetRise,
          planetSet:planetSet,
          planetName : newVal,
          rotateAangle:rotateAangle
        })
        log('planetName',newVal)
      }
    },
    latitude:{
      type: String
    },
    longitude:{
      type: String
    },
    planetRise: {
      type: String
    },
    planetSet: {
      type: String
    },
    rotateAangle: {
      type: String,
      value:0
    }
  },
  data: {
    use: ['themeValue','languageValue']
  },
  lifetimes: {
    attached: function () {},
    ready: function () {}
  },
  pageLifetimes: {
    show: function () {},
    hide: function () {}
  },
  methods: {
    changePlant(){
      const t = this
      t.data.planetName == 'sun' ? t.setData({
        planetName : 'moon'
      }) : t.setData({
        planetName : 'sun'
      })
      // if(t.data.planetName == 'sun'){
      //   t.setData({
      //     planetName : 'moon'
      //   })
      // }else if(t.data.planetName == 'moon'){
      //   t.setData({
      //     planetName : 'sun'
      //   })
      // }
    }
  }
})