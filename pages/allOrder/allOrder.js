const request = require('../../utils/request')
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isSelect: [true, false, false, false],
        openid: '',
        orderList: [],
        countDown: '30:00',
    },
    // 倒计时
    countDown(startTime='2021-08-04 13:34:00') {

        let start = new Date(startTime.replace(/-/g, "/")).getTime()
        let end = start + 30 * 60000
        var date = new Date()
        var now = date.getTime()

        var allTime = end - now
        let m, s
        if (allTime > 0) {
            m = Math.floor(allTime / 1000 / 60 % 60)
            s = Math.floor(allTime / 1000 % 60)

            this.setData({
                countDown: `${m} : ${s}`
            })
            setTimeout(() => {
                this.countDown()
            }, 1000)
        } else {
            this.setData({
                countDown: '00 : 00'
            })
        }
    },
    toOrderDetail(e) {
        tt.navigateTo({
            url: "/pages/orderDetail/orderDetail?orderCode="
                + e.currentTarget.dataset.ordercode +
                '&productName=' + e.currentTarget.dataset.productname
        })
    },
    handleSelect(e) {
        let {isSelect} = this.data
        let index = e.currentTarget.dataset.index
        for (let i in isSelect) {
            isSelect[i] = false
            if (index == i) {
                isSelect[i] = !isSelect[i]
                this.getOrderList(index)
            }
        }
        this.setData({
            isSelect
        })
    },
    async getOrderList(status = 0) {
        await request.myRequest(
            '/tiktok/personCenter/order/List',
            {
                openid: this.data.openid,
                status
            },
            'get',
            "application/x-www-form-urlencoded"
        ).then(res => {
            let {orderList} = this.data
            orderList = res.data.data.orderList
            for (let item of orderList) {
                item.createTime = item.createTime.split(' ')[0]
            }
            console.log(res.data.data.orderList);
            this.setData({
                orderList
            })
        }).catch(err => {
            console.log(err);
        })
    },
    toTicketDetail(e) {
        let name = e.currentTarget.dataset.name;
        let id = e.currentTarget.dataset.id;
        tt.navigateTo({
            url: `/pages/ticketDetail/ticketDetail?id=${id}&name=${name}`
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            openid: app.globalData.openid
        })
        this.getOrderList()
        this.countDown()
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