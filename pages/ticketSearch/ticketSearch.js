const request = require('../../utils/request')
const base64 = require("../../utils/base64.js")
Page({
    data: {
        value:'',
        goodsList:[],
        size:5,
    },
    toTicketDetail(e) {
        let name = e.currentTarget.dataset.name;
        let id = e.currentTarget.dataset.id;
        tt.navigateTo({
            url: `/pages/ticketDetail/ticketDetail?id=${id}&name=${name}`
        });
    },
    async getSearch(size,content=this.data.value) {
        tt.showLoading({title: '加载中...'})
        let obj = JSON.stringify({
            "categoryId": 1,
            "city": "",
            "content": content,
            "endDate": "",
            "orderBy": 0,
            "startDate": "",
            "current": 0,
            "size": size,
            "themeId": ""
        })
        let object = base64.encode(obj)
        await request.myRequest(
            '/tiktok/mutual/goods',
            {
                data: object,
                signed: '111'
            },
            'post',
        ).then(res => {
            tt.hideLoading()
            let {goodsList} = this.data
            goodsList = []
            for (let resItem of res.data.data) {
                resItem.imageList = JSON.parse(resItem.imageList)
                goodsList.push(resItem)
            }
            console.log(goodsList);
            this.setData({
                goodsList
            })
        }).catch(err => {
            tt.hideLoading()
            console.log(err);
        })
    },
    onLoad: function (options) {
        this.setData({
            value:options.value
        })
        this.getSearch(5,this.data.value)
    },
    onReachBottom: function () {
        console.log('别啦了');
        let {size} = this.data
        size+=1
        this.setData({
            size
        })
        tt.showLoading({title:'加载更多'})
        this.getSearch(size)
    },
});