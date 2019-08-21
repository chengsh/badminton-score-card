import callFunction from '../../unit/callFunction';

const app = getApp()

wx.cloud.init()

Page({
  data: {
    loading: false,
    game_title: '',
    red_name: '',
    blue_name: ''
  },

  onLoad: async function(){
    wx.hideLoading();
    await this.getUserInfo();
  },

  onShareAppMessage(){
    return {
      title: '羽毛球比赛在线记分'
    }
  },

  setGame(e){
    this.setData({
      [e.currentTarget.dataset.field]: e.detail.value
    })
  },

  getUserInfo: async function(){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.init()
    return await wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        wx.hideLoading();
        wx.setStorageSync('openid', res.result.openid);
      }
    })
  },

  createGame: async function(){
    const { game_title, red_name, blue_name } = this.data;

    this.setData({
      loading: true
    })
    
    await callFunction({
      name: 'create',
      data: {
        game: {
          game_title: game_title.trim() || '羽毛球大赛',
          red_name: red_name.trim() || '红队',
          blue_name: blue_name.trim() || '蓝队'
        }
      }
    }).then(res => {
      this.setData({
        game_title: '',
        red_name: '',
        blue_name: '',
        loading: false
      })
      wx.navigateTo({
        url: `/pages/score/index?game_id=${res['_id']}`
      })
    }).catch(err => {
      this.setData({
        loading: false
      })
    })
  },

  navigateToHistory() {
    wx.navigateTo({
      url: '/pages/history/index'
    })
  }
})
