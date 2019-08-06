<template>
  <div class="game-list">
    <view v-for="item in history" class="game-item">
      <navigator :url="item.url">{{item.game_title}}</navigator>
    </view>
    <view class="no-history" v-if="!loading && history.length === 0">
      暂无历史比赛
    </view>
    <view class="data-describe" v-if="history.length > 0">
      仅显示最近50场比赛
    </view>
    <loading :hidden="!loading" >
      加载中...
    </loading>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      history: []
    }
  },

  methods: {
    getHistory(){
      this.loading = true;
      wx.cloud.init()
      wx.cloud.callFunction({
        name: 'getHistory',
        data: {
          openid: this.user_id
        },
        complete: res => {
          this.loading = false;
          this.history = res.result.data.map(item => {
            item.url = `/pages/score/main?game_id=${item._id}`;
            return item;
          });
        }
      })
    }
  },
  mounted: function(){
    this.loading = false;
    this.user_id = wx.getStorageSync('openid');
    this.getHistory();
  }
}
</script>

<style scoped lang="less">
.game-theme{
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  .bg-img{
    width: 100%;
  }
}
.game-list{
  position: relative;
  padding: 40rpx;
  background: linear-gradient(#0b54a7, #166dd1);
  overflow: hidden;
  min-height: 100vh;
  box-sizing: border-box;
  &:before{
    content: '';
    display: block;
    position: absolute;
    width: 100vw;
    height: 230vh;
    left: 40rpx;
    top: 0;
    z-index: 0;
    background: linear-gradient(#2cc447, #1d9632);
    transform: rotate(33deg);
  }
}
.game-item{
  position: relative;
  width: 100%;
  height: 72rpx;
  line-height: 72rpx;
  color: white;
  border-bottom: 2rpx solid rgba(255,255,255,0.3);
  z-index: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.no-history{
  text-align: center;
  line-height: 60rpx;
  margin-top: 40rpx;
  color: white;
}
.data-describe{
  text-align: center;
  line-height: 72rpx;
  color: rgba(255,255,255,0.7);
  font-size: 26rpx;
  z-index: 2;
  position: relative;

}
</style>
