import callFunction from '../../unit/callFunction';

const app = getApp()

wx.cloud.init()

Page({
  data: {
    loading: false,
    game_title: '',
    red_name: '',
    blue_name: '',
    red_focus: false,
    blue_focus: false,
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
      title: '羽毛球记分工具'
    }
  },

  setGame(e){
    this.setData({
      [e.currentTarget.dataset.field]: e.detail.value
    })
  },

  createGame: async function(){
    const { game_title, red_name, blue_name } = this.data;
    const red_name_length = red_name.trim().length;
    const blue_name_length = blue_name.trim().length;

    if( red_name_length === 0 || blue_name_length === 0 ){
      wx.showToast({
        title: '请输入队伍名称',
        icon: 'none',
        duration: 2000
      })
      const query = wx.createSelectorQuery();
      red_name_length === 0 
        ? this.setData({
            red_focus: true,
            blue_focus: false,
          })
        : this.setData({
          red_focus: false,
          blue_focus: true,
        }); 
      return false;
    }
    this.setData({
      loading: true
    })
    
    await callFunction({
      name: 'create',
      data: {
        game: {
          game_title: game_title.trim(),
          red_name: red_name.trim(),
          blue_name: blue_name.trim()
        }
      }
    }).then(res => {
      this.setData({
        game_title: '',
        red_name: '',
        blue_name: '',
        loading: false,
        red_focus: false,
        blue_focus: false,
      })
      wx.navigateTo({
        url: `/pages/score/index?game_id=${res['_id']}`
      })
    }).catch(err => {
      this.setData({
        loading: false
      })
    })
  }
})
