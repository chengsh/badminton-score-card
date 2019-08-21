//app.js
App({
  onLaunch: function () {
    const releaseEnv = 'game-pcm9t';
    const developEnv = 'test-7w5bo';
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env: developEnv,
        env: releaseEnv,
        traceUser: true
      })
    }

    this.globalData = {}
  }
})
