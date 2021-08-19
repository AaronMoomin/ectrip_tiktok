// pages/qualityTouristRoutes/playReserve.js
const base64 = require("../../utils/base64.js");
const request = require("../../utils/request");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderList:[],
    size:5,
  },
  // 商品列表查询
  async getGoods(size) {
    tt.showLoading({title:'加载中...'})
    let obj = JSON.stringify({
      "categoryId": 14,
      "city": "",
      "content": "",
      "endDate": "",
      "orderBy": 0,
      "startDate": "",
      "current":0,
      "size":size,
      "themeId":""
    })
    let object = base64.encode(obj)
    await request.myRequest(
        '/tiktok/mutual/goods',
        {
          data:object,
          signed:'111'
        },
        'post',
    ).then(res=>{
      tt.hideLoading()
      console.log(res.data.data);
      for (let item of res.data.data) {
        item.imageList = JSON.parse(item.imageList)
      }
      this.setData({
        orderList:res.data.data
      })
    }).catch(err=>{
      tt.hideLoading()
      console.log(err);
    })
  },
  toPlayReserve(e) {
    let id = e.currentTarget.dataset.id
    tt.navigateTo({
      url: "/pages/playReserve/playReserve?id="+id
    })
  },
  toPlayerShow(e){
    tt.navigateTo({
      url:"/pages/playerItemShow/playerItemShow?type="+e.currentTarget.dataset.type
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGoods(this.data.size)
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
  onReachBottom: function () {
    console.log('别啦了');
    let {size} = this.data
    size+=6
    this.setData({
      size
    })
    tt.showLoading({title:'加载更多'})
    this.getGoods(size)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
});