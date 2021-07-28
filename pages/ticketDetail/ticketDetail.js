const request = require("../../utils/request")
const util = require("../../utils/util")
const base64 = require("../../utils/base64.js")
const app = getApp()
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
        productListShow:[],
        slideNum:0,
        contentHeight: '550rpx',
        //介绍的高度
        displayed: 'block',
        //显示
        dialog1: false,
        isCollect:'',
        openid:'',
    },
    async handleCollect(e) {
        let {isCollect,openid} = this.data
        console.log(e.currentTarget.dataset.goods);
        let obj = JSON.stringify({
            "categoryId": e.currentTarget.dataset.goods.categoryId,
            "goodsId": e.currentTarget.dataset.goods.id,
            openid,
        })
        let object = base64.encode(obj)
        if (isCollect) {
            tt.showToast({
                title: '取消收藏',
                icon: 'none'
            })
            isCollect=0
            await request.myRequest(
                '/tiktok/personCenter/collection/remove',
                {
                    goodsId:e.currentTarget.dataset.goods.id,
                    openid:app.globalData.openid
                },
                'post',
                'application/x-www-form-urlencoded'
            ).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            })
        } else {
            tt.showToast({
                title: '收藏成功',
                icon: 'none'
            })
            isCollect=1
            await request.myRequest(
                '/tiktok/personCenter/collection/add',
                {
                    data:object,
                    signed:'add'
                },
                'post',
            ).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            })
        }
        this.setData({
            isCollect
        })
    },
    slide(){
        let {productList,productListShow} = this.data
        for (let i = 2; i < productList.length; i++) {
            productListShow.push(productList[i])
        }
        this.setData({
            productListShow,
            slideNum:productList.length-productListShow.length
        })
    },
    async getGoodsDetail() {
        let {id} = this.data
        let today = util.GetDateStr(0)
        let openid = app.globalData.openid
        let obj = JSON.stringify({
            "endDate": "",
            id,
            openid,
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
            let {goods,productList,productListShow,isCollect} = this.data
            res.data.data.goods.openStartTime =
            res.data.data.goods.openStartTime.split(" ")[1]
            res.data.data.goods.openEndTime =
                res.data.data.goods.openEndTime.split(" ")[1]
            res.data.data.goods.infoAddress
                = JSON.parse(res.data.data.goods.infoAddress)
            res.data.data.goods.imageList = JSON.parse(res.data.data.goods.imageList)
            for (let p of res.data.data.productList) {
                p.attributeIds = JSON.parse(p.attributeIds)
                p.attributeIds.attributeIds =
                    JSON.parse(p.attributeIds.attributeIds)
                productList.push(p)
            }
            if (productList.length>=2){
                for (let i = 0; i < 2; i++) {
                    productListShow.push(productList[i])
                }
            }else {
                productListShow = productList
            }

            this.setData({
                goods:res.data.data.goods,
                productList,
                productListShow,
                slideNum:productList.length-productListShow.length,
                isCollect:res.data.data.isCollected
            })
            console.log('goods',res.data.data.goods);
            console.log('productList',productList);
        }).catch(err=>{
            console.log(err);
        })
    },
    toReserve(e) {
        let product = JSON.stringify(e.currentTarget.dataset.product)
        let totalStock = e.currentTarget.dataset.totalstock
        tt.navigateTo({
            url: `/pages/reserve/reserve?product=${product}&totalStock=${totalStock}`
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
            id:options.id,
            openid:app.globalData.openid
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