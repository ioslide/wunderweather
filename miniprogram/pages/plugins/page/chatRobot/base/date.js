function t(t) {
    return t = t.replace(/^(\d{4})-(\d{1,2})-(\d{1,2})$/, "$2/$3");
}

var e = function(t) {
    return (t = t.toString())[1] ? t : "0" + t;
};

module.exports = {
    formatTime: function(t) {
        var r = t.getFullYear(), n = t.getMonth() + 1, o = t.getDate(), a = t.getHours(), u = t.getMinutes(), i = t.getSeconds();
        return [ r, n, o ].map(e).join("/") + " " + [ a, u, i ].map(e).join(":");
    },
    randomString: function(t) {
        var e, r, n = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", o = "";
        for (e = 0; t > e; e += 1) r = Math.random() * n.length, r = Math.floor(r), o += n.charAt(r);
        return o;
    },
    formAtText: function(t) {
        for (var e = "", r = 0; r < t.length; r++) e += t[r].text;
        return e;
    },
    recordTime: function(t) {
        var r = t.getMonth() + 1, n = t.getDate(), o = t.getHours(), a = t.getMinutes();
        return [ r, n ].map(e).join("/") + " " + [ o, a ].map(e).join(":");
    },
    dateTimeFormat: t,
    secondToMinute: function(t) {
        return (t / 60 >= 10 ? parseInt(t / 60) : "0" + parseInt(t / 60)) + ":" + (t % 60 >= 10 ? parseInt(t % 60) : "0" + parseInt(t % 60));
    },
    randomString2: function(t) {
        var e, r, n = "0123456789", o = "";
        for (e = 0; t > e; e += 1) r = Math.random() * n.length, r = Math.floor(r), o += n.charAt(r);
        return o;
    },
    fullTimeFormat: function(e) {
        var r = e.split(" ");
        return t(r[0]) + " " + r[1].slice(0, 5);
    },
    date2Week: function(t) {
        return [ "周日", "周一", "周二", "周三", "周四", "周五", "周六" ][new Date(Date.parse(t.replace(/-/g, "/"))).getDay()];
    }
};