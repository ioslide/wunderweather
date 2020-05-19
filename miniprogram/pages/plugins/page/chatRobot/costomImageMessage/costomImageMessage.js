Component({
    properties: {
        msg: Object
    },
    data: {},
    lifetimes: {
        ready: function() {}
    },
    methods: {
        showImage: function(e) {
            var t = e.currentTarget.dataset;
            wx.previewImage({
                current: t.imgurl,
                urls: [ t.imgurl ]
            });
        }
    }
});