const cloud = require('wx-server-sdk');
const templateMessage = require('templateMessage.js');
const rp = require('request-promise');
cloud.init({
  env: 'wunderweather-nwepb'
})
exports.main = async (event, context) => {

  const db = cloud.database();
  try {
    const AllUserWeatherData = await db
      .collection('oa-subscribe-user-daily')
      .where({
        done: false,
      })
      .get();

    const sendPromises = AllUserWeatherData.data.map(async userWeatherData => {
      try {
        if (isToday(userWeatherData.startTime) == true) {
          let getAccessToken = await db.collection("oa-subscribe-accessToken").doc("ACCESS_TOKEN").get();
          let accessToken = getAccessToken.data.token;

          var weatherSkycon = {
            CLEAR_DAY: "晴",
            CLEAR_NIGHT: "晴夜",
            PARTLY_CLOUDY_DAY: "白天多云",
            PARTLY_CLOUDY_NIGHT: "夜间多云",
            CLOUDY: "阴",
            RAIN: "雨",
            WIND: "风",
            SNOW: "雪",
            HAZE: "雾霾沙尘",
            LIGHT_HAZE: "轻度雾霾",
            MODERATE_HAZE: "中度雾霾",
            HEAVY_HAZE: "重度雾霾",
            LIGHT_RAIN: "小雨",
            MODERATE_RAIN: "中雨",
            HEAVY_RAIN: "大雨",
            STORM_RAIN: "暴雨",
            FOG: "雾",
            LIGHT_SNOW: "小雪",
            MODERATE_SNOW: "中雪",
            HEAVY_SNOW: "大雪",
            STORM_SNOW: "暴雪",
            DUST: "浮尘",
            SAND: "沙尘",
            THUNDER_SHOWER: "雷阵雨",
            HAIL: "冰雹",
            SLEET: "雨夹雪"
          }

          let getWeatherData = await rp({
            method: 'GET',
            uri: 'https://api.caiyunapp.com/v2.5/F4i9DpgD0R1DIcPP/' + userWeatherData.longitude + ',' + userWeatherData.latitude + '/weather.json?lang=' + userWeatherData.language + '&dailysteps=30&unit=' + userWeatherData.unit,
            json: true
          })
          let getOAUserList = await rp({
            method: 'GET',
            uri: 'https://api.weixin.qq.com/cgi-bin/user/get?access_token=' + accessToken,
            json: true
          })
          let getOAUserListOpenid = getOAUserList.data.openid
          console.log('getOAUserListOpenid', getOAUserListOpenid)
          console.log(getWeatherData)
          // let temperature = getWeatherData.result.daily.temperature[0]
          // let skycon = weatherSkycon[getWeatherData.result.realtime.skycon]
          let weatherData = {
            'first': {
              value: '较高'
            },
            'keyword1': {
              value: '10~20°C'
            },
            'keyword2': {
              value: '60%',
            },
            'keyword3': {
              value: '35'
            },
            'keyword4': {
              value: 'PM10'
            },
            'keyword5': {
              value: '50μg/m3'
            },
            'remark': {
              value: '空气中刺激因素较强，容易引起发作，请避免户外运动。'
            }
          }

          for (let i = 0; i < getOAUserListOpenid.length; i++) {
            let longtermTemplateData = {
              'touser': getOAUserListOpenid[i],
              "miniprogram": {
                "appid": "wx7b4bbc2d9c538e84",
                "pagepath": "pages/index/index"
              },
              'data': weatherData,
              'template_id': 'oOTpsU26qGPpShCbFypuJj6eLlpDm_Yba9Jz500G4dk',
            }
            console.log('longtermTemplateData', longtermTemplateData)
            // await templateMessage.sendTemplateMsg(accessToken, longtermTemplateData);
          }
        }
      } catch (e) {
        return e;
      }
    });
    return Promise.all(sendPromises);
  } catch (err) {
    console.log(err);
    return err;
  }
};