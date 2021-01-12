// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'wunderweather-nwepb'
})

exports.main = async (event, context) => {
  console.log(event)
  switch (event.action) {
    case 'getWXACode': {
      return getWXACode(event)
    }
    case 'getOpenData': {
      return getOpenData(event)
    }
    case 'getRunData': {
      return getRunData(event)
    }
    case 'subscribeWarning': {
      return subscribeWarning(event)
    }
    case 'subscribeOnetimeDailyWeather': {
      return subscribeOnetimeDailyWeather(event)
    }
    case 'subscribeLongtermDailyWeather': {
      return subscribeLongtermDailyWeather(event)
    }
    case 'getContext': {
      return getContext(event)
    }
    case 'unSubscribeOneTimeDailyWeather': {
      return unSubscribeOneTimeDailyWeather(event)
    }
    case 'unSubscribeLongTermDailyWeather': {
      return unSubscribeLongTermDailyWeather(event)
    }
    case 'unSubscribeWarning': {
      return unSubscribeWarning(event)
    }
    default: {
      return
    }
  }
}
async function getWXACode(event) {
  const wxacodeResult = await cloud.openapi.wxacode.get({
    path: 'pages/index/index',
    width: 430,
    is_hyaline:true
  })
  let obj = {
    wxacodebase64 : wxacodeResult.buffer.toString('base64').replace(/[\r\n]/g, ""),
    wxacodeResult:wxacodeResult
  }
  return obj
  // const wxacodeResult = await cloud.openapi.wxacode.get({
  //   path: 'pages/openapi/openapi',
  // })
  // const fileExtensionMatches = wxacodeResult.contentType.match(/\/([^\/]+)/)
  // const fileExtension = (fileExtensionMatches && fileExtensionMatches[1]) || 'jpg'
  // const uploadResult = await cloud.uploadFile({
  //   cloudPath: `wxacode_default_openapi_page.${fileExtension}`,
  //   fileContent: wxacodeResult.buffer,
  // })
  // if (!uploadResult.fileID) {
  //   throw new Error(`upload failed with empty fileID and storage server status code ${uploadResult.statusCode}`)
  // }
  // return uploadResult.fileID
}

async function getOpenData(event) {
  return cloud.getOpenData({
    list: event.openData.list,
  })
}

async function getRunData(event) {
  delete event.userInfo
  return event
}

async function unSubscribeOneTimeDailyWeather(event) {
  const db = cloud.database();
  const result = await db
    .collection('mini-subscribe-user-daily')
    .where({
      openid: event.openid,
      templateId: event.templateId
    })
    .remove();
  return result;
}
async function unSubscribeLongTermDailyWeather(event) {
  const db = cloud.database();
  const result = await db
    .collection('oa-subscribe-user-daily')
    .where({
      openid: event.openid,
      templateId: event.templateId
    })
    .remove();
  return result;
}
async function subscribeWarning(event) {
  const db = cloud.database();
  const {OPENID} = cloud.getWXContext();

  // 在云开发数据库中存储用户订阅的信息
  const result = await db.collection('warning-subscribe-user').add({
    data: {
      ...event,
      touser: OPENID
    },
  });
  return result;
}
async function unSubscribeWarning(event) {
  const db = cloud.database();
  const result = await db
    .collection('oa-subscribe-user-daily')
    .where({
      openid: event.openid,
      templateId: event.templateId
    })
    .remove();
  return result;
}
async function getContext(event) {
  const wxContext = cloud.getWXContext()
  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID
  }
}

async function subscribeOnetimeDailyWeather(event) {
  const db = cloud.database();
  const {OPENID} = cloud.getWXContext();

  const result = await db.collection('mini-subscribe-user-daily').add({
    data: {
      ...event,
      touser: OPENID
    },
  });
  return result;
}
async function subscribeLongtermDailyWeather(event) {
  const db = cloud.database();
  const {OPENID} = cloud.getWXContext();
  const result = await db.collection('oa-subscribe-user-daily').add({
    data: {
      ...event,
      touser: OPENID
    },
  });
  return result;
}
