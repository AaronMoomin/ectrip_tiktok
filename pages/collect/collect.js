const request = require('../../utils/request')
const util = require("../../utils/util.js");
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        dateGlobal:'',
        dateGlobal2:'',
        isSelect: [true, false, false],
        openid:'',
        allList:[],
        categoryIdList:[1,2,14],
    },
    handleSelect(e) {
        let {isSelect,categoryIdList,dateGlobal,dateGlobal2} = this.data
        let index = e.currentTarget.dataset.index
        for (let i in isSelect) {
            isSelect[i] = false
            if (index == i) {
                isSelect[i] = !isSelect[i]
                if (i==0){
                    this.getCollectList(categoryIdList[i])
                }else if (i==1){
                    this.getCollectList(categoryIdList[i],dateGlobal,dateGlobal2)
                }else{
                    this.getCollectList(categoryIdList[i])
                }
            }
        }
        this.setData({
            isSelect
        })
    },
    async getCollectList(categoryId=1,start='',end='') {
        await request.myRequest(
            '/tiktok/personCenter/collection/list',
            {
                categoryId,
                openid:this.data.openid
            },
            'get',
            'application/x-www-form-urlencoded'
        ).then(res => {
            console.log(res);
            let {allList} = this.data
            if (res.data.message=='无收藏'){
                allList=[]
            }else {
                allList = res.data.data.goodsList
                for (let i in allList) {
                    allList[i].imageList = JSON.parse(allList[i].imageList)
                }
            }
            this.setData({
                allList
            })
        }).catch(err =>{
            console.log(err);
        })
    },
    toPlayDetail(e){
        let id = e.currentTarget.dataset.id;
        tt.navigateTo({
            url: `/pages/playReserve/playReserve?id=${id}`
        });
    },
    toHotelDetail(e){
        let name = e.currentTarget.dataset.name;
        let id = e.currentTarget.dataset.id;
        tt.navigateTo({
            url: `/pages/hotelDetail/hotelDetail?id=${id}&name=${name}`
        });
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
        let {dateGlobal,dateGlobal2} = this.data
        dateGlobal = util.GetDateStr(0)
        dateGlobal2 = util.GetDateStr(1)
        console.log(dateGlobal);
        console.log(dateGlobal2);
        this.setData({
            openid:app.globalData.openid,
            dateGlobal,
            dateGlobal2,
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