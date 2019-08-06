// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database({
    env: 'game-pcm9t'
  })
  return await db.collection('games').doc(event._id).update({
  	data: {
  		red: event.red,
  		blue: event.blue
  	}
  });
}