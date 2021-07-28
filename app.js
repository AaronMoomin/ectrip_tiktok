// app.js
const request = require('/utils/request.js');
const base64 = require("/utils/base64.js")
App({
    onLaunch() {

        this.getAccessToken()
    },
    onShow(){
        tt.getStorage({
            key: 'session',
            success:res=>{
                this.globalData.openid = res.data.openid
            },
            fail:err=>{
                console.log(err);
            }
        })
    },

    // 获取服务端接口调用凭证
    async getAccessToken() {
        let obj = JSON.stringify({
            "anonymous_code": "",
            "appid": "tt0b527def946a3fdc01",
            "code": "",
            "secret": "5e2cbaada863c1cc462a7624cad1252eb4f6a88e"
        })
        let object = base64.encode(obj)
        let data = {
            "data": object,
            "signed": "gettoken"
        }
        await request.myRequest(
            '/tiktok/serverAPI/getAccessToken',
            data,
            "post"
        ).then(res => {
            console.log(res);
            let token = res.data.data.access_token
            tt.setStorage({
                key: "token",
                data: {
                    token
                },
                success: (res) => {
                    console.log('setStorage调用成功');
                },
                fail(res) {
                    console.log(`setStorage调用失败`);
                },
            });
        }).catch(err => {
            console.log(err);
        })
    },
    globalData: {
        userInfo: null,
        list: [],
        openid:'',
        appid: "tt0b527def946a3fdc01",
        secret: "5e2cbaada863c1cc462a7624cad1252eb4f6a88e"
    }
});