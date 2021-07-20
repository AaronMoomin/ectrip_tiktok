let util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    yesterday: '',
    today: '',
    tomorrow: '',
    showYesterday: false,
    showDay: true,
    showTomorrow: true,
    selectDay: '',
    dialog:false,
  },
  toRouteReserve(){
    tt.navigateTo({
      url:"/pages/routeReserve/routeReserve"
    })
  },
  dateChange(e) {
    console.log("现在日期是", e.detail.dateString)
    this.setData({
      dateString: e.detail.dateString,
      selectDay: e.detail.dateString
    })
    this.dayClick(e)
  },
  dayClick(e) {
    let {
      selectDay,
      today,
      yesterday,
      tomorrow
    } = this.data; //今天

    let str = util.GetDateStr(0); //下一天

    let preStr = util.GetDateStr1(str, -1);
    yesterday = util.GetWeekStr(selectDay, -1);
    today = util.GetWeekStr(selectDay, 0);
    tomorrow = util.GetWeekStr(selectDay, 1);

    if (str > selectDay) {
      //选中日期比今天小 6 7 8  5 6 7
      if (preStr <= selectDay) {
        this.setData({
          showYesterday: false,
          showDay: false,
          showTomorrow: true
        });
      } else {
        this.setData({
          showYesterday: false,
          showDay: false,
          showTomorrow: false
        });
      }
    } else if (str < selectDay) {
      //选中日期比今天大
      this.setData({
        showYesterday: true,
        showDay: true,
        showTomorrow: true
      });
    } else {
      //就是今天
      this.setData({
        showYesterday: false,
        showDay: true,
        showTomorrow: true
      });
    }

    this.setData({
      selectDay,
      today,
      yesterday,
      tomorrow
    });
  },

  preDay() {
    let {
      selectDay,
      today,
      yesterday,
      tomorrow
    } = this.data;
    let str = util.GetDateStr(0);
    selectDay = util.GetDateStr1(selectDay, -1);
    yesterday = util.GetWeekStr(selectDay, -1);
    today = util.GetWeekStr(selectDay, 0);
    tomorrow = util.GetWeekStr(selectDay, 1);

    if (str >= selectDay) {
      this.setData({
        showYesterday: false
      });
    }

    this.setData({
      yesterday,
      today,
      tomorrow,
      selectDay
    });
  },

  nextDay() {
    let {
      selectDay,
      today,
      yesterday,
      tomorrow
    } = this.data;
    let str = util.GetDateStr(0);
    selectDay = util.GetDateStr1(selectDay, 1);
    yesterday = util.GetWeekStr(selectDay, -1);
    today = util.GetWeekStr(selectDay, 0);
    tomorrow = util.GetWeekStr(selectDay, 1);

    if (str < selectDay) {
      this.setData({
        showYesterday: true,
        showDay: true
      });
    } else {
      this.setData({
        showYesterday: false,
        showDay: true
      });
    }

    this.setData({
      yesterday,
      today,
      tomorrow,
      selectDay
    });
  },
  open(){
    this.setData({
      dialog:true
    })
  },
  close(){
    this.setData({
      dialog:false
    })
  },
  confirmDate() {
    this.setData({
      dialog: false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = new Date();
    let day = date.getDate();
    let {
      yesterday,
      today,
      tomorrow,
      selectDay
    } = this.data;
    //获取当天日期 2021-07-08
    let str = util.GetDateStr(0);
    selectDay = str;
    yesterday = util.GetWeekStr(str, -1);
    today = util.GetWeekStr(str, 0);
    tomorrow = util.GetWeekStr(str, 1);
    this.setData({
      yesterday,
      today,
      tomorrow,
      selectDay
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
});