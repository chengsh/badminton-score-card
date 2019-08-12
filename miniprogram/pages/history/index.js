const app = getApp()

Page({
  data: {
  	openid: '',
    loading: false,
    history: [],
    startX: 0,
    deleteBtnWidth: 68
  },

  onLoad: function() {
    this.setData({
      loading: false,
      openid: wx.getStorageSync('openid')
    })
    this.getHistory();
  },

  handleTouchStart(e) {
    let {index} = e.currentTarget.dataset;

    this.setData({
      startX: e.touches[0].pageX
    })
    this.resetSwipe(index);
  },
  resetSwipe(index){
    this.data.history.forEach((item, i) => {
      if(i != index){
        item.moveX = 0;
      }
      return item;
    })
    this.setData({
      history: this.data.history
    })
  },
  handleTouchEnd(e) {
    let {index} = e.currentTarget.dataset;
    let historyItem = this.data.history[index];
    let moveX = e.changedTouches[0].pageX - this.data.startX;
    let deleteBtnWidth = this.data.deleteBtnWidth;
    let greaterThanHalf = Math.abs(moveX) >= deleteBtnWidth/2;

    if(moveX < 0){
      historyItem.moveX = greaterThanHalf ? -deleteBtnWidth : 0;
    }else if(Math.abs(historyItem.moveX) === deleteBtnWidth){
      historyItem.moveX = greaterThanHalf ? 0 : -deleteBtnWidth;
    }
    this.setData({
      history: this.data.history
    })
  },

  getHistory(){
    this.setData({
      loading: true
    })
    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'curd',
      data: {
        action: 'retriveAll',
        openid: this.data.openid
      },
      complete: res => {
        this.setData({
          loading: false,
          history: res.result.data.map((item, index) => {
            item.url = `/pages/score/index?game_id=${item._id}`;
            item.moveX = 0;
            return item;
          })
        })
      }
    })
  },
  removeGame(e){
    let {index} = e.currentTarget.dataset;

    this.data.history[index].moveX = 0;
    this.setData({
      loading: true,
      history: this.data.history
    })

    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'curd',
      data: {
        action: 'delete',
        game_id: this.data.history[index]._id
      },
      complete: res => {
        this.data.history.splice(index, 1);
        this.setData({
          loading: false,
          history: this.data.history
        })
      }
    })
  }

})
