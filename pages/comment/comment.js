const request = require("../../utils/request")
const base64 = require("../../utils/base64.js")
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        name: '',
        goodsId:'',
        orderCode:'',
        imagesList:[],
        select:[false,false,false,false,false],
        selectIndex:0,//分数
        value: "",
        textareaValue:'',
    },
    async send() {
        let {name, goodsId, orderCode, imagesList, selectIndex, textareaValue} = this.data
        if (selectIndex == 0) {
            tt.showToast({
                title: '还未评分',
                icon: 'none'
            })
            return
        }
        let obj = JSON.stringify({
            "commentImageList": imagesList,
            "commentText": textareaValue,
            "commentTime": "",
            "goodsId": goodsId,
            "id": 0,
            "openId": app.globalData.openid,
            "orderCode": orderCode,
            "productId": 0,
            "remarknum": selectIndex,
            "status": 0,
            "supplierId": 0
        })
        console.log(JSON.parse(obj));
        let object = base64.encode(obj)
        await request.myRequest(
            '/tiktok/personCenter/comment/add',
            {
                data:object,
                signed:'addComment'
            },
            'post'
        ).then(res => {
            tt.showToast({
                title:'评论成功'
            })
            tt.navigateBack()
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
    },
    onTextInput(e){
        this.setData({
            textareaValue:e.detail.value
        })
    },
    handleSelect(e){
        let {select} = this.data
        let index = e.currentTarget.dataset.index
        for (let i in select) {
            select[i] = false
            if (i==index){
                for (let j=0;j<=index;j++){
                    select[j] = true
                }
            }
        }
        this.setData({
            select,
            selectIndex:index+1
        })
    },
    uploader() {
        var that = this;
        let imagesList = [];
        let maxSize = 1024 * 1024;
        let maxLength = 6;
        let flag = true;
        tt.chooseImage({
            count: 6, //最多可以选择的图片总数
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                console.log("图片列表",res);
                tt.showToast({
                    title: '正在上传...',
                    icon: 'loading',
                    mask: true,
                    duration: 500
                })
                for (let i = 0; i < res.tempFiles.length; i++) {
                    if (res.tempFiles[i].size > maxSize) {
                        flag = false;
                        wx.showModal({
                            content: '图片太大，不允许上传',
                            showCancel: false,
                            success: function (res) {

                            }
                        });
                    }
                }
                if (res.tempFiles.length > maxLength) {
                    tt.showModal({
                        content: '最多能上传' + maxLength + '张图片',
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                console.log('确定');
                            }
                        }
                    })
                }
                if (flag == true && res.tempFiles.length <= maxLength) {
                    that.setData({
                        imagesList: res.tempFilePaths
                    })
                }
                tt.uploadFile({
                    url: 'http://tour.12301cn.cn/file/up.do',
                    filePath: res.tempFilePaths[0],
                    name: 'images',
                    header: {
                        "Content-Type": "multipart/form-data",
                    },
                    success:(res=>{
                        console.log(res);
                    }),
                    fail: (err=>{
                        console.log(err);
                    })
                })
            },
            fail: function (res) {
                console.log(res);
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        this.setData({
            name: options.name,
            goodsId:options.id,
            orderCode:options.ordercode
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
});