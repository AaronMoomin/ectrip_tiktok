// pages/ticketDetail/ticketDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'测试3',//商品名称
    contentHeight:'550rpx',//介绍的高度
    displayed:'block',//显示
    dialog1: false,
  },
  toReserve(){
    wx.navigateTo({
      url:'/pages/reserve/reserve'
    })
  },
  handleLocation(){
    wx.showToast({
      title:'暂无经纬度信息',
      icon:'none'
    })
  },
  open(){
    this.setData({
      dialog1:true
    })
  },
  close(){
    this.setData({
      dialog1: false
    })
  },
  handleSlide(){
    this.setData({
      contentHeight:'auto',
      displayed:'none',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title:options.name
    })
    this.setData({
      name:options.name
    })
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
})