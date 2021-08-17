const request = require('../../utils/request')
const base64 = require("../../utils/base64.js")
Page({
    /**
     * 页面的初始数据
     */
    data: {
        pid: 0,
        peopleList: [],
        dialog: false,
        dialog1: false,
        iosDialog: false,
        idCardType: '身份证',
        array: ['身份证', '护照', '军官证', '台胞证', '港澳通行证', '其他', '学生证'],
        value1: 0,
        name: '',
        isNameCurrentWaring: false,
        nameWarnMessage: '',
        sex: '男',
        phone: '',
        isPhoneCurrentWaring: false,
        phoneWarnMessage: '',
        idCard: '',
        isIdCardCurrentWaring: false,
        IdCardWarnMessage: '',
        address: '',
        isAddressCurrentWaring: false,
        addressWarnMessage: '',
        openid: '',
        unionid: '',
    },
    // 常用联系人列表查询
    async getList() {
        let {openid} = this.data
        tt.showLoading({
            title: '加载中...'
        })
        await request.myRequest(
            '/tiktok/personCenter/contact/list',
            {
                openid
            },
            'get',
            'application/x-www-form-urlencoded'
        ).then(res => {
            tt.hideLoading()
            let contactList = res.data.data.contactList
            let {peopleList, array} = this.data
            peopleList = contactList
            for (const i in contactList) {
                peopleList[i].idCardType = array[contactList[i].credentialsType]
            }
            this.setData({
                peopleList
            })
            console.log(this.data.peopleList);
        }).catch(err => {
            tt.hideLoading()
            console.log(err);
        })
    },
    // 常用联系人新增和修改
    async addOrUpdate(id = '') {
        let {openid, unionid, name, phone, idCard, address, sex, array, value1, peopleList} = this.data
        let obj = JSON.stringify({
            "address": address.replace(/\s*/g, ""),
            "cellphone": phone.replace(/\s*/g, ""),
            "credentials": idCard.replace(/\s*/g, ""),
            "credentialsType": value1,
            id,
            "name": name.replace(/\s*/g, ""),
            "openid": openid,
            "unionid": unionid
        })
        let object = base64.encode(obj)
        let data = {
            "data": object,
            "signed": "addOrUpdate"
        }
        await request.myRequest(
            '/tiktok/personCenter/contact/addOrUpdate',
            data,
            'post'
        ).then(res => {
            console.log('加入成功');
            this.getList()
        }).catch(err => {
            console.log(err);
        })
    },
    del(e) {
        this.setData({
            iosDialog: true,
            pid: e.currentTarget.dataset.pid,
        })
    },
    async deleteItem() {
        let {peopleList, pid} = this.data

        await request.myRequest(
            '/tiktok/personCenter/contact/remove',
            {
                id: pid,
                openid: this.data.openid
            },
            'post',
            'application/x-www-form-urlencoded'
        ).then(res => {
            console.log(res);
            this.getList()
        }).catch(err => {
            console.log(err);
        })
        this.setData({
            peopleList,
            iosDialog: false
        })
    },
    edit(e) {
        let item = e.currentTarget.dataset.item
        this.setData({
            dialog1: true,
            pid: item.id,
            name: item.name,
            phone: item.cellphone,
            idCard: item.credentials,
            value1: item.credentialsType,
            idCardType: item.idCardType,
            address: item.address
        })
    },
    confirmEdit() {
        let {pid, name, phone, idCard, address, sex, array, value1, peopleList} = this.data
        if (name == '') {
            tt.showToast({
                title: '名字不能为空',
                icon: 'none'
            })
            return
        }
        if (idCard == '') {
            tt.showToast({
                title: '证件不能为空',
                icon: 'none'
            })
            return
        }
        if (phone == '') {
            tt.showToast({
                title: '电话不能为空',
                icon: 'none'
            })
            return
        }
        // if (address == '') {
        //     tt.showToast({
        //         title: '地址不能为空',
        //         icon: 'none'
        //     })
        //     return
        // }
        this.addOrUpdate(pid)
        this.setData({
            peopleList,
            dialog1: false,
            name: '',
            phone: '',
            idCard: '',
            sex: '男',
            address: '',
            value1: 0,
        })
    },
    confirm() {
        let {pid, name, phone, idCard, address, sex, array, value1, peopleList} = this.data
        if (name == '') {
            tt.showToast({
                title: '名字不能为空',
                icon: 'none'
            })
            return
        }
        if (idCard == '') {
            tt.showToast({
                title: '证件不能为空',
                icon: 'none'
            })
            return
        }
        if (phone == '') {
            tt.showToast({
                title: '电话不能为空',
                icon: 'none'
            })
            return
        }
        // if (address == '') {
        //     tt.showToast({
        //         title: '地址不能为空',
        //         icon: 'none'
        //     })
        //     return
        // }
        this.addOrUpdate()
        this.setData({
            dialog: false,
            name: '',
            phone: '',
            idCard: '',
            sex: '男',
            address: '',
            value1: 0,
        })
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
    handleAddress(e) {
        this.setData({
            address: e.detail.value,
            isAddressCurrentWaring: false
        });
    },
    handleUserName(e) {
        if (e.detail.value == '') {
            this.setData({
                isNameCurrentWaring: true,
                nameWarnMessage: '姓名不能为空',
                name: ''
            });
        } else {
            this.setData({
                name: e.detail.value,
                isNameCurrentWaring: false
            });
        }
    },
    //性别
    radioChange(e) {
        this.setData({
            sex: e.detail.value
        });
    },
    bindPickerChange(e) {
        this.setData({
            value1: e.detail.value
        });
    },
    open() {
        this.setData({
            dialog: true
        })
    },
    close() {
        this.setData({
            dialog: false,
            name: '',
            phone: '',
            idCard: '',
            sex: '男',
            value1: 0,
            address: ''
        })
    },
    close1() {
        this.setData({
            dialog1: false,
            name: '',
            phone: '',
            idCard: '',
            sex: '男',
            value1: 0,
            address: ''
        })
    },
    cancel() {
        this.setData({
            iosDialog: false
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        tt.getStorage({
            key: 'session',
            success: res => {
                let openid = res.data.openid
                let unionid = res.data.unionid
                this.setData({
                    openid: openid,
                    unionid: unionid,
                })
                this.getList()
            },
            fail: err => {
                console.log(err);
            }
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