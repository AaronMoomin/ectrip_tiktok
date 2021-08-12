const request = require("../../utils/request");
const base64 = require("../../utils/base64");
Page({
    data: {
        orderCode: '',
        createTime:'',
        dialog1: false,
        isPeople: false,//是否联系人
        index:0,//游客序号
        array: ['身份证', '护照', '军官证', '台胞证', '港澳通行证', '其他'],
        array1: ['ID_CARD','HUZHAO','JUNGUAN','TAIBAO','GANGAO','OTHER'],
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
    },
    open(e) {
        let {
            value1,
            name,
            phone,
            idCard,
            address,
            isPeople,
            index
        } = this.data
        let people = e.currentTarget.dataset.people
        let i = e.currentTarget.dataset.index
        if (people.contactName) {//编辑联系人
            name = people.contactName
            phone = people.contactPhone
            idCard = people.credentials
            value1 = people.credentialsType
            isPeople = true
        } else {//编辑游客
            name = people.name
            phone = people.phone
            idCard = people.credentials
            value1 = people.credentialsType
            isPeople = false
            index = i
        }
        this.setData({
            dialog1: true,
            name,
            phone,
            idCard,
            value1,
            isPeople,
            index
        })
    },
    close() {
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
    async feeChange() {
        tt.showLoading({
            title: '改签中...'
        })
        let {orderInfo, orderPassenger,array1,orderCode,createTime} = this.data
        let visitPersons = []
        for (let item of orderPassenger) {
            visitPersons.push({
                credentials: item.credentials,
                credentialsType:array1[item.credentialsType],
                mobile: item.phone,
                name: item.name
            })
        }

        let obj = JSON.stringify({
            contactPerson: {
                credentials: orderInfo.credentials,
                credentialsType:array1[orderInfo.credentialsType],
                mobile: orderInfo.contactPhone,
                name: orderInfo.contactName
            },
            orderCode,
            visitDate: createTime,
            visitPersons
        })
        let object = base64.encode(obj)
        console.log(JSON.parse(obj));
        await request.myRequest(
            '/tiktok/mutual/pushOrder',
            {
                data:object,
                signed:'feeChange'
            },
            'post'
        ).then(res=>{
            tt.hideLoading()
            console.log(res);
            if (res.data.code==200){
                tt.showToast({
                    title:res.data.data.responseHeader.resultMessage
                })
                tt.navigateBack()
            }
        }).catch(err => {
            tt.hideLoading()
            console.log(err);
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
        if (e.detail.value == '') {
            this.setData({
                isAddressCurrentWaring: true,
                addressWarnMessage: '地址不能为空',
                address: ''
            });
        } else {
            this.setData({
                address: e.detail.value,
                isAddressCurrentWaring: false
            });
        }
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
    confirmEdit() {
        let {isPeople,name,phone,idCard,orderInfo,orderPassenger,value1,index} = this.data
        if (isPeople){//是联系人
            orderInfo.contactName = name
            orderInfo.contactPhone = phone
            orderInfo.credentials = idCard
            orderInfo.credentialsType = value1
        }else{
            orderPassenger[index].name = name
            orderPassenger[index].phone = phone
            orderPassenger[index].credentials = idCard
            orderPassenger[index].credentialsType = value1
        }
        this.setData({
            orderInfo,
            orderPassenger,
            dialog1: false
        })
    },
    async getOrder() {
        tt.showLoading({
            title: '加载中...'
        })
        let {orderCode} = this.data
        await request.myRequest(
            '/tiktok/personCenter/order/Detail',
            {
                orderCode
            },
            'get',
            'application/x-www-form-urlencoded'
        ).then(res => {
            tt.hideLoading()
            console.log(res);
            // res.data.data.orderInfo.createDate = res.data.data.orderInfo.createDate.split(' ')[0]
            // res.data.data.orderInfo.visitDate = res.data.data.orderInfo.visitDate.split(' ')[0]
            this.setData({
                orderInfo: res.data.data.orderInfo,
                orderList: res.data.data.orderList,
                orderPassenger: res.data.data.orderPassenger,
                qrCodeDto: res.data.data.qrCodeDto
            })
        }).catch(err => {
            console.log(err);
        })
    },
    onLoad: function (options) {
        console.log(options);
        this.setData({
            orderCode: options.ordercode,
            createTime:options.createTime,
        })
        this.getOrder()
    },
    onHide: function () {
        tt.hideLoading()
    }
});