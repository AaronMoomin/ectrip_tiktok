const request = require('../..//utils/request')
const base64 = require("../../utils/base64.js")
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        avatarUrl: '',
        nickName: '',
    },
    checkLogin() {
        tt.getStorage({
            key: 'userInfo',
            success: res => {
                console.log(res);
                this.setData({
                    nickName: res.data.nickName,
                    avatarUrl: res.data.avatarUrl
                })
            },
            fail: err => {
                console.log(err);
            }
        })
        if (this.data.nickName == "") {
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
            "appid": app.globalData.appid,
            "code": value.code,
            "avatarUrl": this.data.avatarUrl,
            "nickName": this.data.nickName,
            "secret": app.globalData.secret
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
            app.globalData.openid = openid
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
        if(this.data.avatarUrl!=''){
            tt.showToast({
                title:'已登录'
            })
            return
        }
        tt.login({
                force: true,
                success: (res) => {
                    // console.log('登录回调', res);
                    tt.getUserInfo({
                        withCredentials: true,
                        success: (res1) => {
                            this.login(res)
                            this.setData({
                                avatarUrl: res1.userInfo.avatarUrl,
                                nickName: res1.userInfo.nickName
                            })
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
    toFeedbackList(){
        if (this.checkLogin()) {
            tt.navigateTo({
                url: "/pages/feedbackList/feedbackList"
            })
        }
    },
    toMyComment() {
        if (this.checkLogin()) {
            tt.navigateTo({
                url: "/pages/myComment/myComment"
            })
        }
    },
    toGoodsAddress() {
        if (this.checkLogin()) {
            tt.navigateTo({
                url: "/pages/goodsAddress/goodsAddress"
            })
        }
    },
    toCollect() {
        if (this.checkLogin()) {
            tt.navigateTo({
                url: "/pages/collect/collect"
            })
        }
    },
    toAllOrder(e) {
        if (this.checkLogin()) {
            tt.navigateTo({
                url: "/pages/allOrder/allOrder?status="+e.currentTarget.dataset.status
            })
        }
    },
    toDiscountShow() {
        if (this.checkLogin()) {
            tt.navigateTo({
                url: "/pages/discountShow/discountShow"
            })
        }
    },
    toVisitor() {
        if (this.checkLogin()) {
            tt.navigateTo({
                url: "/pages/visitor/visitor"
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let {avatarUrl, nickName} = this.data
        tt.getStorage({
            key: "userInfo",
            success: (res) => {
                avatarUrl = res.data.avatarUrl
                nickName = res.data.nickName
                this.setData({
                    avatarUrl,
                    nickName
                })
            }
        })
        this.checkLogin()
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
    },
});