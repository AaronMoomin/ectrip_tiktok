// pages/components/calculateIndex/calculateIndex.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    num:{
      type: 'number'
    },
    defaultNum:{
      type: 'number',
      value:1,
      observer:function(newVal,oldVal){
        this.setData({
          index:newVal,
          isDisabled: false,
        })
      }
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
      console.log('点击了减');
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
      console.log('点击了加');
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
      this.setData({
        index: this.properties.defaultNum
      })
      if (this.data.index <= 1) {
        this.setData({
          isDisabled: true,
        });
      }
      if (this.data.index==this.properties.num){
        this.setData({
          jiaDisabled: true,
        });
      }
    }
  },
});