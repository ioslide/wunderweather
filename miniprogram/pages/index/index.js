
var temperatureChart = null
var rainChart = null
var radarChart = null
const app = getApp()
const globalData = getApp().globalData
// const AUTH_MODE = 'fingerPrint'
const log = console.log.bind(console)
const group = console.group.bind(console)
const groupEnd = console.groupEnd.bind(console)
const error = console.error.bind(console)
const warn = console.warn.bind(console)
const chooseLocation = requirePlugin('chooseLocation');
const scui = require('../../weatherui/sc-ui');
const util = require('../../utils/util.js')
const sunCalc = require('../../utils/sunCalc.js')
const config = require('../../weatherui/config/config.js').default
const transWeatherName = require('../../weatherui/assets/lib/transWeatherName/transWeatherName.js').default
const qqMapWX = new(require("../../weatherui/assets/lib/qqMapWX/qqMapWX.js"))({
  key: config.locationKey
})
const dayjs = require('../../weatherui/assets/lib/day/day.js')
import _ from '../../utils/lodash.min.js';

// import base64src from '../../utils/base64src.js'
// import vrequest from '../../utils/v-request.js'
// import calcSunUtil from '../../utils/calcnew.js'
// import lazyFunction from "../../utils/lazyFunction"
import create from '../../utils/create'
import store from '../../store/index'


create(store, {
  data: {
    opts:{
      lazyLoad: true
    },
    subData:{
      action: 'saveOnetimeTemplateData',
      page: 'pages/index/index',
      unit: '',
      language: '',
      city: '',
      startTime: 'startTime',
      latitude: '',
      longitude: '',
      templateId: '',
      done: false
    },
    temperatureChartConfig : {
      appendPadding:0,
      padding:[30,0,30,0],
      pixelRatio : globalData.pixelRatio,
      width: globalData.windowWidth,
      height: 210
    },
    rainChartConfig : {
      appendPadding:0,
      padding:[30,0,0,0],
      pixelRatio : globalData.pixelRatio,
      width: globalData.windowWidth,
      height: 200
    },
    // loadHeadImage:false,
    weatherKeyWord:"云",
    // radarMapLatitude:0,
    // radarMapLongitude:0,
    radarChartConfig : {
      appendPadding:0,
      padding:30,
      pixelRatio : globalData.pixelRatio,
      width: 250,
      height: 250
    },
    cropCallBackFadeOut:false,
    enableSatellite:false,
    // radarMapMarkers: [{
    //   iconPath: "https://weather.ioslide.com/pm25_rt_as_20200606_16.png",
    //   id: 1,
    //   latitude: 23,
    //   longitude: 103,
    //   name:'aqi',
    //   width: 869,
    //   height: 958,
    //   anchor:{x: .5, y: .57} 
    // }],
    showAirQuatityRadar:false,
    canIntervalRainRadarPlay:true,
    drawerModalName:null,
    timeLineInterval:'',
    snackBarLength:0,
    x: 0,
    y: 0,
    ww: 0,
    hh: 0,
    latitude: "",
    longitude: "",
    datePicker: {},
    timePicker: {},
    radarTimeLineIndexNum:[],
    radarTimeLineImage:"https://weather.ioslide.com/weather/timeLinePlay.svg",
    // StatusBar: globalData.StatusBar,
    // CustomBar: globalData.CustomBar,
    // Custom: globalData.Custom,
    windowWidth: globalData.windowWidth,
    // windowHeight: globalData.windowHeight,
    lastRefreshTime: '',
    // initChart: !1,
    // refreshChart: !1,
    refreshSunset: false,
    refreshLocation: false,
    refreshRadar: false,
    canBlurRoot: false,
    isHourlyRainChart:false,
    isManualGetNewLocation:false,
    rainChartName:'',
    isChangeSetting: false,
    networkType: 'none',
    imageBase64: '',
    qrImageURL: '',
    radarTimeLinePosition:1,
    // planetRise: "06:00",
    // planetSet: "19:34",
    planetName:'sun',
    painting: {},
    shareImage: '',
    touchS: [0, 0],
    touchE: [0, 0],
    curDetailTime: '',
    moonPhaseLists: [],
    historyCityList: [],
    // authScreen: false,
    // NASAImage: "",
    // NASAImageLists : null,
    // manualLocationData: wx.getStorageSync('manualLocationData') || [],
    src: null,
    visible: false,
    cropSize: {
      width: 400,
      height: 300
    },
    radarMapSetting : {},
    radarMapImageType : 'rain',
    radarMapScale : 7,
    drawerModalName:null,
    cropSizePercent: 0.9,
    forecastData: {
      hourlyKeypoint: "",
      // minutelyKeypoint: "",
      rainRadar: {
        coverImage: "",
        forecastImages: {},
        images: [
          '','','','','','','','','','','','','','','','','','','','','',''
        ]
      },
      aqiRadar: {
        coverImage: "",
        images: [
          '','','','','','','','','','','','','','','','','','','','','',''
        ]
      },
      minutely: {},
      hourly: {},
      daily: {},
      city: "",
      address: "",
      latitude: "",
      longitude: "",
      serviceData: [],
      alarmInfo: []
    },
    use: [
      'style',
      'themeValue',
      'startScreen',
      'refreshfrequencyValue',
      'languageValue',
      'language',
      'unit',
      'unitValue',
      'getLocationMethod',
      'getWeatherDataAgain',
      'icon',
      'iconValue',
      'warningValue',
      'subscribeType',
      'longitude',
      'latitude'
    ]
  },
  onLoad(a) {
    const t = this

    // t.selectComponent('#startScreen').screenFadeIn()
    t.data.snackBar = scui.SnackBar("#snackbar");
    const handler = function (evt) {
      log('[' + evt + ']' + '=>', evt)
    }
    store.onChange(handler)

    wx.getNetworkType({
      success: res => {
        log(`[networkType] =>`, res.networkType)
        var networkType = res.networkType
        t.setData({
          networkType: networkType
        })
        if (networkType == 'none' || networkType == '2g' || networkType == undefined) {
          wx.showToast({
            title: '请检查你的网络连接',
            duration: 1500,
            icon: 'none',
            mask: true,
          })
          return 
        }
      }
    })

    const selectLocationMethodType = () => {
      t.store.data.getLocationMethod == 'manual' ? t.getLocationByManual() :
      t.store.data.getLocationMethod == 'auto' ? t.getLocationByAuto() :
      t.store.data.getLocationMethod == 'historyCity' ? t.getLocationByHistory() :
      warn('[getLocationMethod]')
    }

    log('[startScreen  => selectLocationMethodType]', t.store.data.startScreen, '=>' ,t.store.data.getLocationMethod)
    t.store.data.startScreen == 'auth' ?  '': selectLocationMethodType()
    t.data.isHourlyRainChart == 'true'? 
    t.setData({
      rainChartName:t.store.data.languageValue == 'zh_TW' ? '小時':t.store.data.languageValue == 'zh_CN'? '小时':t.store.data.languageValue == 'ja'? '時間':'Hourly'
    }) : t.setData({
      rainChartName:t.store.data.languageValue == 'zh_TW' ? '天':t.store.data.languageValue == 'zh_CN'? '天':t.store.data.languageValue == 'ja'? '日':'Daily'
    })
  },
  onHide(){
    log("[onHide]")
    // wx.stopAccelerometer();
  },
  onUnload () {
        chooseLocation.setLocation(null);
    },
  onShow() {
    const t = this
    // t.onStartAccelerometer()
    // t.setData({
    //   rainChartName:t.store.data.languageValue == 'zh_TW' ? '小時':t.store.data.languageValue == 'zh_CN'? '小时':t.store.data.languageValue == 'ja'? '時間':'Hourly'
    // })
    const location = chooseLocation.getLocation();
    log('[isBackFromChooseNewLocation]',location)
    if (location == null) {
      if(t.store.data.startScreen == 'auth'){
        t.selectComponent('#startScreen').setData({
          'isManualGetNewLocation' : false
        })
      }
    }
    if (location !== null) {
      log(`[chooseLocation.getLocation()] =>`, location)
      t.setData({
        isManualGetNewLocation:true,
        'longitude': location.longitude,
        'latitude': location.latitude
      })
      t.setCityNameORStreetName(location.latitude,location.longitude)
      t.store.data.latitude = location.latitude
      t.store.data.longitude = location.longitude
      //auth状态手动获取经纬度后先不请求数据
      t.store.data.startScreen == 'auth' ? t.selectComponent('#startScreen').authScreenNext('canNavToFinalScreen')  :
      t.store.data.startScreen == 'poetry' ? (t.getWeatherData(true), t.setData({
        'modalName': null
      })) :
      t.store.data.startScreen == 'default' ? (t.getWeatherData(true), t.setData({
        'modalName': null
      })) : ''
      log('[manualLocationData]', location)
      t.store.data.getLocationMethod = 'manual'
      //make sure location value != null
      // app.saveData('manualLocationData', location)
      app.changeStorage('getLocationMethod', 'manual')
      chooseLocation.setLocation(null);
    }
  },
  onReady() {
    // log('[onReady]')
    const t = this
    const onReadyEvnet = async () => {
      // log('[onReadyEvnet]')
      await t.setRadarTimeLineIndex()
      // await t.setRadarMapSetting()
      await t.getMoonPhaseList()
      await t.getQRCode()
      await t.checkIsAccept()
    }
    onReadyEvnet()
    t.data.datePicker = scui.DatePicker("#datepicker")
    t.data.timePicker = scui.TimePicker("#timepicker")
    // t.radarMapCtx = wx.createMapContext('radarMap')
  },
  getQRCode(){
    // log('[getQRCode]')
    const t = this
    const formatImg = (base64Img) =>{
      let fsm = wx.getFileSystemManager()
      let FILE_BASE_NAME = 'weatherLogo'
      let buffer = wx.base64ToArrayBuffer(base64Img);
      const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.jpg`;
      fsm.writeFile({
        filePath,
        data: buffer,
        encoding: 'binary',
        success: res => {
          log(`[writeFile] => qrImageURL =>`, filePath)
          t.data.qrImageURL = filePath
        },
        fail: err => {
          log(`[writeFile] => fail => ${err}`)
          return (new Error('ERROR_BASE64SRC_WRITE'));
        },
      });
    }
    const base64ImgStorage = wx.getStorageSync('qrCodeBase64')
    if (base64ImgStorage) {
      t.data.qrImageURL = formatImg(base64ImgStorage)
      console.log(`[get wxacode] from storage ID`,t.data.qrImageURL)
    } else {
      wx.cloud.callFunction({
        name: 'openapi',
        data: {
          action: 'getWXACode',
        },
        success: res => {
          log(`[get wxacode] from cloud`, res)
          let base64Img = res.result.wxacodebase64.replace(/[\r\n]/g, "")
          formatImg(base64Img)
          app.saveData('qrCodeBase64', base64Img)
        },
        fail: err => {
          log(`[getWXACode] => ${err}`)
        }
      })
    }
  },
  setRadarMapSetting(){
    const t = this
    let layerStyle = t.store.data.themeValue == 'light' ? 3 : 2
    let setting = {
      skew: 0,
      rotate: 0,
      showLocation: false,
      showScale: false,
      enableZoom: false,
      enableScroll: false,
      layerStyle:layerStyle,
      enableRotate: false,
      showCompass: false,
      enable3D: false,
      enableOverlooking: false,
      enableSatellite: t.data.enableSatellite, //卫星图
      enableTraffic: false,
    }
    // log('[setRadarMapSetting]',setting)
    t.setData({
      radarMapSetting : setting
    })
  },
  changeRadarMapType(){
      const t = this
      let layerStyle = t.store.data.themeValue == 'light' ? 3 : 2
      let setting = {
        skew: 0,
        rotate: 0,
        showLocation: false,
        showScale: false,
        layerStyle: layerStyle,
        enableZoom: true,
        enableScroll: false,
        enableRotate: false,
        showCompass: false,
        enable3D: false,
        enableOverlooking: false,
        enableSatellite: !t.data.enableSatellite, //卫星图
        enableTraffic: false,
      }
      log('setRadarMapSetting',setting)
      t.setData({
        enableSatellite: !t.data.enableSatellite, 
        radarMapSetting : setting
      })
  },

  getLocationByManual() {
    const t = this
    let manualData = wx.getStorageSync('historyCityList')[0]
    log('[getLocationByManual]', manualData)
    const changeStorage = () => {
      app.changeStorage('getLocationMethod', 'manual')
    }
    (async () => {
      await t.setData({
        'latitude': manualData.latitude,
        'longitude': manualData.longitude,
        'forecastData.city': manualData.city,
        'forecastData.address': manualData.address
      }),
      await t.getWeatherData(false)
      await changeStorage()
      t.store.data.latitude = manualData.latitude
      t.store.data.longitude = manualData.longitude
    })()
  },
  getLocationByHistory() {
    const t = this
    var historyCityData = wx.getStorageSync('historyCityList')[0]
    const changeStorage = () => {
      app.changeStorage('getLocationMethod', 'historyCity')
    }
    (async () => {
      await t.setData({
        'latitude': historyCityData.latitude,
        'longitude': historyCityData.longitude,
        'forecastData.city': historyCityData.city,
        'forecastData.address': historyCityData.address
      }),
      await t.getWeatherData(false)
      await changeStorage()
      t.store.data.latitude = historyCityData.latitude
      t.store.data.longitude = historyCityData.longitude
    })()
  },
  getLocationByAuto() {
    const t = this
    wx.getLocation({
      success: res => {
        (async (res) =>{
          t.setData({
            'latitude': res.latitude,
            'longitude': res.longitude,
            // 'radarMapLatitude' : res.latitude,
            // 'radarMapLongitude' :res.longitude
          })
          t.store.data.latitude = res.latitude
          t.store.data.longitude = res.longitude
          await t.setCityNameORStreetName(res.latitude,res.longitude)
          await t.store.data.startScreen == 'auth' ? (t.selectComponent('#startScreen').authScreenNext('canNavToFinalScreen'),wx.hideToast()) : t.getWeatherData(false) 
        })(res)
      },
      fail: err => {
        wx.showModal({
          title: '是否授权以下应用权限',
          content: '地理位置',
          confirmText: "确认",
          cancelText: "取消",
          success: res => {
            if (res.confirm) {
              wx.openSetting({
                success: res => {
                  log(`[wx.openSetting] =>`, res, res.authSetting['scope.userLocation'])
                  if (res.authSetting['scope.userLocation'] == true) {
                    wx.getLocation({
                      success: res => {
                        (async (res) =>{
                          t.setData({
                            'latitude': res.latitude,
                            'longitude': res.longitude,
                            // 'radarMapLatitude' : res.latitude,
                            // 'radarMapLongitude' :res.longitude
                          })
                          t.store.data.latitude = res.latitude
                          t.store.data.longitude = res.longitude
                          await setCityNameORStreetName(res.latitude,res.longitude)
                          await t.store.data.startScreen !== 'auth' ?(t.getWeatherData(false)) : t.authScreenNext('canNavToFinalScreen')
                        })(res)
                      },
                      fail: err => {
                        log(`[getLocation] => fail =>`,err)
                      }
                    });
                  } 
                }
              });
            } else {
              log('[scope.userLocation] fail')
            }
          }
        });
        log(`[getLocation] => fail =>`,err)
      }
    });
    app.changeStorage('getLocationMethod', 'auto')
  },
  getNewLocationByManual() {
    log('[getNewLocationByManual]')
    const t = this
    let locationKey = config.locationKey
    const appReferer = '奇妙天气-小程序';
    const locationCategory = '奇妙天气,XHY';
    wx.hideToast()
    wx.navigateTo({
      url: 'plugin://chooseLocation/index?key=' + locationKey + '&referer=' + appReferer + '&category=' + locationCategory
    });
  },
  setNewWeatherDataByHistory(e) {
    const t = this
    var curCityData = e.detail.curCityData
    log('[setNewWeatherDataByHistory]', e.detail)
    t.setData({
      'latitude': curCityData.latitude,
      'longitude': curCityData.longitude,
      'forecastData.city': curCityData.city,
      'forecastData.address': curCityData.address,
      'modalName': null
    })
    t.store.data.latitude = curCityData.latitude
    t.store.data.longitude = curCityData.longitude
    const changeStorage = () => {
        app.changeStorage('getLocationMethod', 'historyCity')
        t.store.data.getLocationMethod = 'historyCity'
      }
      (async () => {
        await t.getWeatherData(true)
        await changeStorage()
      })()
  },
  setCityNameORStreetName(latitude,longitude){
    const t = this
    qqMapWX.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: res => {
        log(`[reverseGeocoder]`, res)
        let e = res.result;
        t.setData({
          'forecastData.city': e.address_component.city,
          'forecastData.address': e.formatted_addresses.recommend
        })
      },
      fail: err => {
        log(`[reverseGeocoder] = > ${err}`)
      }
    })
  },
  _getWeatherData(e){
      log('[_getWeatherData]',e.detail.canRefreshChart)
      const t = this
      const setGeo = (e) =>{
        t.store.data.latitude = e.latitude
        t.store.data.longitude = e.longitude
      }
      (async () => {
        await setGeo(e.detail)
        await t.setCityNameORStreetName(e.detail.latitude,e.detail.longitude)
        await t.setData({
          'canRefreshChart' : e.detail.canRefreshChart
        })
        await t.getWeatherData(e.detail.canRefreshChart)
      })()
  },
  getWeatherData(canRefreshChart) {
    const t = this
    log('[getWeatherData]',t.store.data.longitude , t.store.data.latitude)
    let apiHost = config.weatherApiHost + "/" + config.weatherApiVersion + "/" + config.weatherApiToken + "/" + t.store.data.longitude + "," + t.store.data.latitude + "/weather.jsonp?lang=" + t.store.data.languageValue + "&dailysteps=30&hourlysteps=120&alert=true&unit=" + t.store.data.unitValue
    log('[getWeatherData] => apiHost', apiHost)
    wx.request({
      url: apiHost,
      success: a => {
        let weatherData = a.data.result;
        const refreshOrInitChart = (canRefreshChart) => {
          const initChart = () => {
            // log('[initChart]')
            const temperatureChartComponent = t.selectComponent('#temperatureChart');
            temperatureChartComponent.lazyInitTemperatureChart(t.initTemperatureChart);
            const rainChartComponent = t.selectComponent('#rainChart');
            rainChartComponent.lazyInitRainChart(t.initRainChart);
            const radarChartComponent = t.selectComponent('#radarChart');
            radarChartComponent.lazyInitRadarChart(t.initRadarChart);
          }
          const refreshChart = () => {
            const getdata = async () =>{
              let temperatureChartData = await t.getTemperatureChartData().chartData
              let rainChartData= t.data.isHourlyRainChart == 'true'? await t.getHourlyRainChartData() : await t.getDailyRainChartData()
              let radarChartData= await t.getRadarChartData()
              return {temperatureChartData : temperatureChartData,rainChartData :rainChartData,radarChartData:radarChartData}
            }
            getdata().then(result =>{
              rainChart.changeData(result.rainChartData)
              radarChart.changeData(result.radarChartData)
              temperatureChart.changeData(result.temperatureChartData)
            })
            temperatureChart.guide().clear();
            log('[refreshChartData]')
          }
          log('[canRefreshChart] => ', canRefreshChart)
          canRefreshChart == true ? (refreshChart(),t.getWeatherImage()) : initChart()
        }
        (async (weatherData, canRefreshChart) => {
          try{
            await t.loadingProgress(true)
            await t.setData({
              'canBlurRoot': true,
              'refreshSunset':!t.data.refreshSunset
            })
            await t.formatWeatherData(weatherData)
            await t.selectComponent('#startScreen').screenFadeOut()
            await t.setData({
              'canBlurRoot': false
            })
            await t.scrollTo('#top')
            await refreshOrInitChart(canRefreshChart)
            await t.loadingProgress(false)
            await t.openSnackBar()
            // await t.setRadarMapSetting()
            // await t.getWeatherImage()
            // await (t.data.forecastData.alarmInfo.length == 1 && t.store.data.warningValue == 'true') ? t.openSnackBar() : ''
          }catch{
            
          }
          app.saveData("forecastData", weatherData)
        })(weatherData, canRefreshChart)
      }
    })
  },
  formatWeatherData(a) {
    const that = this;
    const realtime = (realtime) => {
      let realtimeTemperature = realtime.temperature
      let realtimeSkycon = realtime.skycon
      let realtimeWind = {
        wind: that.getWindDirect(realtime.wind.direction),
        windSpeed: realtime.wind.speed,
        windLevel: that.getWindLevel(realtime.wind.speed),
        windDirection: that.getWindDirect(realtime.wind.direction)
      }
      let realtimeAirquality = {
        aqi: realtime.air_quality.aqi.chn,
        aqiName: realtime.air_quality.description.chn,
        aqiDescription: that.getAqiDescription(realtime.air_quality.aqi.chn),
        aqiLevel: that.getAqiData(realtime.aqi).level,
        no2: realtime.air_quality.no2,
        o3: realtime.air_quality.o3,
        pm10: realtime.air_quality.pm10,
        pm25: realtime.air_quality.pm25,
        so2: realtime.air_quality.so2,
        co: realtime.air_quality.co
      }
      let realtimeAqiColor = that.setAqiColor(realtime.aqi)
      let realtimeData = {
        nowTemp: ~~(realtimeTemperature),
        skycon: realtime.skycon,
        skyconCN: that.store.data.languageValue == 'zh_TW' ? transWeatherName.weatherSkyconTW[realtimeSkycon] : that.store.data.languageValue == 'ja' ? transWeatherName.weatherSkyconJA[realtimeSkycon] :that.store.data.languageValue == 'zh_CN' ? transWeatherName.weatherSkyconCN[realtimeSkycon] : transWeatherName.weatherSkyconEN[realtimeSkycon],
        wind: realtimeWind,
        humidity: that.getHumidity(parseInt(100 * realtime.humidity)),
        airQuality: realtimeAirquality,
        aqiColor: realtimeAqiColor
      }
      const reduceHistoryCityData = (reduceData) => {
        let historyCityList = wx.getStorageSync('historyCityList') || []
        let hash = {}
        historyCityList.unshift(reduceData)
        historyCityList = historyCityList.reduce(
          function (item, next) {
            hash[next.address] ? '' : hash[next.address] = true && item.push(next);
            return item
          }, [])
        return historyCityList
      }
      let data = {
        address: that.data.forecastData.address,
        city: that.data.forecastData.city,
        icon: config.cosApiHost + "/weather/icon/flatIcon",
        backgroundBg:that.selectComponent('#headImage').getWeatherImage(realtime.skycon),
        nowTemp: ~~(realtimeTemperature),
        skycon: realtime.skycon,
        skyconCN: that.store.data.languageValue == 'zh_TW' ? transWeatherName.weatherSkyconTW[realtimeSkycon] : that.store.data.languageValue == 'ja' ? transWeatherName.weatherSkyconJA[realtimeSkycon] :that.store.data.languageValue == 'zh_CN' ? transWeatherName.weatherSkyconCN[realtimeSkycon] : transWeatherName.weatherSkyconEN[realtimeSkycon],
        latitude: that.store.data.latitude,
        longitude: that.store.data.longitude
      }
      let historyCityList = reduceHistoryCityData(data)
      app.saveData("historyCityList", historyCityList)
      // var count = 20,keyword = transWeatherName.weatherKeyWord[realtimeSkycon]
      // app.request('GET','https://500px.com.cn/community/searchv2?client_type=1&imgSize=p2%2Cp4&key='+ keyword +'&searchType=photo&page=1&size='+ count +'&type=json&avatarSize=a1&resourceType=0%2C2',{}).then((result) => {
      //   log('[saveHistoryCityLists]',result.data.data)
      //   let randomBgIndex = _.random(0,result.data.data.length-1)
      //   let backgroundBg = result.data.data[randomBgIndex].url.p2
      //   let data = {
      //     address: that.data.forecastData.address,
      //     city: that.data.forecastData.city,
      //     icon: config.cosApiHost + "/weather/icon/flatIcon",
      //     backgroundBg:that.selectComponent('#headImage').getWeatherImage(),
      //     nowTemp: ~~(realtimeTemperature),
      //     skycon: realtime.skycon,
      //     skyconCN: that.store.data.languageValue == 'zh_TW' ? transWeatherName.weatherSkyconTW[realtimeSkycon] : that.store.data.languageValue == 'ja' ? transWeatherName.weatherSkyconJA[realtimeSkycon] :that.store.data.languageValue == 'zh_CN' ? transWeatherName.weatherSkyconCN[realtimeSkycon] : transWeatherName.weatherSkyconEN[realtimeSkycon],
      //     latitude: that.store.data.latitude,
      //     longitude: that.store.data.longitude
      //   }
      //   let historyCityList = reduceHistoryCityData(data)
      //   that.setData({
      //     'weatherKeyWord': transWeatherName.weatherKeyWord[realtimeSkycon]
      //   })
      //   app.saveData("historyCityList", historyCityList)
      // }).catch((err) => {
      //   log(err);
      //   let data = {
      //     address: that.data.forecastData.address,
      //     city: that.data.forecastData.city,
      //     icon: config.cosApiHost + "/weather/icon/flatIcon",
      //     backgroundBg:'../../weatherui/assets/images/headbackground.jpg',
      //     nowTemp: ~~(realtimeTemperature),
      //     skycon: realtime.skycon,
      //     skyconCN: that.store.data.languageValue == 'zh_TW' ? transWeatherName.weatherSkyconTW[realtimeSkycon] : that.store.data.languageValue == 'ja' ? transWeatherName.weatherSkyconJA[realtimeSkycon] :that.store.data.languageValue == 'zh_CN' ? transWeatherName.weatherSkyconCN[realtimeSkycon] : transWeatherName.weatherSkyconEN[realtimeSkycon],
      //     latitude: that.store.data.latitude,
      //     longitude: that.store.data.longitude
      //   }
      //   let historyCityList = reduceHistoryCityData(data)
      //   that.data.historyCityList = historyCityList
      //   that.setData({
      //     'weatherKeyWord': transWeatherName.weatherKeyWord[realtimeSkycon]
      //   })
      //   app.saveData("historyCityList", historyCityList)
      // })
      return realtimeData
    }
    // const minutely = () => {
    //   that.setData({
    //     'forecastData.minutely': {
    //       precipitation: a.minutely.precipitation,
    //       precipitation_2h: a.minutely.precipitation_2h,
    //       probability: a.minutely.probability
    //     }
    //   })
    // }
    const hourly = (hourlyData) => {
      for (var t = hourlyData, hourlyReduce = [], r = new Date().getHours(), n = 0; n < 48; n++) {
        let c = n + r;
        hourlyReduce.push({
          time: c % 24 + ".00",
          weather: that.store.data.languageValue == 'zh_TW' ? transWeatherName.weatherSkyconTW[t.skycon[n].value] : that.store.data.languageValue == 'ja' ? transWeatherName.weatherSkyconJA[t.skycon[n].value] :that.store.data.languageValue == 'zh_CN' ? transWeatherName.weatherSkyconCN[t.skycon[n].value] : transWeatherName.weatherSkyconEN[t.skycon[n].value],
          weatherEN: t.skycon[n].value.replace(/_/g, ' '),
          iconPath: config.cosApiHost + "/weather/icon/"+ that.store.data.iconValue +"/" + t.skycon[n].value + "-icon",
          temp: ~~(t.temperature[n].value) + '°',
          wind: that.getWindDirect(t.wind[n].direction) + "·" + that.getWindLevel(t.wind[n].speed),
          value: t.skycon[n].value,
          precipitation: t.precipitation[n]
        });
      }
      return hourlyReduce
    }
    const service = (dailyData) => {
      let d = dailyData
      let themeValue = that.store.data.themeValue == 'light' ? '-light' : ''
      var serviceData = [{
        desc: ~~(d.temperature[0].avg) + '°',
        name: that.store.data.languageValue == 'zh_CN' ? "体感温度" : that.store.data.languageValue == 'zh_TW' ? "體感溫度" : that.store.data.languageValue == 'ja' ? "体性感覚温度" : "Feels Like",
        type: "sw-temperature",
        icon: config.cosApiHost + "/weather/service/"+ that.store.data.iconValue +"/sw-temperature" + themeValue+ '.svg'
      }, {
        desc: ~~(d.humidity[0].avg * 100) + "%",
        name: that.store.data.languageValue == 'zh_CN' ? "湿度" : that.store.data.languageValue == 'zh_TW' ? "濕度" : that.store.data.languageValue == 'ja' ? "湿度": "Humidity",
        type: "sw-humidity",
        icon: config.cosApiHost + "/weather/service/"+ that.store.data.iconValue +"/sw-humidity" + themeValue + '.svg'
      }, {
        desc: ~~(d.life_index.ultraviolet[0].index),
        name: that.store.data.languageValue == 'zh_CN' ? "紫外线指数" : that.store.data.languageValue == 'zh_TW' ? "紫外线指数"  : that.store.data.languageValue == 'ja' ? "SPF" : "UV index",
        type: "sw-ultraviolet",
        icon: config.cosApiHost + "/weather/service/"+ that.store.data.iconValue +"/sw-ultraviolet" + themeValue + '.svg'
      }, {
        desc: d.visibility[0].avg + "km",
        name: that.store.data.languageValue == 'zh_CN' ? "能见度" : that.store.data.languageValue == 'zh_TW' ? "能见度" : that.store.data.languageValue == 'ja' ? "視認性": "Visibility",
        type: "sw-visibility",
        icon: config.cosApiHost + "/weather/service/"+ that.store.data.iconValue +"/sw-visibility" + themeValue+ '.svg'
      }, {
        desc: d.cloudrate[0].avg,
        name: that.store.data.languageValue == 'zh_CN' ? "云量" : that.store.data.languageValue == 'zh_TW' ? "雲量" : that.store.data.languageValue == 'ja' ? "曇り": "Cloudiness",
        type: "sw-cloudrate",
        icon: config.cosApiHost + "/weather/service/"+ that.store.data.iconValue +"/sw-cloudrate" + themeValue+ '.svg'
      }, {
        desc: ~~(d.pressure[0].avg) + "mb",
        name: that.store.data.languageValue == 'zh_CN' ? "气压" : that.store.data.languageValue == 'zh_TW' ? "氣壓" : that.store.data.languageValue == 'ja' ? "空気圧" : "Pressure",
        type: "sw-pressure",
        icon: config.cosApiHost + "/weather/service/"+ that.store.data.iconValue +"/sw-pressure" + themeValue + '.svg'
      }]
      return serviceData
    }
    const daily = (dailyData) => {
      for (var d = dailyData, dailyReduce = [], f = 0; f < 16; f++) {
        let l = new Date().getDay() + f;
        l %= 7;
        let D = new Date();
        D.setDate(D.getDate() + f);
        let
          g = D.getMonth() + 1,
          h = D.getDate();
        g < 10 && (g = "0" + g), h < 10 && (h = "0" + h);
        let p = ''
        if (that.store.data.languageValue == 'zh_CN' || that.store.data.languageValue == 'zh_TW' || that.store.data.languageValue == 'ja') {
          p = g + "月" + h + '日'
        }else{
          p = g + "/" + h
        }

        let chartsMargin = ~~(d.temperature[f].min)
        //Set a horizontal line
        if (chartsMargin < 0) {
          chartsMargin = ~~(d.temperature[f].min) + 20
        }
        const getWeek = (l) => {
          let tweek = ''
          if (that.store.data.languageValue == 'zh_CN' || that.store.data.languageValue == 'zh_TW') {
            tweek = "星期" + "天一二三四五六".charAt(l)
          } else if (that.store.data.languageValue == 'en_US' || that.store.data.languageValue == 'en_GB') {
            tweek = ["Mon.", "Tues.", "Wed.", "Thur.", "Fri.", "Sat.", "Sun."][l]
          }else if (that.store.data.languageValue == 'ja') {
            tweek = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'][l]
          }
          // log('[tweek]',tweek)
          return tweek
        }
        dailyReduce.push({
          date: getWeek(l),
          weather:that.store.data.languageValue == 'zh_TW' ? transWeatherName.weatherSkyconTW[d.skycon[f].value] : that.store.data.languageValue == 'ja' ? transWeatherName.weatherSkyconJA[d.skycon[f].value] :that.store.data.languageValue == 'zh_CN' ? transWeatherName.weatherSkyconCN[d.skycon[f].value] : transWeatherName.weatherSkyconEN[d.skycon[f].value],
          weatherEN: d.skycon[f].value.replace(/_/g, ' '),
          iconPath: config.cosApiHost + "/weather/icon/"+ that.store.data.iconValue + "/" + d.skycon[f].value + "-icon",
          min: ~~(d.temperature[f].min),
          max: ~~(d.temperature[f].max),
          monthday: p,
          id: d.skycon[f].value,
          aqi: d.air_quality.aqi[f].avg.chn,
          astro: {
            date: d.astro[f].date,
            planetRise: d.astro[f].sunrise.time,
            planetSet: d.astro[f].sunset.time
          },
          windLevel: that.getWindLevel(d.wind[f].avg.speed),
          windDirect: that.getWindDirect(d.wind[f].avg.direction),
          precipitation: d.precipitation[f]
        });
      }
      return dailyReduce
    }
    const alertContent = (alertData) => {
      if (alertData == []) {
        return
      } else {
        for (var y = alertData, v = [], w = 0; w < y.length; w++) {
          v.push({
            level: y[w].code.slice(2, 4),
            alertType: y[w].code.slice(0, 2),
            content: y[w].description,
            source: y[w].source,
            icon:transWeatherName.WeatherWarningIcon[y[w].code.slice(0, 2)],
            levelName: transWeatherName.WeatherWarningLevel[y[w].code.slice(2, 4)],
            typeName: transWeatherName.WeatherWarning[y[w].code.slice(0, 2)]
          });
        }
        return v
      }
    }
    const setCurTime = () => {
      const getDates = (days, todate) => {
        const dateLater = (dates,later) => {
          let dateObj = {};
          let show_day = that.store.data.languageValue == 'en_US' ? new Array('Sun.', 'Mon.', 'Tues.', 'Wed.', 'Thur.', 'Fri.', 'Sat.') : 
          that.store.data.languageValue =='en_GB' ? new Array('Sun.', 'Mon.', 'Tues.', 'Wed.', 'Thur.', 'Fri.', 'Sat.') :
          that.store.data.languageValue =='ja' ? new Array('日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日') :
          new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六') 
          let date = new Date(dates);
          date.setDate(date.getDate() + later);
          let day = date.getDay();
          let yearDate = date.getFullYear();
          let month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
          let dayFormate = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
          dateObj.time = yearDate + '-' + month + '-' + dayFormate;
          dateObj.week = show_day[day];
          return dateObj;
        }
          var dateArry = [];
          for (var i = 0; i < days; i++) {
            var dateObj = dateLater(todate, i);
            dateArry.push(dateObj)
          }
          return dateArry;
      }
      let time = util.formatDate(new Date())
      let date = getDates(7, time)
      let curDetailTime = date[0].time + " " + date[0].week
      app.saveData("lastRefreshTime", curDetailTime)
      return curDetailTime
    }
    const setTimelyWeather = (forecastData) => {
      const realtimeData = realtime(forecastData.realtime)
      const hourlyData = hourly(forecastData.hourly)
      const dailyData = daily(forecastData.daily)
      const serviceData = service(forecastData.daily)
      const alertContentData = alertContent(forecastData.alert.content)
      const curTime = setCurTime()
      console.group(`%c  setTimelyWeather`, 'color:#e0c184; font-weight: bold', 'color:#f0a139; font-weight: bold')
      console.log(`%c realtime`, 'color:#3d91cf; font-weight: bold', realtimeData)
      console.log(`%c hourly`, 'color:#3d91cf; font-weight: bold', hourlyData)
      console.log(`%c daily`, 'color:#3d91cf; font-weight: bold', dailyData)
      console.log(`%c serviceData`, 'color:#3d91cf; font-weight: bold', serviceData)
      console.log(`%c alertContentData`, 'color:#3d91cf; font-weight: bold', alertContentData[0])
      console.log(`%c curTime`, 'color:#3d91cf; font-weight: bold', curTime)
      console.groupEnd()

      that.setData({
        'forecastData.daily': dailyData,
        'forecastData.realtime': realtimeData,
        'forecastData.hourly': hourlyData,
        'forecastData.serviceData': serviceData,
        'forecastData.hourlyKeypoint': a.hourly.description,
        'forecastData.alarmInfo': alertContentData,
        'curDetailTime': curTime
        // 'forecastData.minutelyKeypoint': a.minutely.description,
        // 'forecastData.minutely':{
        //   precipitation:a.minutely.precipitation,
        //   precipitation_2h:a.minutely.precipitation_2h,
        //   probability:a.minutely.probability
        // }
      });
    }
    
    // const getWeatherImage = () => {
    //   if(that.store.data.indexHeadImageValue == 'Weather'){
    //     that.selectComponent('#headImage').getWeatherImage()
    //   }
    // }
    (async () => {
      await setTimelyWeather(a)
      // await getWeatherImage()
      await that.setRadarMapSetting()
      await that.setData({
        'loadHeadImage':!that.data.loadHeadImage,
      })
    })()
  },
  setRefreshWeatherInterval() {
    const t = this
    let refreshTime = t.store.data.refreshfrequencyValue * 60 * 1000
    log('[refreshWeatherDataTime]', refreshTime)
    setInterval(() => {
      log('[setRefreshWeatherInterval] => setInterval()', refreshTime)
      log(`[setRefreshWeatherInterval]`, t.store.data.startScreen)
      let time = util.formatDate(new Date())
      let date = util.getDates(7, time)
      app.saveData("lastRefreshTime", date[0].time)
      if (t.store.data.startScreen !== 'auth') {
          (async () => {
            await t.setData({
              'canBlurRoot': true
            })
            await t.getWeatherData(true)
            await t.setData({
              'canBlurRoot': false
            })
          })()
      }
    }, refreshTime);
  },
  setAqiColor(a) {
    let t = "#4ADC9B";
    return 0 <= a && a <= 50 ? t = "#4ADC9B" : 51 <= a && a <= 100 ? t = "#F5E878" : 101 <= a && a <= 150 ? t = "#FC9F62" : 151 <= a && a <= 200 ? t = "#FD4452" : 201 <= a && a <= 300 ? t = "#B044FC" : 300 <= a && (t = "#B044FC"),
      t;
  },
  getAqiData(a) {
    let t = "优",
      e = 1,
      o = "#A3D765";
    return a <= 50 ? (t = "优", e = 1, o = "#A3D765") : 51 <= a && a <= 100 ? (t = "良",
      e = 2, o = "#F0CC35") : 101 <= a && a <= 150 ? (t = "轻度污染", e = 3, o = "#F1AB62") : 151 <= a && a <= 200 ? (t = "中度污染",
      e = 4, o = "#EF7F77") : 201 <= a && a <= 300 ? (t = "重度污染", e = 5, o = "#B28CCB") : a > 300 && (t = "严重污染",
      e = 6, o = "#AD788A"), {
      name: t,
      color: o,
      level: e
    };
  },
  getAqiDescription(a) {
    const self = this,
      zh_CN = () => {
        let d = '暂无描述'
        return a = 0 ? (d = "暂无描述") : a <= 50 && a>0 ? (d = "令人满意的空气质量") : 51 <= a && a <= 100 ? (d = "可以接受的空气质量") : 101 <= a && a <= 150 ? (d = "敏感人群可能会感到不适") : 151 <= a && a <= 200 ? (d = "一般人群应避免户外活动") : 201 <= a && a <= 300 ? (d = "健康预警：一般人群可能会出现不适应症状") : a > 300 && (d = "紧急情况下的健康预警"), d;
      },
      ja = () => {
        let d = '説明なし'
        return a = 0 ? (d = "説明なし") : a <= 50 && a>0 ? (d = "十分な空気質") : 
        51 <= a && a <= 100 ? (d = "許容できる空気の質") : 
        101 <= a && a <= 150 ? (d = "敏感な人は気分が悪いかもしれません") : 
        151 <= a && a <= 200 ? (d = "一般住民は野外活動を避けるべきです") : 
        201 <= a && a <= 300 ? (d = "健康に関する警告：一般住民は不適応の症状を持っている可能性があります") : 
        a > 300 && (d = "緊急事態における健康の早期警告"), d;
      },
      zh_TW = () => {
        let d = '暫無描述'
        return a = 0 ? (d = "暫無描述") : a <= 50 && a>0 ? (d = "令人滿意的空氣質量") : 51 <= a && a <= 100 ? (d = "可以接受的空氣質量") : 101 <= a && a <= 150 ? (d = "敏感人群可能會感到不適") : 151 <= a && a <= 200 ? (d = "一般人群應避免戶外活動") : 201 <= a && a <= 300 ? (d = "健康預警：一般人群可能會出現不適應症狀") : a > 300 && (d = "緊急情況: 健康預警"), d;
      },
      en_US_en_GB = () => {
        let d = 'No description'
        return a = 0 ? (d = "No description") : a <= 50 && a>0 ? (d = "Satisfactory air quality") : 51 <= a && a <= 100 ? (d = "Acceptable air quality") : 101 <= a && a <= 150 ? (d = "Sensitive people may feel unwell") : 151 <= a && a <= 200 ? (d = "The general population should avoid outdoor activities") : 201 <= a && a <= 300 ? (d = "Health alert: general population may experience symptoms of maladjustment") : a > 300 && (d = "Health alert in emergencies"), d;
      }
    return self.store.data.languageValue == 'zh_CN' ? zh_CN() : self.store.data.languageValue == 'ja' ? ja() : self.store.data.languageValue == 'zh_TW' ? zh_TW() : self.store.data.languageValue == 'en_US' || self.store.data.languageValue == 'en_GB' ? en_US_en_GB() : warn('[getAqiDescription]')
  },
  getWindLevel(a) {
    const self = this
    let t = 0
    1 <= a && a <= 5 ? t = 1 : 6 <= a && a <= 11 ? t = 2 : 12 <= a && a <= 19 ? t = 3 : 20 <= a && a <= 28 ? t = 4 : 29 <= a && a <= 38 ? t = 5 : 39 <= a && a <= 49 ? t = 6 : 50 <= a && a <= 61 ? t = 7 : 62 <= a && a <= 74 ? t = 8 : 75 <= a && a <= 88 ? t = 9 : 89 <= a && a <= 102 ? t = 10 : 103 <= a && a <= 117 ? t = 11 : 118 <= a && a <= 133 ? t = 12 : 134 <= a && a <= 149 ? t = 13 : 150 <= a && a <= 166 ? t = 14 : 167 <= a && a <= 183 ? t = 15 : 184 <= a && a <= 201 ? t = 16 : 202 <= a && a <= 220 && (t = 17),
      t;
    if (self.store.data.languageValue == 'en_US' || self.store.data.languageValue == 'en_GB') {
      t = "WindLevel: " + t
    } else if (self.store.data.languageValue == 'zh_TW') {
      t = "風力:" + t + "級"
    } else if (self.store.data.languageValue == 'zh_CN') {
      t = "风力:" + t + "级"
    }else if (self.store.data.languageValue == 'ja') {
      t = "風力:" + t + "レベル"
    }
    return t
  },
  getWindSpeed(a) {
    const self = this,
      zh_CN = () => {
        let t = "软风";
        return a < 1 ? t = "无风" : 1 <= a <= 5 ? t = "软风" : 6 <= a <= 11 ? t = "轻风" : 12 <= a <= 19 ? t = "微风" : 20 <= a <= 28 ? t = "和风" : 29 <= a <= 38 ? t = "清风" : 39 <= a <= 49 ? t = "强风" : 50 <= a <= 61 ? t = "疾风" : 62 <= a <= 74 ? t = "大风" : 75 <= a <= 88 ? t = "烈风" : 89 <= a <= 102 ? t = "狂风" : 103 <= a <= 117 ? t = "暴风" : 118 <= a <= 133 ? t = "台风" : 134 <= a <= 149 ? t = "台风" : 150 <= a <= 166 ? t = "强台风" : 167 <= a <= 183 ? t = "强台风" : 184 <= a <= 201 ? t = "超强台风" : 202 <= a <= 220 ? t = "超强台风" : a >= 221 && (t = "超强台⻛"),
          t;
      },
      ja = () => {
        let t = "軽い空気";
        return a < 1 ? t = "風がない" : 1 <= a <= 5 ? t = "軽い空気" : 6 <= a <= 11 ? t = "そよ風" : 12 <= a <= 19 ? t = "風" : 20 <= a <= 28 ? t = "ゼファー" : 29 <= a <= 38 ? t = "風" : 39 <= a <= 49 ? t = "強風" : 50 <= a <= 61 ? t = "爆風" : 62 <= a <= 74 ? t = "強風" : 75 <= a <= 88 ? t = "強風" : 89 <= a <= 102 ? t = "強風" : 103 <= a <= 117 ? t = "強風" : 118 <= a <= 133 ? t = "台風" : 134 <= a <= 149 ? t = "台風" : 150 <= a <= 166 ? t = "強い台風" : 167 <= a <= 183 ? t = "強い台風" : 184 <= a <= 201 ? t = "スーパー台風" : 202 <= a <= 220 ? t = "スーパー台風" : a >= 221 && (t = "スーパー台風"),
          t;
      },
      zh_TW = () => {
        let t = "軟風";
        return a < 1 ? t = "無風" : 1 <= a <= 5 ? t = "軟風" : 6 <= a <= 11 ? t = "輕風" : 12 <= a <= 19 ? t = "微風" : 20 <= a <= 28 ? t = "和風" : 29 <= a <= 38 ? t = "清風" : 39 <= a <= 49 ? t = "強風" : 50 <= a <= 61 ? t = "疾風" : 62 <= a <= 74 ? t = "大風" : 75 <= a <= 88 ? t = "烈風" : 89 <= a <= 102 ? t = "狂風" : 103 <= a <= 117 ? t = "暴風" : 118 <= a <= 133 ? t = "颱風" : 134 <= a <= 149 ? t = "颱風" : 150 <= a <= 166 ? t = "強颱風" : 167 <= a <= 183 ? t = "強颱風" : 184 <= a <= 201 ? t = "超強颱風" : 202 <= a <= 220 ? t = "超強颱風" : a >= 221 && (t = "超強颱風"),
          t;
      },
      en_US_en_GB = () => {
        let t = "Light air";
        return a < 1 ? t = "Calm" : 1 <= a <= 5 ? t = "Light air" : 6 <= a <= 11 ? t = "Light breeze" : 12 <= a <= 19 ? t = "Gentle breeze" : 20 <= a <= 28 ? t = "Moderate breeze" : 29 <= a <= 38 ? t = "Fresh breeze" : 39 <= a <= 49 ? t = "Strong breeze" : 50 <= a <= 61 ? t = "Near Gale" : 62 <= a <= 74 ? t = "Gale" : 75 <= a <= 88 ? t = "Severe Gale" : 89 <= a <= 102 ? t = "Storm" : 103 <= a <= 117 ? t = "Violent Storm" : 118 <= a <= 133 ? t = "Hurricane" : 134 <= a <= 149 ? t = "Hurricane" : 150 <= a <= 166 ? t = "Strong hurricane" : 167 <= a <= 183 ? t = "Strong hurricane" : 184 <= a <= 201 ? t = "Super Hurricane" : 202 <= a <= 220 ? t = "Super Hurricane" : a >= 221 && (t = "Super Hurricane"),
          t;
      }
    log('[getWindSpeed]', self.store.data.languageValue)
    return self.store.data.languageValue == 'zh_CN' ? zh_CN() : self.store.data.languageValue == 'ja' ? ja() : self.store.data.languageValue == 'zh_TW' ? zh_TW() : self.store.data.languageValue == 'en_US' || self.store.data.languageValue == 'en_GB' ? en_US_en_GB() : warn('[getWindSpeed]')
  },
  getHumidity(a) {
    const self = this
    if (self.store.data.languageValue == 'en_US' || self.store.data.languageValue == 'en_GB') {
      a = "Humidity: " + a + "%"
    } else if (self.store.data.languageValue == 'zh_TW') {
      a = "濕度: " + a + "%"
    } else if (self.store.data.languageValue == 'zh_CN') {
      a = "湿度: " + a + "%"
    }else if (self.store.data.languageValue == 'ja') {
      a = "湿度: " + a + "%"
    }
    return a
  },
  getWindDirect(a) {
    const self = this,
      zh_CN = () => {
        let t = "北";
        return 11.26 <= a && a <= 78.75 ? t = "东北" : 78.76 <= a && a <= 101.25 ? t = "东" : 101.26 <= a && a <= 168.75 ? t = "东南" : 168.76 <= a && a <= 191.25 ? t = "南" : 191.26 <= a && a <= 258.75 ? t = "西南" : 258.76 <= a && a <= 281.25 ? t = "西" : 281.26 <= a && a <= 348.75 && (t = "西北"),
          t + "风";
      },
      ja = () => {
        let t = "北";
        return 11.26 <= a && a <= 78.75 ? t = "北東" : 78.76 <= a && a <= 101.25 ? t = "東" : 101.26 <= a && a <= 168.75 ? t = "南東" : 168.76 <= a && a <= 191.25 ? t = "南" : 191.26 <= a && a <= 258.75 ? t = "南西" : 258.76 <= a && a <= 281.25 ? t = "西" : 281.26 <= a && a <= 348.75 && (t = "北西"),
          t + "風";
      },
      zh_TW = () => {
        let t = "北";
        return 11.26 <= a && a <= 78.75 ? t = "東北" : 78.76 <= a && a <= 101.25 ? t = "東" : 101.26 <= a && a <= 168.75 ? t = "東南" : 168.76 <= a && a <= 191.25 ? t = "南" : 191.26 <= a && a <= 258.75 ? t = "西南" : 258.76 <= a && a <= 281.25 ? t = "西" : 281.26 <= a && a <= 348.75 && (t = "西北"),
          t + "風";
      },
      en_US_en_GB = () => {
        let t = "North";
        return 11.26 <= a && a <= 78.75 ? t = "Northeast" : 78.76 <= a && a <= 101.25 ? t = "East" : 101.26 <= a && a <= 168.75 ? t = "Southeast" : 168.76 <= a && a <= 191.25 ? t = "South" : 191.26 <= a && a <= 258.75 ? t = "Southwest" : 258.76 <= a && a <= 281.25 ? t = "West" : 281.26 <= a && a <= 348.75 && (t = "Northwest"),
          "WindDirect: " + t;
      }
    return self.store.data.languageValue == 'zh_CN' ? zh_CN() :self.store.data.languageValue == 'ja' ? ja() : self.store.data.languageValue == 'zh_TW' ? zh_TW() : self.store.data.languageValue == 'en_US' || self.store.data.languageValue == 'en_GB' ? en_US_en_GB() : warn('[getWindDirect]')
  },
  getMoonPhaseList() {
    const t = this
    let obj = Array.from(Array(30), (v, k) => k)
    obj.map(function (value, index, arr) {
      const getMoonName = (r) => {
        // log('[getMoonName]',r)
        let zh_CN = '新月'
        let zh_TW = '新月'
        let ja = '新月'
        let en_US_en_GB = 'New Moon'
        return r <= 0.055 ? (zh_CN = '新月', zh_TW = '新月', en_US_en_GB = 'New Moon',ja= '新月') : 
        0.055 < r && r <= 0.245 ? (zh_CN = '峨眉月', zh_TW = '峨眉月', en_US_en_GB = 'Waxing Crescent' ,ja= '峨眉の月') : 
        0.245 < r && r <= 0.255 ? (zh_CN = '上弦月', zh_TW = '上弦月', en_US_en_GB = 'First Quarter',ja= '上弦の月') : 
        0.255 < r && r <= 0.495 ? (zh_CN = '盈凸月', zh_TW = '盈凸月', en_US_en_GB = 'Waxing Gibbous',ja= '満ちる月') :
         0.495 < r && r <= 0.51 ? (zh_CN = '满月', zh_TW = '滿月', en_US_en_GB = 'Full Moon',ja= 'ゆんゆう') :
          0.51 < r && r <= 0.745 ? (zh_CN = '亏凸月', zh_TW = '虧凸月', en_US_en_GB = 'Waning Gibbous',ja= 'マイナス凸月') : 
          0.745 < r && r <= 0.755 ? (zh_CN = '下弦月', zh_TW = '下弦月', en_US_en_GB = 'Last Quarter',ja= '下弦の月') : 
          0.755 < r && r <= 1 ? (zh_CN = '残月', zh_TW = '殘月', en_US_en_GB = 'Waning Crescent',ja= '三日月') : 
          r > 1 && (zh_CN = '丽月', zh_TW = '丽月', en_US_en_GB = 'Li Yue',ja= '丽月'), {
          zh_CN: zh_CN,
          en_US_en_GB: en_US_en_GB,
          zh_TW: zh_TW,
          ja:ja
        }
      }
      let moonListsTime = []
      moonListsTime[index] = new Date()
      moonListsTime[index].setDate(moonListsTime[index].getDate() + index)
      let objDetailValue = {
        moonPhaseIndex: sunCalc.getMoonIllumination(moonListsTime[index]).phase,
        moonPhaseDate_zh_CN: moonListsTime[index].getMonth() + 1 + "月" + moonListsTime[index].getDate() + "日",
        moonPhaseDate_zh_TW: moonListsTime[index].getMonth() + 1 + "月" + moonListsTime[index].getDate() + "日",
        moonPhaseDate_ja: moonListsTime[index].getMonth() + 1 + "月" + moonListsTime[index].getDate() + "日",
        moonPhaseDate_en_US_en_GB: moonListsTime[index].getMonth() + 1 + "/" + moonListsTime[index].getDate(),
        moonPhaseName_zh_CN: '',
        moonPhaseName_en_US_en_GB: '',
        moonPhaseName_zh_TW: '',
        moonPhaseName_ja: '',
        moonPhaseName_Image: ''
      }
      obj.fill(objDetailValue, index, index + 1)
      let moonPhaseName = getMoonName(obj[index].moonPhaseIndex)
      obj[index].moonPhaseName_zh_CN = moonPhaseName.zh_CN
      obj[index].moonPhaseName_en_US_en_GB = moonPhaseName.en_US_en_GB,
      obj[index].moonPhaseName_zh_TW = moonPhaseName.zh_TW,
      obj[index].moonPhaseName_ja = moonPhaseName.ja,
      obj[index].moonPhaseName_Image = moonPhaseName.en_US_en_GB.replace(' ', '')
    })
    let reduceObj = {}
    let moonPhaseLists = obj.reduce((item, next) => {
      // log('[next]',next)
      if (!reduceObj[next.moonPhaseName_zh_CN]) {
        item.push(next);
        reduceObj[next.moonPhaseName_zh_CN] = true;
      }
      return item;
    }, []) || []

    t.setData({
      moonPhaseLists: moonPhaseLists
    })
    // log(`[moonPhaseLists] =>`, moonPhaseLists)
  },
  onStartAccelerometer(){
    wx.startAccelerometer({
      interval: "ui"
    });
    const that = this
    let t = globalData.screenWidth
    let a = t / 750
    let o = 75 * a
    let n = 168.5 * a
    that.setData({
      ww:o,
      hh:n
    })
    wx.onAccelerometerChange(function(t) {
        let a = -10 * t.x
        let o = -10 * t.y;
        Math.abs(a) > 7 || Math.abs(o) > 10 || (that.setData({
          x : a,
          y : o
        }))
    });
  },
  showDrawerModal(e){
    const t = this
    t.setData({
      drawerModalName: e.currentTarget.dataset.target
    })
  },
  _showDrawerModal(e){
    const t = this
    log(e)
    t.setData({
      drawerModalName: e.detail.drawerModalName
    })
  },
  hideDrawerModal(e){
    log('[hideDrawerModal]')
    var drawerModalName = e.detail.drawerModalName;
    const t = this
    t.setData({
      drawerModalName: drawerModalName
    })
  },
  savePostImg(e){
    this.setData({
      modalName:e.detail.modalName
    })
    this.eventDraw()
  },
  showModalListener(e) {
    log('[showModal]', e)
    const t = this
    const setData = (drawerModalName) => {
      t.setData({
        drawerModalName: drawerModalName
      })
    }
    setData(e.detail)
    // e.detail == 'shareImage' ? (t.eventDraw(), setData(e.detail)) : setData(e.detail)
  },
  hideModal(e) {
    log('[hideModal]')
    const t = this
    t.setData({
      modalName: null
    })
    // wx.hideLoading()
  },
  navChange(e) {
    log(`[navChange] => ${e.currentTarget.dataset.cur}`)
    const cur = e.currentTarget.dataset.cur
    wx.navigateTo({
      url: '../' + cur + '/' + cur
    });
  },
  navCopyrightlink(e){
    log('[navCopyrightlink]')
    let cur = e.target.dataset.cur
    wx.navigateTo({
      url: '../' + cur + '/' + cur
    });
  },
  navRadar() {
    // appid:'wx673e7d2fe4e6a413',  //订阅号
    // appid:'wx7b4bbc2d9c538e84', //服务号
    log('[navRadar]', globalData.appid)
    const t = this
    log('[navigateTo]')
    wx.navigateTo({
      url: '../radar/radar?latitude=' + t.store.data.latitude + "&longitude=" + t.store.data.longitude
    })
  },
  navSetting() {
    wx.navigateTo({
      url: '../setting/setting'
    });
  },
  navAbout() {
    wx.navigateTo({
      url: '../setting/about/about'
    });
  },
  navWechatsi(){
    wx.navigateTo({
      url: '../plugins/page/wechatsi/wechatsi'
    })
  },
  onPullDownRefresh() {
    const t = this
    log(`[onPullDownRefresh]`, t.store.data.startScreen)
    let time = util.formatDate(new Date())
    let date = util.getDates(7, time)
    app.saveData("lastRefreshTime", date[0].time)
    if (t.store.data.startScreen !== 'auth') {
        (async () => {
          await t.setData({
            'canBlurRoot': true
          })
          await t.getWeatherData(true)
          await wx.stopPullDownRefresh();
          await t.setData({
            'canBlurRoot': false
          })
        })()
    }
  },
  onReachBottom() {
    log(`[onReachBottom]`)
  },
  eventDraw() {
    log(`[eventDraw]`)
    const t = this
    wx.showLoading({
      title: 'Loading',
      mask: true
    })
    t.setData({
      painting: {
        width: 300,
        height: 350,
        clear: true,
        views: [{
            type: 'image',
            url: this.selectComponent('#headImage').data.bingImage || this.selectComponent('#headImage').data.NASAImage || this.selectComponent('#headImage').data.weatherImage || 'https://weather.ioslide.com/weather/defaultHeadImage.png',
            top: 0,
            left: 0,
            width: 300,
            height: 210
          },
          {
            type: 'rect',
            background: '#ffffff',
            top: 210,
            left: 0,
            width: 300,
            height: 140
          },
          {
            type: 'text',
            content: t.data.forecastData.hourlyKeypoint,
            fontSize: 14,
            lineHeight: 21,
            color: '#383549',
            textAlign: 'center',
            top: 220,
            left: 146,
            width: 200,
            MaxLineNumber: 2,
            breakWord: true,
            bolder: true
          },
          {
            type: 'image',
            url: t.data.qrImageURL, //二维码
            top: 270,
            left: 120,
            width: 65,
            height: 65
          }
        ]
      }
    })
  },
  eventSave() {
    log(`[eventSave]`)
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success: res => {
        wx.showToast({
          title: '保存图片成功',
          mask: true,
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  eventGetImage(event) {
    const t = this
    log(`[eventGetImage] => `, event.detail.errMsg)
    wx.hideLoading()
    const {
      tempFilePath,
      errMsg
    } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      log('[canvasdrawer] => success')
      this.setData({
        shareImage: tempFilePath
      })
    }
  },
  pickerOpened() {
    log(`picker opened`);
  },
  timePickerSubmit(e){
    console.log(e);
    const t = this
    let pickTime = dayjs(e.detail.value.toString()).hour().toString() + dayjs(e.detail.value.toString()).minute().toString()
    log(pickTime)
    const templateId = 'oOTpsU26qGPpShCbFypuJj6eLlpDm_Yba9Jz500G4dk'
    const subDailyWeatherCloudFn = () => {
      let longtermData = {
        action: 'saveLongtermTemplateData',
        unit: t.store.data.unitValue,
        language: t.store.data.languageValue,
        city: t.data.forecastData.city,
        startTime: pickTime,
        latitude: t.store.data.latitude,
        longitude: t.store.ata.longitude,
        templateId: templateId,
        done: false
      }
      wx.cloud.callFunction({
        name: 'openapi',
        data: longtermData,
        success: res => {
        },
        fail: err => {}
      })
      t.hideModal()
    }
    subDailyWeatherCloudFn()
},
  datePickerSubmit(e) {
    const t = this
    let submitValue = e.detail.value
    let time = util.formatDate(submitValue)
    let date = util.getDates(7, time)
    let startTime = date[0].time
    log('nowTime,startTime,submitValue',startTime,dayjs().isAfter(dayjs(startTime)) )
    
    if(dayjs().isAfter(dayjs(startTime)) == true) {
      wx.showToast({
        title: t.store.data.languageValue == 'zh_TW' ? '不能選擇過去時間,請重新選擇':t.store.data.languageValue == 'zh_CN'? '不能选择过去时间,请重新选择':t.store.data.languageValue == 'ja'? '「過去の時間を選択できません。もう一度選択してください」':'Cannot select the past time, please select again',
        duration: 1500,
        icon: 'none',
        mask: true,
      })
      t.setData({
        longTerm:false,
        oneTime:false
      })
      return
    }
    const templateId = '4qBy3Pm6pqvOCP_RgX8MOhxYMwO36_YyxCkduHnsAbg'
    const subDailyWeatherCloudFn = () => {
      let onetimeData = {
        action: 'saveOnetimeTemplateData',
        page: 'pages/index/index',
        unit: t.store.data.unitValue,
        language: t.store.data.languageValue,
        city: t.data.forecastData.city,
        startTime: startTime,
        latitude: t.store.data.latitude,
        longitude: t.store.ata.longitude,
        templateId: templateId,
        done: false
      }
      t.data.subData = onetimeData
      wx.cloud.callFunction({
        name: 'openapi',
        data: onetimeData,
        success: res => {
          wx.hideLoading({
            success: () => {
              wx.showToast({
                title: t.store.data.languageValue == 'zh_TW' ? '訂閱成功':t.store.data.languageValue == 'zh_CN'? '订阅成功':t.store.data.languageValue == 'ja'? '正常にサブスクライブしました':'Successfully subscribed',
                icon: 'success',
                duration: 1000,
                mask: true
              });
              t.hideModal()
              t.setData({
                longTerm:false,
                oneTime:false
              })
            }
          });
          log(`[subDailyWeatherCloudFn] => OK =>`,res)
        },
        fail: err => {
          log(`[subDailyWeatherCloudFn] => Fail => `,err)
        }
      })
    }
    const unSubDailyWeatherCloudFn = () => {
      let onetimeData = {
        action: 'deleteSubscribeMessage',
        startTime: startTime,
        templateId: templateId
      }
      t.data.subData = onetimeData
      log(t.data.subData)
      wx.cloud.callFunction({
        name: 'openapi',
        data: onetimeData,
        success: res => {
          wx.showToast({
            mask: true,
            title: '取消订阅成功',
            icon: 'success',
            duration: 1000,
          });
          log(`[unSubDailyWeatherCloudFn] => Success => ${res}`)
        },
        fail: err => {
          log(`[unSubDailyWeatherCloudFn] => Fail => ${err}`)
        }
      })
    }
    wx.requestSubscribeMessage({
      tmplIds: [templateId],
      success: res => {
        if (res.errMsg === 'requestSubscribeMessage:ok') {
          if (res[templateId] === 'accept') {
            wx.showLoading({
              title: 'Loading',
            })
            subDailyWeatherCloudFn()
          } else {
            unSubDailyWeatherCloudFn()
          }
        }
      },
      fail: result =>{
        wx.showToast({
          title: '订阅失败，微信版本过低',
          duration: 1500,
          icon: 'none',
          mask: true,
        })
        log(result)
      }
    });
  },
  openDatePicker(){
    log('[openDatePicker]')
    this.data.datePicker.open();
  },
  openTimePicker(){
    log('[openTimePicker]')
    this.data.timePicker.open();
    this.setData({
      longTerm:true
    })
    let subscribeType ={
      longTerm : false,
      oneTime: false
    }
    app.changeStorage('subscribeType', subscribeType)
  },
  openSubscribeRadioModal() {
    // this.setData({
    //   modalName: 'choseSubscribeType'
    // })
    wx.navigateTo({
      url: '../subscribe/subscribe',
    })
  },  
  subscribeTypeRadioChange(e){
    const t = this
    if(e.detail.value == 'longTerm'){
      t.openTimePicker()
    }else if(e.detail.value == 'oneTime'){
      t.openDatePicker()
    }
  },
  pickerOpen() {
    log(`picker opening`);
  },
  pickerClose() {
    log(`picker closing`);    
  },

  pickerClosed() {
    log(`picker closed`);
    this.setData({
      longTerm:false,
      oneTime:false
    })
  },
  eventHandle(e) {
    log('[official-account] =>', e)
  },
  touchStart(e) {
    let sx = e.touches[0].pageX
    let sy = e.touches[0].pageY
    this.data.touchS = [sx, sy]
  },
  touchMove(e) {
    let sx = e.touches[0].pageX
    let sy = e.touches[0].pageY
    this.data.touchE = [sx, sy]
  },
  touchEnd(e) {
    const t = this
    let start = this.data.touchS
    let end = this.data.touchE
    if (start[0] < end[0] - 50) {} else if (start[0] > end[0] + 50) {
      t.setData({
        drawerModalName: e.currentTarget.dataset.target
      })
    } else {}
  },
  touchEndLess(e) {
    const t = this
    let start = this.data.touchS
    let end = this.data.touchE
    if (start[0] < end[0] - 5) {
    } else if (start[0] > end[0] + 5) {
      t.setData({
        drawerModalName: e.currentTarget.dataset.target
      })
    } else {}
  },
  reqRadar() {
    const t = this
    const reqRainRadar = () => {
      let rainRadarApiHost = config.weatherApiHost + "/" + config.radarApiVersion + "/radar/fine_images?lat=" + t.store.data.latitude + "&lon=" + t.store.data.longitude + "&level=1&token=" + config.radarApiToken
      log('[reqRainRadar] => rainRadarApiHost', rainRadarApiHost)
      wx.request({
        url: rainRadarApiHost,
        success: (result) => {
          log('[rainRadarApiHost result]', result.data)
          if(result.data.status == 'failed'){
            warn(result.data.status)
            return
          }
          let rainRadarImg = result.data.images[0][0]
          let source = result.data.images[0]
          let rainRadarPosition = source[2]
          //Today
          const reduceRainRadarImages = () => {
            let rainRadarImageData = []
            let rainRadarImages = result.data.images
            for (var m = rainRadarImages, i = 0; i < rainRadarImages.length; i++) {
              var u = {
                image: m[i][0]
              };
              rainRadarImageData.push(u);
            }
            return rainRadarImageData
          }
          //Forecast
          const reduceRainRadarForecastImages = () => {
            var rainRadarforecastImagesData = []
            var rainRadarforecastImages = result.data.forecast_images
            for (var n = rainRadarforecastImages, j = 0; j < rainRadarforecastImages.length; j++) {
              var v = {
                image: n[j][0]
              };
              rainRadarforecastImagesData.push(v);
            }
            return rainRadarforecastImagesData
          }
          const reduceRainRadarData = async () => {
            let rainRadarforecastImagesData = await reduceRainRadarForecastImages()
            let rainRadarImageData = await reduceRainRadarImages()
            return {
              rainRadarImageData,
              rainRadarforecastImagesData
            }
          }
          reduceRainRadarData().then(res => {
            log('[rainRadarImg]',rainRadarImg,res.rainRadarImageData)
            t.setData({
              'latitude': (rainRadarPosition[0] + rainRadarPosition[2]) / 2,
              'longitude': (rainRadarPosition[1] + rainRadarPosition[3]) / 2,
              // 'radarMapLatitude' : (rainRadarPosition[0] + rainRadarPosition[2]) / 2,
              // 'radarMapLongitude' :(rainRadarPosition[1] + rainRadarPosition[3]) / 2,
              'forecastData.rainRadar.coverImage': rainRadarImg,
              'forecastData.rainRadar.images': res.rainRadarImageData,
              'forecastData.rainRadar.forecastImages': res.rainRadarforecastImagesData
            })
            t.store.data.latitude =  (rainRadarPosition[0] + rainRadarPosition[2]) / 2
            t.store.data.longitude = (rainRadarPosition[1] + rainRadarPosition[3]) / 2
          })
        },
        fail: (res) => {

        }
      })
    }
    const reqAqiRadar = () => {
      let aqiRadarApiHost = config.weatherApiHost + "/" + config.radarApiVersion + "/aqi/images?token=" + config.radarApiToken + "&lon=" + t.store.data.longitude + "&lat=" + t.store.data.latitude
      log('[reqAqiRadar] => aqiRadarApiHost', aqiRadarApiHost)
      wx.request({
        url: aqiRadarApiHost,
        success: (result) => {
          log('[reqAqiRadar]', result.data.images)
          let aqiRadarImg = result.data.images[0][0]
          t.setData({
            'forecastData.aqiRadar.coverImage': aqiRadarImg,
            'forecastData.aqiRadar.images': result.data.images
          })
          log('[aqiRadarImg]',aqiRadarImg)
        },
        fail: (res) => {},
        complete: () => {

        }
      })
    }
    (async () => {
      await reqRainRadar()
      await reqAqiRadar()
    })()
  },
  
  setRadarTimeLineIndex(){
    const t = this
    let timeCounts = 7  , radarTimeLineIndexNum = []
    for(let i = 0 ;i<= timeCounts;i++){
      var curTime = new Date();
      var nextTime = util.formatHourTime(new Date(curTime.setMinutes(curTime.getMinutes() + i * 15)))
      radarTimeLineIndexNum.push(nextTime)
    }
      // log('[radarTimeLineIndexNum]',radarTimeLineIndexNum)
      t.setData({
        radarTimeLineIndexNum : radarTimeLineIndexNum
      })
  },
  intervalRainRadar(options){
    const t = this
    let e = 0
    var rainRadarImageslength = t.data.forecastData.rainRadar.images.length
    var radarTimeLineIndexAni = wx.createAnimation({
      duration: 200 * rainRadarImageslength,
      timingFunction: 'ease-in-out',
      delay: 0
    });
    var radarTimeLineIndexAniBreak = wx.createAnimation({
      duration: 1,
      timingFunction: 'ease-in-out',
      delay: 0
    });
    if(t.data.radarTimeLineImage == 'https://weather.ioslide.com/weather/timeLinePlay.svg'){
      t.setData({
        radarTimeLineImage : 'https://weather.ioslide.com/weather/timeLinePause.svg'
      })
    }else{
      t.setData({
        radarTimeLineImage : 'https://weather.ioslide.com/weather/timeLinePlay.svg'
      })
    }
    if(t.data.canIntervalRainRadarPlay == true){
      radarTimeLineIndexAni.translate3d(globalData.windowWidth-50, 0, 0).step()
      t.setData({
        canIntervalRainRadarPlay:!t.data.canIntervalRainRadarPlay,
        radarTimeLineIndex: radarTimeLineIndexAni.export()
      })
      t.data.timeLineInterval = setInterval(() => {
        t.setData({
          radarTimeLinePosition:e,
          'forecastData.rainRadar.coverImage':t.data.forecastData.rainRadar.images[e].image
        })
        log(t.data.forecastData.rainRadar.images[e].image)
        e = e + 1
        if(e == rainRadarImageslength){
          clearInterval(t.data.timeLineInterval)
          radarTimeLineIndexAniBreak.translate3d(0, 0, 0).step()
          t.setData({
            canIntervalRainRadarPlay:!t.data.canIntervalRainRadarPlay,
            radarTimeLineImage : 'https://weather.ioslide.com/weather/timeLinePlay.svg',
            radarTimeLineIndex: radarTimeLineIndexAniBreak.export()
          })
        }
      }, 200);
    }else{
      clearInterval(t.data.timeLineInterval)
      log(options.currentTarget.dataset.position)
      radarTimeLineIndexAni.translate3d(globalData.windowWidth/rainRadarImageslength * options.currentTarget.dataset.position-50, 0, 0).step()
      t.setData({
        canIntervalRainRadarPlay:!t.data.canIntervalRainRadarPlay,
        radarTimeLineIndex: radarTimeLineIndexAni.export(),
        'forecastData.rainRadar.coverImage':t.data.forecastData.rainRadar.images[options.currentTarget.dataset.position].image
      })
    }
  },
  onIntersectionObserver() {
    // log('[onIntersectionObserver]')
    const t = this
    let windowWidth = globalData.windowWidth*2/3
    const aniStart = (item) =>{
      let i = ('.'+item).toString()
      this.animate(item, [
        { opacity: 0.0},
        { opacity: 1.0}
        ], 1200, function () {
          log('_aniStart',item)
      }.bind(this))
    }
    // const aniStop = (item) =>{
    //   this.animate(item, [
    //     { opacity: 1.0},
    //     { opacity: 0.0}
    //     ], 1200, function () {
    //       // log('aniStop',item)
    //   }.bind(this))
    // }
    // var observerGroup =['firstObserverAni','temperatureObserverAni','thirdObserverAni','rainObserverAni','radarObserverAni','fourthObserverAni','fifthObserverAni','sixthObserverAni']
    let firstObserverAni  = wx.createIntersectionObserver(),
    temperatureObserverAni = wx.createIntersectionObserver(),
    thirdObserverAni = wx.createIntersectionObserver(),
    rainObserverAni = wx.createIntersectionObserver(),
    radarObserverAni = wx.createIntersectionObserver(),
    fourthObserverAni = wx.createIntersectionObserver(),
    fifthObserverAni = wx.createIntersectionObserver(),
    sixthObserverAni = wx.createIntersectionObserver()

    firstObserverAni.relativeToViewport().observe('.firstObserverAni', (res) => {
      if (res.boundingClientRect.top > 0) {
        aniStart('.firstObserverAni'),
        t.reqRadar(),
        firstObserverAni.disconnect()
      }else if (res.boundingClientRect.bottom <= 0) {
      }
    })
    temperatureObserverAni.relativeToViewport().observe('.temperatureObserverAni', (res) => {
      if (res.boundingClientRect.top > 0) {
        aniStart('.temperatureObserverAni'),
        temperatureObserverAni.disconnect()
      }else if (res.boundingClientRect.bottom <= 0) {
      }
    })
    thirdObserverAni.relativeToViewport().observe('.thirdObserverAni', (res) => {
      if (res.boundingClientRect.top > 0) {
        aniStart('.thirdObserverAni')
        thirdObserverAni.disconnect()
      }else if (res.boundingClientRect.bottom <= 0) {
      }
    })
    rainObserverAni.relativeToViewport().observe('.rainObserverAni', (res) => {
      if (res.boundingClientRect.top > 0) {
        aniStart('.rainObserverAni'),
        rainObserverAni.disconnect()
      }else if (res.boundingClientRect.bottom <= 0) {
      }
    })
    radarObserverAni.relativeToViewport().observe('.radarObserverAni', (res) => {
      if (res.boundingClientRect.top > 0) {
        aniStart('.radarObserverAni'),
        radarObserverAni.disconnect()
      }else if (res.boundingClientRect.bottom <= 0) {
      }
    })
    fourthObserverAni.relativeToViewport().observe('.fourthObserverAni', (res) => {
      if (res.boundingClientRect.top > 0) {
        aniStart('.fourthObserverAni'),
        fourthObserverAni.disconnect()
      }else if (res.boundingClientRect.bottom <= 0) {
      }
    })
    fifthObserverAni.relativeToViewport().observe('.fifthObserverAni', (res) => {
      if (res.boundingClientRect.top > 0) {
        aniStart('.fifthObserverAni'),
        fifthObserverAni.disconnect()
      }else if (res.boundingClientRect.bottom <= 0) {
      }
    })
    sixthObserverAni.relativeToViewport().observe('.sixthObserverAni', (res) => {
      if (res.boundingClientRect.top > 0) {
        aniStart('.sixthObserverAni'),
        sixthObserverAni.disconnect()
      }else if (res.boundingClientRect.bottom <= 0) {
      }
    })
    // observerGroup.forEach((item,index)=>{
    //   let i = wx.createIntersectionObserver()
    //   item = ('.'+item).toString()
    //   i.relativeToViewport().observe(item, (res) => {
    //     if (res.boundingClientRect.top > 0) {
    //       aniStart(item),
    //       item == '.firstObserverAni' ? t.reqRadar() : item == '.sixthObserverAni' ? (i.disconnect(),log('disconnect')):'log(item)'
    //       log('relativeToViewport',i)
    //     }else if (res.boundingClientRect.bottom <= 0) {
    //       // log(res.boundingClientRect,item)
    //       // aniStop(item)
    //     }
    //   })
    //   // log(item,index,i)
    //  })
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
  themeRadioChange(e) {
    log('[themeRadioChange]', e.detail.value)
    const t = this
    var themeValue = e.detail.value.toString()
    var theme = {
      themeChecked_auto: false,
      themeChecked_light: false,
      themeChecked_dark: false
    }
    const setData = () => {
      themeValue == 'light' ? theme['themeChecked_light'] = true :theme['themeChecked_dark'] = true
      t.setData({
        modalName: null,
        isChangeSetting: true
      })
    }
    const changeStorage = () => {
      log('[isChangeSetting]', true)
      t.store.data.theme = theme
      t.store.data.themeValue = themeValue
      app.changeStorage('themeValue', themeValue)
      app.changeStorage('theme', theme)
    }
    const event = async () => {
      await setData()
      await changeStorage()
    }
    event()
  },
  unitValueRadioChange(e) {
    const t = this
    var unit = {
      metric: false,
      SI: false,
      imperial: false
    }
    const setData = () => {
      e.detail.value == 'metric'? (unit['metric'] = true) :e.detail.value == 'imperial'? (unit['imperial'] = true) :(unit['SI'] = true)
      t.setData({
        modalName: null,
        isChangeSetting: true
      })
    }
    const changeStorage = () => {
      log('[isChangeSetting]', true)
      t.store.data.unitValue = e.detail.value.toString()
      t.store.data.unit = unit
      app.changeStorage('unitValue', e.detail.value.toString())
      app.changeStorage('unit', unit)
    }
    const event = async () => {
      await setData()
      await changeStorage()
    }
    event()
  },
  getBingImage(){
    this.selectComponent('#headImage').getBingImage()
  },
  getHeadImageData(){
    return this.selectComponent('#headImage').data
  },
  getNASAImage(){
    this.selectComponent('#headImage').getNASAImage()
  },
  getWeatherImage(){
      this.selectComponent('#headImage').getWeatherImage(this.data.forecastData.realtime.skycon)
  },
  onDev() {
    const t = this
    wx.showModal({
      title: t.store.data.languageValue == 'zh_TW' ?'功能暫未開放':t.store.data.languageValue == 'zh_CN'?'功能暂未开放':t.store.data.languageValue == 'ja'?'関数はまだ開いていません':'Function not open yet',
      content: t.store.data.languageValue == 'zh_TW' ?'敬請期待':t.store.data.languageValue == 'zh_CN'?'敬请期待':t.store.data.languageValue == 'ja'?'乞うご期待':'Do not expect'
    })
  },
  refreshLocation() {
    //自动获取系统定位的location,请求数据
    const t = this
    log(`[refreshLocation]`, t.store.data.startScreen)
    let time = dayjs(new Date()).format('YYYY-MM-DD')
    let date = util.getDates(7, time)
    app.saveData("lastRefreshTime", date[0].time)
    if (t.store.data.startScreen !== 'auth') {
        (async () => {
          await t.setData({
            'canBlurRoot': true
          })
          await t.getLocationByAuto()
          await t.setData({
            'canBlurRoot': false
          })
          t.store.data.getLocationMethod = 'auto'
        })()
    }
    app.changeStorage('getLocationMethod', 'auto')
  },
  scrollTo(viewId) {
    let query = wx.createSelectorQuery();
    query.select(viewId).boundingClientRect();
    query.selectViewport().scrollOffset()
    query.exec((res) => {
      if (res[0] && res[1])
        wx.pageScrollTo({
          scrollTop: res[0].top + res[1].scrollTop,
          duration: 1200
        });
    });
  },
  _scrollTo(e) {
    const t = this
    let query = wx.createSelectorQuery();
    query.select(e.detail.viewId).boundingClientRect();
    query.selectViewport().scrollOffset()
    query.exec((res) => {
      if (res[0] && res[1])
        wx.pageScrollTo({
          scrollTop: res[0].top + res[1].scrollTop - globalData.windowHeight/3,
          duration: 1200
        });
    });
  },
  getTemperatureChartData (){
    var chartData = []
    var dailyWeather = this.data.forecastData.daily
    for (var s = dailyWeather, d = 1; d < 8; d++) {
      var u = {
        x: s[d].date,
        y: [s[d].min, s[d].max]
      };
      chartData.push(u);
    }
    let range = {
        max : Math.max.apply(Math, dailyWeather.map(function (o) {
        return o.max
       })),
        min:Math.min.apply(Math, dailyWeather.map(function (o) {
          return o.min
        }))
    }
    return {chartData,range}
  },
  initTemperatureChart(F2,config){
    let chartData = this.getTemperatureChartData().chartData
    let range = this.getTemperatureChartData().range
    temperatureChart = new F2.Chart(config);
    return temperatureChart.clear(),
    temperatureChart.legend(!1),
    temperatureChart.axis("y", !1),
    temperatureChart.axis("x", !1),
    temperatureChart.tooltip(false),
    temperatureChart.source(chartData, {
      x: {
        tickCount: 7
      },
      y: {
        min: range.min,
        max: range.max
      }
    }),
    chartData.map(function (obj) {
      temperatureChart.guide().text({
        top: true,
        position: [obj.x, obj.y[0]],
        content: obj.y[0],
        style: {
          textAlign: 'center',
          textBaseline: 'top',
          fontSize: 12,
          fill: '#8799a3'
        },
        offsetY: 10
      });
      temperatureChart.guide().text({
        top: true,
        position: [obj.x, obj.y[1]],
        content: obj.y[1],
        style: {
          textAlign: 'center',
          textBaseline: 'bottom',
          fontSize: 12,
          fill: '#8799a3'
        },
        offsetY: -10
      });
    }),
    temperatureChart.interval().position('x*y')
      .animate({
        appear: {
          animation: 'shapesScaleInY'
        }
      })
      .size(9)
      .style({
        radius: [4, 4, 4, 4]
      })
      .color('l(90) 0:#d5effc 1:#bcc8d4'),
      temperatureChart.render(),
      temperatureChart;
  },

  getRadarChartData(){
    const t = this
    const data = [{
      item: 'Aqi',
      user: ' ',
      score: t.data.forecastData.realtime.airQuality.aqi
    }, {
      item: 'NO2',
      score: t.data.forecastData.realtime.airQuality.no2
    },{
      user: ' ',
      item: 'O3',
      score: t.data.forecastData.realtime.airQuality.o3
    }, {
      user: ' ',
      item: 'PM10',
      score: t.data.forecastData.realtime.airQuality.pm10
    }, {
      user: ' ',
      item: 'PM25',
      score: t.data.forecastData.realtime.airQuality.pm25
    }, {
      user: ' ',
      item: 'SO2',
      score: t.data.forecastData.realtime.airQuality.so2
    }, {
      user: ' ',
      item: 'CO',
      score: t.data.forecastData.realtime.airQuality.co
    }];
    return data  
  },
  initRainChart(F2, config) {
    let chartData = this.getDailyRainChartData()
    // log('[initChartFuc]', chartData)
    rainChart = new F2.Chart(config);
    return rainChart.clear(), 
    rainChart.legend(!1),
    rainChart.source(chartData, {
      time: {
        type: 'timeCat',
        mask: 'MM/DD',
        tickCount: 3,
        range: [ 0, 1 ]
      },
      value: {
        tickCount: 2,
        min: 0,
        alias: '降水强度'
      }
    }),
    rainChart.axis('time', false),
    rainChart.tooltip({
      showItemMarker: false,
      alwaysShow: false,
      triggerOn: ['touchstart', 'touchmove'],
      triggerOff: 'touchend',
      background: {
        radius: 2,
        fill: '#4AA2FC',
        padding: [3, 5]
      },
      showCrosshairs: true, // 是否显示辅助线，点图、路径图、线图、面积图默认展示
      crosshairsStyle: {
        stroke: 'rgba(71,231,255,1)',
        lineWidth: 1
      },
      tooltipMarkerStyle: {
        fill: '#4AA2FC',
        fillOpacity: 0.2
      },
      onShow: function onShow(ev) {
        const items = ev.items;
        items[0].name = null;
        log(items[0].origin)
        items[0].value = items[0].origin.time
      }
    }),
    rainChart.area()
      .position('time*value')
      .color('l(90) 0:#1890FF 1:#f7f7f7')
      .shape('smooth'),
    rainChart.line()
      .position('time*value')
      .color('l(90) 0:#1890FF 1:#8dd9f7')
      .shape('smooth'),
    rainChart.render(),
    rainChart;
  },
  initRadarChart(F2, config) {
    const t = this
    const data = [{
      item: 'Aqi',
      user: ' ',
      score: t.data.forecastData.realtime.airQuality.aqi
    }, {
      item: 'NO2',
      score: t.data.forecastData.realtime.airQuality.no2
    },{
      user: ' ',
      item: 'O3',
      score: t.data.forecastData.realtime.airQuality.o3
    }, {
      user: ' ',
      item: 'PM10',
      score: t.data.forecastData.realtime.airQuality.pm10
    }, {
      user: ' ',
      item: 'PM25',
      score: t.data.forecastData.realtime.airQuality.pm25
    }, {
      user: ' ',
      item: 'SO2',
      score: t.data.forecastData.realtime.airQuality.so2
    }, {
      user: ' ',
      item: 'CO',
      score: t.data.forecastData.realtime.airQuality.co
    }];
    radarChart = new F2.Chart(config);
    radarChart.legend(false)
    radarChart.coord('polar');
    radarChart.source(data, {
      score: {
        min: 0,
        max: 250,
        nice: false,
        tickCount: 4
      }
    });
    radarChart.axis('score', {
      label: function label(text, index, total) {
        if (index === total - 1) {
          return null;
        }
        return {
          top: true
        };
      },
      grid: {
        lineDash: null,
        type: 'arc' // 弧线网格
      }
    });
    radarChart.axis('item', {
      grid: {
        lineDash: null
      }
    });
    radarChart.area().position('item*score').color('user')
    .animate({
      appear: {
        animation: 'groupWaveIn'
      }
    });
    radarChart.line().position('item*score').color('user')
      .animate({
        appear: {
          animation: 'groupWaveIn'
        }
      });
    radarChart.point().position('item*score').color('user')
      .style({
        stroke: '#fff',
        lineWidth: 1
      })
      .animate({
        appear: {
          delay: 300
        }
      });
  
    radarChart.render();
    
    return radarChart
  },
  setTemperatureImage(e){
    this.setData({
      temperatureImage:e.detail.temperatureImage,
      temperatureImageWidth:e.detail.width
    })
  },
  changeAirQuatityView(){
    const t = this
    if(t.data.showAirQuatityRadar == true){
      this.animate('#airQuatityRadar', [
        { opacity: 1.0, ease:'ease-in' },
        { opacity: 0.0, ease:'ease-out' },
        ], 280, function () {
          this.animate('#airQuatityItem', [
            { opacity: 0, ease:'ease-in' },
            { opacity: 1, ease:'ease-out' },
            ], 280)
      }.bind(this))  
    }else{
      this.animate('#airQuatityItem', [
        { opacity: 1.0, ease:'ease-in' },
        { opacity: 0.0, ease:'ease-out' },
        ], 280, function () {
          this.animate('#airQuatityRadar', [
            { opacity: 0, ease:'ease-in' },
            { opacity: 1, ease:'ease-out' },
            ], 280)
      }.bind(this))  
    }
    t.setData({
      showAirQuatityRadar:!t.data.showAirQuatityRadar
    })
  },
  changeRainChartData(){
    const t = this
    t.setData({
      isHourlyRainChart:!t.data.isHourlyRainChart
    })
    if(t.data.isHourlyRainChart == true){
      t.setData({
        rainChartName:t.store.data.languageValue == 'zh_TW' ? '小時':t.store.data.languageValue == 'zh_CN'? '小时':t.store.data.languageValue == 'ja'? '時間':'Hourly'
      })
      let rainChartData= t.getHourlyRainChartData()
      rainChart.changeData(rainChartData)
    }else{
      t.setData({
        rainChartName:t.store.data.languageValue == 'zh_TW' ? '天':t.store.data.languageValue == 'zh_CN'? '天':t.store.data.languageValue == 'ja'? '日':'Daily'
      })
      let rainChartData= t.getDailyRainChartData()
      rainChart.changeData(rainChartData)
    }
  },
  getHourlyRainChartData(){
    var chartData = []
    var hourly = this.data.forecastData.hourly
    for (var s = hourly, d = 0; d < 48; d++) {
      var u = {
        time: s[d].precipitation.datetime,
        value: s[d].precipitation.value,
      };
      chartData.push(u);
    }
    // log('[getHourlyRainChartData rainWeather]',chartData)
    return chartData  
  },
  getDailyRainChartData(){
    const t = this
    var chartData = []
    let daily = t.data.forecastData.daily
    for (let s = daily, d = 0; d < 16; d++) {
      let u = {
        time: s[d].precipitation.date,
        value: s[d].precipitation.max,
      };
      chartData.push(u);
    }
    return chartData
  },
  loadingProgress(canLoading){
    const t = this
    // log('[loadingProgress]',canLoading)
    const loadingComponent = t.selectComponent('#loading');
    if(canLoading == true){
      loadingComponent.startLoading();
    }else{
      loadingComponent.stopLoading();
    }
  },
  updateComponnet: function () {
    var src = this.data.src ? this.data.src : 'https://weather.ioslide.com/weather/weatherlogo.png'; //裁剪图片不存在时，使用default图片，注意加载时的相对路径
    this.setData({
      visible: true,
      cropCallBackFadeOut : false,
      src: src,
      borderColor: "#0BFF00",
      cropSizePercent: 0.7,
      cropSize: {
        width: 300,
        height: 300
      }
    })
  },
  chooseCropImage(e) {
    let self = this;
    log('[chooseCropImage]',e)
    let type = e.detail.type
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: [type],
      success(res) {
        log(res)
        const tempFilePaths = res.tempFiles[0].path
        self.setData({
          visible: true,
          cropCallBackFadeOut: false,
          src: tempFilePaths,
        })
      },
      fail(err) {
        log(err)
      }
    });
  },
  uploadCallback(event) {
    log('[uploadCallback]', event);
  },
  closeCallback(event) {
    log('[closeCallback]', event);
    this.setData({
      visible: false,
      cropCallBackFadeOut: true
    });
  },
  cropCallback(event) {
    const t = this
    log('[cropCallback]', event);
    const setCusImage = t.selectComponent('#headImage');
    setCusImage.setCusImage({'cusImage': event.detail.resultSrc,'hasCusImageFileID': true})
    const cloudUpload = (p, n) => {
      wx.cloud.uploadFile({
        cloudPath: 'cusImage/' + n,
        filePath: p,
      }).then(res => {
        log('[uploadFile]', res)
        app.saveData('hasCusImageFileID', true)
        app.saveData('cusImageFileID', res.fileID)
        t.setData({
          cropCallBackFadeOut:true,
          modalName: null
        })
        setTimeout(() => {
          t.setData({
            visible :false
          })
        }, 1100);
      }).catch(error => {
        log(error)
      })
    }
    let fileName = util.formatDateClear(new Date()).concat(globalData.openid)
    log('filename',fileName,util.formatDateClear(new Date()))
    cloudUpload(event.detail.resultSrc, fileName)
  },
  checkIsAccept() {
    const t = this
    wx.cloud.database().collection('mini-subscribe-user-daily').where({
      openid: app.globalData.openid,
      done:false
    }).get({
      success(res) {
        log('[checkIsAccept daily]',res)
        if(res.data.length == 0){
          t.store.data.subscribeType.oneTime = false
        }else if(res.data.length > 0){
          t.store.data.subscribeType.oneTime = true
        }
      },
      fail(res) {
        t.store.data.subscribeType.oneTime = false
      }
    })
    wx.cloud.database().collection('warning-subscribe-user').where({
      openid: app.globalData.openid,
      done:false
    }).get({
      success(res) {
        log('[checkIsAccept warning]',res)
        if(res.data.length == 0){
          t.store.data.subscribeType.warning = false
        }else if(res.data.length > 0){
          t.store.data.subscribeType.warning = true
        }
      },
      fail(res) {
        t.store.data.subscribeType.warning = false
      }
    })
  },
  openSnackBar(){
    const t = this
    let alarmInfo = t.data.forecastData.alarmInfo || [{'content':'none'}]
    let alarmIcon = config.cosApiHost + "/weather/icon/lineIcon/" + alarmInfo[0].icon + '-white.svg'
    log('[openSnackBar]',alarmIcon,alarmInfo[0])
    if(alarmInfo[0].content !== 'none'){
      // log('[openSnackBar OK]')
      t.data.snackBar.open({
          messageSource:alarmInfo[0].source + ":",
          message:alarmInfo[0].levelName + '预警'  + '-' + alarmInfo[0].typeName,
          buttonText:'关闭',
          icon: alarmIcon,
          buttonTextColor:'#ffffff',
          messageColor:'#ffffff',
          closeOnButtonClick:true,
          onButtonClick:() => {
              log('点击button');
          },
          onOpen:() => {
              // log('snackBar打开中');
          },
          onOpened(){
              // log('snackBar已打开');
          },
          onClose(){
              // log('snackBar关闭中');
          },
          onClosed(){
              // log('snackBar已关闭');
          }
      });
    }
}
});
