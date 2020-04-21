const app = getApp()
const log = console.log.bind(console)
const error = console.error.bind(console)
import create from '../../utils/create'
import store from '../../store/index'
const config = require('../../weatherui/config/config.js')

var t = void 0,
  i = (getApp(), void 0),
  e = void 0,
  n = void 0,
  a = void 0,
  o = void 0,
  s = void 0;

create(store, {
  data: {
    bingLists: {},
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    use: [
      'themeValue'
    ]
  },
  onLoad: function () {
    const t = this
    let 
      lists = wx.getStorageSync('bingLists') || [{
        datesign : "1998-03-13"
      }],
      isToday = app.isToday(lists[0].datesign),
      hasBingLists = wx.getStorageSync('hasBingLists') || false
    const loadBingListFromeStorage = () =>{
      log('[loadBingListFromeNet]')
      t.setData({
        bingLists: lists
      });
    }
    const loadBingListFromeNet = () => {
        log('[loadBingListFromeNet')
      wx.request({
        url: config.default.bingApiHost + '/api/bing/lists',
        header: {
          "content-type": "application/json"
        },
        success: res => {
          log('[requestBing]',res)
          t.setData({
            bingLists: res.data.data
          });
          app.saveData('bingLists', res.data.data)
          app.saveData('hasBingLists',true)
        },
        fail: err =>{
          warn('requestBing',err)
          app.saveData('hasBingLists',false)
        }
      });
    }
    const event = (isToday,hasBingLists) => {
      switch (true) {
        case (isToday == true && hasBingLists == true):
          loadBingListFromeStorage()
          break
        case (hasBingLists == false):
          loadBingListFromeNet()
          break
        default:
          loadBingListFromeNet()
          break
      }
    }
    event(isToday,hasBingLists)
  },
  onShow() {
    const t = this
  },
  BackPage: function () {
    // let
    // pages = getCurrentPages(),
    // prevPage = pages[pages.length - 2];
    // prevPage.setData({
    //   isBackFromBing: true
    // })
    wx.navigateBack({
      delta: 1
    });
  },
  onShareAppMessage: function (a) {
    return {
      title: '奇妙天气',
      imageUrl: 'https://weather.ioslide.com/shareimg.png',
      path: "/pages/index/index"
    };
  },
  showModal(e) {
    var t = this
    console.log(wx.getStorageSync('bingLists')[e.currentTarget.dataset.order])
    t.setData({
      // modalImage: wx.getStorageSync('bingLists')[e.currentTarget.dataset.order],
      currDay: e.currentTarget.dataset.order,
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  swipeEnd: function (t) {
    if (t.detail.current != a) {
      a = t.detail.current,
        o = -1;
      var i = this;
      s < 1 && a == 8 * s + 7 && (s++, r(this, function () {
        i.setData({
          currDay: a
        });
      })), this.setData({
        currDay: a
      })
    }
  },
  downloadImageModal: function () {
    var t = this
    wx.showModal({
      title: '是否下载图片',
      content: wx.getStorageSync('bingLists')[t.data.currDay].title,
      success(res) {
        if (res.confirm) {
          t.downloadCur()
        } else if (res.cancel) {}
      }
    })
  },
  downloadCur: function () {
    var t = this
    if (this.downloading) {
      return false;
    }
    var progress = 0;
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success: function success() {
        t.downloading = true;
        let safeUrl = wx.getStorageSync('bingLists')[t.data.currDay].oldurl.replace(/http/, 'https')
        wx.downloadFile({
          url: safeUrl,
          success: function success(res) {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function success() {
                wx.showToast({
                  title: '下载成功',
                  duration: 1500
                });
                t.triggerEvent('download', {
                  downloadList: safeUrl
                });
              }
            });
          }
        }).onProgressUpdate(function (res) {
          progress = res.progress;
        });

        var progressTimer = setInterval(function () {
          var _progressContent = progress > 0 ? '\u4E0B\u8F7D\u4E2D ' + progress + '%' : '下载中...';
          wx.showToast({
            title: _progressContent,
            icon: 'none'
          });

          if (progress >= 100) {
            clearInterval(progressTimer);
            t.downloading = false;
          }
        }, 200);
      },
      fail: function fail() {
        this.downloading = false;
        wx.showToast({
          title: '请授权后,重新保存！',
          icon: 'none',
          duration: 2000
        });
        wx.openSetting({});
      }
    });
    return true;
  } 
})