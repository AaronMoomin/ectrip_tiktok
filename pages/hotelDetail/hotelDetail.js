let util = require('../../utils/util.js');
const base64 = require("../../utils/base64.js");
const request = require("../../utils/request");
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        dialog3: false,//预定须知
        rule:'',//预定须知
        id:'',
        openid: '',
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
        goods:'',
        productList:[],
        productListShow:[],
        commentList:[],
        avatarUrl:'',
        nickName:'',
    },
    async getCommentList() {
        tt.showLoading({
            title: "加载中..."
        })
        await request.myRequest(
            '/tiktok/personCenter/comment/list',
            {
                goodsId:this.data.goods.id,
                openid:app.globalData.openid
            },
            'get',
            'application/x-www-form-urlencoded'
        ).then(res=>{
            tt.hideLoading()
            let list = res.data.data.list
            for (let item of list) {
                item.commentImageList = JSON.parse(item.commentImageList)
                item.commentTime = item.commentTime.split(' ')[0]
            }
            this.setData({
                commentList:list
            })
            console.log(this.data.commentList);
        }).catch(err=>{
            console.log(err);
        })
    },
    async handleCollect(e) {
        if (this.checkLogin()){
            this.setData({
                openid:app.globalData.openid
            });
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
        }
    },
    async getGoodsDetail() {
        let {id,dateGlobal,dateGlobal2} = this.data
        let openid = app.globalData.openid
        let obj = JSON.stringify({
            "endDate": dateGlobal2,
            id,
            openid,
            "startDate": dateGlobal
        })
        let object = base64.encode(obj)
        tt.showLoading({
            title: '加载中...'
        })
        await request.myRequest(
            '/tiktok/mutual/detail',
            {
                data:object ,
                signed: "酒店详情"
            },
            'post'
        ).then(res=>{
            tt.hideLoading()
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
                p.imageList = JSON.parse(p.imageList)
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
                isCollect:res.data.data.isCollected
            })
            this.getCommentList()
            console.log('goods',res.data.data.goods);
            console.log('productList',productList);
        }).catch(err=>{
            tt.hideLoading()
            console.log(err);
        })
    },
    toHotelReserve(e){
        console.log(e);
        if (this.checkLogin()){
            let goods = JSON.stringify(e.currentTarget.dataset.goods)
            let start = e.currentTarget.dataset.start
            let end = e.currentTarget.dataset.end
            let product = JSON.stringify(e.currentTarget.dataset.product)
            let totalStock = e.currentTarget.dataset.totalstock
            let switchneedvisitor = e.currentTarget.dataset.switchneedvisitor
            let contactducumenttype = e.currentTarget.dataset.contactducumenttype
            let visitorducumenttype = e.currentTarget.dataset.visitorducumenttype
            let daysBetween = e.currentTarget.dataset.daysbetween
            tt.navigateTo({
                url: `/pages/hotelReserve/hotelReserve?product=${product}&visitorducumenttype=${visitorducumenttype}&daysbetween=${daysBetween}&goods=${goods}&start=${start}&end=${end}&totalStock=${totalStock}&switchneedvisitor=${switchneedvisitor}&contactducumenttype=${contactducumenttype}`
            });
        }else {
            console.log('未登录');
        }
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
        let {today,tomorrow,daysBetween,params,dateGlobal,dateGlobal2} = this.data
        dateGlobal = params[0].xuanShiJian+'-'+params[0].xuanDayShi
        dateGlobal2 = params[1].xuanShiJian+'-'+params[1].xuanDayShi
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
            dateGlobal,
            dateGlobal2,
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
    open3(e) {
        let {rule} = e.currentTarget.dataset
        rule = rule.split('；')
        this.setData({
            dialog3: true,
            rule:rule
        });
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
    close3() {
        this.setData({
            dialog3: false
        })
    },
    checkLogin() {
        tt.getStorage({
            key: 'userInfo',
            success: res => {
                console.log(res);
                this.setData({
                    nickName: res.data.nickName,
                    avatarUrl: res.data.avatarUrl
                })
            },
            fail: err => {
                console.log(err);
            }
        })
        if (this.data.nickName == "") {
            console.log("未登录");
            this.handleLogin()
            return false
        } else {
            console.log("已登录");
            return true
        }
    },
    async login(value) {
        let obj = JSON.stringify({
            "anonymous_code": value.anonymousCode,
            "appid": app.globalData.appid,
            "code": value.code,
            "avatarUrl": this.data.avatarUrl,
            "nickName": this.data.nickName,
            "secret": app.globalData.secret
        })
        let Object = base64.encode(obj)
        let data = {
            "data": Object,
            "signed": "login"
        }
        await request.myRequest(
            '/tiktok/serverAPI/login',
            data,
            "post"
        ).then(res => {
            console.log(res);
            let {openid, session_key, unionid} = res.data.data
            app.globalData.openid = openid
            tt.setStorage({
                key: 'session',
                data: {
                    openid,
                    session_key,
                    unionid
                },
                success: res => {
                    // console.log('openid调用成功');
                },
                fail: err => {
                    // console.log('openid调用失败');
                }
            })
        }).catch(err => {
            console.log(err);
        })
    },
    handleLogin() {
        tt.login({
                force: true,
                success: (res) => {
                    // console.log('登录回调', res);
                    tt.getUserInfo({
                        withCredentials: true,
                        success: (res1) => {
                            this.setData({
                                avatarUrl: res1.userInfo.avatarUrl,
                                nickName: res1.userInfo.nickName
                            })
                            this.login(res)
                            tt.setStorage({
                                key: "userInfo",
                                data: {
                                    avatarUrl: res1.userInfo.avatarUrl,
                                    nickName: res1.userInfo.nickName
                                },
                                success: (res) => {
                                    console.log(`userInfo写入成功`);
                                },
                                fail(res) {
                                    // console.log(`userInfo调用失败`);
                                },
                            });
                        },
                        fail(res) {
                            console.log(`getUserInfo失败`);
                        },
                    });
                },
                fail: (err) => {
                    console.log('取消', err);
                }
            }
        )
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
            id:options.id,
            dateGlobal,
            dateGlobal2,
            weekT,
            weekN,
            today,
            tomorrow,
            daysBetween,
        })
        this.getGoodsDetail()
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
        tt.hideLoading()
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