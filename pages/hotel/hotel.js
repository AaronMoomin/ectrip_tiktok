// pages/hotel/hotel.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        currentIndex: 1,
        //标签index
        dateGlobal: '2021-07-06',
        dateGlobal2: '2021-07-06',
        today: '',
        tomorrow: '',
        yearT: '',
        yearN: '',
        weekT: '',
        //周几
        weekN: '',
        //周几
        index: 1,
        index1: 0,
        array: [0, 1, 2],
        adults: 1,
        // 大人
        childrens: 0,
        // 小孩
        address: '福州'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //初始化日期
        this.handleDate(); //    获取位置
    },
    // 跳转酒店详情
    toHotelDetail(e){
        tt.navigateTo({
            url:"/pages/hotelDetail/hotelDetail?name="+e.currentTarget.dataset.name
        })
    },
    toHotelSearch(){
        tt.navigateTo({
            url:"/pages/hotelSearch/hotelSearch"
        })
    },
    //点击预定
    handleReserve() {
        let {
            currentIndex,
            dateGlobal,
            dateGlobal2,
            adults,
            childrens
        } = this.data;
        let type = '';

        switch (currentIndex) {
            case 1:
                type = '酒店';
                break;

            case 2:
                type = '民宿';
                break;

            case 3:
                type = '钟点房';
                break;
        }

        console.log(`${type},${dateGlobal},${dateGlobal2},${adults},${childrens}`);
    },

    handleCurrentIndex(event) {
        let index = event.currentTarget.dataset.index;
        index *= 1;
        let {
            currentIndex
        } = this.data;

        switch (index) {
            case 1:
                currentIndex = 1;
                break;

            case 2:
                currentIndex = 2;
                break;

            case 3:
                currentIndex = 3;
                break;
        }

        this.setData({
            currentIndex
        });
    },

    handleDate() {
        let {
            dateGlobal,
            dateGlobal2,
            yearT,
            yearN,
            today,
            tomorrow,
            weekT,
            weekN
        } = this.data;
        const weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        let date = new Date();
        let year = date.getFullYear();
        let week = date.getDay();
        weekT = weekday[week];
        let month = date.getMonth() + 1 + ''; // 月

        month = month.padStart(2, '0');
        let day = date.getDate() + ''; // 日

        day = day.padStart(2, '0');
        yearT = `${year}-${month}-${day}`;
        dateGlobal = yearT;
        today = `${month}月${day}日`;
        date = date.setDate(date.getDate() + 1);
        date = new Date(date);
        year = date.getFullYear();
        week = date.getDay();
        weekN = weekday[week];
        let nextMonth = date.getMonth() + 1 + ''; // 月

        nextMonth = nextMonth.padStart(2, '0');
        let nextDay = date.getDate() + ''; // 日

        nextDay = nextDay.padStart(2, '0');
        tomorrow = `${nextMonth}月${nextDay}日`;
        yearN = `${year}-${nextMonth}-${nextDay}`;
        dateGlobal2 = yearN;
        this.setData({
            today,
            tomorrow,
            weekT,
            weekN,
            yearT,
            yearN,
            dateGlobal,
            dateGlobal2
        });
    },
    getLocation() {
        tt.authorize({
            scope: "scope.userLocation",
            success: (res) => {
              tt.getLocation({
                type: "gjc02",
                success: res => {
                  tt.chooseLocation({
                    success: value => {
                      this.setData({
                        address: value.name
                      });
                    }
                  });
                },
                fail(err) {
                  console.log(err);
                }
              });
                    },
            fail: (err) => {
              console.log(err);
            }
      })


    },

    bindDateChange(e) {
        let {
            yearT,
            dateGlobal,
            dateGlobal2,
            yearN,
            today,
            tomorrow,
            weekT,
            weekN
        } = this.data;
        const weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        var date = new Date(e.detail.value);

        if (e.currentTarget.dataset.type === 'pre') {
            let year = date.getFullYear();
            var week = date.getDay();
            weekT = weekday[week];
            let month = date.getMonth() + 1 + ''; // 月

            month = month.padStart(2, '0');
            let day = date.getDate() + ''; // 日

            day = day.padStart(2, '0');
            today = `${month}月${day}日`;
            yearT = `${year}-${month}-${day}`;
            dateGlobal = yearT;
            date = date.setDate(date.getDate() + 1);
            date = new Date(date);
            year = date.getFullYear();
            week = date.getDay();
            weekN = weekday[week];
            let nextMonth = date.getMonth() + 1 + ''; // 月

            nextMonth = nextMonth.padStart(2, '0');
            let nextDay = date.getDate() + ''; // 日

            nextDay = nextDay.padStart(2, '0');
            tomorrow = `${nextMonth}月${nextDay}日`;
            yearN = `${year}-${nextMonth}-${nextDay}`;
            dateGlobal2 = yearN;
        } else {
            date = new Date(e.detail.value);
            let year = date.getFullYear();
            week = date.getDay();
            weekN = weekday[week];
            let nextMonth = date.getMonth() + 1 + ''; // 月

            nextMonth = nextMonth.padStart(2, '0');
            let nextDay = date.getDate() + ''; // 日

            nextDay = nextDay.padStart(2, '0');
            tomorrow = `${nextMonth}月${nextDay}日`;
            yearN = `${year}-${nextMonth}-${nextDay}`;
            dateGlobal2 = yearN;
        }

        this.setData({
            dateGlobal,
            today,
            tomorrow,
            weekT,
            weekN,
            yearN,
            dateGlobal2,
            yearT
        });
    },

    bindPickerChange: function (e) {
        let {
            index,
            index1,
            adults,
            childrens
        } = this.data;

        if (e.currentTarget.dataset.type === 'adult') {
            index = e.detail.value;
            adults = index;
        } else {
            index1 = e.detail.value;
            childrens = index1;
        }

        this.setData({
            index,
            index1,
            adults,
            childrens
        });
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