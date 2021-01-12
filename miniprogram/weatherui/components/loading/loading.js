Component({
  properties: {

  },
  data: {
    canLoading:false
  },
  methods: {
    startLoading(){
      // console.log('[startLoading]')
      this.setData({
        canLoading : true
      })
    },
    stopLoading(){
      // console.log('[stopLoading]')
      setTimeout(() => {
        this.setData({
          canLoading : false
        })
      }, 4000);
    }
  }
})
