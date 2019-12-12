// 云函数入口文件
const cloud = require('wx-server-sdk')
const collectionName = 'games';

const paramError = (errMsg = '参数错误') => {
  return Promise.reject(errMsg);
}

cloud.init({
  // env: 'test-7w5bo'
  env: 'game-pcm9t'
});
// 云函数入口函数
exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const db = cloud.database();

  // 查询当前用户创建比赛数量，超出50条则删除最旧的1条数据
  const result = await db.collection(collectionName).where({
    create_user_id: OPENID
  }).count()

  if(result.total >= 50){
    let lastResult = await db.collection(collectionName).where({
        create_user_id: OPENID
      }).orderBy('create_time', 'asc').limit(1).get()
    
    await db.collection(collectionName).where({
      _id: lastResult.data[0]._id
    }).remove()
  }

  return await db.collection(collectionName).add({
    data: {
      create_time: Date.now(),
      game_title: event.game.game_title || '羽毛球PK赛',
      create_user_id: OPENID,
      red: {
        name: event.game.red_name || '红队',
        score: 0
      },
      blue: {
        name: event.game.blue_name || '蓝队',
        score: 0
      },
      current_round: 'A',
      server: '',
      finish: 0,
      round: {
        'A': {
          red: 0,
          blue: 0
        },
        'B': {
          red: 0,
          blue: 0
        },
        'C': {
          red: 0,
          blue: 0
        }
      }
    }
  })
}

