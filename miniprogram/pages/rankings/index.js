import callFunction from '../../unit/callFunction';
import MS from './sportsman-ms';

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
      this.setData({
        rankings: res.data.map(item => {
          item.cnName = MS[item.name] ? MS[item.name].name : item.name;
          return item;
        })
      })
    })
  }

})
