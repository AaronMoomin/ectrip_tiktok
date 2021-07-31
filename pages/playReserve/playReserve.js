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
    isCollect:false,
  },
  handleCollect(){
    let {isCollect} = this.data
    if (isCollect) {
      tt.showToast({
        title:'取消收藏',
        icon: 'none'
      })
      isCollect = false
    }else {
      tt.showToast({
        title:'收藏成功',
        icon: 'none'
      })
      isCollect = true
    }
    this.setData({
      isCollect
    })
  },
  toRouteReserve(){
    tt.navigateTo({
      url:"/pages/routeReserve/routeReserve"
    })
  },
  formatTime(time, format) {
    function formatNumber(n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    }

    function getDate(time, format) {
      const formateArr = ['Y', 'M', 'D', 'h', 'm', 's']
      const returnArr = []
      const date = new Date(time)
      returnArr.push(date.getFullYear())
      returnArr.push(formatNumber(date.getMonth() + 1))
      returnArr.push(formatNumber(date.getDate()))
      returnArr.push(formatNumber(date.getHours()))
      returnArr.push(formatNumber(date.getMinutes()))
      returnArr.push(formatNumber(date.getSeconds()))
      for (const i in returnArr) {
        format = format.replace(formateArr[i], returnArr[i])
      }
      return format
    }

    function getDateDiff(time) {
      let r = ''
      const ft = new Date(time)
      const nt = new Date()
      const nd = new Date(nt)
      nd.setHours(23)
      nd.setMinutes(59)
      nd.setSeconds(59)
      nd.setMilliseconds(999)
      const d = parseInt((nd - ft) / 86400000)
      switch (true) {
        case d === 0:
          const t = parseInt(nt / 1000) - parseInt(ft / 1000)
          switch (true) {
            case t < 60:
              r = '刚刚'
              break
            case t < 3600:
              r = parseInt(t / 60) + '分钟前'
              break
            default:
              r = parseInt(t / 3600) + '小时前'
          }
          break
        case d === 1:
          r = '昨天'
          break
        case d === 2:
          r = '前天'
          break
        case d > 2 && d < 30:
          r = d + '天前'
          break
        default:
          r = getDate(time, 'Y-M-D')
      }
      return r
    }
    if (!format) {
      return getDateDiff(time)
    } else {
      return getDate(time, format)
    }
  },
  dateChange(e) {
    console.log("现在日期是", e.detail.dateString)
    let date = new Date()
    let thisDay = this.formatTime(date,'Y-M-D')
    if (e.detail.dateString>=thisDay){
      this.setData({
        dateString: e.detail.dateString,
        selectDay: e.detail.dateString
      })
      this.dayClick(e)
    }
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