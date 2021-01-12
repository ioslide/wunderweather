const cloud = require('wx-server-sdk');
const templateMessage = require('templateMessage.js');
const rp = require('request-promise');
const dayjs = require('day.js')

cloud.init({
  env: 'wunderweather-nwepb'
})
exports.main = async (event, context) => {

  const db = cloud.database();
  try {
    const AllUser = await db
      .collection('warning-subscribe-user')
      .where({
        done: false,
      })
      .get();

    const sendPromises = AllUser.data.map(async userData => {

      let rqURL = {
        method: 'GET',
        uri: 'https://api.caiyunapp.com/v2.5/F4i9DpgD0R1DIcPP/' + userData.longitude + ',' + userData.latitude + '/weather.json?lang=' + userData.language +  "&dailysteps=30&hourlysteps=120&alert=true&unit=" + userData.unit,
        json: true
      }
      let weatherWarningLevel = {
        "01": "四级",
        "02": "三级",
        "03": "二级",
        "04": "一级"
      }
      let weatherWarningLevelName = {
        "01": "蓝色",
        "02": "⻩色",
        "03": "橙色",
        "04": "红色"
      }
      let weatherWarning = {
        "01": "台⻛",
        "02": "暴雨",
        "03": "暴雪",
        "04": "寒潮",
        "05": "⼤风",
        "06": "沙尘暴",
        "07": "⾼温",
        "08": "⼲旱",
        "09": "雷电",
        "10": "冰雹",
        "11": "霜冻",
        "12": "⼤雾",
        "13": "霾",
        "14": "道路结冰",
        "15": "森林火灾",
        "16": "雷⾬大风"
      }
      const alertContent = (alertData) => {
        if (alertData == []) {
          console.log(alertData)
          return
        } else {
          for (var y = alertData, v = [], w = 0; w < y.length; w++) {
            v.push({
              alertType: y[w].code.slice(0, 2),
              location: y[w].location,
              title: y[w].city+'气象局发布'+  weatherWarning[y[w].code.slice(0, 2)] + weatherWarningLevelName[y[w].code.slice(2, 4)] + '预警,请注意防范',
              source: y[w].source,
              level: weatherWarningLevel[y[w].code.slice(2, 4)],
              levelName: weatherWarningLevelName[y[w].code.slice(2, 4)],
              typeName: weatherWarning[y[w].code.slice(0, 2)]
            });
          }
          return v
        }
      }

      let requestWeatherData = await rp(rqURL)
      console.log(requestWeatherData)
      let alarmInfo = alertContent(requestWeatherData.result.alert.content)

      try {
        if (alarmInfo[0].content !== 'none') {
          let getAccessToken = await db.collection("mini-subscribe-accessToken").doc("ACCESS_TOKEN").get();
          let accessToken = getAccessToken.data.token;
          console.log(alarmInfo[0])
          let subscribeWeatherData = {
            'phrase4': {
              value: alarmInfo[0].level
            },
            'thing2': {
              value: alarmInfo[0].location
            },
            'phrase3': {
              value: alarmInfo[0].typeName
            },
            'thing1': {
              value: alarmInfo[0].title
            },
            'date5': {
              value: dayjs(new Date()).format('YYYY-MM-DD HH:mm').toString()
            }
          }
          let warningData = {
            'touser': userData.touser,
            'page': 'pages/index/index',
            'data': subscribeWeatherData,
            'templateId': userData.templateId,
          }

          console.log('----------warningData-----------', warningData)
          await templateMessage.sendSubscribeMsg(accessToken, warningData);
          // await cloud.openapi.subscribeMessage.send({
          //   touser: warningData.touser,
          //   templateId: warningData.templateId,
          //   page: warningData.page,
          //   data: warningData.data
          // })
          return db
            .collection('warning-subscribe-user')
            .doc(userData._id)
            // .remove();
            .update({
              data: {
                done: true,
              },
            });
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