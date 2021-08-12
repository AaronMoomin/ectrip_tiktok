const base64 = require("../../utils/base64.js");
const request = require("../../utils/request");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    all: [{
      id: '001',
      name: '深圳'
    }, {
      id: '002',
      name: '上海'
    }, {
      id: '003',
      name: '深圳'
    }],
    locations: [{
      id: '001',
      name: '北京'
    }, {
      id: '002',
      name: '上海'
    }, {
      id: '003',
      name: '深圳'
    }],
    destination: [{
      id: '001',
      name: '你家'
    }, {
      id: '002',
      name: '上海'
    }, {
      id: '003',
      name: '深圳'
    }],
    days: [{
      id: '001',
      name: '一日'
    }, {
      id: '002',
      name: '两日'
    }, {
      id: '003',
      name: '三日'
    }],
    start:'',
    end:'',
    content:'',
    goodsList:[],
    size:5,//信息条数
  },
  toSpecialtyOrder(){
    tt.navigateTo({
      url:"/pages/specialtyOrder/specialtyOrder"
    })
  },
  handleContent(e) {
    if (e.detail.value==''){
      this.getGoods(5)
    }else {
      this.setData({
        content: e.detail.value
      })
    }
  },
  searchContent(){
    this.getGoods(5,this.data.content)
  },
  // 跳转酒店详情
  toHotelDetail(e){
    tt.navigateTo({
      url:"/pages/hotelDetail/hotelDetail?name="+e.currentTarget.dataset.name+
          '&id='+e.currentTarget.dataset.id
    })
  },
  // 商品列表查询
  async getGoods(size,content='') {
    let {start,end,} = this.data
    tt.showLoading({title:'加载中...'})
    let obj = JSON.stringify({
      "categoryId": 2,
      "city": "",
      content,
      "endDate": end,
      "orderBy": 0,
      "startDate": start,
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
      let {goodsList} = this.data
      goodsList = []
      for (let resItem of res.data.data) {
        resItem.imageList = JSON.parse(resItem.imageList)
        goodsList.push(resItem)
      }
      console.log(goodsList);
      this.setData({
        goodsList
      })
    }).catch(err=>{
      tt.hideLoading()
      console.log(err);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      start:options.start,
      end:options.end,
      content:options.content,
    })
    let name = options.name
    tt.setNavigationBarTitle({
      title:name
    })
    if (this.data.content){
      this.getGoods(10,this.data.content)
    }else {
      this.getGoods(10)
    }

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