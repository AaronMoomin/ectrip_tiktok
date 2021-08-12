// index.js
// 获取应用实例
const app = getApp();
Page({
  data: {
    isSelect:[false,false,true,false,false],
    move:50,
  },

  // 事件处理函数
  onLoad() {

  },
  onShow() {

  },
  handleAddress(e){
    let {isSelect,move} = this.data
    let index = e.currentTarget.dataset.index
    let mid = (isSelect.length)/2
    move=0
    if (index<Math.floor(mid)){
      move=move-(index*50)
    }else if (index>Math.floor(mid)){
      move=move+(index*50)
    }else {
      move = 50
    }
    for (let i in isSelect) {
      isSelect[i] = false
      if (index == i) {
        isSelect[i] = !isSelect[i]
      }
    }
    this.setData({
      isSelect,
      move
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
    tt.showToast({
      title: "敬请期待"
    })
    return
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