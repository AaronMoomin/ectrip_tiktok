// app.js
const request = require('/utils/request.js');
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = tt.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    tt.setStorageSync('logs', logs); // 登录

    tt.login({
      success: res => {// 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });

    this.getAccessToken(
        "tt0b527def946a3fdc01",
        "5e2cbaada863c1cc462a7624cad1252eb4f6a88e"
    )
  },

  // 获取服务端接口调用凭证
  async getAccessToken(appid,secret){
    await request.myRequest(
        '/tiktok/serverAPI/getAccessToken',
        {
          appid,
          secret
        },
        "post"
        ).then(res => {
      let token = res.data.data.access_token
      tt.setStorage({
        key: "token",
        data: {
          token
        },
        success:(res) =>{
          console.log('setStorage调用成功');
        },
        fail(res) {
          console.log(`setStorage调用失败`);
        },
      });
    }).catch(err=>{
      console.log(err);
    })
  },
  globalData: {
    userInfo: null,
    list:[],
  }
});