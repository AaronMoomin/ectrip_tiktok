// app.js
const request = require('/utils/request.js');
const base64 = require("/utils/base64.js")
App({
    onLaunch() {
        this.getAccessToken()
    },
    onShow() {
        tt.getStorage({
            key: 'session',
            success: res => {
                this.globalData.openid = res.data.openid
            },
            fail: err => {
                console.log(err);
            }
        })
    },
    checkLogin() {
        tt.getStorage({
            key: 'userInfo',
            success: res => {
                console.log(res);
                this.globalData.nickName = res.data.nickName
                this.globalData.avatarUrl = res.data.avatarUrl
            },
            fail: err => {
                console.log(err);
            }
        })
        if (this.globalData.nickName == "") {
            console.log("未登录");
            this.handleLogin()
            return false
        } else {
            console.log("已登录");
            return true
        }
    },
    async login(value) {
        let obj = JSON.stringify({
            "anonymous_code": value.anonymousCode,
            "appid": this.globalData.appid,
            "code": value.code,
            "avatarUrl": this.globalData.avatarUrl,
            "nickName": this.globalData.nickName,
            "secret": this.globalData.secret
        })
        let Object = base64.encode(obj)
        let data = {
            "data": Object,
            "signed": "login"
        }
        await request.myRequest(
            '/tiktok/serverAPI/login',
            data,
            "post"
        ).then(res => {
            console.log(res);
            let {openid, session_key, unionid} = res.data.data
            this.globalData.openid = openid
            tt.setStorage({
                key: 'session',
                data: {
                    openid,
                    session_key,
                    unionid
                },
                success: res => {
                    // console.log('openid调用成功');
                },
                fail: err => {
                    // console.log('openid调用失败');
                }
            })
        }).catch(err => {
            console.log(err);
        })
    },
    handleLogin() {
        tt.login({
                force: true,
                success: (res) => {
                    console.log('登录回调', res);
                    tt.getUserInfo({
                        withCredentials: true,
                        success: (res1) => {
                            this.login(res)
                            this.globalData.avatarUrl = res1.userInfo.avatarUrl
                            this.globalData.nickName = res1.userInfo.nickName
                            tt.setStorage({
                                key: "userInfo",
                                data: {
                                    avatarUrl: res1.userInfo.avatarUrl,
                                    nickName: res1.userInfo.nickName
                                },
                                success: (res) => {
                                    console.log(`userInfo写入成功`);
                                },
                                fail(res) {
                                    // console.log(`userInfo调用失败`);
                                },
                            });
                        },
                        fail(res) {
                            console.log(`getUserInfo失败`);
                        },
                    });
                },
                fail: (err) => {
                    console.log('取消', err);
                }
            }
        )
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
                    // console.log('setStorage调用成功');
                },
                fail(res) {
                    // console.log(`setStorage调用失败`);
                },
            });
        }).catch(err => {
            console.log(err);
        })
    },
    globalData: {
        userInfo: null,
        avatarUrl: '',
        nickName: '',
        list: [],
        openid: '',
        appid: "tt0b527def946a3fdc01",
        secret: "5e2cbaada863c1cc462a7624cad1252eb4f6a88e"
    }
});