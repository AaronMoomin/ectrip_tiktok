const request = require("../../utils/request")
const base64 = require("../../utils/base64.js")
const app = getApp()
Page({
    data: {
        commentList:[],
    },
    async getCommentList() {
        tt.showLoading({
            title: "加载中..."
        })
        await request.myRequest(
            '/tiktok/personCenter/comment/list',
            {
                goodsId:0,
                openid:app.globalData.openid
            },
            'get',
            'application/x-www-form-urlencoded'
        ).then(res=>{
            tt.hideLoading()
            let list = res.data.data.list
            for (let item of list) {
                item.commentImageList = JSON.parse(item.commentImageList)
            }
            this.setData({
                commentList:list
            })
            console.log(this.data.commentList);
        }).catch(err=>{
            console.log(err);
        })
    },
    previewImage(e) {
        let index = e.currentTarget.dataset.index
        let j = e.currentTarget.dataset.j
        let {commentList} = this.data
        console.log(commentList);
        tt.previewImage({
            current: commentList[index].commentImageList[j],
            urls: commentList[index].commentImageList,
            success: res => {
                console.log('success');
            },
            fail: err => {
                tt.showModal({
                    title: "预览失败",
                    content: err.errMsg,
                    showCancel: false,
                });
            }
        })
    },
    onLoad: function (options) {
        this.getCommentList()
    },
    onHide:function () {
        tt.hideLoading()
    }
});