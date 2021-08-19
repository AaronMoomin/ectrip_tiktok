let util = require('../../utils/util.js');
const base64 = require("../../utils/base64.js");
const request = require("../../utils/request");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    yesterday: '',
    today: '',
    tomorrow: '',
    yesterdayPrice: 0,
    todayPrice: 0,
    tomorrowPrice: 0,
    showYesterday: false,
    showDay: true,
    showTomorrow: true,
    selectDay: '',
    dialog:false,
    isCollect:false,
    goods:'',
    productList:[],
    product:'',
    openid:'',
  },
  async getDailyPrice(start,end) {
    let {productList} = this.data
    await request.myRequest(
        '/tiktok/mutual/dailyPriceAndStock',
        {
          endDate: end,
          id: productList[0].productId,
          startDate: start
        },
        "get",
        'application/x-www-form-urlencoded'
    ).then(res => {
      console.log('getDailyPrice',res);
      if (res.data.data.dailyProductInfoList.length==3){
        this.setData({
          yesterdayPrice:res.data.data.dailyProductInfoList[0].settlementPrice,
          todayPrice:res.data.data.dailyProductInfoList[1].settlementPrice,
          tomorrowPrice:res.data.data.dailyProductInfoList[2].settlementPrice
        })
      }else if (res.data.data.dailyProductInfoList.length==2){
        this.setData({
          yesterdayPrice:'无',
          todayPrice:res.data.data.dailyProductInfoList[0].settlementPrice,
          tomorrowPrice:res.data.data.dailyProductInfoList[1].settlementPrice
        })
      }else {
        this.setData({
          yesterdayPrice:'无',
          todayPrice:'无',
          tomorrowPrice:res.data.data.dailyProductInfoList[0].settlementPrice
        })
      }
    }).catch(err => {
      console.log(err);
    })
  },
  async handleCollect(e) {
    if (this.checkLogin()){
      this.setData({
        openid:app.globalData.openid
      });
      let {isCollect,openid} = this.data
      console.log(e.currentTarget.dataset.goods);
      let obj = JSON.stringify({
        "categoryId": e.currentTarget.dataset.goods.categoryId,
        "goodsId": e.currentTarget.dataset.goods.id,
        openid,
      })
      let object = base64.encode(obj)
      if (isCollect) {
        tt.showToast({
          title: '取消收藏',
          icon: 'none'
        })
        isCollect=0
        await request.myRequest(
            '/tiktok/personCenter/collection/remove',
            {
              goodsId:e.currentTarget.dataset.goods.id,
              openid:app.globalData.openid
            },
            'post',
            'application/x-www-form-urlencoded'
        ).then(res => {
          console.log(res);
        }).catch(err => {
          console.log(err);
        })
      } else {
        tt.showToast({
          title: '收藏成功',
          icon: 'none'
        })
        isCollect=1
        await request.myRequest(
            '/tiktok/personCenter/collection/add',
            {
              data:object,
              signed:'add'
            },
            'post',
        ).then(res => {
          console.log(res);
        }).catch(err => {
          console.log(err);
        })
      }
      this.setData({
        isCollect
      })
    }
  },
  async getGoodsDetail() {
    let {id} = this.data
    let today = util.GetDateStr(0)
    let openid = app.globalData.openid
    let obj = JSON.stringify({
      "endDate": "",
      id,
      openid,
      "startDate": today
    })
    let object = base64.encode(obj)
    await request.myRequest(
        '/tiktok/mutual/detail',
        {
          data:object ,
          signed: "111"
        },
        'post'
    ).then(res=>{
      let {goods,productList,product} = this.data
      goods = res.data.data.goods
      productList = res.data.data.productList
      product = productList[0]
      goods.imageList = JSON.parse(goods.imageList)
      let isCollected = res.data.data.isCollected
      if (isCollected==1) {
        this.setData({
          isCollect:true
        })
      }else{
        this.setData({
          isCollect:false
        })
      }
      this.setData({
        goods,
        productList,
        product
      })
      console.log('goods',goods);
      console.log('productList',productList);
      console.log('product',product);
      let start = util.GetDateStr(-1);
      let end = util.GetDateStr(1);
      console.log(start,end);
      this.getDailyPrice(start,end)
    }).catch(err=>{
      console.log(err);
    })
  },
  handleLogin() {
    tt.login({
          force: true,
          success: (res) => {
            // console.log('登录回调', res);
            tt.getUserInfo({
              withCredentials: true,
              success: (res1) => {
                this.setData({
                  avatarUrl: res1.userInfo.avatarUrl,
                  nickName: res1.userInfo.nickName
                })
                this.login(res)
                tt.setStorage({
                  key: "userInfo",
                  data: {
                    avatarUrl: res1.userInfo.avatarUrl,
                    nickName: res1.userInfo.nickName
                  },
                  success: (res) => {
                    console.log(`userInfo写入成功`);
                  },
                  fail(res) {
                    // console.log(`userInfo调用失败`);
                  },
                });
              },
              fail(res) {
                console.log(`getUserInfo失败`);
              },
            });
          },
          fail: (err) => {
            console.log('取消', err);
          }
        }
    )
  },
  checkLogin() {
    tt.getStorage({
      key: 'userInfo',
      success: res => {
        console.log(res);
        this.setData({
          nickName: res.data.nickName,
          avatarUrl: res.data.avatarUrl
        })
      },
      fail: err => {
        console.log(err);
      }
    })
    if (this.data.nickName == "") {
      console.log("未登录");
      this.handleLogin()
      return false
    } else {
      console.log("已登录");
      return true
    }
  },
  async login(value) {
    let obj = JSON.stringify({
      "anonymous_code": value.anonymousCode,
      "appid": app.globalData.appid,
      "code": value.code,
      "nickName":this.data.nickName,
      "avatarUrl":this.data.avatarUrl,
      "secret": app.globalData.secret
    })
    let Object = base64.encode(obj)
    let data = {
      "data": Object,
      "signed": "login"
    }
    await request.myRequest(
        '/tiktok/serverAPI/login',
        data,
        "post"
    ).then(res => {
      console.log(res);
      let {openid, session_key, unionid} = res.data.data
      app.globalData.openid = openid
      tt.setStorage({
        key: 'session',
        data: {
          openid,
          session_key,
          unionid
        },
        success: res => {
          // console.log('openid调用成功');
        },
        fail: err => {
          // console.log('openid调用失败');
        }
      })
    }).catch(err => {
      console.log(err);
    })
  },
  clickProduct(e){
    this.setData({
      product:e.currentTarget.dataset.product
    })
  },
  toRouteReserve(e){
    let product = JSON.stringify(e.currentTarget.dataset.product)
    let totalStock = e.currentTarget.dataset.totalstock
    let switchneedvisitor = e.currentTarget.dataset.switchneedvisitor
    let contactducumenttype = e.currentTarget.dataset.contactducumenttype
    tt.navigateTo({
      url:`/pages/routeReserve1/routeReserve1?product=${product}&totalStock=${totalStock}&switchneedvisitor=${switchneedvisitor}&contactducumenttype=${contactducumenttype}`
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
    } = this.data;

    let str = util.GetDateStr(0);

    let preStr = util.GetDateStr1(str, -1);
    let start = util.GetDateStr1(selectDay, -1);
    let end = util.GetDateStr1(selectDay, 1);
    yesterday = util.GetWeekStr(selectDay, -1);
    today = util.GetWeekStr(selectDay, 0);
    tomorrow = util.GetWeekStr(selectDay, 1);
    console.log(start,end);
    this.getDailyPrice(start,end)
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
      let start = util.GetDateStr1(selectDay,0);
      let end = util.GetDateStr1(selectDay,1);
      console.log(start,end);
      this.getDailyPrice(start,end)
    }else {
      let start = util.GetDateStr1(selectDay,-1);
      let end = util.GetDateStr1(selectDay,1);
      console.log(start,end);
      this.getDailyPrice(start,end)
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
      let start = util.GetDateStr1(selectDay,-1);
      let end = util.GetDateStr1(selectDay,1);
      console.log(start,end);
      this.getDailyPrice(start,end)
    } else {
      this.setData({
        showYesterday: false,
        showDay: true
      });
      let start = util.GetDateStr1(selectDay,0);
      let end = util.GetDateStr1(selectDay,1);
      console.log(start,end);
      this.getDailyPrice(start,end)
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
      selectDay,
      id:options.id
    });
    this.getGoodsDetail()
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