const request = require('../../utils/request')
Page({
    data: {
        productName:'',
        orderCode:'',
        orderList:'',
        orderInfo:'',
        orderPassenger:'',
    },
    async getOrder() {
        tt.showLoading({
            title:'加载中...'
        })
        let {orderCode} = this.data
        await request.myRequest(
            '/tiktok/personCenter/order/Detail',
            {
                orderCode
            },
            'get',
            'application/x-www-form-urlencoded'
        ).then(res=>{
            tt.hideLoading()
            console.log(res);
            res.data.data.orderInfo.createDate = res.data.data.orderInfo.createDate.split(' ')[0]
            res.data.data.orderInfo.visitDate = res.data.data.orderInfo.visitDate.split(' ')[0]
            this.setData({
                orderInfo:res.data.data.orderInfo,
                orderList:res.data.data.orderList,
                orderPassenger:res.data.data.orderPassenger,
            })
        }).catch(err =>{
            console.log(err);
        })
    },
    onLoad: function (options) {
        this.setData({
            orderCode: options.orderCode,
            productName:options.productName
        })
        this.getOrder();
    },
    onUnload: function () {
        tt.hideLoading()
    },
});