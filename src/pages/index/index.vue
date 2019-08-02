<template>
  <div>
    <view class="section">
      <input type="text" v-model="game_title" placeholder="比赛名称" auto-focus>
    </view>
    <view class="section">
      <input type="text" v-model="red_name" placeholder="红队名称">
    </view>
    <view class="section">
      <input type="text" v-model="blue_name" placeholder="蓝队名称">
    </view>
    
    <button type="primary" @click="createGame">提交</button>    
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
      openid: '',
      game_title: '1',
      red_name: '2',
      blue_name: '3'
    }
  },

  components: {
  },

  methods: {
    getUserInfo() {
      wx.cloud.init()
      return wx.cloud.callFunction({
        name: 'login',
        complete: res => {
          console.log( res.result.openid );
          this.openid = res.result.openid;
        }
      })
    },
    createGame() {
      this.loading = true;
      wx.cloud.init()
      wx.cloud.callFunction({
        name: 'newGame',
        data: {
          openid: this.openid,
          game_title: this.game_title,
          red_name: this.red_name,
          blue_name: this.blue_name
        },
        complete: res => {
          this.loading = false;
          console.log(res);
          mpvue.navigateTo({
            url: '../control/main'
          })
        }
      })
    }
  },

  created () {
    this.getUserInfo()
  }
}
</script>

<style scoped>

</style>
