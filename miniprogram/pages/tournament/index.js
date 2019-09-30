import callFunction from '../../unit/callFunction';

const app = getApp()

Page({
  data: {
    type: 'remaining',
    tournament: [],
    // 全部
    all: [],
    // 剩余
    remaining: [],
    // 已结束
    completed: [],
    year: new Date().getFullYear(),
    cache: {},
    years: [2019, 2020]
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
    let startFormat = startDate.getMonth() + 1 + '月' + startDate.getDate() + '日';
    let endFormat = endDate.getMonth() + 1 + '月' + endDate.getDate() + '日';

    return startFormat + '-' + endFormat;
  },
  switchTournament(e){
    let type = e.currentTarget.dataset.type;

    this.setData({
      tournament: this.data[type],
      type
    })
  },
  switchYear(e){
    let year = e.currentTarget.dataset.year;
    this.setData({
      year
    }, () => {
      this.getTournament();
    })
  },
  getTournament(){
    let now = new Date().getTime();
    let year = this.data.year;

    if(this.data.cache[year]){
      let cache = this.data.cache[year];
      let type = this.data.type;
      
      this.setData({  
        all: cache.all,
        tournament: cache[ type ],
        completed: cache.completed,
        remaining: cache.remaining
      });
      return;
    }
    callFunction({
      name: 'getTournament',
      data: {
        year
      }
    }).then(res => {
      let result = res.data.length > 0 ? res.data : [];
      let completed = [];
      let remaining = [];

      result.sort((a, b) => {
        let aStart = new Date(`${a.year}-${a['start-date']}`).getTime();
        let bStart = new Date(`${b.year}-${b['start-date']}`).getTime();

        return aStart < bStart ? -1 : 1;
      })
      result = result.map(item => {
        item.date = this.dateFormat( item['start-date'],item['end-date'] );
        if(new Date(`${item.year}-${item['end-date']}`).getTime() < now){
          completed.push(item);
        }else{
          remaining.push(item);
        }
        return item;
      })
      this.data.cache[year] = {
        all: result,
        completed,
        remaining
      };
      this.setData({
        all: result,
        tournament: remaining,
        completed,
        remaining
      })
    })
  }

})
