const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
  console.log(event.action)
  switch (event.action) {
    case 'uploadSponsorshipMsg': {
      return uploadSponsorshipMsg(event)
    }
    case 'getSponsorshipMsg': {
      return getSponsorshipMsg(event)
    }
    default: {
      return getSponsorshipMsg(event)
    }
  }
}
  async function uploadSponsorshipMsg(event) {
    const db = cloud.database();
    const {OPENID} = cloud.getWXContext();
    const result = await db.collection('sponsorshipMsg').add({
      data: {
        ...event,
        touser: OPENID
      },
    });
    return result;
  }
  async function getSponsorshipMsg(event) {
    const db = cloud.database();
    let result = await db.collection("sponsorshipMsg").get();
    console.log(result)
    return result;
  }