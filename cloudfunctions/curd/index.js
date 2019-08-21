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

  switch (event.action) {
    case 'create': {
      return createGame(event, OPENID)
    }
    case 'delete': {
      return removeGame(event)
    }
    case 'update': {
      return updateGame(event, OPENID)
    }
    case 'retriveAll': {
      return retriveGameByOpenid(event, OPENID)
    }
    case 'retriveById': {
      return retriveGameById(event)
    }
    default: {
      return paramError()
    }
  }
}

// 新增比赛
async function createGame(event, OPENID){
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
      game_title: event.game.game_title,
      create_user_id: OPENID,
      red: {
        name: event.game.red_name,
        score: 0
      },
      blue: {
        name: event.game.blue_name,
        score: 0
      }
    }
  })
}

// 删除
async function removeGame(event){
  const db = cloud.database();
  if(!event.game_id){
    return paramError();
  }
  return await db.collection(collectionName).doc(event.game_id).remove();
}

// 更新
async function updateGame(event, OPENID){
  const db = cloud.database();

  if(!event.game._id){
    return paramError();
  }
  if(OPENID !== event.game.create_user_id){
    return paramError('无权限');  
  }
  return await db.collection(collectionName).doc(event.game._id).update({
    data: {
      red: event.game.red,
      blue: event.game.blue
    }
  });
}

// 查找我创建的比赛
async function retriveGameByOpenid(event, OPENID){
  const db = cloud.database();

  return await db.collection(collectionName).where({
    create_user_id: OPENID
  }).orderBy('create_time', 'desc').limit(50).get();
}

// 通过ID查找比赛
function retriveGameById(event){
  const db = cloud.database();
  if(!event.game_id){
    return paramError();
  }
  return new Promise(async (resolve, reject) => {
    await db.collection(collectionName).doc(event.game_id).get()
      .then(res => resolve(res))
      .catch(err => {
        resolve({
          errMsg: '比赛不存在或已删除'
        });
      })
  })
  
}