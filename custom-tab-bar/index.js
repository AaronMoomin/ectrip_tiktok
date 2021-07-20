Component({
    data: {
        selected: 0,
        "color": "#8a8a8a",
        "selectedColor": "#ff935e",
        "backgroundColor": "white",
        "list": [
            {
                "selectedIconPath": "/static/icon/indexSelected.png",
                "iconPath": "/static/icon/index.png",
                "pagePath": "pages/index/index",
                "text": "w首页"
            },
            {
                "selectedIconPath": "/static/icon/destinationSelected.png",
                "iconPath": "/static/icon/destination.png",
                "pagePath": "pages/destination/destination",
                "text": "地图"
            },
            {
                "selectedIconPath": "/static/icon/serveSelected.png",
                "iconPath": "/static/icon/serve.png",
                "pagePath": "pages/serve/serve",
                "text": "服务"
            },
            {
                "selectedIconPath": "/static/icon/mineSelected.png",
                "iconPath": "/static/icon/mine.png",
                "pagePath": "pages/mine/mine",
                "text": "我的"
            }
        ]
    },
    methods: {
        switchTab(e) {
            const data = e.currentTarget.dataset
            const url = data.path
            tt.switchTab({url})
            this.setData({
                selected: data.index
            })
        }
    }

})