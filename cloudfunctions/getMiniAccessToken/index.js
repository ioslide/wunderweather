
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'wunderweather-nwepb'
})
const http = require('http.js')


exports.main = async event => {
  const db = cloud.database()
  let accessToken = {}
  try {
    accessToken = (await db.collection('mini-subscribe-accessToken').doc('ACCESS_TOKEN').get()).data
    console.log('[accessToken from db]',accessToken)
    const overtime = new Date((new Date()).valueOf() + 60 * 1000)
    if (accessToken.time > overtime) {
      return accessToken.token
    } else {
      const result = await http.getToken()
      console.log(result)
      if (result.access_token != null) {
        const { access_token, expires_in } = result
        await db.collection('mini-subscribe-accessToken').doc('ACCESS_TOKEN').update({
          time: db.serverDate({
            offset: expires_in * 1000
          }),
          token: access_token
        })
        return access_token
      } else {
        return {
          code: result.errmsg
        }
      }
    }
  } catch (e) {
    const result = await http.getToken()
    console.log('[accessToken from http]',result)
    if (result.access_token != null) {
      const { access_token, expires_in } = result
      console.log('[update accessToken]',result)
      try {
        let resAdd = await db.collection('mini-subscribe-accessToken').doc('ACCESS_TOKEN').update({
              data: {
                time: db.serverDate({
                  offset: expires_in * 1000
                }),
                token: access_token
              },
              success: function(res) {
                console.log(res.access_token)
              }
            })
        return resAdd
      } catch (e) {
        return {
          code: 'db is no found!'
        }
      }
    } else {
      return {
        code: result.errmsg
      }
    }
  }
}
