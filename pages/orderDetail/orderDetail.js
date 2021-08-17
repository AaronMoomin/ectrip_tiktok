const request = require('../../utils/request')
const status = require('../../utils/status')
Page({
    data: {
        status:'',
        productName:'',
        orderCode:'',
        orderList:'',
        orderInfo:'',
        orderPassenger:'',
        qrCodeDto:'',
        iosDialog2:false,
    },
    open(){
        this.setData({
            iosDialog2:true
        })
    },
    close(){
        this.setData({
            iosDialog2:false
        })
    },
    toRefund(e){
        console.log(e);
        let refundVisitor = []
        for (let item of e.currentTarget.dataset.orderpassenger) {
            if (item.status==4){
                refundVisitor.push(item)
            }
        }
        tt.navigateTo({
            url:`/pages/refund/refund?orderinfo=${JSON.stringify(e.currentTarget.dataset.orderinfo)}&orderlist=${JSON.stringify(e.currentTarget.dataset.orderlist)}&orderpassenger=${JSON.stringify(refundVisitor)}`
        })
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
            // res.data.data.orderInfo.createDate = res.data.data.orderInfo.createDate.split(' ')[0]
            // res.data.data.orderInfo.visitDate = res.data.data.orderInfo.visitDate.split(' ')[0]
            this.setData({
                orderInfo:res.data.data.orderInfo,
                orderList:res.data.data.orderList,
                orderPassenger:res.data.data.orderPassenger,
                qrCodeDto:res.data.data.qrCodeDto
            })
        }).catch(err =>{
            console.log(err);
        })
    },
    onLoad: function (options) {
        this.setData({
            orderCode: options.orderCode,
            productName:options.productName,
            status:status
        })
        this.getOrder();
    },
    onShow:function () {
        this.getOrder();
    },
    onUnload: function () {
        tt.hideLoading()
    },
});