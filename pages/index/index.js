// index.js
// 获取应用实例
const app = getApp();
Page({
  data: {
    isSelect:[false,true,false],
    content:['阿尔山，拥有原始森林、火山遗迹、温泉矿泉、高山湿地、河流湖泊、峡谷奇峰、冰雪运动、民俗文化等旅游资源。','稻城亚丁，是中国香格里拉生态旅游区的核心区，被誉为“香格里拉之魂”。',
    '大运河，两岸风光秀丽，文化积淀深厚，沿途经过运河公园、东关大桥、游艇码头、彩虹桥、燃灯塔、三教庙、大光楼、玉带河大桥、月岛观景台、漕运码头外景地、新北京市政府、万亩森林公园、橡胶坝等特色景点。'],
    contentShow:'',
    move:50,
  },
  //跳转门票详情
  toTicketDetail(e) {
    let name = e.currentTarget.dataset.name;
    let id = e.currentTarget.dataset.id;
    tt.navigateTo({
      url: `/pages/ticketDetail/ticketDetail?id=${id}&name=${name}`
    });
  },
  // 跳转酒店详情
  toHotelDetail(e){
    tt.navigateTo({
      url:"/pages/hotelDetail/hotelDetail?name="+e.currentTarget.dataset.name+
          '&id='+e.currentTarget.dataset.id
    })
  },
  // 事件处理函数
  onLoad() {
    this.setData({
      contentShow:this.data.content[1]
    })
  },
  onShow() {

  },
  handleAddress(e){
    let {isSelect,move,content,contentShow} = this.data
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
        contentShow = content[i]
      }
    }
    this.setData({
      isSelect,
      move,
      contentShow
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
    tt.showToast({
      title: "敬请期待"
    })
    return
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
    tt.showToast({
      title: "敬请期待"
    })
    return
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