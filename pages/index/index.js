// index.js
// 获取应用实例
const app = getApp();
Page({
  data: {
    isSelect:[true,false,false],
  },

  // 事件处理函数
  onLoad() {

  },
  onShow() {

  },
  handleAddress(e){
    let {isSelect} = this.data
    let index = e.currentTarget.dataset.index

    for (let i in isSelect) {
      isSelect[i] = false
      if (index == i) {
        isSelect[i] = !isSelect[i]
      }
    }
    this.setData({
      isSelect
    })
  },
  handleScan() {
    tt.scanCode({
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    });
  },

  // 跳转精品路线
  toQualityTouristRoutes() {
    tt.navigateTo({
      url: "/pages/qualityTouristRoutes/qualityTouristRoutes"
    });
  },
  //跳转特产商城
  toSpecialtyStore(){
    tt.navigateTo({
      url: "/pages/specialtyStore/specialtyStore"
    });
  },
  // 跳转文旅预约
  toTourBooking() {
    tt.navigateTo({
      url: "/pages/hotList/hotList"
    });
  },

  // 跳转门票
  toTicket() {
    tt.navigateTo({
      url: "/pages/ticket/ticket"
    });
  },

  // 跳转酒店
  toHotel() {
    tt.navigateTo({
      url: "/pages/hotel/hotel"
    });
  }
});