module.exports = {
    chinese2letter: function(e) {
        var a = "";
        switch (e) {
          case "晴":
            a = "qing";
            break;

          case "中到大雨":
            a = "dayu";
            break;

          case "中雨":
            a = "zhongyu";
            break;

          case "小雨":
            a = "xiaoyu";
            break;

          case "大到暴雨":
            a = "baoyu";
            break;

          case "小阵雨":
            a = "leizhenyu";
            break;

          case "特大暴雨":
            a = "tedabaoyu";
            break;

          case "暴雪":
            a = "dabaoxue";
            break;

          case "阵雪":
            a = "xiaoxue";
            break;

          case "雨夹雪":
            a = "yujiaxue";
            break;

          case "大雪":
            a = "daxue";
            break;

          case "小到中雪":
            a = "zhongxue";
            break;

          case "阴天":
            a = "yin";
            break;

          case "多云":
            a = "duoyun";
            break;

          case "冰雹":
            a = "yujiabingbao";
            break;

          case "尘卷风":
            a = "shachen";
            break;

          case "浮尘":
            a = "fuchen";
            break;

          case "雷暴":
            a = "dalei";
            break;

          case "雾":
            a = "wu";
            break;

          case "雾霾":
            a = "wumai";
            break;

          case "大风":
            a = "dafeng";
            break;

          case "风":
            a = "feng";
            break;

          case "飓风":
            a = "jufeng";
            break;

          case "龙卷风":
            a = "longjuanfeng";
            break;

          default:
            a = "duoyun";
        }
        return a;
    }
};