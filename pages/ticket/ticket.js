const request = require('../../utils/request')
const base64 = require("../../utils/base64.js")
Page({
    /**
     * 页面的初始数据
     */
    data: {
        options: [{
            id: '001',
            name: '厦门'
        }, {
            id: '002',
            name: '上海'
        }, {
            id: '003',
            name: '深圳'
        }],
        goodsList:[],
        themeList:[],
        size:10,
    },
    //按钮跳转类型商品展示
    toOrderTypeShow(e) {
        tt.navigateTo({
            url: '/pages/orderTypeShow/orderTypeShow?name=' + e.currentTarget.dataset.name
        })
    },
    //跳转门票详情
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
        this.getGoods(this.data.size)
        // this.getTheme()
    },
    // 查询主题
    async getTheme() {
        await request.myRequest(
            '/tiktok/mutual/theme',
            {
                'categoryId':1
            },
            'get',
            'application/x-www-form-urlencoded'
        ).then(res=>{
            this.setData({
                themeList:res.data.data.data
            })
        }).catch(err=>{
            console.log(err);
        })
    },
    // 商品列表查询
    async getGoods(size) {
        tt.showLoading({title:'加载中...'})
        let obj = JSON.stringify({
            "categoryId": 1,
            "city": "",
            "content": "",
            "endDate": "",
            "orderBy": 0,
            "startDate": "",
            "current":0,
            "size":size
        })
        let object = base64.encode(obj)
        await request.myRequest(
            '/tiktok/mutual/goods',
            {
                data:object,
                signed:'111'
            },
            'post',
        ).then(res=>{
            tt.hideLoading()
            let {goodsList} = this.data
            goodsList = []
            for (let resItem of res.data.data) {
                resItem.imageList = JSON.parse(resItem.imageList)
                goodsList.push(resItem)
            }
            console.log(goodsList);
            this.setData({
                goodsList
            })
        }).catch(err=>{
            tt.hideLoading()
            console.log(err);
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
        tt.hideLoading()
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
        let {size} = this.data
        size+=6
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