Page({
    data: {
        imagesList: [],
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
    onLoad: function (options) {

    }
});