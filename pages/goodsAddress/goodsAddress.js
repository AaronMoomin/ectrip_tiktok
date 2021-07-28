Page({
    data: {
        addressList: [
            {
                uid: 0, name: '张三', address: '地址地址地址地址地址地址地址地址地址地址地址地址',
                phone: 1888888888
            },
            {
                uid: 1, name: '张三1', address: '地址111地址地址地址地址地址地址地址地址地址地址地址',
                phone: 1822228888
            }
        ],
        uid: 0,
        dialog: false,
        dialog1: false,
        iosDialog:false,
        name: '',
        isNameCurrentWaring: false,
        nameWarnMessage: '',
        phone: '',
        isPhoneCurrentWaring: false,
        phoneWarnMessage: '',
        address: '',
        isAddressCurrentWaring: false,
        addressWarnMessage: '',
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
    edit(e) {
        this.setData({
            dialog1: true,
            uid:e.currentTarget.dataset.item.uid,
            name: e.currentTarget.dataset.item.name,
            address: e.currentTarget.dataset.item.address,
            phone: e.currentTarget.dataset.item.phone,
        })
    },
    confirm() {
        let {uid, name, phone, address, addressList} = this.data
        if (name == '') {
            tt.showToast({
                title: '请填写姓名',
                icon: 'none'
            })
            return
        }
        if (phone == '') {
            tt.showToast({
                title: '请填写手机',
                icon: 'none'
            })
            return
        }
        if (address == '') {
            tt.showToast({
                title: '请填写地址',
                icon: 'none'
            })
            return
        }
        uid = uid++
        let addressItem = {
            uid,
            name,
            phone,
            address
        }
        addressList.push(addressItem);
        this.setData({
            addressList,
            name: '',
            phone: '',
            address: '',
            dialog: false
        })
    },
    confirmEdit() {
        let {uid,name, phone, address, addressList} = this.data
        if (name == '') {
            tt.showToast({
                title: '请填写姓名',
                icon: 'none'
            })
            return
        }
        if (phone == '') {
            tt.showToast({
                title: '请填写手机',
                icon: 'none'
            })
            return
        }
        if (address == '') {
            tt.showToast({
                title: '请填写地址',
                icon: 'none'
            })
            return
        }
        addressList.find(item=>{
            if (item.uid==uid){
                item.name=name
                item.phone = phone
                item.address= address
            }
        })
        this.setData({
            addressList,
            dialog1:false,
            name:'',
            phone: '',
            address: '',
        })
    },
    del(e){
        this.setData({
            iosDialog:true,
            uid:e.currentTarget.dataset.item.uid,
        })
    },
    deleteItem(){
        let {addressList,uid} = this.data
        for (let i in addressList) {
            if (addressList[i].uid==uid){
                addressList.splice(i,1)
            }
        }
        this.setData({
            addressList,
            iosDialog: false
        })
    },
    open() {
        this.setData({
            dialog: true,
            name:'',
            phone: '',
            address: '',
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
    cancel(){
        this.setData({
            iosDialog: false
        })
    },
    onLoad: function (options) {

    }
});