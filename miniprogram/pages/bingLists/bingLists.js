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
    bingImageLists: {},
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    use: [
      'themeValue'
    ]
  },
  onLoad: function () {
    const t = this
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 2]
    log(currPage)
    let headImageData = currPage.getHeadImageData()
    log('[headImageData]',headImageData)
    t.setData({
      bingImageLists:headImageData.bingImageLists
    })
  },
  onShow() {
    const t = this
  },
  BackPage: function () {
    wx.navigateBack({
      delta: 1
    });
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
  showModal(e) {
    var t = this
    t.setData({
      // modalImage: wx.getStorageSync('bingImageLists')[e.currentTarget.dataset.order],
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
      content: t.data.bingImageLists[t.data.currDay].copyright,
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
        let safeUrl = 'https://cn.bing.com/' + t.data.bingImageLists[t.data.currDay].url
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