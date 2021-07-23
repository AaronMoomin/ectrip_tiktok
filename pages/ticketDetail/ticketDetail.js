const request = require("../../utils/request")
const util = require("../../utils/util")
const base64 = require("../../utils/base64.js")
Page({
    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        //商品名称
        name:'',
        goods:{},
        productList:[],
        contentHeight: '550rpx',
        //介绍的高度
        displayed: 'block',
        //显示
        dialog1: false,
    },
    async getGoodsDetail() {
        let {id} = this.data
        let today = util.GetDateStr(0)
        let obj = JSON.stringify({
            "endDate": "",
            id,
            "startDate": today
        })
        let object = base64.encode(obj)
        await request.myRequest(
            '/tiktok/mutual/detail',
            {
                data:object ,
                signed: "111"
            },
            'post'
        ).then(res=>{
            console.log(res);
            let {goods,productList} = this.data
            res.data.data.goods.openStartTime =
            res.data.data.goods.openStartTime.split(" ")[1]
            res.data.data.goods.openEndTime =
                res.data.data.goods.openEndTime.split(" ")[1]
            res.data.data.goods.infoAddress
                = JSON.parse(res.data.data.goods.infoAddress)
            for (let p of res.data.data.productList) {
                p.attributeIds = JSON.parse(p.attributeIds)
                p.attributeIds.attributeIds =
                    JSON.parse(p.attributeIds.attributeIds)
                productList.push(p)
            }
            this.setData({
                goods:res.data.data.goods,
                productList
            })
            console.log('goods',res.data.data.goods);
            console.log('productList',productList);
        }).catch(err=>{
            console.log(err);
        })
    },
    toReserve(e) {
        let product = JSON.stringify(e.currentTarget.dataset.product)
        tt.navigateTo({
            url: `/pages/reserve/reserve?product=${product}`
        });
    },

    handleLocation() {
        tt.showToast({
            title: '暂无经纬度信息',
            icon: 'none'
        });
    },

    open() {
        this.setData({
            dialog1: true
        });
    },

    close() {
        this.setData({
            dialog1: false
        });
    },

    handleSlide() {
        this.setData({
            contentHeight: 'auto',
            displayed: 'none'
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        tt.setNavigationBarTitle({
            title: options.name
        });
        this.setData({
            name: options.name,
            id:options.id
        });
        this.getGoodsDetail()
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