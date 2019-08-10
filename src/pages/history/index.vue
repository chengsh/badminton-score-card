<template>
  <div class="game-list" @click="resetSwipe">
    <view :wx:for="history" wx:for-index="index" wx:for-item="item" :wx:key="_id" class="game-item">
      <div class="movable-area">
        <div 
          class="movable-view"
          :style="{transform: 'translateX('+ (item ? item.moveX : 0) +'px)'}" 
          :data-index="index"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd">
          <navigator class="game-item-navigator" :url="item ? item.url : ''">{{item && item.game_title}}</navigator>
          <span class="delete-game-item" @click="removeGame" :data-index="index">删除</span>
        </div>
      </div>
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
      history: [],
      startX: 0,
      deleteBtnWidth: 68,
      direction: 'left'
    }
  },

  methods: {
    handleTouchStart(e) {
      let {index} = e.currentTarget.dataset;

      this.startX = e.pageX;
      this.currentMoveX = this.history[index].moveX;
      this.resetSwipe(index);
    },
    resetSwipe(index){
      this.history.forEach((item, i) => {
        if(i != index){
          item.moveX = 0;
        }
        return item;
      })
    },
    handleTouchMove(e) {
      let {index} = e.currentTarget.dataset;
      let moveX = e.pageX - this.startX;
      this.direction = moveX < 0 ? 'left' : 'right';

      if(this.direction === 'right' && this.history[index].moveX >= 0 || 
         this.direction === 'left' && Math.abs(this.history[index].moveX) === this.deleteBtnWidth)return false;
      if(Math.abs(moveX) <= this.deleteBtnWidth){
        this.history[index].moveX = this.direction === 'left' ? moveX : this.currentMoveX + moveX;
      }
    },
    handleTouchEnd(e) {
      let {index} = e.currentTarget.dataset;
      let historyItem = this.history[index];
      let greaterThanHalf = Math.abs(historyItem.moveX) >= this.deleteBtnWidth/2;

      historyItem.moveX = greaterThanHalf ? -this.deleteBtnWidth : 0;
    },

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
          this.history = res.result.data.map((item, index) => {
            item.url = `/pages/score/main?game_id=${item._id}`;
            item.moveX = 0;
            return item;
          });
        }
      })
    },
    removeGame(e){
      let {index} = e.currentTarget.dataset;

      this.loading = true;
      this.history[index].moveX = 0;
      wx.cloud.init()
      wx.cloud.callFunction({
        name: 'removeGameById',
        data: {
          id: this.history[index]._id
        },
        complete: res => {
          this.loading = false;
          this.history.splice(index, 1);
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
  width: 100vw;
  padding: 40rpx 0;
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
  width: 100vw;
  height: 100rpx;
  box-sizing: border-box;
  line-height: 100rpx;
  color: white;
  z-index: 1;
  &:first-child{
    border-top: 2rpx dashed rgba(255,255,255,0.3);
  }
  .game-item-navigator{
    width: 100vw;
    height: 100rpx;
    padding: 0 40rpx;
    box-sizing: border-box;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
    font-size: 28rpx;
  }
  .delete-game-item{
    z-index: 1;
    background-color: orange;
    width: 68px;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    font-size: 26rpx;
    color: white;
  }
  .movable-area{
    width: calc(100vw);
    height: 100rpx;
    z-index: 3;
    position: relative;
    overflow: hidden;
  }
  .movable-view{
    width: calc(100vw + 68px);
    height: 100rpx;
    z-index: 2;
    font-size: 0;
    transition: all 0.6s cubic-bezier(0.18, 0.89, 0.32, 1) 0s;
    border-bottom: 2rpx dashed rgba(255,255,255,0.3);
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0;
  }
  .delete-game-item,.game-item-navigator{
    display: inline-block;
    vertical-align: middle;
  }
}
.no-history{
  text-align: center;
  line-height: 60rpx;
  margin-top: 40rpx;
  color: white;
}
.data-describe{
  text-align: center;
  line-height: 100rpx;
  color: rgba(255,255,255,0.7);
  font-size: 26rpx;
  z-index: 2;
  position: relative;
}
</style>
