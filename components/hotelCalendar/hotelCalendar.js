let util = require('../../utils/util.js');
Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        thisYear: '',
        thisMonth: '',
        thisMonthArr: [],
        today: new Date().getDate(),
        nextYear: '',
        nextMonth: '',
        nextMonthArr: [],
        selectArray: [],//记录入住时间
        thisDate: '',
        nextDate: '',
        betweenDayList: [],
    },

    /**
     * 组件的方法列表
     */
    methods: {
        select_date: function (e) {
            let {selectArray, thisDate, nextDate, betweenDayList} = this.data
            // this.triggerEvent('getMyDate',{selectArray:selectArray})
            //如果点击项为空百项目，不继续执行
            var date = e.currentTarget.dataset.date;
            if (date == '' || date <= 0) {
                return;
            }
            var index = e.currentTarget.dataset.key;
            var item = e.currentTarget.dataset.keyitem;
            var month = e.currentTarget.dataset.month;
            if (month == 'thisMonth') {
                var thisDateLists = this.data.thisMonthArr;
                thisDateLists[index][item].month = this.data.thisMonth
                thisDateLists[index][item].year = this.data.thisYear
                if (selectArray.indexOf(thisDateLists[index][item]) === -1) {
                    selectArray.push(thisDateLists[index][item])
                }
                this.setData({
                    selectArray
                })
                // console.log(selectArray);
                //切换选中状态
                if (thisDateLists[index][item].state == true) { // 取消选中
                    thisDateLists[index][item].state = false;
                    if (selectArray.length === 1) {
                        thisDateLists[index][item].inDate = false
                        selectArray.pop()
                    }
                    if (thisDateLists[index][item].outDate) {
                        thisDateLists[index][item].outDate = false
                        selectArray.pop()
                    }
                    for (let i = 0; i < thisDateLists.length; i++) {
                        for (let j = 0; j < thisDateLists[i].length; j++) {
                            thisDateLists[i][j].state = false;
                        }
                    }
                } else if (thisDateLists[index][item].state == false) {//选中
                    thisDateLists[index][item].state = true;
                    if (selectArray.length === 1) {// 判断入住
                        thisDateLists[index][item].inDate = true
                    } else if (!thisDateLists[index][item].outDate) {// 判断离店
                        thisDateLists[index][item].outDate = true
                        this.triggerEvent('getMyDate',{selectArray:selectArray})
                    }
                }
                if (selectArray.length != 0) {
                    let thisMonth = selectArray[0].month + '';
                    thisMonth = thisMonth.padStart(2, '0')
                    let thisDay = selectArray[0].date + '';
                    thisDay = thisDay.padStart(2, '0')
                    let nextMonth = selectArray[selectArray.length - 1].month + ''
                    nextMonth = nextMonth.padStart(2, '0')
                    let nextDay = selectArray[selectArray.length - 1].date + ''
                    nextDay = nextDay.padStart(2, '0')
                    thisDate = `${this.data.thisYear}-${thisMonth}-${thisDay}`
                    nextDate = `${this.data.thisYear}-${nextMonth}-${nextDay}`
                    // 入离日期之间的日期
                    let selectBetween = this.getdiffdate(thisDate, nextDate)
                    betweenDayList = []
                    for (let i = 1; i < selectBetween.length - 1; i++) {
                        if (betweenDayList.indexOf(selectBetween[i].split('-')[2]) == -1) {
                            betweenDayList.push(selectBetween[i].split('-')[2])
                        }
                    }
                }
                if (selectArray.length > 1) {
                    for (let i = 0; i < thisDateLists.length; i++) {
                        for (let j = 0; j < thisDateLists[i].length; j++) {
                            for (let z = 0; z < betweenDayList.length; z++) {
                                if (thisDateLists[i][j].date == betweenDayList[z]) {
                                    thisDateLists[i][j].state = true
                                }
                            }
                        }
                    }
                }
            } else {
                var nextDateLists = this.data.nextMonthArr;
                nextDateLists[index][item].month = this.data.nextMonth
                nextDateLists[index][item].year = this.data.nextYear
                var thisDateLists = this.data.thisMonthArr
                if (selectArray.indexOf(nextDateLists[index][item]) === -1) {
                    selectArray.push(nextDateLists[index][item])
                }
                this.setData({
                    selectArray
                })
                // console.log(selectArray);
                //切换选中状态
                if (nextDateLists[index][item].state == true) { // 取消选中
                    nextDateLists[index][item].state = false;
                    if (selectArray.length === 1) {
                        nextDateLists[index][item].inDate = false
                        selectArray.pop()
                    } else if (nextDateLists[index][item].outDate) {
                        nextDateLists[index][item].outDate = false
                        selectArray.pop()
                    }
                    for (let i = 0; i < nextDateLists.length; i++) {
                        for (let j = 0; j < nextDateLists[i].length; j++) {
                            nextDateLists[i][j].state = false;
                        }
                    }
                    for (let i = 0; i < thisDateLists.length; i++) {
                        for (let j = 0; j < thisDateLists[i].length; j++) {
                            thisDateLists[i][j].state = false;
                        }
                    }
                } else if (nextDateLists[index][item].state == false) {//选中
                    nextDateLists[index][item].state = true;
                    if (selectArray.length === 1) {// 判断入住
                        nextDateLists[index][item].inDate = true
                    } else if (!nextDateLists[index][item].outDate) {// 判断离店
                        nextDateLists[index][item].outDate = true
                        this.triggerEvent('getMyDate',{selectArray:selectArray})
                    }
                }
                if (selectArray.length != 0) {
                    let thisMonth = selectArray[0].month + '';
                    thisMonth = thisMonth.padStart(2, '0')
                    let thisDay = selectArray[0].date + '';
                    thisDay = thisDay.padStart(2, '0')
                    let nextMonth = selectArray[selectArray.length - 1].month + ''
                    nextMonth = nextMonth.padStart(2, '0')
                    let nextDay = selectArray[selectArray.length - 1].date + ''
                    nextDay = nextDay.padStart(2, '0')
                    thisDate = `${this.data.thisYear}-${thisMonth}-${thisDay}`
                    nextDate = `${this.data.thisYear}-${nextMonth}-${nextDay}`
                    // 入离日期之间的日期
                    let selectBetween = this.getdiffdate(thisDate, nextDate)
                    betweenDayList = []
                    selectBetween = selectBetween.slice(1, selectBetween.length - 1)
                    for (let i = 0; i < selectBetween.length; i++) {
                        betweenDayList.push(selectBetween[i].split('-')[2])
                    }
                }
                let pre = []
                let next = []
                let z = 0
                for (; z < betweenDayList.length; z++) {
                    pre.push(betweenDayList[z])
                    if (betweenDayList[z] * 1 > betweenDayList[z + 1] * 1) {
                        break
                    }
                }
                next = betweenDayList.slice(z + 1)
                if (selectArray.length > 1) {
                    for (let i = 0; i < thisDateLists.length; i++) {
                        for (let j = 0; j < thisDateLists[i].length; j++) {
                            for (let z = 0; z < pre.length; z++) {
                                if (thisDateLists[i][j].date == pre[z]) {
                                    thisDateLists[i][j].state = true
                                }
                            }
                        }
                    }
                    for (let i = 0; i < nextDateLists.length; i++) {
                        for (let j = 0; j < nextDateLists[i].length; j++) {
                            for (let z = 0; z < next.length; z++) {
                                if (nextDateLists[i][j].date == next[z]) {
                                    nextDateLists[i][j].state = true
                                }
                            }
                        }
                    }
                }
            }

            //根据月份设置数据
            if (month == 'thisMonth') {
                this.setData({
                    thisMonthArr: thisDateLists,
                });
            } else {
                this.setData({
                    thisMonthArr: thisDateLists,
                    nextMonthArr: nextDateLists,
                });
            }
        },
        //获取两日期之间日期列表函数
        getdiffdate(stime, etime) {
            //初始化日期列表，数组
            var diffdate = new Array();
            var i = 0;
            //开始日期小于等于结束日期,并循环
            while (stime <= etime) {
                diffdate[i] = stime;

                //获取开始日期时间戳
                var stime_ts = new Date(stime).getTime();
                // console.log('当前日期：' + stime + '当前时间戳：' + stime_ts);

                //增加一天时间戳后的日期
                var next_date = stime_ts + (24 * 60 * 60 * 1000);

                //拼接年月日，这里的月份会返回（0-11），所以要+1
                var next_dates_y = new Date(next_date).getFullYear() + '-';
                var next_dates_m = (new Date(next_date).getMonth() + 1 < 10) ? '0' + (new Date(next_date).getMonth() + 1) + '-' : (new Date(next_date).getMonth() + 1) + '-';
                var next_dates_d = (new Date(next_date).getDate() < 10) ? '0' + new Date(next_date).getDate() : new Date(next_date).getDate();

                stime = next_dates_y + next_dates_m + next_dates_d;

                //增加数组key
                i++;
            }
            return diffdate
        },
        //根据指定年月获得当月天数
        mGetDate(year, month) {
            var d = new Date(year, month, 0);
            return d.getDate();
        },
        //根据指定年月获得当月日历数组
        getDateArr(date) {
            //根据指定年月
            //var myDate = new Date();
            var myDate = date;
            var thisYear = myDate.getFullYear(); //获取完整的年份
            var thisMonth = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
            var firstDay = new Date(thisYear + ',' + thisMonth + ',01').getDay(); //本月第一天星期几,0表示星期天
            var nowDay = myDate.getDate(); // 今天是几号
            var monthNum = this.mGetDate(thisYear, thisMonth); //本月多少天

            var monthArray = [];
            var week = 1; //第一周
            var oneDay = '';
            var isToday = false;
            monthArray[week] = new Array(); //声明本周的二维数组

            //循环当月的每一天
            for (var k = 1; k <= monthNum; k++) {
                isToday = false;
                //组装当前日期
                oneDay = thisYear + ',' + thisMonth + ',' + k;
                var witchDay = new Date(oneDay).getDay(); //当前是星期几
                //如果当期循环日期为今天
                if (k == nowDay) {
                    isToday = true;
                }

                //如果是第一周
                if (week == 1) {
                    //判断当前日期是否是本月第一天
                    if (k == 1) {
                        //第一天之前的日期补为空
                        for (var a = 0; a < firstDay; a++) {
                            monthArray[week][a] = {
                                date: '',
                                isToday: isToday,
                                state: false
                            };
                        }
                    }
                }

                monthArray[week][witchDay] = {
                    date: k,
                    isToday: isToday,
                    state: false
                };

                //如果已经是周六，切换到下一周
                if (witchDay == 6) {
                    week++;
                    monthArray[week] = new Array(); //声明本周的二维数组
                }
            }
            monthArray.splice(0, 1); //删除下标为0的空元素
            //console.log(monthArray);
            return monthArray;
        },
    },
    lifetimes: {
        attached() {
            //初始化日历数据
            var nextM_start = new Date(new Date(new Date().toLocaleDateString()).setMonth(new Date().getMonth() + 1)); //下一个月
            var thisMonthArr = this.getDateArr(new Date());
            var nextMonthArr = this.getDateArr(nextM_start);
            this.setData({
                thisYear: new Date().getFullYear(),
                thisMonth: new Date().getMonth() + 1,
                nextYear: nextM_start.getFullYear(),
                nextMonth: nextM_start.getMonth() + 1,
                thisMonthArr: thisMonthArr,
                nextMonthArr: nextMonthArr
            })
        }
    }
});