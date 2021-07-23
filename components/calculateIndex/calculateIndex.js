// pages/components/calculateIndex/calculateIndex.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    num:{
      type: 'number'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    index: 1,
    isDisabled: false,
    jiaDisabled: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    jian() {
      let {
        index
      } = this.data;
      index--;
      this.setData({
        index,
        jiaDisabled:false,
      });

      if (index < 2) {
        this.setData({
          isDisabled: true
        });
      }

      this.triggerEvent("itemIndex", {
        index
      });
    },

    jia() {
      let {
        index
      } = this.data;
      index++;
      this.setData({
        index,
        isDisabled: false
      });
      if (index>=this.properties.num){
        this.setData({
          jiaDisabled:true,
        });
      }
      this.triggerEvent("itemIndex", {
        index
      });
    }

  },
  lifetimes: {
    attached() {
      if (this.data.index <= 1) {
        this.setData({
          isDisabled: true
        });
      }
    }

  }
});