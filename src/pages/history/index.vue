<template>
  <div class="game-list">
    <view class="game-theme">
      <img class="bg-img" src="/static/images/index-bg.png" mode="widthFix" ></img>
    </view>
    <view v-for="item in history" class="game-item">
      <navigator :url="item.url">{{item.game_title}}</navigator>
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
            item.url = `../control/main?game_id=${item._id}`;
            return item;
          });
        }
      })
    }
  },
  mounted: function(){
    this.user_id = this.$mp.query.user_id;
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
  margin: 20px;
}
.game-item{
  height: 36px;
  line-height: 36px;
  border-bottom: 1px solid #ccc;
}
</style>
