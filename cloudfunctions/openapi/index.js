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
    case 'saveSubscribeMessage': {
      return saveSubscribeMessage(event)
    }
    case 'getContext': {
      return getContext(event)
    }
    case 'deleteSubscribeMessage': {
      return deleteSubscribeMessage(event)
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

async function deleteSubscribeMessage(event) {
  const { OPENID } = cloud.getWXContext();
  const result = await db
    .collection('sub_daily_weather_user')
    .where({
      touser: OPENID,
      startTime: event.startTime,
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
    unionid: wxContext.UNIONID,
    env: wxContext.ENV,
  }
}

async function saveSubscribeMessage(event) {
  const db = cloud.database();
  const {OPENID} = cloud.getWXContext();

  // 在云开发数据库中存储用户订阅的信息
  const result = await db.collection('sub_daily_weather_user').add({
    data: {
      ...event,
      touser: OPENID
    },
  });
  return result;
}