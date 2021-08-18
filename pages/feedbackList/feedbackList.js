const request = require("../../utils/request")
const base64 = require("../../utils/base64.js")
const app = getApp()
Page({
    data: {
        feedbackList:[],
        selected:['登录注册','门票','周边地图','特产','精品路线','美食','城市服务','其他'],
    },
    toFeedback(){
        tt.navigateTo({
            url:'/pages/feedback/feedback'
        })
    },
    async getFeedbackList() {
        tt.showLoading({
            title:'加载中...'
        })
        await request.myRequest(
            '/tiktok/personCenter/feedback/list',
            {
                openid:app.globalData.openid
            },
            'get',
            'application/x-www-form-urlencoded'
        ).then(res=>{
            tt.hideLoading()
            console.log(res);
            let list = res.data.data.pageInfo.records
            for (let item of list) {
                item.feedbackImageList = JSON.parse(item.feedbackImageList)
                item.feedbackTime = item.feedbackTime.split(' ')[0]
            }
            this.setData({
                feedbackList:res.data.data.pageInfo.records
            })
            console.log(res);
        }).catch(err=>{
            console.log(err);
        })
    },
    previewImage(e) {
        let index = e.currentTarget.dataset.index
        let j = e.currentTarget.dataset.j
        let {feedbackList} = this.data
        tt.previewImage({
            current: feedbackList[index].feedbackImageList[j],
            urls: feedbackList[index].feedbackImageList,
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

    },
    onShow: function () {
        this.getFeedbackList()
    },
    onHide: function () {
        tt.hideLoading()
    }
});