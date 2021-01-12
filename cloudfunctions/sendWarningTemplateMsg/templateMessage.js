const rp = require('request-promise');
const sendSubscribeMsg = async (token, param) => {
  return await rp({
    json: true,
    method: 'POST',
    uri: 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=' + token,
    body: {
      touser: param.touser,
      template_id: param.templateId,
      page: param.page,
      data: param.data
    }
  }).then(res => {
    return true
  }).catch(err => {
    return false
  })
}
const sendTemplateMsg = async (token, param) => {
  return await rp({
    json: true,
    method: 'POST',
    uri: 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + token,
    body: {
      template_id :param.template_id,
      miniprogram: param.miniprogram,
      touser: param.touser,
      data: param.data
    }
  }).then(res => {
    console.log(res)
    return true
  }).catch(err => {
    console.log(err)
    return false
  })
}
module.exports = {
  sendTemplateMsg:sendTemplateMsg,
  sendSubscribeMsg: sendSubscribeMsg
}