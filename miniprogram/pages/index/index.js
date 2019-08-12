const app = getApp()

Page({
  data: {
    loading: false,
    openid: '',
    game_title: '',
    red_name: '',
    blue_name: ''
  },

  onLoad: async function(){
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

  getUserInfo: async function(){
    this.setData({
      loading: true
    })
    wx.cloud.init()
    await wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        this.setData({
          openid: res.result.openid,
          loading: false
        })
        wx.setStorageSync('openid', res.result.openid);
      }
    })
  },

  createGame: async function(){
    const { loading, game_title, red_name, blue_name, openid } = this.data;

    if(loading)return;
    this.setData({
      loading: true
    })
    // 避免创建没有create_user_id的比赛
    if(openid == ''){
      await this.getUserInfo();
    }
    wx.cloud.init()
    await wx.cloud.callFunction({
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
