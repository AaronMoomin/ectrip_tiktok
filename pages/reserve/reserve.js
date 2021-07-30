// pages/reserve/reserve.js
let util = require('../../utils/util.js');
const request = require("../../utils/request")
const base64 = require("../../utils/base64.js")
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        price: '',
        nowPrice: '',
        product: {},
        visitPersons: [],
        visitPersonsShow: [],
        totalStock: 0,
        ticketType: [],
        needToKnow: false,
        needKnow: [],
        yesterday: '',
        today: '',
        tomorrow: '',
        selectDay: '',
        showYesterday: false,
        showDay: true,
        showTomorrow: true,
        timeChooser: [{
            start: '20:30',
            end: '21:40',
            session: '20:30',
            isSelect: false
        }, {
            start: '08:30',
            end: '10:40',
            session: '08:30',
            isSelect: false
        }],
        dialog: false,
        dialog1: false,
        //编辑dialog
        days_style: [],
        disabled: '',
        displayed2: 'none',
        btnDisabled: true,
        currentValue: '',
        //当前输入手机号
        isCurrentWaring: false,
        warnMessage: '',
        array: ['身份证', '护照', '台胞证', '港澳通行证', '军官证', '其他'],
        arrayVal: ['ID_CARD', 'HUZHAO', 'TAIBAO', 'GANGAO', 'JUNGUAN', 'OTHER'],
        users: [],
        value1: 0,
        value1Show: '身份证',
        value2: 0,
        userName: '',
        userNameShow: '',
        phone: '',
        phoneShow: '',
        sex: '男',
        sexShow: '男',
        isPhoneCurrentWaring: false,
        phoneWarnMessage: '',
        idCard: '',
        idCardShow: '',
        isIdCardCurrentWaring: false,
        IdCardWarnMessage: '',
        isNameCurrentWaring: false,
        nameWarnMessage: '',
        hasUser: false,
        iosDialog: false,
        //确认删除
        voteNum: 1,
        dateString: "",
        spot: [],
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
                if (visitPersonsShow.indexOf(visitPerson)==-1){
                    visitPersonsShow.push(visitPerson)
                }
                visitPerson.checked = false
            }
        }
        this.setData({
            visitPersons,
            visitPersonsShow,
            dialog1: false
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
            visitPersonsShow
        })
    },
    checkboxChange(e) {
        let {visitPersons} = this.data
        for (let person of visitPersons) {
            for (let v of e.detail.value) {
                if (person.id==v){
                    person.checked = true
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
    async toReserve() {
        // 15731445471
        // 610404197603155734

        // 522601198003069767
        // 15724864113
        tt.showLoading({
            title: '加载中...'
        })
        let {
            voteNum, price, nowPrice, selectDay,
            arrayVal, value1, phone, userName,
            idCard, visitPersons, product,
            isIdCardCurrentWaring, isPhoneCurrentWaring,
            visitPersonsShow
        } = this.data
        let credentialsType = arrayVal[value1]
        price = price * 100
        nowPrice = nowPrice * 100
        if (userName == '') {
            tt.showToast({
                title: '姓名不能为空',
                icon: 'fail'
            })
            return
        } else if (idCard == '') {
            if (isIdCardCurrentWaring) {
                tt.showToast({
                    title: '身份证格式错误',
                    icon: 'fail'
                })
            } else {
                tt.showToast({
                    title: '身份证不能为空',
                    icon: 'fail'
                })
            }
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
        }else if (visitPersonsShow.length==0){
            tt.showToast({
                title: '游客不能为空',
                icon: 'fail'
            })
            return
        }
        let obj = JSON.stringify({
            contactPerson: {
                credentials: idCard,
                credentialsType,
                mobile: phone,
                name: userName
            },
            distributorProductId: product.distributorProductId,
            endDate: "",
            orderPrice: nowPrice,
            orderQuantity: voteNum,
            productId: product.productId,
            sellPrice: price,
            startDate: selectDay,
            visitPersonsShow
        })
        console.log(obj);
        let object = base64.encode(obj)
        await request.myRequest(
            '/tiktok/mutual/createPaymentOrder',
            {
                data: object,
                signed: "111"
            },
            'post'
        ).then(res => {
            tt.hideLoading()
            console.log(res);
        }).catch(err => {
            tt.hideLoading()
            console.log(err);
        })
    },
    async getDailyPrice(day) {
        let {product} = this.data
        await request.myRequest(
            '/tiktok/mutual/dailyPriceAndStock',
            {
                endDate: "",
                id: product.distributorProductId,
                startDate: day
            },
            "get",
            'application/x-www-form-urlencoded'
        ).then(res => {
            this.setData({
                price: res.data.data.priceList[0].price
            })
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
    },
    dateChange(e) {
        console.log("现在日期是", e.detail.dateString)
        this.setData({
            dateString: e.detail.dateString,
            selectDay: e.detail.dateString
        })
        this.dayClick(e)
    },
    //获取票数
    getIndex(e) {
        const {
            index
        } = e.detail;
        let {
            voteNum,
            price,
            nowPrice
        } = this.data;
        if (voteNum > index) {
            nowPrice -= price
        } else {
            nowPrice += price
        }
        nowPrice = nowPrice.toFixed(2) * 1
        voteNum = index;
        this.setData({
            voteNum,
            price,
            nowPrice
        });
    },

    //选择时间段
    checkSession(e) {
        let {
            timeChooser
        } = this.data;
        timeChooser.forEach(item => {
            if (item.session === e.currentTarget.dataset.session) {
                item.isSelect = !item.isSelect;
            }
        });
        this.setData({
            timeChooser
        });
    },

    confirm() {
        let {
            userName,
            userNameShow,
            phone,
            phoneShow,
            sex,
            sexShow,
            array,
            value1,
            value1Show,
            idCard,
            idCardShow,
            users
        } = this.data;
        // console.log(`${userName}-${phone}-${sex}-${array[value1]}-${idCard}`)

        let idType = array[value1];
        if (userName === '') {
            this.setData({
                isNameCurrentWaring: true,
                nameWarnMessage: '姓名不能为空'
            });
            return;
        }

        if (phone === '') {
            this.setData({
                isPhoneCurrentWaring: true,
                phoneWarnMessage: '手机号不能为空'
            });
            return;
        }

        if (idCard === '') {
            this.setData({
                isIdCardCurrentWaring: true,
                IdCardWarnMessage: '身份证不能为空'
            });
            return;
        }

        for (let item of users) {
            if (item.userName === userName) {
                tt.showToast({
                    title: '该游玩人已存在',
                    icon: 'none'
                });
                return;
            } else if (item.idCard === idCard) {
                tt.showToast({
                    title: '该身份证已存在',
                    icon: 'none'
                });
                return;
            }
        }

        if (users.length == 0) {
            users.push({
                userName,
                phone,
                sex,
                idType,
                idCard,
                value1,
                isSelect: true
            });
        } else {
            users.push({
                userName,
                phone,
                sex,
                idType,
                idCard,
                value1,
                isSelect: false
            });
        }

        users.forEach(item => {
            if (item.isSelect) {
                userNameShow = item.userName;
                phoneShow = item.phone;
                idCardShow = item.idCard;
                sexShow = item.sex;
                value1Show = item.value1;
            }
        });
        this.setData({
            userNameShow,
            phoneShow,
            idCardShow,
            sexShow,
            value1Show,
            userName: '',
            phone: '',
            idCard: '',
            value1: 0,
            hasUser: true,
            dialog2: false,
            isNameCurrentWaring: false,
            isPhoneCurrentWaring: false,
            isIdCardCurrentWaring: false,
            users
        });
    },

    confirmEdit() {
        let {
            userName,
            userNameShow,
            phone,
            phoneShow,
            sex,
            sexShow,
            idCard,
            idCardShow,
            value1,
            value1Show,
            array,
            users
        } = this.data;
        // console.log(`${userName}-${phone}-${sex}-${array[value1]}-${idCard}`);
        let idType = array[value1];

        if (userName == "") {
            this.setData({
                isNameCurrentWaring: true,
                nameWarnMessage: '姓名不能为空'
            });
            return;
        }

        if (phone == "") {
            this.setData({
                isPhoneCurrentWaring: true,
                phoneWarnMessage: '手机号不能为空'
            });
            return;
        }

        if (idCard == "") {
            this.setData({
                isIdCardCurrentWaring: true,
                IdCardWarnMessage: '身份证不能为空'
            });
            return;
        }

        users.forEach(item => {
            if (item.isSelect == true) {
                item.userName = userName;
                item.phone = phone;
                item.sex = sex;
                item.idCard = idCard;
                item.idType = idType;
            }
        });
        userNameShow = userName;
        phoneShow = phone;
        idCardShow = idCard;
        sexShow = sex;
        value1Show = value1;
        this.setData({
            userName: '',
            phone: '',
            idCard: '',
            userNameShow,
            phoneShow,
            idCardShow,
            sexShow,
            value1Show,
            value1: 0,
            dialog3: false,
            isNameCurrentWaring: false,
            isPhoneCurrentWaring: false,
            isIdCardCurrentWaring: false,
            users
        });
    },

    edit() {
        let {
            userNameShow,
            phoneShow,
            sexShow,
            value1Show,
            idCardShow,
            array
        } = this.data;
        console.log(`${userNameShow}-${phoneShow}-${sexShow}-${array[value1Show]}-${idCardShow}`);
        this.setData({
            userName: userNameShow,
            phone: phoneShow,
            idCard: idCardShow,
            sex: sexShow,
            value1: value1Show,
            dialog3: true,
            isNameCurrentWaring: false,
            isPhoneCurrentWaring: false,
            isIdCardCurrentWaring: false
        });
    },

    cancel() {
        this.setData({
            iosDialog: false
        });
    },

    deleteItem() {
        let {
            users,
            userNameShow,
            phoneShow,
            idCardShow
        } = this.data;

        for (let index in users) {
            if (users[index].userName === userNameShow) {
                users.splice(index, 1);

                if (users.length === 0) {
                    this.setData({
                        userNameShow: '',
                        phoneShow: '',
                        idCardShow: ''
                    });
                } else {
                    users[0].isSelect = true;
                }
            }
        }

        users.forEach(item => {
            if (item.isSelect) {
                userNameShow = item.userName;
                phoneShow = item.phone;
                idCardShow = item.idCard;
            }
        });
        this.setData({
            users,
            userNameShow,
            phoneShow,
            idCardShow,
            iosDialog: false
        });
    },

    bindPickerChange(e) {
        this.setData({
            value1: e.detail.value
        });
    },

    //性别
    radioChange(e) {
        this.setData({
            sex: e.detail.value
        });
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

    handleIdCard(e) {
        const currentValue = e.detail.value;
        const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

        if (currentValue == '') {
            this.setData({
                isIdCardCurrentWaring: true,
                IdCardWarnMessage: '身份证不能为空',
                idCard: ''
            });
        } else if (!reg.test(currentValue)) {
            this.setData({
                isIdCardCurrentWaring: true,
                IdCardWarnMessage: '输入身份证格式不正确'
            });
        } else {
            this.setData({
                idCard: e.detail.value,
                isIdCardCurrentWaring: false
            });
        }
    },

    open() {
        this.setData({
            dialog: true
        });
    },

    open1() {
        this.setData({
            dialog1: true
        });
    },

    open2() {
        this.setData({
            needToKnow: true
        });
    },

    close() {
        this.setData({
            dialog: false
        });
    },

    close1() {
        this.setData({
            dialog1: false
        });
    },

    close2() {
        this.setData({
            dialog3: false
        });
    },

    dayClick(e) {
        let {
            selectDay,
            today,
            yesterday,
            tomorrow
        } = this.data; //今天

        let str = util.GetDateStr(0); //下一天

        let preStr = util.GetDateStr1(str, -1);
        yesterday = util.GetWeekStr1(selectDay, -1);
        today = util.GetWeekStr1(selectDay, 0);
        tomorrow = util.GetWeekStr1(selectDay, 1);

        if (str > selectDay) {
            //选中日期比今天小 6 7 8  5 6 7
            if (preStr <= selectDay) {
                this.setData({
                    showYesterday: false,
                    showDay: false,
                    showTomorrow: true
                });
            } else {
                this.setData({
                    showYesterday: false,
                    showDay: false,
                    showTomorrow: false
                });
            }
        } else if (str < selectDay) {
            //选中日期比今天大
            this.setData({
                showYesterday: true,
                showDay: true,
                showTomorrow: true
            });
        } else {
            //就是今天
            this.setData({
                showYesterday: false,
                showDay: true,
                showTomorrow: true
            });
        }

        this.setData({
            selectDay,
            today,
            yesterday,
            tomorrow
        });
    },

    preDay() {
        let {
            selectDay,
            today,
            yesterday,
            tomorrow
        } = this.data;
        let str = util.GetDateStr(0);
        selectDay = util.GetDateStr1(selectDay, -1);
        yesterday = util.GetWeekStr1(selectDay, -1);
        today = util.GetWeekStr1(selectDay, 0);
        tomorrow = util.GetWeekStr1(selectDay, 1);
        this.getDailyPrice(selectDay)
        if (str >= selectDay) {
            this.setData({
                showYesterday: false
            });
        }

        this.setData({
            yesterday,
            today,
            tomorrow,
            selectDay
        });
    },

    nextDay() {
        let {
            selectDay,
            today,
            yesterday,
            tomorrow
        } = this.data;
        let str = util.GetDateStr(0);
        selectDay = util.GetDateStr1(selectDay, 1);
        yesterday = util.GetWeekStr1(selectDay, -1);
        today = util.GetWeekStr1(selectDay, 0);
        tomorrow = util.GetWeekStr1(selectDay, 1);
        this.getDailyPrice(selectDay)
        if (str < selectDay) {
            this.setData({
                showYesterday: true,
                showDay: true
            });
        } else {
            this.setData({
                showYesterday: false,
                showDay: true
            });
        }

        this.setData({
            yesterday,
            today,
            tomorrow,
            selectDay
        });
    },

    confirmDate() {
        this.setData({
            dialog: false
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        options.product = JSON.parse(options.product)
        let date = new Date();
        let day = date.getDate();
        let {
            yesterday,
            today,
            tomorrow,
            selectDay,
        } = this.data;
        //获取当天日期 2021-07-08

        let str = util.GetDateStr(0);
        selectDay = str;
        yesterday = util.GetWeekStr1(str, -1);
        today = util.GetWeekStr1(str, 0);
        tomorrow = util.GetWeekStr1(str, 1);
        this.setData({
            yesterday,
            today,
            tomorrow,
            selectDay,
            product: options.product,
            ticketType: options.product.attributeIds.attributeIds,
            price: options.product.priceList[0].price,
            nowPrice: options.product.priceList[0].price,
            totalStock: options.totalStock * 1
        });
        let thisDay = util.GetDateStr(0)
        this.getDailyPrice(thisDay)

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
        this.getList()
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