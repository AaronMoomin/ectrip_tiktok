
Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:'',
    nickName:'',
  },
  handleLogin(){
    let {avatarUrl,nickName} = this.data
    tt.login({
      force: true,
      success:(res)=>{
        console.log(res);
        tt.getUserInfo({
          withCredentials: true,
          success:(res)=> {
            avatarUrl = res.userInfo.avatarUrl
            nickName = res.userInfo.nickName
            this.setData({
              avatarUrl,
              nickName
            })
            tt.setStorage({
              key: "userInfo",
              data: {
                avatarUrl,
                nickName
              },
              success:(res) =>{
                console.log(res);
              },
              fail(res) {
                console.log(`setStorage调用失败`);
              },
            });
          },
          fail(res) {
            console.log(`getUserInfo 调用失败`);
          },
        });
      },
      fail:(err)=>{
        console.log(err);
      }
    }
    )
  },
  toCollect(){
    tt.navigateTo({
      url:"/pages/collect/collect"
    })
  },
  toAllOrder(){
    tt.navigateTo({
      url:"/pages/allOrder/allOrder"
    })
  },
  toDiscountShow(){
    tt.navigateTo({
      url:"/pages/discountShow/discountShow"
    })
  },
  toVisitor(){
    tt.navigateTo({
      url:"/pages/visitor/visitor"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {avatarUrl,nickName} = this.data
    tt.getStorage({
      key: "userInfo",
      success:(res)=>{
        avatarUrl = res.data.avatarUrl
        nickName = res.data.nickName
        this.setData({
          avatarUrl,
          nickName
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

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