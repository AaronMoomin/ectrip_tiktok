// pages/reserve/reserve.js
let util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        yesterday: '',
        today: '',
        tomorrow: '',
        selectDay: '',
        showYesterday: false,
        showDay: true,
        showTomorrow: true,
        timeChooser: [],
        dialog: false,//时间dialog
        dialog2: false,//新增dialog
        dialog3: false,//编辑dialog
        days_style: [],
        disabled: '',
        displayed2: 'none',
        btnDisabled: true,
        currentValue: '',//当前输入手机号
        isCurrentWaring: false,
        warnMessage: '',
        array: ['身份证', '兵役证'],
        array1: ['+86', '+80', '+84', '+87'],
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
        iosDialog: false,//确认删除
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
        } = this.data
        console.log(`${userName}-${phone}-${sex}-${array[value1]}-${idCard}`)
        let idType = array[value1]
        if (userName === '') {
            this.setData({
                isNameCurrentWaring: true,
                nameWarnMessage: '姓名不能为空'
            })
            return;
        }
        if (phone === '') {
            this.setData({
                isPhoneCurrentWaring: true,
                phoneWarnMessage: '手机号不能为空'
            })
            return;
        }
        if (idCard === '') {
            this.setData({
                isIdCardCurrentWaring: true,
                IdCardWarnMessage: '身份证不能为空'
            })
            return;
        }
        for (let item of users) {
            if (item.userName === userName) {
                wx.showToast({
                    title: '该游玩人已存在',
                    icon: 'none'
                })
                return
            } else if (item.idCard === idCard) {
                wx.showToast({
                    title: '该身份证已存在',
                    icon: 'none'
                })
                return
            }
        }
        if (users.length == 0) {
            users.push({userName, phone, sex, idType, idCard, isSelect: true})
        } else {
            users.push({userName, phone, sex, idType, idCard, isSelect: false})
        }
        users.forEach(item => {
            if (item.isSelect) {
                userNameShow = item.userName
                phoneShow = item.phone
                idCardShow = item.idCard
                sexShow = item.sex
                value1Show = value1
            }
        })
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
        })
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
        } = this.data
        console.log(`${userName}-${phone}-${sex}-${array[value1]}-${idCard}`)

        let idType = array[value1]
        if (userName == "") {
            this.setData({
                isNameCurrentWaring: true,
                nameWarnMessage: '姓名不能为空'
            })
            return;
        }
        if (phone == "") {
            this.setData({
                isPhoneCurrentWaring: true,
                phoneWarnMessage: '手机号不能为空'
            })
            return;
        }
        if (idCard == "") {
            this.setData({
                isIdCardCurrentWaring: true,
                IdCardWarnMessage: '身份证不能为空'
            })
            return;
        }
        users.forEach(item => {
            if (item.isSelect == true) {
                item.userName = userName
                item.phone = phone
                item.sex = sex
                item.idCard = idCard
                item.idType = idType
            }
        })
        userNameShow = userName
        phoneShow = phone
        idCardShow = idCard
        sexShow = sex
        value1Show = value1
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
        })
    },
    handleDelete() {
        this.setData({
            iosDialog: true
        })
    },
    addNew() {
        let {users} = this.data
        if (users.length >= 4) {
            wx.showToast({
                title: '最多可添加4位',
                icon: 'none'
            })
        } else {
            this.setData({
                userName: '',
                phone: '',
                idCard: '',
                value1: 0,
                dialog2: true,
            })
        }
    },
    edit() {
        let {userNameShow, phoneShow, sexShow, value1Show, idCardShow} = this.data
        this.setData({
            userName: userNameShow,
            phone: phoneShow,
            idCard: idCardShow,
            sex: sexShow,
            value1: value1Show,
            dialog3: true,
            isNameCurrentWaring: false,
            isPhoneCurrentWaring: false,
            isIdCardCurrentWaring: false,
        })
    },
    //切换选中
    userChoose(e) {
        let {users, userNameShow, phoneShow, idCardShow} = this.data
        users.forEach(item => {
            if (item.userName === e.currentTarget.dataset.user.userName) {
                item.isSelect = true
                userNameShow = item.userName
                phoneShow = item.phone
                idCardShow = item.idCard
                return true
            } else {
                item.isSelect = false
                return false
            }
        });
        this.setData({
            users,
            userNameShow,
            phoneShow,
            idCardShow
        })
    },
    cancel() {
        this.setData({
            iosDialog: false
        })
    },
    deleteItem() {
        let {users, userNameShow} = this.data
        for (let index in users) {
            if (users[index].userName === userNameShow) {
                users.splice(index, 1)
            }
        }
        this.setData({
            users,
            iosDialog: false
        })
    },
    bindPickerChange(e) {
        this.setData({
            value1: e.detail.value
        })
    },
    bindPickerChange1(e) {
        this.setData({
            value2: e.detail.value
        })
    },
    //性别
    radioChange(e) {
        console.log(e.detail.value);
        this.setData({
            sex: e.detail.value
        })
    },
    onCurrentInput(e) {
        const currentValue = e.detail.value;
        let myReg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        if (!myReg.test(currentValue)) {
            this.setData({
                isCurrentWaring: true,
                warnMessage: '输入手机号格式不正确'
            });
        } else {
            this.setData({
                isCurrentWaring: false,
            });
        }
    },
    handleUserName(e) {
        if (e.detail.value == '') {
            this.setData({
                isNameCurrentWaring: true,
                nameWarnMessage: '姓名不能为空',
                userName: ''
            })
        } else {
            this.setData({
                userName: e.detail.value,
                isNameCurrentWaring: false
            })
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
                isPhoneCurrentWaring: false,
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
                isIdCardCurrentWaring: false,
            });
        }
    },
    open() {
        this.setData({
            dialog: true
        })
    },
    open1() {
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
            dialog2: false
        })
    },
    close2() {
        this.setData({
            dialog3: false
        })
    },
    dayClick(e) {
        //设置只能选一天
        this.setData({
            days_style: []
        })
        let {days_style, selectDay, today, yesterday, tomorrow} = this.data
        //今天
        let str = util.GetDateStr(0)
        //下一天
        let preStr = util.GetDateStr1(str, -1)
        console.log(e.detail.day);
        days_style.push({month: 'current', day: e.detail.day, color: 'white', background: '#aad4f5'},)
        selectDay = `${e.detail.year}-${(e.detail.month + '').padStart(2, '0')}-${(e.detail.day + '').padStart(2, '0')}`
        yesterday = util.GetWeekStr(selectDay, -1)
        today = util.GetWeekStr(selectDay, 0)
        tomorrow = util.GetWeekStr(selectDay, 1)
        if (str > selectDay) {//选中日期比今天小 6 7 8  5 6 7
            if (preStr <= selectDay) {
                this.setData({
                    showYesterday: false,
                    showDay: false,
                    showTomorrow: true
                })
            } else {
                this.setData({
                    showYesterday: false,
                    showDay: false,
                    showTomorrow: false
                })
            }
        } else if (str < selectDay) {//选中日期比今天大
            this.setData({
                showYesterday: true,
                showDay: true,
                showTomorrow: true
            })
        } else { //就是今天
            this.setData({
                showYesterday: false,
                showDay: true,
                showTomorrow: true
            })
        }
        this.setData({
            days_style,
            selectDay,
            today,
            yesterday,
            tomorrow
        })
    },
    preDay() {
        //设置只能选一天
        this.setData({
            days_style: []
        })
        let {selectDay, today, yesterday, tomorrow, days_style} = this.data
        let str = util.GetDateStr(0)
        selectDay = util.GetDateStr1(selectDay, -1)
        yesterday = util.GetWeekStr(selectDay, -1)
        today = util.GetWeekStr(selectDay, 0)
        tomorrow = util.GetWeekStr(selectDay, 1)
        days_style.push({month: 'current', day: util.GetDay(selectDay), color: 'white', background: '#aad4f5'},)
        if (str >= selectDay) {
            this.setData({
                showYesterday: false
            })
        }
        this.setData({
            yesterday,
            today,
            tomorrow,
            selectDay,
            days_style
        })
    },
    nextDay() {
        //设置只能选一天
        this.setData({
            days_style: []
        })
        let {selectDay, today, yesterday, tomorrow, days_style} = this.data
        let str = util.GetDateStr(0)
        selectDay = util.GetDateStr1(selectDay, 1)
        console.log(selectDay);
        yesterday = util.GetWeekStr(selectDay, -1)
        today = util.GetWeekStr(selectDay, 0)
        tomorrow = util.GetWeekStr(selectDay, 1)
        days_style.push({month: 'current', day: util.GetDay(selectDay), color: 'white', background: '#aad4f5'},)
        if (str < selectDay) {
            this.setData({
                showYesterday: true,
                showDay: true
            })
        } else {
            this.setData({
                showYesterday: false,
                showDay: true
            })
        }
        this.setData({
            yesterday,
            today,
            tomorrow,
            selectDay,
            days_style
        })
    },
    confirmDate() {
        this.setData({
            dialog: false
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let date = new Date()
        let day = date.getDate()
        let {days_style, yesterday, today, tomorrow, selectDay} = this.data
        days_style.push({month: 'current', day: day, color: 'white', background: '#aad4f5'},)
        //获取当天日期 2021-07-08
        let str = util.GetDateStr(0)
        selectDay = str
        yesterday = util.GetWeekStr(str, -1)
        today = util.GetWeekStr(str, 0)
        tomorrow = util.GetWeekStr(str, 1)
        this.setData({
            days_style,
            yesterday,
            today,
            tomorrow,
            selectDay
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
})