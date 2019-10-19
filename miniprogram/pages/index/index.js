import callFunction from '../../unit/callFunction';

const app = getApp()

wx.cloud.init()

Page({
  data: {
    loading: false,
    game_title: '',
    red_name: '',
    blue_name: '',
    // 1普通模式，2专业模式
    game_type: 2
  },

  onLoad: function(option){
    wx.hideLoading();
    if(option.page){
      switch(option.page){
        case 'score':
          wx.navigateTo({
            url: `/pages/score/index?game_id=${option.game_id}`
          })
          break;
        case 'tournament':
          wx.navigateTo({
            url: `/pages/tournament/index`
          })
          break;
      }
    }
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
          blue_name: blue_name.trim() || '蓝队',
          game_type: game_type || 1
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
  },

  switchType(e) {
    this.setData({
      game_type: e.currentTarget.dataset.type || 1
    })
  }
})
