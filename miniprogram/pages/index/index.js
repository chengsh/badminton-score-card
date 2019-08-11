//index.js
const app = getApp()

Page({
  data: {
    loading: false,
    user_id: '',
    game_title: '',
    red_name: '',
    blue_name: ''
  },

  onLoad: function() {
    this.setData({
      loading: false
    })
    this.getUserInfo();
  },

  setGame(e){
    this.setData({
      [e.currentTarget.dataset.field]: e.detail.value
    })
  },

  getUserInfo() {
    wx.cloud.init()
    return wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        this.setData({
          openid: res.result.openid
        })
        wx.setStorageSync('openid', res.result.openid);
      }
    })
  },

  createGame() {
    const { loading, game_title, red_name, blue_name, openid } = this.data;

    if(loading)return;
    this.setData({
      loading: true
    })
    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'curd',
      data: {
        action: 'create',
        game: {
          openid: openid,
          game_title: game_title.trim() || '羽毛球大赛',
          red_name: red_name.trim() || '红队',
          blue_name: blue_name.trim() || '蓝队'
        }
      }
    }).then(res => {
      this.setData({
        loading: false,
        game_title: '',
        red_name: '',
        blue_name: ''
      })
      
      wx.navigateTo({
        url: `/pages/score/index?game_id=${res.result['_id']}`
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
