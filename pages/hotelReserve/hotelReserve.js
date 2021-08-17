const util = require('../../utils/util')
const request = require("../../utils/request");
const base64 = require("../../utils/base64.js");
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        visitPersons: [],
        visitPersonsShow: [],
        dialog: false,
        dialog1: false,
        nowPrice: '',
        priceList: [],//单价集合
        roomIndex:1,//房间数
        goods: '',
        dateGloable: '',
        dateGloable2: '',
        start: '',
        end: '',
        product: '',
        totalStock: '',
        switchneedvisitor: '',
        contactducumenttype: '',
        visitorDucumentType:'',
        daysBetween: '',
        typeStr: '',
        userName: '',
        isNameCurrentWaring: false,
        nameWarnMessage: '',
        phone: '',
        isPhoneCurrentWaring: false,
        phoneWarnMessage: '',
        idCard: '',
        idCardShow: '',
        isIdCardCurrentWaring: false,
        IdCardWarnMessage: '',
        isPeople:true,
        peopleMessage: '',//游客信息提醒
        array: ['1间', '2间'],
        value1: 0,
        array1: ['身份证', '护照', '军官证', '台胞证', '港澳通行证', '其他'],
        arrayVal: ['ID_CARD', 'HUZHAO', 'JUNGUAN', 'TAIBAO', 'GANGAO', 'OTHER'],
        value: 0,
    },
    async toReserve() {
        // 15731445471
        // 610404197603155734

        // 522601198003069767
        // 15724864113
        tt.showLoading({
            title: '加载中...'
        })
        let {
            roomIndex, price, nowPrice, dateGloable,dateGloable2,contactducumenttype,
            arrayVal, value, phone, userName,
            idCard, product,isIdCardCurrentWaring, isPhoneCurrentWaring,
            visitPersonsShow, openid,visitorDucumentType
        } = this.data
        let credentialsType = value
        price = price * 100
        nowPrice = nowPrice * 100
        if (userName == '') {
            tt.showToast({
                title: '姓名不能为空',
                icon: 'fail'
            })
            return
        } else if (phone == '') {
            if (isPhoneCurrentWaring) {
                tt.showToast({
                    title: '手机号格式错误',
                    icon: 'fail'
                })
            } else {
                tt.showToast({
                    title: '手机号不能为空',
                    icon: 'fail'
                })
            }
            return
        }else if (this.data.switchneedvisitor==1 && roomIndex!=visitPersonsShow.length) {
            console.log('需要实名');
            tt.showToast({
                title: '游客数量不对',
                icon: 'fail'
            })
            return
        }
        let visitPerson = []
        for (let item of visitPersonsShow) {
            let perItem = {
                credentials: (item.credentials).replace(/\s*/g,""),
                credentialsType: arrayVal[item.credentialsType],
                mobile: (item.cellphone).replace(/\s*/g,""),
                name: (item.name).replace(/\s*/g,"")
            }
            visitPerson.push(perItem)
        }
        let obj = JSON.stringify({
            contactPerson: {
                credentials: idCard.replace(/\s*/g,""),
                credentialsType: arrayVal[credentialsType],
                mobile: phone.replace(/\s*/g,""),
                name: userName.replace(/\s*/g,"")
            },
            distributorProductId: product.distributorProductId,
            openid,
            endDate: dateGloable2,
            orderPrice: nowPrice,
            orderQuantity: roomIndex,
            productId: product.productId,
            sellPrice: 1,
            startDate: dateGloable,
            visitPersons: visitPerson
        })
        console.log(JSON.parse(obj));
        let object = base64.encode(obj)
        //?创建订单
        await request.myRequest(
            '/tiktok/mutual/createOrder',
            {
                data: object,
                signed: "reserve"
            },
            'post'
        ).then(res => {
            tt.hideLoading()
            tt.pay({
                orderInfo: res.data.data.orderInfo,
                service: 5,
                getOrderStatus: function (res) {
                    let {orderCode} = res;   // 订单号
                    return new Promise(function (resolve, reject) {
                        //? 商户前端根据 out_order_no 请求商户后端查询微信支付订单状态
                        tt.request({
                            url: "/tiktok/mutual/queryOrder",
                            method: 'get',
                            header: {
                                "content-type": "application/x-www-form-urlencoded"
                            },
                            data: {
                                orderCode   // 必传参数 订单号
                            },
                            success: function (res) {
                                // 商户后端查询的微信支付状态，通知收银台支付结果
                                if (res.data.trade_state == "SUCCESS") {
                                    // 查询微信订单返回一个 trade_state 的属性值 当它返回为 SUCCESS 时，就为成功，Promise 中 resolve中返回 code:0 方便下面拿到。
                                    resolve({code: 0})
                                }
                            },
                            fail(err) {
                                reject(err);
                            }
                        });
                    });
                },
                success: res => {
                    if (res.code == 0) {
                        //?支付成功
                        console.log('支付成功', res);
                        //?跳转订单页面
                        tt.redirectTo({
                            url:"/pages/allOrder/allOrder"
                        })
                    } else if (res.code == 1) {
                        tt.showToast({
                            title: '支付超时',
                            icon: 'fail'
                        })
                        console.log('支付超时', res);
                    } else if (res.code == 2) {
                        tt.showToast({
                            title: '支付失败',
                            icon: 'fail'
                        })
                        console.log('支付失败', res);
                    } else if (res.code == 3) {
                        tt.showToast({
                            title: '支付关闭',
                            icon: 'fail'
                        })
                        console.log('支付关闭', res);
                    } else if (res.code == 4) {
                        tt.showToast({
                            title: '支付取消',
                            icon: 'fail'
                        })
                        console.log('支付取消', res);
                    }
                },
                fail: err => {
                    //?支付失败
                    console.log('支付失败', err);
                }
            })
            console.log(res);
        }).catch(err => {
            tt.hideLoading()
            tt.showToast({
                title: '支付失败',
                icon: 'fail'
            })
            console.log(err);
        })
    },
    async getDailyPrice() {
        let {product, dateGloable, dateGloable2,roomIndex} = this.data
        tt.showLoading({
            title: '加载价格中...'
        })
        await request.myRequest(
            '/tiktok/mutual/dailyPriceAndStock',
            {
                endDate: dateGloable2,
                id: product.productId,
                startDate: dateGloable
            },
            "get",
            'application/x-www-form-urlencoded'
        ).then(res => {
            tt.hideLoading()
            let priceList = res.data.data.dailyProductInfoList
            let allPrice = 0
            let list = []
            for (let i = 0; i < priceList.length; i++) {
                allPrice += priceList[i].settlementPrice
                list.push(priceList[i])
            }
            console.log(list);
            allPrice = allPrice * roomIndex
            allPrice = allPrice.toFixed(2)
            this.setData({
                nowPrice: allPrice,
                priceList: list
            })
            console.log(res);
        }).catch(err => {
            tt.hideLoading()
            console.log(err);
        })
    },
    // 常用联系人列表查询
    async getList() {
        await request.myRequest(
            '/tiktok/personCenter/contact/list',
            {
                openid: app.globalData.openid,
            },
            'get',
            'application/x-www-form-urlencoded'
        ).then(res => {
            let {visitPersons} = this.data
            visitPersons = res.data.data.contactList
            for (let visitPerson of visitPersons) {
                visitPerson.checked = false
            }
            this.setData({
                visitPersons,
            })
            console.log(visitPersons);
        }).catch(err => {
            console.log(err);
        })
    },
    confirmVisitor() {
        let {visitPersons, visitPersonsShow} = this.data
        for (let visitPerson of visitPersons) {
            if (visitPerson.checked) {
                if (visitPersonsShow.indexOf(visitPerson) == -1) {
                    visitPersonsShow.push(visitPerson)
                }
                visitPerson.checked = false
            }
        }
        this.setData({
            visitPersons,
            visitPersonsShow,
            dialog1: false,
        })
        console.log(visitPersonsShow);
    },
    deleteVisitor(e) {
        let {visitPersonsShow} = this.data
        for (let i in visitPersonsShow) {
            if (visitPersonsShow[i].id == e.currentTarget.dataset.id) {
                visitPersonsShow.splice(i, 1)
            }
        }
        this.setData({
            visitPersonsShow,
        })
    },
    checkboxChange(e) {
        let {visitPersons} = this.data
        for (let person of visitPersons) {
            if (e.detail.value.length == 0) {
                person.checked = false
            } else {
                person.checked = false
                for (let v of e.detail.value) {
                    if (person.id == v) {
                        person.checked = true;
                    }
                }
            }
        }
        this.setData({
            visitPersons
        })
    },
    toVisitor() {
        tt.navigateTo({
            url: '/pages/visitor/visitor'
        })
    },
    open() {
        this.setData({
            dialog: true,
        })
    },
    open1(){
        this.setData({
            dialog1: true,
        })
    },
    close() {
        this.setData({
            dialog: false,
        })
    },
    close1() {
        this.setData({
            dialog1: false,
        })
    },
    handleUserName(e) {
        if (e.detail.value == '') {
            this.setData({
                isNameCurrentWaring: true,
                nameWarnMessage: '姓名不能为空',
                userName: ''
            });
        } else {
            this.setData({
                userName: e.detail.value,
                isNameCurrentWaring: false
            });
        }
    },
    handlePhone(e) {
        const currentValue = e.detail.value;
        let myReg = /^[1][3,4,5,7,8,9][0-9]{9}$/;

        if (currentValue == '') {
            this.setData({
                isPhoneCurrentWaring: true,
                phoneWarnMessage: '手机号不能为空',
                phone: ''
            });
        } else if (!myReg.test(currentValue)) {
            this.setData({
                isPhoneCurrentWaring: true,
                phoneWarnMessage: '输入手机号格式不正确'
            });
        } else {
            this.setData({
                phone: e.detail.value,
                isPhoneCurrentWaring: false
            });
        }
    },
    bindPickerChange(e) {
        let {value1,roomIndex} = this.data
        value1 = e.detail.value
        value1 = value1*1
        roomIndex = value1+1
        this.setData({
            value1,
            roomIndex,
            peopleMessage:`请添加${roomIndex}个住户信息`
        });
        this.getDailyPrice()
    },
    bindPickerChange1(e) {
        this.setData({
            value:e.detail.value,
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let {start, end, dateGloable, dateGloable2, typeStr, product,roomIndex} = this.data
        dateGloable = options.start
        dateGloable2 = options.end
        start = util.GetWeekMD(options.start)
        end = util.GetWeekMD(options.end)
        product = JSON.parse(options.product)
        this.setData({
            goods: JSON.parse(options.goods),
            product,
            start,
            end,
            dateGloable,
            dateGloable2,
            totalStock: options.totalStock,
            switchneedvisitor: options.switchneedvisitor,
            contactducumenttype: options.contactducumenttype,
            visitorDucumentType: options.visitorducumenttType,
            daysBetween: options.daysbetween,
            typeStr,
            openid:app.globalData.openid,
            peopleMessage:`请添加${roomIndex}个住户信息`
        })
        for (let item of product.attributeIds.attributeIds) {
            for (let itemElement of item.sizeList) {
                if (itemElement.selected) {
                    typeStr += `/${itemElement.name}`
                }
            }
        }
        typeStr = typeStr.slice(1)
        this.setData({
            typeStr
        })
        this.getList()
        this.getDailyPrice()
        console.log(product);
        console.log('res',this.data.goods);
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