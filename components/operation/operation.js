Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isZan:true,
    isHave:true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toComment(){
      tt.navigateTo({
        url: "/pages/comment/comment?name="+this.data.name
      })
    }
  }
});