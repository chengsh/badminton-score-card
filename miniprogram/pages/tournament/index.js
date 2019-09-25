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
  dateFormat(start, end){
    let startDate = new Date(start);
    let endDate = new Date(end);
    let startFormat = startDate.getMonth() + 1 + '月' + startDate.getDate();
    let endFormat = endDate.getMonth() + 1 + '月' + endDate.getDate();

    return startFormat + '-' + endFormat;
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
      result = result.map(item => {
        item.date = this.dateFormat( item['start-date'],item['end-date'] );
        return item;
      })
      this.data.cache[year] = result;
      setData(result);
    })
  }

})
