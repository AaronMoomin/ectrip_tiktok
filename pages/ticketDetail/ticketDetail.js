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
        //显示
        dialog1: false,
        dialog2: false,
        isCollect:'',
        openid:'',
        nickName:'',
        avatarUrl:'',
        rule:'',
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
                            this.login(res)
                            this.setData({
                                avatarUrl: res1.userInfo.avatarUrl,
                                nickName: res1.userInfo.nickName
                            })
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
        if (this.checkLogin()){
            let product = JSON.stringify(e.currentTarget.dataset.product)
            let totalStock = e.currentTarget.dataset.totalstock
            let switchneedvisitor = e.currentTarget.dataset.switchneedvisitor
            let contactducumenttype = e.currentTarget.dataset.contactducumenttype
            tt.navigateTo({
                url: `/pages/reserve/reserve?product=${product}&totalStock=${totalStock}&switchneedvisitor=${switchneedvisitor}&contactducumenttype=${contactducumenttype}`
            });
        }else {
            console.log('未登录');
        }
    },

    open() {
        this.setData({
            dialog1: true
        });
    },
    open2(e) {
        let {rule} = e.currentTarget.dataset
        rule = rule.split('；')
        this.setData({
            dialog2: true,
            rule:rule
        });
    },

    close() {
        this.setData({
            dialog1: false
        });
    },
    close2() {
        this.setData({
            dialog2: false
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        tt.setNavigationBarTitle({
            title: options.name
        });
        tt.getStorage({
            key:'userInfo',
            success:res=>{
                this.setData({
                    nickName:res.data.nickName
                })
            }
        })
        this.setData({
            name: options.name,
            id:options.id,
            openid:app.globalData.openid,
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