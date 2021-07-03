// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    
  },
  // 事件处理函数
  onLoad() {
    
  },
  // 跳转精品路线
  toQualityTouristRoutes(){
    wx.navigateTo({
      url: "/pages/qualityTouristRoutes/qualityTouristRoutes"
    })
  },
  // 跳转文旅预约
  toTourBooking(){
    wx.navigateTo({
      url: "/pages/tourBooking/tourBooking"
    })
  },
  // 跳转门票
  toTicket(){
    wx.navigateTo({
      url: "/pages/ticket/ticket"
    })
  },
  // 跳转酒店
  toHotel(){
    wx.navigateTo({
      url: "/pages/hotel/hotel"
    })
  }
})
