let util = require('../../utils/util.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isCollect:false,
        name: '',//酒店名称
        yearT: '',
        dateGlobal: '',
        dateGlobal2: '',
        today: '',
        tomorrow: '',
        weekT: '',
        weekN: '',
        daysBetween: '',
        dialog: false,
        selectArray:[],
        params:[],
    },
    handleCollect(){
        let {isCollect} = this.data
        if (isCollect) {
            tt.showToast({
                title:'取消收藏',
                icon: 'none'
            })
            isCollect = false
        }else {
            tt.showToast({
                title:'收藏成功',
                icon: 'none'
            })
            isCollect = true
        }
        this.setData({
            isCollect
        })
    },
    toHotelReserve(){
        tt.navigateTo({
            url: '/pages/hotelReserve/hotelReserve'
        })
    },
    bindDateChange(e) {
        let {today, tomorrow, weekT, weekN, daysBetween} = this.data
        let type = e.currentTarget.dataset.type
        let value = e.detail.value
        if (type === 'pre') {
            let dateGlobal = value
            weekT = util.GetWeek(dateGlobal, 0)
            today = util.GetMDStr(dateGlobal, 0)
            daysBetween = this.getDaysBetween(dateGlobal, this.data.dateGlobal2)
        } else if (type === 'next') {
            let dateGlobal2 = value
            weekN = util.GetWeek(dateGlobal2, 1)
            tomorrow = util.GetMDStr(dateGlobal2, 1)
            daysBetween = this.getDaysBetween(this.data.dateGlobal, dateGlobal2)
        }
        this.setData({
            weekT,
            weekN,
            today,
            tomorrow,
            daysBetween
        })
    },
    dateChange(e) {
        console.log(e);
    },
    handleGetMyDate(e){
        let {selectArray} = this.data
        this.setData({
            selectArray: e.detail.selectArray
        })
    },
    onMyEvent(e){
        console.log(e.detail.params);
        let params = e.detail.params
        this.setData({
            params
        })
    },
    confirmDate() {
        let {today,tomorrow,daysBetween,params} = this.data
        today = params[0].xuanShiJian
        today = today.split('-')[1]
        today = `${today}月${(params[0].xuanDayShi+'').padStart(2,'0')}日`
        tomorrow = params[1].xuanShiJian
        tomorrow = tomorrow.split('-')[1]
        tomorrow = `${tomorrow}月${(params[1].xuanDayShi+'').padStart(2,'0')}日`
        daysBetween = params[1].chaDay
        this.setData({
            today,
            tomorrow,
            daysBetween,
            dialog:false
        })
    },
    open() {
        this.setData({
            dialog: true
        })
    },
    open1() {
        this.setData({
            dialog1: true
        })
    },
    open2() {
        this.setData({
            dialog2: true
        })
    },
    close() {
        this.setData({
            dialog: false
        })
    },
    close1() {
        this.setData({
            dialog1: false
        })
    },
    close2() {
        this.setData({
            dialog2: false
        })
    },
    getDaysBetween(dateString1, dateString2) {
        var startDate = Date.parse(dateString1);
        var endDate = Date.parse(dateString2);
        var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
        return days;
    },
    showMap() {
        //暂时为本机经纬度
        tt.getLocation({
            success: res => {
                tt.openLocation({
                    latitude: res.latitude,
                    longitude: res.longitude,
                    scale: 18,
                    success: res => {
                        console.log('打开地图成功');
                    },
                    fail: err => {
                        console.log('打开地图失败');
                    }
                })
            },
            fail: err => {
                console.log(err);
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let dateGlobal = util.GetDateStr(0)
        let dateGlobal2 = util.GetDateStr(1)
        let weekT = util.GetWeek(dateGlobal, 0)
        let weekN = util.GetWeek(dateGlobal, 1)
        let today = util.GetMDStr(dateGlobal, 0)
        let tomorrow = util.GetMDStr(dateGlobal, 1)
        let daysBetween = this.getDaysBetween(dateGlobal, dateGlobal2)
        tt.setNavigationBarTitle({
            title: options.name
        })
        this.setData({
            name: options.name,
            dateGlobal,
            dateGlobal2,
            weekT,
            weekN,
            today,
            tomorrow,
            daysBetween,
        })
    },
    onPageScroll(e) {
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