const app = getApp();
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  properties: {
    isCustom: {
      type: [Boolean, String],
      default: false
    },
    isBack: {
      type: [Boolean, String],
      default: false
    },
    themeValue:{
      type: String,
      value: ""
    },
    contentText:{
      type: String,
      value: ""
    }
  },
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom
  },
  pageLifetimes: {
    show: function() {
      if (getApp().globalSystemInfo.ios) {
        this.getSystemInfo();
        this.setStyle();
      }
    },
    hide: function() {}
  },
  lifetimes:{
    created: function() {
      this.getSystemInfo();
    },
    attached: function() {
      this.setStyle();
    },
    attached:function(){
      var e = this.properties
      this.setData({
        themeValue:e.themeValue,
        contentText:e.contentText
      })
    }
  },
  methods: {
    setStyle: function(life) {
      const {
        statusBarHeight,
        navBarHeight,
        capsulePosition,
        navBarExtendHeight,
        ios,
        windowWidth
      } = getApp().globalSystemInfo;
      let rightDistance = windowWidth - capsulePosition.right; 
      let leftWidth = windowWidth - capsulePosition.left;

      let navigationbarinnerStyle = [
        `height:${navBarHeight + navBarExtendHeight}px`,
        `padding-top:${statusBarHeight}px`,
        `padding-right:${leftWidth}px`,
        `padding-bottom:${navBarExtendHeight}px`
      ].join(';');
      let navBarLeft = [];
        navBarLeft = [
          `width:${capsulePosition.width}px`,
          `height:${capsulePosition.height}px`,
          `margin-left:${rightDistance}px`
        ].join(';');
      if (life === 'created') {
        this.data = {
          navigationbarinnerStyle,
          navBarLeft,
          navBarHeight,
          capsulePosition,
          navBarExtendHeight,
          ios
        };
      } else {
        this.setData({
          navigationbarinnerStyle,
          navBarLeft,
          navBarHeight,
          capsulePosition,
          navBarExtendHeight,
          ios
        });
      }
    },
    _showChange: function(value) {
      this.setStyle();
    },
    getSystemInfo() {
      var app = getApp();
      if (app.globalSystemInfo && !app.globalSystemInfo.ios) {
        return app.globalSystemInfo;
      } else {
        let systemInfo = wx.getSystemInfoSync();
        let ios = !!(systemInfo.system.toLowerCase().search('ios') + 1);
        let rect;
        try {
          rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
          if (rect === null) {
            throw 'getMenuButtonBoundingClientRect error';
          }
          if (!rect.width || !rect.top || !rect.left || !rect.height) {
            throw 'getMenuButtonBoundingClientRect error';
          }
        } catch (error) {
          let gap = '';
          let width = 96;
          if (systemInfo.platform === 'android') {
            gap = 8;
            width = 96;
          } else if (systemInfo.platform === 'devtools') {
            if (ios) {
              gap = 5.5; 
            } else {
              gap = 7.5;
            }
          } else {
            gap = 4;
            width = 88;
          }
          if (!systemInfo.statusBarHeight) {
            systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
          }
          rect = {
            bottom: systemInfo.statusBarHeight + gap + 32,
            height: 32,
            left: systemInfo.windowWidth - width - 10,
            right: systemInfo.windowWidth - 10,
            top: systemInfo.statusBarHeight + gap,
            width: width
          };
          console.log('error', error);
          console.log('rect', rect);
        }

        let navBarHeight = '';
        if (!systemInfo.statusBarHeight) {
          systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
          navBarHeight = (function() {
            let gap = rect.top - systemInfo.statusBarHeight;
            return 2 * gap + rect.height;
          })();

          systemInfo.statusBarHeight = 0;
          systemInfo.navBarExtendHeight = 0;
        } else {
          navBarHeight = (function() {
            let gap = rect.top - systemInfo.statusBarHeight;
            return systemInfo.statusBarHeight + 2 * gap + rect.height;
          })();
          if (ios) {
            systemInfo.navBarExtendHeight = 4; 
          } else {
            systemInfo.navBarExtendHeight = 0;
          }
        }
        systemInfo.navBarHeight = navBarHeight;
        systemInfo.capsulePosition = rect;
        systemInfo.ios = ios;
        app.globalSystemInfo = systemInfo; 
        return systemInfo;
      }
    },
    backPage() {
      wx.navigateBack({
        delta: 1
      });
    },
    toHome(){
      wx.reLaunch({
        url: '/pages/index/index',
      })
    },
    onCapTap: function (e) {
      let modalName = e.currentTarget.dataset.target
      this.triggerEvent('showModalListener', modalName)
    }
  }
})