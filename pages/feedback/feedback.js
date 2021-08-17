const request = require("../../utils/request")
const base64 = require("../../utils/base64.js")
const app = getApp()
Page({
    data: {
        imagesList: [],
        isSelect:[false,false,false,false,false,false,false,false],
        selected:['登录注册','门票','周边地图','特产','精品路线','美食','城市服务','其他'],
        textareaValue:'',
    },
    //选择场景
    selectItem(e){
        let {isSelect} = this.data
        let index = e.currentTarget.dataset.index*1
        for (let i in isSelect) {
            isSelect[i] = false
            if (i==index){
                isSelect[i] = true
            }
        }
        this.setData({
            isSelect
        })
    },
    //获取反馈问题
    handleInput(e){
       this.setData({
           textareaValue:e.detail.value
       })
    },
    async feeBack() {
        let {isSelect, textareaValue, imagesList} = this.data
        let selected = ''
        for (let i in isSelect) {
            if (isSelect[i]) {
                selected = i
            }
        }
        if (selected == '') {
            tt.showToast({
                title: '请选择场景',
                icon: 'none'
            })
            return
        } else if (textareaValue == '') {
            tt.showToast({
                title: '请输入文字反馈',
                icon: 'none'
            })
            return
        }
        let obj = JSON.stringify({
            "feedbackImageList": imagesList,
            "feedbackName": selected,
            "feedbackText": textareaValue,
            "feedbackTime": "",
            "id": 0,
            "openId": app.globalData.openid
        })
        let object = base64.encode(obj)
        console.log(JSON.parse(obj));
        await request.myRequest(
            '/tiktok/personCenter/feedback/add',
            {
                data:object,
                signed:'feeBack'
            },
            'post'
        ).then(res=>{
            tt.showToast({
                title: '反馈成功'
            })
            tt.navigateBack()
            console.log(res);
        }).catch(err => {
            console.log(err);
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
                                if (res.confirm) {
                                    console.log('用户点击确定')
                                }
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
    onLoad: function (options) {

    }
});