let 
  style = {},
  startScreen = '',
  $$ = {}
let c = wx.getStorageSync('hasUserLocation') || false
if (c == false) {
  $$ = {
    id: '',
    data: {},
    // page: 'pages/index/index',
    language: {
      switch_languageChecked_ChineseTraditional: false,
      switch_languageChecked_Japan: false,
      switch_languageChecked_Chinese: true,
      switch_languageChecked_English: false
    },
    languageValue: '中文简体',
    refreshfrequency: {
      switch_refreshfrequencyChecked_30: true,
      switch_refreshfrequencyChecked_60: false,
      switch_refreshfrequencyChecked_120: false,
      switch_refreshfrequencyChecked_180: false
    },
    refreshfrequencyValue: '30分钟',
    theme: {
      switch_themeChecked_light: true,
      switch_themeChecked_dark: false
    },
    themeValue: '明亮',
    // temperatureUnitValue: '摄氏度',
    temperatureUnit: {
      temperatureUnitValueF: false,
      temperatureUnitValueC: true
    },
    startScreen:'诗词',
    style: {
      dailySevenSwitchChange: true,
      dailyhourSwitchChange: true,
      detailSwitchChange: true,
      moonSwitchChange: true,
      aqiSwitchChange: true,
      imageSwitchChange: true,
      // poetrySwitchChange: false,
      radarSwitchChange: true,
      weatherAniSwitchChange: true,
      sunlightSwitchChange: true,
      windSwitchChange: true,
      KeepScreenOnSwitchChange: true
    },
    proMode: false
  }
  startScreen = '授权'
  function toSave$$() {
    return new Promise(resolve => {
      setTimeout(() =>
        wx.setStorage({
          data: $$,
          key: '$$'
        }), 1000);
    });
  }
  async function event() {
    const v = await toSave$$();
    console.log(v);
  }
  event();
}
if (c == true) {
  $$ = wx.getStorageSync('$$')
  startScreen = $$.startScreen
}
console.log('[hasUserLocation] =>', c, ' => ', $$)

export default {
  data: {
    startScreen: startScreen,
    style: $$.style,
    // refreshfrequencyValue: info.refreshfrequencyValue,
    themeValue: $$.themeValue,
    // languageValue: info.languageValue,
    theme: $$.theme,
    // temperatureUnitValue: $$.temperatureUnitValuem,
    temperatureUnit: $$.temperatureUnit,
    // language: info.language,
  },
  // 无脑全部更新，组件或页面不需要声明 use
  updateAll: true,
  debug: true
}