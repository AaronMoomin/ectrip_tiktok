// pages/components/calculateIndex/calculateIndex.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        index: 1,
        isDisabled: false,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        jian() {
            let {index} = this.data
            index--
            this.setData({
                index
            })
            if (index < 2) {
                this.setData({
                    isDisabled: true
                })
            }
        },
        jia() {
            let {index} = this.data
            index++
            this.setData({
                index,
                isDisabled: false
            })
        }
    },
    lifetimes: {
        attached() {
            if (this.data.index <= 1) {
                this.setData({
                    isDisabled: true
                })
            }
        }
    }
})
