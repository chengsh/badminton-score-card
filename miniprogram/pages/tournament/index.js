import callFunction from '../../unit/callFunction';

const app = getApp()

Page({
  data: {
    type: 'remaining',
    tournament: [],
    year: new Date().getFullYear(),
    cache: {}
  },

  onLoad: function() {
    wx.hideLoading();
    this.getTournament();
  },
  onHide(){
    this.data.cache = {};
  },
  onShareAppMessage(){
    return {
      title: `${this.data.year}年国际羽毛球赛事`
    }
  },
  getTournament(){
    let year = this.data.year;
    let setData = result => {
      this.setData({
        tournament: result || [],
        year
      })
    }
    if(this.data.cache[year]){
      let result = this.data.cache[year];

      setData(result);
      return;
    }
    callFunction({
      name: 'getTournament',
      data: {
        year
      }
    }).then(res => {
      let result = res.data.length > 0 ? res.data : [];
      this.data.cache[year] = result;
      console.log( result );
      setData(result);
    })
  }

})
