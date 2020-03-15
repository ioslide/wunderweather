const app = getApp()
const log = console.log.bind(console)

App({
  globalData: {
    StatusBar: "",
    CustomBar: "",
    Custom: "",
    clientId: "c3d88ee29b2337915fd0",
    language:'zh_CN'
  },
  onShow(options) {
    wx.BaaS.reportTemplateMsgAnalytics(options)
    wx.onMemoryWarning(function () {
      console.warn('[onMemoryWarningReceive]')
    })
  },
  onLaunch() {
    console.warn('[onLaunch]')
    this.checkVersion()
    this.updateManager()
    this.getSystemInfo()
    this.loadFontFace()
    this.initCloud()
    this.autologin()
    this.dataPrePull()
  },
  loadFontFace() {
    wx.loadFontFace({
      family: 'wencangshufang',
      source: 'url("https://teaimg.ioslide.com/weather/font/wencangshufang/WenCangShuFang-2.ttf")',
      success:res =>{
        log('[loadFontFace]',res)
      }
    })
  },
  dataPrePull() {
      wx.getBackgroundFetchData({
        fetchType: 'periodic',
        success(res) {
          log('[getBackgroundFetchData] => periodic =>',res)
          wx.setStorage({
            data: res.fetchedData,
            key: 'dataPrePull',
          })
          wx.setStorage({
            data: true,
            key: 'canPrePull',
          })
        },
        fail(res){
          log("[getBackgroundFetchData] => periodic => fail");
        },complete(){
          log("[getBackgroundFetchData] => completed");
        }
      })
      wx.setBackgroundFetchToken({
        token: '19980313',
        success: res => {
          log('[setBackgroundFetchToken] => success =>',res)
        },
        fail: err => {
          log('[setBackgroundFetchToken] => fail',err)
        }
      })
  },
  autologin() {
    log('[autologin]')
    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // wx.BaaS = requirePlugin('sdkPlugin')
    // wx.BaaS.wxExtend(wx.login, wx.getUserInfo, wx.requestPayment)
    // wx.BaaS.auth.loginWithWechat(null, {
    //   createUser: false
    // }).then(user => {
    //   wx.BaaS.auth.getCurrentUser().then(user => {
    //     if (user._anonymous) {
    //       wx.BaaS.auth.anonymousLogin().then(user => {
    //         log("[anonymousLogin] => ", user)
    //       }).catch(err => {
    //         // HError
    //       })
    //     } else {
    //       wx.setStorage({
    //         data: user,
    //         key: 'userInfo_storage',
    //       })
    //     }
    //   })
    // }, err => {
    //   log('[login] => fail')
    // })
    wx.BaaS = requirePlugin('sdkPlugin')
    wx.BaaS.wxExtend(wx.login, wx.getUserInfo, wx.requestPayment)
    let clientID = 'c3d88ee29b2337915fd0'  // 应用名称: 奇妙天气
    wx.BaaS.init(clientID)
  },
  getSystemInfo() {
    wx.getSystemInfo({
      success: res => {
        log(`[getSystemInfo]`,res)
        this.globalData.language = res.language;
        this.globalData.StatusBar = res.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - res.statusBarHeight;
        } else {
          this.globalData.CustomBar = res.statusBarHeight + 50;
        }
        log('[globalData] => ' ,this.globalData)
      }
    })
  },
  initCloud() {
    wx.cloud.init({
      env: 'subweather-5hkjz',
      traceUser: true,
    });
    log('[initCloud] => OK')
  },
  updateManager() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      log('[canUpdateManager] =>', res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '请立即更新以获取最佳体验',
        success: res => {
          if (res.confirm) {
            log('call applyUpdate && restart')
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      log('new vision download fail')
    })
  },
  checkVersion() {
    const version = wx.getSystemInfoSync().SDKVersion
    if (this.compareVersion(version, '2.8.1') >= 0) {
      wx.openBluetoothAdapter()
      log('[curVersion] => OK  => 2.8.1')
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试'
      })
    }
  },
  compareVersion (v1, v2) {
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
  },
  changeStorage(i, t) {
    log([i],'=>', t)
    wx.getStorage({
      key: '$$',
      success: (result) => {
        let $$ = result.data
        $$[i] = t
        wx.setStorage({
          data: $$,
          key: '$$',
        })
      },
      fail: (res) => {
        console.warn('res')
      }
    })
  },
  bioCheck () {
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
  isToday(str){
    var d = new Date(str.replace(/-/g,"/"));
    var todaysDate = new Date();
    if(d.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)){
        return true;
    } else {
        return false;
    }
  }
})