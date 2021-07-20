let util = require('../../utils/util.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
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
    },
    triggerShow(e){
        let index = e.currentTarget.dataset.index
        let {itemTrigger,rotateAnimation} = this.data
        itemTrigger[index] = !itemTrigger[index]
        if (itemTrigger[index]){
            this.animation.rotate(270).step();
        }else {
            this.animation.rotate(90).step();
        }
        rotateAnimation[index] = this.animation.export()
        this.setData({
            itemTrigger,
            rotateAnimation,
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
    confirmDate() {
        let {today,tomorrow,weekN,weekT,daysBetween,selectArray} = this.data
        console.log(selectArray);
        let year0 = selectArray[0].year
        let month0 = selectArray[0].month+''
        month0 = month0.padStart(2,'0')
        let date0 = selectArray[0].date+''
        date0 = date0.padStart(2,'0')
        let year1 = selectArray[1].year
        let month1 = selectArray[1].month+''
        month1 = month1.padStart(2,'0')
        let date1 = selectArray[1].date+''
        date1 = date1.padStart(2,'0')
        let d0 = `${year0}-${month0}-${date0}`
        let d1 = `${year1}-${month1}-${date1}`
        daysBetween = this.getDaysBetween(d0, d1)
        today = `${month0}月-${date0}日`
        tomorrow = `${month1}月-${date1}日`
        weekT = util.GetWeek(d0,0)
        weekN = util.GetWeek(d1,0)
        this.setData({
            today,
            tomorrow,
            daysBetween,
            weekT,
            weekN,
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