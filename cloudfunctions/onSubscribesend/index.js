const cloud = require('wx-server-sdk');
const templateMessage = require('templateMessage.js');
const rp = require('request-promise');
cloud.init({
  env: 'subweather-5hkjz'
})
exports.main = async (event, context) => {

  const db = cloud.database();
  try {
    const messages = await db
      .collection('sub_daily_weather_user')
      .where({
        done: false,
      })
      .get();

    const sendPromises = messages.data.map(async message => {
      const isToday = (str) => {
        var d = new Date(str.replace(/-/g,"/"));
        var todaysDate = new Date();
        if(d.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)){
            return true;
        } else {
            return false;
        }
      }
      console.log('---------isToday',isToday(message.startTime))
      try {
        if (isToday(message.startTime) == true) {
        let opt = {
          method: 'GET',
          uri: 'https://api.caiyunapp.com/v2/F4i9DpgD0R1DIcPP/' + message.longitude + ',' + message.latitude + '/forecast.json?dailysteps=15&alert=true',
          json: true
        }
        // https://api.caiyunapp.com/v2/F4i9DpgD0R1DIcPP/104.77345,31.44005/forecast.json?dailysteps=15&alert=true
        // https://api.caiyunapp.com/v2/TAkhjf8d1nlSlspN/104.77345,31.44005/daily.json?lang=en_US&dailysteps=360

        let reqWeather = await rp(opt)
        let temperature = reqWeather.result.daily.temperature[0]
        let reqSkycon = reqWeather.result.daily.skycon[0].value
        console.log(reqWeather.result.daily.temperature[0])
        let allWeather = {
          '晴天': ["CLEAR_DAY"],
          '晴夜': ["CLEAR_NIGHT"],
          '白天多云': ["PARTLY_CLOUDY_DAY"],
          '夜晚多云': ["PARTLY_CLOUDY_NIGHT"],
          '阴': ["CLOUDY"],
          '雨': ["RAIN"],
          '风': ["WIND"],
          '雪': ["SNOW"],
          '雾霾沙尘': ["HAZE"]
        }
        const changeWeather = (code) => {
          for (let i in allWeather) {
            if (allWeather[i].includes(code)) return i
          }
        }
        console.log(changeWeather(reqSkycon))
        let skycon = changeWeather(reqSkycon)
        let sendTemplateData = {
          'phrase3': {
            value: skycon
          },
          'phrase2': {
            value: message.city,
          },
          'character_string4': {
            value: temperature.min + '~' + temperature.max + '°',
          },
          'date1': {
            value: temperature.date
          }
        }
        console.log('-----------sendTemplateData-----------', sendTemplateData)
        console.log('-----------message.data-----------', message.data)

        let tokenRes = await db.collection("accessToken").doc("ACCESS_TOKEN").get();
        let token = tokenRes.data.token;
        console.log(token)
        let finData = {
          'touser': message.touser,
          'page': message.page,
          'data': sendTemplateData,
          'templateId': message.templateId,
        }
        console.log('______finData_____', finData)
        await templateMessage.sendTemplateMsg(token, finData);
        return db
          .collection('sub_daily_weather_user')
          .doc(message._id)
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