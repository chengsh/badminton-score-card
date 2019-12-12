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

  if(!event.game._id){
    return paramError();
  }
  if(OPENID !== event.game.create_user_id){
    return paramError('无权限');  
  }
  if(!event.finish && event.game.finish){
    return paramError('比赛结束');
  }
  
  return await db.collection(collectionName).doc(event.game._id).update({
    data: {
      red: event.game.red,
      blue: event.game.blue,
      current_round: event.game.current_round,
      round: event.game.round,
      server: event.game.server,
      finish: event.game.finish
    }
  });
}
