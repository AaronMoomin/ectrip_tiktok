const request = require('../../utils/request')
const utils = require('../../utils/util')
const status = require('../../utils/status')
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        status:'',
        isSelect: [true, false, false, false],
        openid: '',
        orderList: [],
        countDown: '00:00',
    },
    toTicketChanging(e){
        tt.navigateTo({
            url: "/pages/ticketChanging/ticketChanging?ordercode="
                + e.currentTarget.dataset.ordercode +
                '&productName=' + e.currentTarget.dataset.productname+
                '&createTime='+e.currentTarget.dataset.createtime
        })
    },
    // 倒计时
    countDown(startTime, orderCode) {
        let {orderList} = this.data
        let start = new Date(startTime.replace(/-/g, "/")).getTime()
        let date = new Date()
        let endTime = utils.GetDate(date).replace(/-/g, "/")
        let end = new Date(endTime).getTime()
        let allTime = 30 * 60000-(end-start)
        let m, s
        if (allTime > 0) {
            m = Math.floor(allTime / 1000 / 60 % 60)
            s = Math.floor(allTime / 1000 % 60)
            setTimeout(() => {
                this.countDown(startTime, orderCode)
            }, 1000)
            orderList.find(item => {
                if (item.orderCode === orderCode) { //?需要定时器
                    item.countDown = `${m} : ${s}`
                }
            })
        } else {
            orderList.find(item => {
                if (item.orderCode === orderCode) {
                    clearTimeout()
                    item.countDown = `00:00`
                }
            })
        }
        this.setData({
            orderList
        })
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
        this.setData({
            orderList: []
        })
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
    toReserve(e){
        tt.pay({
            orderInfo: JSON.parse(e.currentTarget.dataset.orderinfo),
            service: 5,
            getOrderStatus: function () {
                return new Promise(function (resolve, reject) {
                    //? 商户前端根据 out_order_no 请求商户后端查询微信支付订单状态
                    tt.request({
                        url: "/tiktok/mutual/queryOrder",
                        method: 'get',
                        header: {
                            "content-type": "application/x-www-form-urlencoded"
                        },
                        data: {
                            orderCode:e.currentTarget.dataset.ordercode   // 必传参数 订单号
                        },
                        success: function (res) {
                            console.log(res);
                            // 商户后端查询的微信支付状态，通知收银台支付结果
                            if (res.data.trade_state == "SUCCESS") {
                                // 查询微信订单返回一个 trade_state 的属性值 当它返回为 SUCCESS 时，就为成功，Promise 中 resolve中返回 code:0 方便下面拿到。
                                resolve({code: 0})
                            }
                        },
                        fail(err) {
                            reject(err);
                        }
                    });
                });
            },
            success: res => {
                if (res.code == 0) {
                    //?支付成功
                    console.log('支付成功', res);
                    //?跳转订单页面
                    this.setData({
                        orderList:[]
                    })
                    this.getOrderList()
                } else if (res.code == 1) {
                    tt.showToast({
                        title: '支付超时',
                        icon: 'fail'
                    })
                    console.log('支付超时', res);
                } else if (res.code == 2) {
                    tt.showToast({
                        title: '支付失败',
                        icon: 'fail'
                    })
                    console.log('支付失败', res);
                } else if (res.code == 3) {
                    tt.showToast({
                        title: '支付关闭',
                        icon: 'fail'
                    })
                    console.log('支付关闭', res);
                } else if (res.code == 4) {
                    tt.showToast({
                        title: '支付取消',
                        icon: 'fail'
                    })
                    console.log('支付取消', res);
                }
            },
            fail: err => {
                //?支付失败
                console.log('支付失败', err);
            }
        })
    },
    async getOrderList(status = 0) {
        let {orderList} = this.data
        tt.showLoading({
            title:'加载中...'
        })
        await request.myRequest(
            '/tiktok/personCenter/order/List',
            {
                openid: this.data.openid,
                status
            },
            'get',
            "application/x-www-form-urlencoded"
        ).then(res => {
            tt.hideLoading()
            //隐藏导航条加载动画
            tt.hideNavigationBarLoading();
            //停止下拉刷新
            tt.stopPullDownRefresh();
            let {orderList,status} = this.data

            orderList = res.data.data.orderList
            console.log(orderList);
            for (let item of orderList) {
                item.createTime = item.createTime.split('.')[0]
                if (status[item.status] == "未付款") {
                    item.createTime = item.createTime.split('.')[0]
                    let start = new Date(item.createTime.replace(/-/g, "/")).getTime()
                    let day = new Date(item.createTime.replace(/-/g, "/")).getDate()
                    let year = new Date(item.createTime.replace(/-/g, "/")).getFullYear()
                    let date = new Date()
                    let now = date.getTime()
                    let nowDay = date.getDate()
                    let nowYear = date.getFullYear()
                    let betweenTime = now - start
                    //判断日期是否相同
                    if (year == nowYear && day == nowDay && betweenTime <= 30 * 60000) { //小于30分钟
                        this.countDown(item.createTime, item.orderCode)
                    }
                }
            }
            this.setData({
                orderList
            })
        }).catch(err => {
            tt.hideLoading()
            //隐藏导航条加载动画
            tt.hideNavigationBarLoading();
            //停止下拉刷新
            tt.stopPullDownRefresh();
            console.log(err);
        })
    },
    toDetail(e) {
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
            openid: app.globalData.openid,
            status:status
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
        this.setData({
            orderList:[]
        })
        let s = this.data.isSelect
        for (let i in s) {
            if (s[i]){
                this.getOrderList(i)
            }
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        tt.hideLoading()
        //隐藏导航条加载动画
        tt.hideNavigationBarLoading();
        //停止下拉刷新
        tt.stopPullDownRefresh();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
    },
    onRefresh(){
        console.log('reload');
        //在当前页面显示导航条加载动画
        tt.showNavigationBarLoading();
        this.setData({
            orderList:[]
        })
        let s = this.data.isSelect
        for (let i in s) {
            if (s[i]){
                this.getOrderList(i)
            }
        }
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.onRefresh();
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