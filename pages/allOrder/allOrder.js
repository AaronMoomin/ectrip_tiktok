const request = require('../../utils/request')
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isSelect: [true, false, false, false],
        openid: '',
    },
    handleSelect(e) {
        let {isSelect} = this.data
        let index = e.currentTarget.dataset.index
        for (let i in isSelect) {
            isSelect[i] = false
            if (index == i) {
                isSelect[i] = !isSelect[i]
            }
        }
        this.setData({
            isSelect
        })
        console.log(isSelect);
    },
    async getOrderList() {
        await request.myRequest(
            '/tiktok/personCenter/order/List',
            {
                openId: this.data.openid,
                status: 4
            },
            'get',
            "application/x-www-form-urlencoded"
        ).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // tt.getStorage({
        //     key:'session',
        //     success:res=>{
        //         let {openid} = this.data
        //         openid = res.data.openid
        //         this.setData({
        //             openid
        //         })
        //         this.getOrderList()
        //     },
        //     fail:err=>{
        //         console.log(err);
        //     }
        // })
        this.setData({
            openid:app.globalData.openid
        })
        this.getOrderList()
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
    }
});