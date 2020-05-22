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
      .collection('sub_daily_weather_user')
      .where({
        done: false,
      })
      .get();

    const sendPromises = AllUserWeatherData.data.map(async userWeatherData => {
      const isToday = (str) => {
        var d = new Date(str.replace(/-/g,"/"));
        var todaysDate = new Date();
        if(d.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)){
            return true;
        } else {
            return false;
        }
      }
      console.log('---------isToday',isToday(userWeatherData.startTime))
      try {
        if (isToday(userWeatherData.startTime) == true) {
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
          // const findWeather = (code) => {
          //   for (let i in allWeather) {
          //     if (allWeather[i].includes(code)) return i
          //   }
          // }

        let apiOpt = {
          method: 'GET',
          uri: 'https://api.caiyunapp.com/v2.5/F4i9DpgD0R1DIcPP/' + userWeatherData.longitude + ',' + userWeatherData.latitude + '/weather.json?lang=' + userWeatherData.language + '&dailysteps=30&unit=' + userWeatherData.unit,
          json: true
        }

        let reqWeather = await rp(apiOpt)
        let temperature = reqWeather.result.daily.temperature[0]
        let skycon = weatherSkycon[reqWeather.result.realtime.skycon]
        console.log(skycon,temperature)
        let sendTemplateData = {
          'phrase3': {
            value: skycon
          },
          'phrase2': {
            value: userWeatherData.city,
          },
          'character_string4': {
            value: temperature.min + '~' + temperature.max + '°',
          },
          'date1': {
            value: userWeatherData.startTime
          }
        }
        console.log('-----------sendTemplateData-----------', sendTemplateData)
        console.log('-----------userWeatherData.data-----------', userWeatherData)
        let getToken = await db.collection("accessToken").doc("ACCESS_TOKEN").get();
        let token = getToken.data.token;
        let curData = {
          'touser': userWeatherData.touser,
          'page': userWeatherData.page,
          'data': sendTemplateData,
          'templateId': userWeatherData.templateId,
        }
        console.log('------------token-----------',token)
        console.log('----------curData-----------', curData)
        await templateMessage.sendTemplateMsg(token, curData);
        return db
          .collection('sub_daily_weather_user')
          .doc(userWeatherData._id)
          .remove();
          // .update({
          //   data: {
          //     done: true,
          //   },
          // });
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