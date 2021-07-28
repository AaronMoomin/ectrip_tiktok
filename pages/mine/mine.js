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
    async login(value) {
        let obj = JSON.stringify({
            "anonymous_code": value.anonymousCode,
            "appid": app.globalData.appid,
            "code": value.code,
            "secret": app.globalData.secret
        })
        let Object = base64.encode(obj)
        let data = {
            "data": Object,
            "signed": "11"
        }
        console.log(data);
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
                    console.log('setStorage调用成功');
                },
                fail: err => {
                    console.log(err);
                }
            })
        }).catch(err => {
            console.log(err);
        })
    },
    handleLogin() {
        let {avatarUrl, nickName} = this.data
        tt.login({
                force: true,
                success: (res) => {
                    console.log(res);
                    this.login(res)
                    tt.getUserInfo({
                        withCredentials: true,
                        success: (res) => {
                            avatarUrl = res.userInfo.avatarUrl
                            nickName = res.userInfo.nickName
                            this.setData({
                                avatarUrl,
                                nickName
                            })
                            tt.setStorage({
                                key: "userInfo",
                                data: {
                                    avatarUrl,
                                    nickName
                                },
                                success: (res) => {
                                    // console.log(res);
                                },
                                fail(res) {
                                    console.log(`setStorage调用失败`);
                                },
                            });
                        },
                        fail(res) {
                            console.log(`getUserInfo 调用失败`);
                        },
                    });
                },
                fail: (err) => {
                    console.log(err);
                }
            }
        )
    },
    toMyComment() {
        tt.navigateTo({
            url: "/pages/myComment/myComment"
        })
    },
    toGoodsAddress() {
        tt.navigateTo({
            url: "/pages/goodsAddress/goodsAddress"
        })
    },
    toCollect() {
        tt.navigateTo({
            url: "/pages/collect/collect"
        })
    },
    toAllOrder() {
        tt.navigateTo({
            url: "/pages/allOrder/allOrder"
        })
    },
    toDiscountShow() {
        tt.navigateTo({
            url: "/pages/discountShow/discountShow"
        })
    },
    toVisitor() {
        tt.navigateTo({
            url: "/pages/visitor/visitor"
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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