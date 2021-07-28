const request = require('../../utils/request')
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isSelect: [true, false, false],
        openid:'',
        allList:[],
        categoryIdList:[1,2,3],
    },
    handleSelect(e) {
        let {isSelect,categoryIdList} = this.data
        let index = e.currentTarget.dataset.index
        for (let i in isSelect) {
            isSelect[i] = false
            if (index == i) {
                isSelect[i] = !isSelect[i]
                this.getCollectList(categoryIdList[i])
            }
        }
        this.setData({
            isSelect
        })
    },
    async getCollectList(categoryId=1) {
        await request.myRequest(
            '/tiktok/personCenter/collection/list',
            {
                categoryId,
                openId:this.data.openid
            },
            'get',
            'application/x-www-form-urlencoded'
        ).then(res => {
            console.log(res);
            if (res.data.message=='无收藏'){
                this.setData({
                    allList:[]
                })
            }else {
                this.setData({
                    allList:res.data.data.goodsList
                })
            }
        }).catch(err =>{
            console.log(err);
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            openid:app.globalData.openid,
        })
        this.getCollectList()
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