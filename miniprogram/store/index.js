
let $$ = {}
let c = wx.getStorageSync('hasUserLocation') || false

const setStoreage = () =>{
  $$ = {
    id: '',
    data: {},
    // page: 'pages/index/index',
    language: {
      languageChecked_zh_TW: false,
      languageChecked_zh_CN: true,
      languageChecked_en_US: false,
      languageChecked_en_GB: false
    },
    languageValue: 'zh_CN',
    refreshfrequency: {
      refreshfrequencyChecked_1: true,
      refreshfrequencyChecked_5: true,
      refreshfrequencyChecked_10: false,
      refreshfrequencyChecked_30: false,
      refreshfrequencyChecked_60: false
    },
    refreshfrequencyValue: '30分钟',
    theme: {
      themeChecked_light: true,
      themeChecked_dark: false
    },
    themeValue: '明亮',
    temperatureUnitValue: '摄氏度',
    temperatureUnit: {
      temperatureUnitValueF: false,
      temperatureUnitValueC: true
    },
    distanceUnit:{
      distanceUnitValueM:false,
      distanceUnitValueI:true
    },
    startScreen:'授权',
    style: {
      imageSwitchChange: true,
      weatherAniSwitchChange: true,
      detailSwitchChange: true,
      dailyhourSwitchChange: true,
      dailySevenSwitchChange: true,
      aqiSwitchChange: true,
      sunlightSwitchChange: true,
      moonSwitchChange: true,
      windSwitchChange: true,
      radarSwitchChange: true,
      KeepScreenOnSwitchChange: true
    },
    proMode: false,
    indexHeadImage:{
      indexHeadImageBing:true,
      indexHeadImageNASA:false,
      indexHeadImageCus:false
    },
    indexHeadImageValue:'Bing'
  }
  wx.setStorage({
    data: $$,
    key: '$$'
  })
}
const getStoreage = () =>{
  $$ = wx.getStorageSync('$$')
}
const event = (result) => {
  switch (true) {
    case (result == true):
      getStoreage(result)
      break
    case (result == false):
      setStoreage(result)
      break
    default:
      setStoreage(result)
  }
}
event(c)

export default {
  data: {
    startScreen: $$.startScreen,
    style: $$.style,
    indexHeadImage:$$.indexHeadImage,
    indexHeadImageValue:$$.indexHeadImageValue,
    refreshfrequencyValue:$$.refreshfrequencyValue,
    themeValue: $$.themeValue,
    theme: $$.theme,
    language:$$.language,
    languageValue:$$.languageValue,
    temperatureUnit: $$.temperatureUnit,
    temperatureUnitValue: $$.temperatureUnitValue,
    distanceUnit:$$.distanceUnit
  },
  updateAll: true,
  debug: true
}