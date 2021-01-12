const app = getApp();
import create from '../../utils/create'
import store from '../../store/index'
const log = console.log.bind(console)

create(store, {
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    favored: !0,
    use: [
      'themeValue',
      'theme',
      'refreshfrequency',
      'refreshfrequencyValue',
      'indexHeadImageValue',
      'indexHeadImage',
      'language',
      'languageValue',
      'iconValue',
      'icon',
      'warningValue'
    ]
  },
  onLoad(e) {
  },
  indexHeadImageRadioChange:function(e){
    log('[indexHeadImageRadioChange]', e.detail.value )
    const t = this
    var
    pages = getCurrentPages(),
    prevPage = pages[0];
    let indexHeadImageValue = e.detail.value.toString(),
      indexHeadImage = {
        indexHeadImageBing:false,
        indexHeadImageNASA:false,
        indexHeadImageCustomize:false,
        indexHeadImageWeather:false
      }
    if(indexHeadImageValue == 'Bing'){
      indexHeadImage['indexHeadImageBing'] = true
      app.saveData('hasCusImage', false)
      prevPage.getBingImage()
    }
    else if(indexHeadImageValue == 'NASA'){
      indexHeadImage['indexHeadImageNASA'] = true
      app.saveData('hasCusImage', false)
      prevPage.getNASAImage()
    }
    else if(indexHeadImageValue == 'Weather'){
      indexHeadImage['indexHeadImageWeather'] = true
      app.saveData('hasCusImage', false)
      prevPage.getWeatherImage()
    }
    else if(indexHeadImageValue == 'Customize'){
      indexHeadImage['indexHeadImageCustomize'] = true
      app.saveData('hasCusImage', true)
    }
    t.setData({
      modalName: null
    })
    t.store.data.indexHeadImageValue = indexHeadImageValue
    t.store.data.indexHeadImage = indexHeadImage
    app.changeStorage('indexHeadImageValue', indexHeadImageValue)
    app.changeStorage('indexHeadImage', indexHeadImage)
  },
  themeRadioChange(e) {
    log('[themeRadioChange]', e.detail.value)
    const t = this
    var
    pages = getCurrentPages(),
    prevPage = pages[0];
    const modalName = () =>{
      t.setData({
        modalName: null
      })
    }
    const storeChange = () =>{
      let themeValue = e.detail.value.toString(),
      theme =  {
        themeChecked_auto: false,
        themeChecked_light: false,
        themeChecked_dark: false
      }
      if(themeValue == 'light'){
        theme['themeChecked_light'] = true
      }else{
        theme['themeChecked_dark'] = true
      }
      t.store.data.theme = theme
      t.store.data.themeValue = themeValue
      
      app.changeStorage('themeValue', themeValue)
      app.changeStorage('theme', theme)
    }
    const getWeatherData = () =>{
      log('prevPage',prevPage)
      prevPage.getWeatherData(false)
    }
    async function change(){
      await modalName()
      await getWeatherData()
      await storeChange()
    }
    change()
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
  iconRadioChange(e) {
    log('[iconRadioChange]', e.detail.value)
    const t = this
    const modalName = () =>{
      t.setData({
        modalName: null
      })
    }
    const storeChange = () =>{
      let iconValue = e.detail.value.toString(),
      icon = { 
        lineIcon:false,
        colorIcon:false,
        solidIcon:false,
        flatIcon:false
      }
      iconValue == 'lineIcon' ? (icon['lineIcon'] = true) :  iconValue == 'colorIcon' ? (icon['colorIcon'] = true) :  iconValue == 'solidIcon' ? (icon['solidIcon'] = true) : (icon['flatIcon'] = true)
      t.store.data.icon = icon
      t.store.data.iconValue = iconValue
      app.changeStorage('iconValue', iconValue)
      app.changeStorage('icon', icon)
    }
    const getWeatherData = () =>{
      var
      pages = getCurrentPages(),
      prevPage = pages[0];
      prevPage.getWeatherData(false)
    }
    (async () => {
      await modalName()
      await storeChange()
      await getWeatherData()
    })()

    
  },
  warningRadioChange(e) {
    log('[iconRadioChange]', e.detail.value)
    const t = this
    const modalName = () =>{
      t.setData({
        modalName: null
      })
    }
    const storeChange = () =>{
      let warningValue = e.detail.value.toString()
      t.store.data.warningValue = warningValue
      app.changeStorage('warningValue', warningValue)
    }
    (async () => {
      await modalName()
      await storeChange()
    })()
  },
  refreshfrequencyRadioChange:function(e){
    log('[refreshfrequencyRadioChange]', e.detail.value )
    const t = this
    let refreshfrequencyValue = e.detail.value.toString(),
      refreshfrequency = {
        refreshfrequencyChecked_1: false,
        refreshfrequencyChecked_5: false,
        refreshfrequencyChecked_10: false,
        refreshfrequencyChecked_30: false,
        refreshfrequencyChecked_60: false
      }
    if(refreshfrequencyValue == '1'){
        refreshfrequency['refreshfrequencyChecked_1'] = true
    }
    else if(refreshfrequencyValue == '5'){
      refreshfrequency['refreshfrequencyChecked_5'] = true
    }
    else if(refreshfrequencyValue == '10'){
      refreshfrequency['refreshfrequencyChecked_10'] = true
    }
    else if(refreshfrequencyValue == '30'){
      refreshfrequency['refreshfrequencyChecked_30'] = true
    }
    else{
      refreshfrequency['refreshfrequencyChecked_60'] = true
    }
    t.setData({
      modalName: null
    })
    t.store.data.refreshfrequencyValue = refreshfrequencyValue
    t.store.data.refreshfrequency = refreshfrequency
    app.changeStorage('refreshfrequencyValue', refreshfrequencyValue)
    app.changeStorage('refreshfrequency', refreshfrequency)
  },
  unitValueRadioChange(e) {
    const t = this
    const modalName = () =>{
      t.setData({
        modalName: null
      })
    }
    const storeChange = () =>{
      let unit = {
        metric:false,
        SI:false,
        imperial:false
      }
      if (e.detail.value == 'metric') {
        unit['metric'] = true
      } else if (e.detail.value == 'imperial') {
        unit['imperial'] = true
      } else if (e.detail.value == 'SI') {
        unit['SI'] = true
      }
      t.store.data.unitValue = e.detail.value.toString()
      t.store.data.unit = unit
      app.changeStorage('unitValue', e.detail.value.toString())
      app.changeStorage('unit', unit)
    }
    const getWeatherData = () =>{
      var
      pages = getCurrentPages(),
      prevPage = pages[0];
      prevPage.getWeatherData(false)
    }
    async function change(){
      await modalName()
      await getWeatherData()
      await storeChange()
    }
    change()
  },
  languageRadioChange(e) {
    const t = this
    const modalName = () =>{
      t.setData({
        modalName: null
      })
    }
    const storeChange = () =>{
      let language = {
        languageChecked_zh_TW: false,
        languageChecked_zh_CN: false,
        languageChecked_en_US: false,
        languageChecked_en_GB: false,
        languageChecked_ja: false
      },
      languageValue = e.detail.value.toString()
    log('[languageValue] =>', e.detail.value.toString())
    if (e.detail.value == 'zh_TW') {
      language['languageChecked_zh_TW'] = true
      log('[language] =>', 'languageChecked_zh_TW = true')
    }
    else if (e.detail.value == 'zh_CN') {
      language['languageChecked_zh_CN'] = true
      log('[language] =>', 'languageChecked_zh_CN = true')
    }
    else if (e.detail.value == 'en_US') {
      language['languageChecked_en_US'] = true
      log('[language] =>', 'languageChecked_en_US = true')
    }
    else if (e.detail.value == 'en_GB') {
      language['languageChecked_en_GB'] = true
      log('[language] =>', 'languageChecked_en_GB = true')
    }
    else if (e.detail.value == 'ja') {
      language['languageChecked_ja'] = true
      log('[language] =>', 'languageChecked_ja = true')
    }
    t.store.data.language = language
    t.store.data.languageValue = languageValue
    app.changeStorage('language', language)
    app.changeStorage('languageValue', languageValue)
    }
    const getWeatherData = () =>{
      var
      pages = getCurrentPages(),
      prevPage = pages[0];
      prevPage.getWeatherData(false)
    }
    async function change (){
      await modalName()
      await storeChange()
      await getWeatherData()
    }
    change()
  },
  showProModeModal(e) {
    const t = this
    let $$ = wx.getStorageSync('$$')
    if ($$.proMode == true) {
      wx.navigateTo({
        url: 'pro/pro'
      });
    } else {
      t.setData({
        modalName: e.currentTarget.dataset.target
      })
    }
  },
  // ensureOpenProMode: function (e) {
  //   var t = this
  //   wx.getWeRunData({
  //     success(res) {
  //       wx.checkSession({
  //         success: function () {
  //           wx.BaaS.wxDecryptData(res.encryptedData, res.iv, 'we-run-data').then(decrytedData => {
  //             //检查用户运动步数是否达到开通专业模式要求
  //             t.store.data.decrytedData = decrytedData
  //             if (t.store.data.decrytedData.stepInfoList[30].step >= 0) {
  //               wx.cloud.callFunction({
  //                 name: 'proMode',
  //                 data: {
  //                   id: $$.data.created_by
  //                 },
  //                 success(res) {
  //                   wx.showToast({
  //                     title: '开通成功',
  //                     icon: 'success',
  //                     duration: 2000,
  //                   });
  //                   console.log(res)
  //                   app.changeStorage('proMode', true)
  //                   // t.saveData("isRequestUserInfoAgain", 1);
  //                 },
  //                 fail(res) {
  //                   console.log(res)
  //                 }
  //               })
  //             } else {
  //               wx.showModal({
  //                 title: '无法开通',
  //                 content: '您当前步数不足10000步',
  //                 success(res) {
  //                   if (res.confirm) {} else if (res.cancel) {}
  //                 }
  //               })
  //             }
  //           }, err => {})
  //         },
  //         fail: function () {
  //           wx.BaaS.logout()
  //           wx.BaaS.login()
  //         }
  //       })
  //     }
  //   })
  //   t.setData({
  //     modalName: null
  //   })
  // },
  showModal(e) {
    const t = this
    t.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    const t = this
    t.setData({
      modalName: null
    })
  },
  backPage() {
    wx.navigateBack({
      delta: 1
    });
  },
  navChange(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.cur + '/' + e.currentTarget.dataset.cur
    });
  },
  onShareAppMessage(a) {
    return {
      title: '奇妙天气',
      imageUrl: 'https://weather.ioslide.com/shareimg.png',
      path: "/pages/index/index"
    };
  },
  saveData(a, t) {
    a && t && wx.setStorage({
      key: a,
      data: t
    });
  },
  onDev() {
    const t = this
    wx.showModal({
      title: t.store.data.languageValue == 'zh_TW' ?'功能暫未開放':t.store.data.languageValue == 'zh_CN'?'功能暂未开放':t.store.data.languageValue == 'ja'?'関数はまだ開いていません':'Function not open yet',
      content: t.store.data.languageValue == 'zh_TW' ?'敬請期待':t.store.data.languageValue == 'zh_CN'?'敬请期待':t.store.data.languageValue == 'ja'?'乞うご期待':'Do not expect'
    })
  },
  onGetWeRunData() {
    wx.getWeRunData({
      success: res => {
        wx.cloud.callFunction({
          name: 'openapi',
          data: {
            action: 'getWeRunData',
            // info 字段在云函数 event 对象中会被自动替换为相应的敏感数据
            info: wx.cloud.CloudID(res.cloudID),
          },
        }).then(res => {
          console.log('[onGetWeRunData] 收到 echo 回包：', res)

          this.setData({
            weRunResult: JSON.stringify(res.result),
          })
        }).catch(err => {
          console.log('[onGetWeRunData] 失败：', err)
        })
      }
    })
    t.setData({
      modalName: null
    })
  },
  onGotUserInfo: function(e) {
    log(e)
    e.detail.userInfo ? this.loginNSubscribe(e) : wx.showToast({
        title: "登录失败,请重试",
        icon: "none",
        duration: 2e3
    });
},
loginNSubscribe(e){
  const that =this
  wx.login({
    success: function(o) {
        if (o.code) {
            var n = o.code;
            wx.getUserInfo({
                success: function(o) {
                    var c = o.userInfo;
                    c.code = n, c.iv = o.iv, c.encryptedData = o.encryptedData, c.wechat_type = "wxapp"
                    console.log('getUserInfo',c)
                    wx.cloud.callFunction({
                      name: 'openapi',
                      data: {
                        action: 'getContext'
                      }
                    }).then(res => {
                      console.log('[onGetUserInfo] 调用成功：', res)
                    })
                }
            });
        } else wx.showToast({
            title: "登录失败，请再次点击",
            icon: "none",
            duration: 2e3
        });
    }
});
},
subscribe(){
  wx.request({
    url: "https://biz.caiyunapp.com/v1/tianqi/subscribe",
    data: {
      eveningRemindTime: e.data.eveningTime,
      weatherRemind: 1,
      morningRemindTime: e.data.morningTime,
      platform_id: e.data.userInfo.platform_id,
      lon: e.data.settingLon,
      timezone: "+08:00",
      lat: e.data.settingLat,
      address: e.data.settingLocation
  },
    method: 'post',
    success: (result) => {
      log(result)
    },
    fail: (res) => {
      log(res)
    },
    complete: (res) => {
      log(res)
    },
  })
},
getSubscribe: function(e, t) {
  a({
      url: "/tianqi/subscribe?platform_id=" + e,
      method: "get",
      complete: function(e) {
          t(e.data);
          console.log(e)
      },
      fail: function(e) {}
  });
},
cancelSub: function() {
  var e = this;
  wx.showModal({
      title: "确认取消订阅?",
      content: "取消后无法接受天气预报消息",
      showCancel: !0,
      cancelText: "点错了",
      success: function(t) {
          t.confirm && n.default.subscribe({
              eveningRemindTime: e.data.eveningTime,
              weatherRemind: 0,
              morningRemindTime: e.data.morningTime,
              platform_id: e.data.userInfo.platform_id,
              lon: e.data.settingLon,
              timezone: "+08:00",
              lat: e.data.settingLat,
              address: e.data.settingLocation
          }, function(t) {
              e.setData({
                  subscribed: !1
              }), wx.showModal({
                  title: "已取消订阅",
                  content: "将不再向您推送天气预报消息",
                  showCancel: !1
              });
          });
      }
  });
},
reFail(t){
  wx.request({
    method: t.method || "GET",
    url: t.url,
    data: t.data || {},
    header: {
        "content-type": "application/json",
        Authorization: e.default.getCache("cy_user_id") || "",
        "Cy-User-Id": e.default.getCache("cy_user_id") || ""
    },
    success: function(e) {
        t.success && t.success(e);
    },
    fail: function(e) {
        t.fail && t.fail(e);
    },
    complete: function(e) {
        t.complete && t.complete(e);
    }
});
},
onModalCancel: function() {
  this.setData({
      favored: !1
  });
},
})