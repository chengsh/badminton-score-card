// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database({
    env: 'game-pcm9t'
  })
  // 查询当前用户创建比赛数量，超出50条则删除最旧的1条数据
  const result = await db.collection('games').where({
    create_user_id: event.openid
  }).count()

  if(result.total >= 50){
    let lastResult = await db.collection('games').where({
        create_user_id: event.openid
      }).orderBy('create_time', 'asc').limit(1).get()
    
    await db.collection('games').where({
      _id: lastResult.data[0]._id
    }).remove()
  }
  return await db.collection('games').add({
    data: {
      create_time: Date.now(),
      game_title: event.game_title,
      create_user_id: event.openid,
      red: {
        name: event.red_name,
        score: 0
      },
      blue: {
        name: event.blue_name,
        score: 0
      }
    }
  })
}