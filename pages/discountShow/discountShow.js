
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isSelect:[true,false,false]
  },
  handleSelect(e){
    let {isSelect} = this.data
    let index = e.currentTarget.dataset.index
    for (let i in isSelect) {
      isSelect[i] =  false
      if (index == i){
        isSelect[i] = !isSelect[i]
      }
    }
    this.setData({
      isSelect
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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