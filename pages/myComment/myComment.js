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
    onLoad: function (options) {
        this.getCommentList()
    },
    onHide:function () {
        tt.hideLoading()
    }
});