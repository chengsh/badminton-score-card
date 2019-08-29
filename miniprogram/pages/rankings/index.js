import callFunction from '../../unit/callFunction';

const app = getApp()

Page({
  data: {
    rankings: []
  },

  onLoad: function() {
    wx.hideLoading();
    this.getRankings();
  },

  getRankings(){
    callFunction({
      name: 'getRankings'
    }).then(res => {
      if(res.data.length > 0){
        this.setData({
          rankings: res.data[0].sportsman
        })
      }
    })
  }

})
