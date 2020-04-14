
let $$ = {}
let c = wx.getStorageSync('hasUserLocation') || false
const setStoreage = () =>{
  $$ = {
    // id: '',
    // data: {},
    // page: 'pages/index/index',
    language: {
      languageChecked_zh_TW: false,
      languageChecked_zh_CN: true,
      languageChecked_en_US: false,
      languageChecked_en_GB: false
    },
    languageValue: 'zh_CN',
    refreshfrequency: {
      refreshfrequencyChecked_1: false,
      refreshfrequencyChecked_5: false,
      refreshfrequencyChecked_10: false,
      refreshfrequencyChecked_30: true,
      refreshfrequencyChecked_60: false
    },
    refreshfrequencyValue: '30分钟',
    theme: {
      themeChecked_auto: false,
      themeChecked_light: true,
      themeChecked_dark: false
    },
    themeValue: '明亮',
    unit:{
      metric:true,
      SI:false,
      imperial:false
    },
    unitValue:'metric',
    startScreen:'auth',
    style: {
      imageSwitchChange: true,
      weatherAniSwitchChange: true,
      detailSwitchChange: true,
      dailyhourSwitchChange: true,
      dailySevenSwitchChange: true,
      rainSwitchChange: true,
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
    proMode:$$.proMode,
    indexHeadImage:$$.indexHeadImage,
    indexHeadImageValue:$$.indexHeadImageValue,
    refreshfrequency:$$.refreshfrequency,
    refreshfrequencyValue:$$.refreshfrequencyValue,
    theme: $$.theme,
    themeValue: $$.themeValue,
    language:$$.language,
    languageValue:$$.languageValue,
    temperatureUnit: $$.temperatureUnit,
    temperatureUnitValue: $$.temperatureUnitValue,
    unit:$$.unit,
    unitValue:$$.unitValue
  },
  updateAll: true,
  debug: true
}