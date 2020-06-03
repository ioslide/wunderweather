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
    latitude:659,
    longitude:949,
    appid: wx.getAccountInfoSync().miniProgram.appId,
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
    openid: ''
  },
  onShow() {},
  onPageNotFound: function () {
    log('onPageNotFound')
  },
  onLaunch() {
    log('[onLaunch]')
    const t = this
    wx.onMemoryWarning(function () {
      warn('[onMemoryWarningReceive]')
    })
    log('[initCloud]')
    t.initCloud()
    // log(xhy)
    // t.initChatRobot()
    t.updateManager()
    t.initWxBass()
    t.getSystemInfo()
    t.loadFontFace()
    t.getWxContext()
    //t.dataPrePull()
  },
  initChatRobot(charRobotBar){
    chatRobot.init({
      appid: "WmlasdlPkVIUh9hvwdKaVA1CRCYSaX",
      navHeight: charRobotBar, 
      textToSpeech: true,
      welcome: '你好，我是小O',
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
  loadFontFace() {
    wx.loadFontFace({
      family: 'wencangshufang',
      source: 'url("https://teaimg.ioslide.com/weather/font/wencangshufang/WenCangShuFang-2.ttf")',
      success: res => {
        log('[loadFontFace]', res)
      }
    })
  },
  dataPrePull() {
    const t = this
    wx.getBackgroundFetchData({
      fetchType: 'periodic',
      success(res) {
        log('[getBackgroundFetchData] => periodic =>', res)
        t.loadFontFace(res)
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
    wx.setBackgroundFetchToken({
      token: '19980313',
      success: res => {
        log('[setBackgroundFetchToken] => success =>', res)
      },
      fail: err => {
        log('[setBackgroundFetchToken] => fail', err)
      }
    })
  },
  initWxBass() {
    wx.BaaS = requirePlugin('zhixiaoyun')
    wx.BaaS.wxExtend(wx.login, wx.getUserInfo, wx.requestPayment)
    wx.BaaS.init(config.default.wxBassId)
    wx.BaaS.auth.loginWithWechat() // 静默登录
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
        log('getSystemInfo',e)
        e.model.match(o) ? t.globalData.iphoneX = !0 : t.globalData.iphoneX = !1,
          t.globalData.StatusBar = e.statusBarHeight;
        t.globalData.barHeight = e.statusBarHeight,
          t.globalData.navigationHeight = 2 * menuButtonInfo.top + menuButtonInfo.height - e.statusBarHeight + 3,
          t.globalData.windowWidth = e.windowWidth,
          t.globalData.windowHeight = e.windowHeight,
          t.globalData.screenWidth = e.screenWidth,
          t.globalData.systemInfo = e,
          t.globalData.pixelRatio = e.pixelRatio
        if (menuButtonInfo) {
          t.globalData.Custom = menuButtonInfo;
          t.globalData.CustomBar = menuButtonInfo.bottom + menuButtonInfo.top - e.statusBarHeight;
        } else {
          t.globalData.CustomBar = e.statusBarHeight + 50;
        }
        t.checkVersion(e.SDKVersion)
        log('[globalData]', t.globalData)

        t.initChatRobot(t.globalData.charRobotBar)
      },
      fail: function (e) {
        t.isError = !0, wx.showModal({
          title: "错误",
          content: "获取系统信息出错",
          showCancel: !1
        });
      }
    });
  },
  getWxContext() {
    const t = this
    let hasWxContext = wx.getStorageSync('hasWxContext') || false
    if(hasWxContext == true){
      let wxContext = wx.getStorageSync('wxContext')
      t.globalData.openid = wxContext.openid
    }else{
      wx.cloud.callFunction({
        name: "openapi",
        data: {
          action: 'getContext',
        },
      }).then(function (res) {
        console.log(res.result)
        t.globalData.openid = res.result.openid
        wx.setStorage({
          data: res.result,
          key: 'wxContext',
        })
        wx.setStorage({
          data: true,
          key: 'hasWxContext',
        })
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
    log('[initCloud]')
  },
  updateManager() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      log('[canUpdateManager] =>', res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '请更新以保证正常使用',
        success: res => {
          if (res.confirm) {
            wx.clearStorage({
              complete: (res) => {
                log('call applyUpdate && restart', res)
                updateManager.applyUpdate()
              },
            })
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      log('New vision download fail')
    })
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
  request(method, url, data){
    var promise = new Promise((resolve, reject) => {
        wx.request({
            url: url,
            data: data,
            method: method,
            header: {
            },
            success: function (res) {
                //服务器返回数据
                if (res.statusCode == 200) {
                    resolve(res);
                } else {
                    //返回错误提示信息
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