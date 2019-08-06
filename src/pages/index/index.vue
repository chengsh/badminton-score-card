<template>
  <div class="game-form">
    <view class="game-theme">
      <img class="bg-img" src="/static/images/index-bg.png" mode="widthFix" ></img>
    </view>
    <view class="create-area">
      <view class="section">
        <input type="text" class="game-attr" v-model="game_title" maxlength="30" placeholder="比赛名称" auto-focus>
      </view>
      <view class="section">
        <input type="text" class="game-attr" v-model="red_name" maxlength="30" placeholder="红队名称">
      </view>
      <view class="section">
        <input type="text" class="game-attr" v-model="blue_name" maxlength="30" placeholder="蓝队名称">
      </view>
      
      <button class="handle-btn" type="primary" @click="createGame">创建比赛</button>
      <button class="handle-btn" @click="navigateToHistory">历史比赛</button> 
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
      user_id: '',
      game_title: '',
      red_name: '',
      blue_name: ''
    }
  },
  methods: {
    getUserInfo() {
      wx.cloud.init()
      return wx.cloud.callFunction({
        name: 'login',
        complete: res => {
          this.openid = res.result.openid;
          wx.setStorageSync('openid', res.result.openid);
        }
      })
    },
    createGame() {
      if(this.loading)return;
      this.loading = true;
      wx.cloud.init()
      wx.cloud.callFunction({
        name: 'newGame',
        data: {
          openid: this.openid,
          game_title: this.game_title.trim() || '羽毛球大赛',
          red_name: this.red_name.trim() || '红队',
          blue_name: this.blue_name.trim() || '蓝队'
        }
      }).then(res => {
        this.loading = false;
        this.game_title = '';
        this.red_name = '';
        this.blue_name = '';
        mpvue.navigateTo({
          url: `/pages/score/main?game_id=${res.result['_id']}`
        })
      }).catch(err => {
        this.loading = false;
      })
    },
    navigateToHistory() {
      mpvue.navigateTo({
        url: '/pages/history/main'
      })
    }
  },
  mounted () {
    this.loading = false;
  },
  created () {
    this.getUserInfo()
  }
}
</script>

<style lang="less" scoped>
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
.create-area{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 40rpx;
  z-index: 2;
  .game-attr,.handle-btn{
    box-shadow: 0 5px 5px rgba(0,0,0,0.2);
  }
}
.game-form{
  width: 100vw;
  height: 100vh;
  padding: 40rpx;
  box-sizing: border-box;
  position: relative;
  background: linear-gradient(#0b54a7, #166dd1);
  overflow: hidden;
  &:before{
    content: '';
    display: block;
    position: absolute;
    width: 100vw;
    height: 200vh;
    left: 40rpx;
    top: 0;
    background: linear-gradient(#2cc447, #1d9632);
    transform: rotate(33deg);
  }
}
.game-attr{
  background-color: white;
  height: 72rpx;
  padding: 0 20rpx;
  line-height: 72rpx;
  margin: 40rpx 0;
}
.handle-btn{
  margin: 40rpx 0;
}
</style>
