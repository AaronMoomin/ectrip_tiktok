Page({
    /**
     * 页面的初始数据
     */
    data: {
        name: '',
        imagesList:[],
        select:[false,false,false,false,false],
        value: "",
    },
    onTextFocus: function (e) {
        console.log(e);
    },
    onTextBlur: function (e) {
        console.log(e);
    },
    onTextInput: function (e) {
        this.setData({
            value: e.detail.value,
        });
    },
    handleSelect(e){
        let {select} = this.data
        let index = e.currentTarget.dataset.index
        console.log(index);
        for (let i=0;i<index+1;i++){
            select[i] = true
        }
        for (let j = index+1; j <=select.length ; j++) {
            select[j] = false
        }
        this.setData({
            select
        })
    },
    uploader() {
        var that = this;
        let imagesList = [];
        let maxSize = 1024 * 1024;
        let maxLength = 3;
        let flag = true;
        tt.chooseImage({
            count: 6, //最多可以选择的图片总数
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                tt.showToast({
                    title: '正在上传...',
                    icon: 'loading',
                    mask: true,
                    duration: 500
                })
                for (let i = 0; i < res.tempFiles.length; i++) {
                    if (res.tempFiles[i].size > maxSize) {
                        flag = false;
                        console.log(111)
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
                    console.log('222');
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
                    url: 'https://shop.gxyourui.cn',
                    filePath: res.tempFilePaths[0],
                    name: 'images',
                    header: {
                        "Content-Type": "multipart/form-data",
                        'Content-Type': 'application/json'
                    },
                    success: function (data) {
                        console.log(data);
                    },
                    fail: function (data) {
                        console.log(data);
                    }
                })
                console.log(res);
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
        this.setData({
            name: options.name
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