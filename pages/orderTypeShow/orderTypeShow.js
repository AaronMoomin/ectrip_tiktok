// pages/ticket/orderTypeShow.js
const base64 = require("../../utils/base64.js");
const request = require("../../utils/request");
Page({
    /**
     * 页面的初始数据
     */
    data: {
        goodsList: [],
        themeId: 0,
        size:5,
    },
    toTicketDetail(e) {
        let name = e.currentTarget.dataset.name;
        let id = e.currentTarget.dataset.id;
        tt.navigateTo({
            url: `/pages/ticketDetail/ticketDetail?id=${id}&name=${name}`
        });
    },
// 商品列表查询
    async getGoods(size, themeId=this.data.themeId) {
        tt.showLoading({title: '加载中...'})
        let obj = JSON.stringify({
            "categoryId": 1,
            "city": "",
            "content": "",
            "endDate": "",
            "orderBy": 0,
            "startDate": "",
            "current": 0,
            "size": size,
            "themeId": themeId
        })
        let object = base64.encode(obj)
        await request.myRequest(
            '/tiktok/mutual/goods',
            {
                data: object,
                signed: '111'
            },
            'post',
        ).then(res => {
            tt.hideLoading()
            let {goodsList} = this.data
            goodsList = []
            for (let resItem of res.data.data) {
                resItem.imageList = JSON.parse(resItem.imageList)
                goodsList.push(resItem)
            }
            // console.log(goodsList);
            this.setData({
                goodsList
            })
        }).catch(err => {
            tt.hideLoading()
            console.log(err);
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        tt.setNavigationBarTitle({title: options.name})
        this.setData({
            themeId: options.themeId,
        })
        this.getGoods(5, this.data.themeId)
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
        console.log('别啦了');
        let {size,themeId} = this.data
        size+=1
        this.setData({
            size
        })
        tt.showLoading({title:'加载更多'})
        this.getGoods(size)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
    }
});