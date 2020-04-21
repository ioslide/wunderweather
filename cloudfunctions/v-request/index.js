// 云函数入口文件
const cloud = require('wx-server-sdk');
const fetchit = require('node-fetch');

cloud.init({
  env: 'wunderweather-nwepb'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return new Promise((RES, REJ) => {
    url = event.options.url
    options = event.options
    const res = {}
    fetchit(url, event.options).then((response) => {
      res.statusCode = response.status
      res.header = response.headers
      if (options.dataType === 'json') {
        return response.json()
      }
      if (options.responseType === 'arraybuffer') {
        return response.arrayBuffer()
      }
      if (options.responseType === 'text') {
        return response.text()
      }
      if (typeof options.dataType === 'undefined') {
        return response.json()
      }
      return Promise.resolve(null)
    }).then(data => {
      res.data = data
      RES(res)
    })
  });
}