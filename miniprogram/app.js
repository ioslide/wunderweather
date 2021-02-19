const log = console.log.bind(console)
const warn = console.warn.bind(console)
var chatRobot = requirePlugin("chatRobot");

// const group = console.group.bind(console)
// const groupEnd = console.groupEnd.bind(console)

// const computedBehavior = require('miniprogram-computed')
// const xhy = require('weatherui/sc-ui')
const config = require('weatherui/config/config.js')

App({
  isReady: !1,
  isError: !1,
  globalData: {
    latitude:30.664,
    longitude:104.016,
    StatusBar: "",
    CustomBar: "",
    barHeight: "",
    navigationHeight: "",
    Custom: "",
    pixelRatio: "",
    windowWidth: "",
    windowHeight:"",
    screenWidth:"",
    systemInfo: "",
    openid: '',
    unionid:''
  },
  onShow() {},
  onPageNotFound() {
    log('onPageNotFound')
  },
  onThemeChange(e){
    log('onThemeChange',e)
  },
  onLaunch() {
    const t = this
    wx.onMemoryWarning(function () {
      warn('[onMemoryWarningReceive]')
    })

    t.initCloud()
    t.updateManager()
    t.getSystemInfo()
    // t.loadFontFace()
    warn('[请不要反编译我的小程序，谢谢，祝你发大财]')
    warn('[请不要反编译我的小程序，谢谢，祝你发大财]')
    warn('[请不要反编译我的小程序，谢谢，祝你发大财]')
    warn('[请不要反编译我的小程序，谢谢，祝你发大财]')
    warn('[请不要反编译我的小程序，谢谢，祝你发大财]')
    
    //t.dataPrePull()
  },
  initChatRobot(openid,chatnavHeight){
    log('[initChatRobot openid]',openid)
    chatRobot.init({
      appid: "WmlasdlPkVIUh9hvwdKaVA1CRCYSaX",
      openid: openid,
      navHeight: chatnavHeight, 
      textToSpeech: true,
      guideList: ["成都市的天气", "北京市的天气", "深圳市的天气"],
      welcome: '你好，我是天气助手小O',
      history: true,
      historySize: 60,
      background: "#F5F6F7",
      guideCardHeight: 50,
      operateCardHeight: 120,
      history: false,
      success: function () { },
      fail: function (e) { }
    });
  },
  setData: function (e, t) {
    this.globalData[e] = t;
  },
  getData: function () {
    return this.globalData.difference;
  },
  // loadFontFace() {
  //   let $$ = wx.getStorageSync('$$')
  //   if($$.startScreen !== 'poetry') return
  //   wx.loadFontFace({
  //     family: 'wencangshufang',
  //     source: 'url("https://weather.ioslide.com/weather/font/wencangshufang/WenCangShuFang-2.ttf")',
  //     success: res => {
  //       log('[loadFontFace]', res)
  //     },
  //     complete: res =>{

  //     }
  //   })
  // },
  dataPrePull() {
    const t = this
    wx.getBackgroundFetchData({
      fetchType: 'periodic',
      success(res) {
        log('[getBackgroundFetchData] => periodic =>', res)
        wx.setStorage({
          data: res.fetchedData,
          key: 'dataPrePull',
        })
        wx.setStorage({
          data: true,
          key: 'canPrePull',
        })
      },
      fail(res) {
        log("[getBackgroundFetchData] => periodic => fail");
      },
      complete() {
        log("[getBackgroundFetchData] => completed");
      }
    })
  },
  getSystemInfo() {
    const t = this
    wx.getSystemInfo({
      success: function (e) {
        var tt = e.system.indexOf("iOS") > -1;
        t.globalData.charRobotBar = (tt ? 44 : 48) + e.statusBarHeight;
        let menuButtonInfo = wx.getMenuButtonBoundingClientRect();
        (0 == menuButtonInfo.buttom && 0 == menuButtonInfo.height && 0 == menuButtonInfo.left && 0 == menuButtonInfo.right && 0 == menuButtonInfo.top && 0 == menuButtonInfo.width || void 0 === menuButtonInfo.buttom && void 0 === menuButtonInfo.height && void 0 === menuButtonInfo.left && void 0 === menuButtonInfo.right && void 0 === menuButtonInfo.top && void 0 === menuButtonInfo.width) && (menuButtonInfo = {
          bottom: 58,
          height: 32,
          left: 278,
          right: 365,
          top: 26,
          width: 87
        })
        var o = RegExp("^.*iPhone X.*$");
        log('[getSystemInfo]',e)
        e.model.match(o) ? t.globalData.iphoneX = !0 : t.globalData.iphoneX = !1,
          t.globalData.StatusBar = e.statusBarHeight;
          t.globalData.barHeight = e.statusBarHeight,
          t.globalData.navigationHeight = 2 * menuButtonInfo.top + menuButtonInfo.height - e.statusBarHeight + 3,
          t.globalData.windowWidth = e.windowWidth,
          t.globalData.windowHeight = e.windowHeight,
          t.globalData.screenWidth = e.screenWidth,
          // t.globalData.systemInfo = e,
          t.globalData.pixelRatio = e.pixelRatio
          t.globalData.theme = e.theme
        if (menuButtonInfo) {
          t.globalData.Custom = menuButtonInfo;
          t.globalData.CustomBar = menuButtonInfo.bottom + menuButtonInfo.top - e.statusBarHeight;
        } else {
          t.globalData.CustomBar = e.statusBarHeight + 50;
        }
        t.checkVersion(e.SDKVersion)
        log('[globalData]', t.globalData)
        t.getWxContext(e.statusBarHeight,tt)
      },
      fail: function (e) {
        t.isError = !0
      }
    });
  },
  getWxContext(statusBarHeight,tt) {
    const t = this
    let hasWxContext = wx.getStorageSync('hasWxContext') || false
    log('hasWxContext',hasWxContext)
    if(hasWxContext == true){
      let wxContext = wx.getStorageSync('wxContext')
      t.globalData.openid = wxContext.openid
      t.globalData.unionid  = wxContext.unionid 
      if(wxContext.unionid == '' || wxContext.unionid == 'undefined'){
        wx.setStorageSync('haveUnionid', false)
      }
      t.initChatRobot(wxContext.openid,(tt ? 44 : 48) + statusBarHeight)
      log('[wxContext]',wxContext)
      return wxContext
    }else{
      wx.cloud.callFunction({
        name: "openapi",
        data: {
          action: 'getContext',
        },
      }).then(function (res) {
        log('[wxContext]',res.result)
        t.globalData.openid = res.result.openid
        t.globalData.unionid  = res.result.unionid 
        wx.setBackgroundFetchToken({
          token: res.result.openid
        })
        t.dataPrePull()
        t.initChatRobot(res.result.openid,(tt ? 44 : 48) + statusBarHeight)
        wx.setStorage({
          data: res.result,
          key: 'wxContext',
        })
        wx.setStorage({
          data: true,
          key: 'hasWxContext',
        })
        return  res.result
      }).catch(console.error), wx.login({
        success: function (e) {
          console.log("login ", e);
        }
      })
    }
  },
  initCloud() {
    wx.cloud.init({
      env: config.default.cloudEnv
    }),
    wx.cloud ? wx.cloud.init({
      traceUser: !0
    }) : console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    // log('[initCloud]')
  },
  updateManager() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log('onCheckForUpdate', res)
        if (res.hasUpdate) {
          console.log('res.hasUpdate')
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已准备好，立即重启应用？',
              success: function (res) {
                console.log('success', res)
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '新版本更新失败',
              content: '请删除当前小程序，并重新搜索打开'
            })
          })
        }
      })
    }
  },
  checkVersion(version) {
    const compareVersion = (v1, v2) => {
      v1 = v1.split('.')
      v2 = v2.split('.')
      const len = Math.max(v1.length, v2.length)
      while (v1.length < len) {
        v1.push('0')
      }
      while (v2.length < len) {
        v2.push('0')
      }
      for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i])
        const num2 = parseInt(v2[i])
        if (num1 > num2) {
          return 1
        } else if (num1 < num2) {
          return -1
        }
      }
      return 0
    }
    if (compareVersion(version, '2.8.1') >= 0) {
      wx.openBluetoothAdapter()
      log('[curVersion] => ', version)
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试'
      })
    }
  },
  changeStorage(i, t) {
    log([i], t)
    let $$ = wx.getStorageSync('$$')
    $$[i] = t
    wx.setStorageSync('$$', $$)
  },
  changeStorageAsync(i, t) {
    log([i], t)
    wx.getStorage({
      key: '$$',
      complete: (res) => {},
      fail: (res) => {
        warn(res)
      },
      success: (result) => {
        let $$ = result.data
        $$[i] = t
        wx.setStorage({
          data: $$,
          key: '$$'
        })
      },
    })
  },
  bioCheck() {
    const startSoterAuthentication = () => {
      wx.startSoterAuthentication({
        requestAuthModes: [AUTH_MODE],
        challenge: 'test',
        authContent: '奇妙天气',
        success: (res) => {
          log('认证成功', res)
        },
        fail: (err) => {
          error(err)
          wx.showModal({
            title: '失败',
            content: '认证失败',
            showCancel: false
          })
          wx.showToast({
            title: '认证失败'
          })
        }
      })
    }
    const checkIsEnrolled = () => {
      wx.checkIsSoterEnrolledInDevice({
        checkAuthMode: AUTH_MODE,
        success: (res) => {
          log(res)
          if (parseInt(res.isEnrolled) <= 0) {
            wx.showModal({
              title: '错误',
              content: '您暂未录入指纹信息，请录入后重试',
              showCancel: false
            })
            return
          }
          startSoterAuthentication();
        },
        fail: (err) => {
          error(err)
        }
      })
    }
    wx.checkIsSupportSoterAuthentication({
      success: (res) => {
        log(res)
        checkIsEnrolled()
      },
      fail: (err) => {
        error(err)
        wx.showModal({
          title: '错误',
          content: '您的设备不支持指纹识别',
          showCancel: false
        })
      }
    })
  },
  saveData(a, t) {
    a && t && wx.setStorage({
      key: a,
      data: t
    });
  },
  saveDataSync(a, t) {
    a && t && wx.setStorageSync({
      key: a,
      data: t
    });
  },
  isToday(str) {
    var d = new Date(str.replace(/-/g, "/"));
    var todaysDate = new Date();
    if (d.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  },
    getRecordAuth: function() {
      wx.getSetting({
        success(res) {
          console.log(res)
          if (!res.authSetting['scope.record']) {
            wx.authorize({
              scope: 'scope.record',
              success() {
                  console.log("succ auth")
              }, fail() {
                  console.log("fail auth")
              }
            })
          } else {
            console.log("record has been authed")
          }
        }, fail(res) {
            console.log("fail")
            console.log(res)
        }
      })
    },  
  request(method, url, data){
    var promise = new Promise((resolve, reject) => {
        wx.request({
            url: url,
            data: data,
            method: method,
            header: {
            },
            success: function (res) {
                if (res.statusCode == 200) {
                    resolve(res);
                } else {
                    reject(res.data);
                }
            },
            fail: function (e) {
                reject('网络出错');
            }
        })
    });
    return promise;
}
})
Object.assign(global, {
  Object : Object,
  Array : Array,
  DataView : DataView,
  Date : Date,
  Error : Error,
  Float32Array : Float32Array,
  Float64Array : Float64Array,
  Function : Function,
  Int8Array : Int8Array,
  Int16Array : Int16Array,
  Int32Array : Int32Array,
  Map : Map,
  Math : Math,
  Promise : Promise,
  RegExp : RegExp,
  Set : Set,
  String : String,
  Symbol : Symbol,
  TypeError : TypeError,
  Uint8Array : Uint8Array,
  Uint8ClampedArray : Uint8ClampedArray,
  Uint16Array : Uint16Array,
  Uint32Array : Uint32Array,
  WeakMap : WeakMap,
  clearTimeout : clearTimeout,
  isFinite : isFinite,
  parseInt : parseInt,
  setTimeout : setTimeout
  });