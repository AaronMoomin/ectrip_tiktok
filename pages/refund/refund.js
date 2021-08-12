const request = require('../../utils/request')
const base64 = require("../../utils/base64.js")
const app = getApp()
Page({
    data: {
        voteNum: '',
        index: '',
        price: '',
        nowPrice: '',
        dialog1: false,
        iosDialog2:false,
        orderInfo: '',
        orderList: '',
        orderPassenger: [],
        visitPersonsShow: [],
        textValue: '',
        openid: '',
        credentialstype: ['ID_CARD', 'HUZHAO', 'JUNGUAN', 'TAIBAO', 'GANGAO', 'OTHER'],
        rule: '',//规则
        realName: '',//实名制
        content:'',//退订信息
        selectStr:'全选',
    },
    async getRule() {
        await request.myRequest(
            '/tiktok/mutual/rule',
            {
                productId: this.data.orderList.productId,
                ruleId: 4
            },
            'get',
            'application/x-www-form-urlencoded'
        ).then(res => {
            this.setData({
                rule: res.data.data.ruleDesc
            })
        }).catch(err => {
            console.log(err);
        })
    },
    onTextInput(e) {
        this.setData({
            textValue: e.detail.value
        })
    },
    async refund() {
        tt.showLoading({
            title:'加载中...'
        })
        let {
            realName,
            voteNum,
            visitPersonsShow,
            textValue,
            orderList,
            openid,
            orderInfo,
            credentialstype,
            nowPrice,
            orderPassenger
        } = this.data
        if (textValue == '') {
            tt.showToast({
                title: '请输入退订理由',
                icon: 'fail',
            })
            return
        }
        let visitPersons = []
        for (let item of orderPassenger) {
            if (item.checked){
                voteNum++
            }else {
                voteNum--
            }
            visitPersons.push({
                credentials: item.credentials,
                credentialsType: credentialstype[item.credentialsType],
                mobile: item.phone,
                name: item.name
            })
        }
        let obj = JSON.stringify({
            openid,
            "orderCode": orderInfo.orderCode,
            "refundMoney": nowPrice * 100,
            "refundQuantity": voteNum,
            "refundReason": textValue,
            visitPersons
        })
        console.log(JSON.parse(obj));
        let object = base64.encode(obj)
        await request.myRequest(
            '/tiktok/mutual/refundOrder',
            {
                data: object,
                signed: 'refund'
            },
            'post'
        ).then(res => {
            tt.hideLoading()
            console.log(res);
            if (res.data.code==200){
                this.setData({
                    iosDialog2:true,
                    content:res.data.data.responseHeader.resultMessage
                })
            }else if (res.data.code == 500) {
                this.setData({
                    iosDialog2:true,
                    content:res.data.message
                })
            }
        }).catch(err => {
            tt.hideLoading()
            console.log(err);
        })
    },
    selectAll(){
        let {orderPassenger,selectStr,nowPrice,price} = this.data
        console.log(orderPassenger);
        if (selectStr=='全选'){
            for (let item of orderPassenger) {
                item.checked = true
                nowPrice+=price
            }
            this.setData({
                selectStr:'全不选'
            })
        }else {
            for (let item of orderPassenger) {
                item.checked = false
                nowPrice-=price
            }
            this.setData({
                selectStr:'全选'
            })
        }

        this.setData({
            orderPassenger
        })
    },
    checkboxChange(e) {
        let {orderPassenger,nowPrice,price,voteNum} = this.data
        for (let person of orderPassenger) {
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
        nowPrice = price*e.detail.value.length
        voteNum = e.detail.value.length
        this.setData({
            orderPassenger,
            nowPrice,
            voteNum
        })
    },
    confirmVisitor() {
        let {orderPassenger, visitPersonsShow} = this.data
        for (let visitPerson of orderPassenger) {
            if (visitPerson.checked) {
                if (visitPersonsShow.indexOf(visitPerson) == -1) {
                    visitPersonsShow.push(visitPerson)
                }
                visitPerson.checked = false
            }
        }
        this.setData({
            orderPassenger,
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
    open1() {
        this.setData({
            dialog1: true
        });
    },
    close1() {
        this.setData({
            dialog1: false
        });
    },
    close2() {
        this.setData({
            iosDialog2: false
        });
        tt.navigateBack()
    },

    //获取票数
    getIndex(e) {
        let {
            index
        } = e.detail;
        let {
            voteNum,
            price,
            nowPrice
        } = this.data;
        if (voteNum >= index) {
            nowPrice -= price
        } else{
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
    onLoad: function (options) {
        options.orderpassenger = JSON.parse(options.orderpassenger)
        for (let item of options.orderpassenger) {
            item.checked = true
        }
        this.setData({
            orderInfo: JSON.parse(options.orderinfo),
            orderList: JSON.parse(options.orderlist),
            orderPassenger:options.orderpassenger
        })
        let {orderInfo, orderList, orderPassenger,nowPrice} = this.data
        if (this.data.orderPassenger.length == 0) {//?不是实名制
            this.setData({
                realName: false,
                nowPrice: orderList.totalMoney,
                voteNum: 1,
            })
        } else {
            this.setData({
                realName: true,
                nowPrice: orderList.price*orderPassenger.length,
                voteNum: 0,
            })
        }
        this.setData({
            price: orderList.price,
            openid: app.globalData.openid
        })
        console.log(this.data.orderInfo);
        console.log(this.data.orderList);
        console.log(this.data.orderPassenger);
        this.getRule()
    },
    onHide:function(){
        tt.hideLoading()
    }
});