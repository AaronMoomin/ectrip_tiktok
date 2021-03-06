let weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
module.exports = {
    GetDay: date => {
        var dd = new Date(date);
        let day = dd.getDate();
        return day;
    },
    GetDateStr: AddDayCount => {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期

        let y = dd.getFullYear();
        let m = dd.getMonth() + 1 + '';
        m = m.padStart(2, '0');
        let d = dd.getDate() + '';
        d = d.padStart(2, '0');
        return y + "-" + m + "-" + d;
    },
    GetDateStr1: (date, AddDayCount) => {
        var dd = new Date(date);
        dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期

        let y = dd.getFullYear();
        let m = dd.getMonth() + 1 + '';
        m = m.padStart(2, '0');
        let d = dd.getDate() + '';
        d = d.padStart(2, '0');
        return y + "-" + m + "-" + d;
    },
    GetWeekStr: (date, AddDayCount) => {
        var dd = new Date(date);
        dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期

        let w = dd.getDay();
        let week = weekday[w];
        let m = dd.getMonth() + 1 + '';
        m = m.padStart(2, '0');
        let d = dd.getDate() + '';
        d = d.padStart(2, '0');
        return week + " " + m + "-" + d;
    },
    GetWeekMD: (date) => {
        var dd = new Date(date);
        dd.setDate(dd.getDate()); //获取AddDayCount天后的日期

        let w = dd.getDay();
        let week = weekday[w];
        let m = dd.getMonth() + 1 + '';
        m = m.padStart(2, '0');
        let d = dd.getDate() + '';
        d = d.padStart(2, '0');
        return m + "月" + d + '日' + " " + week;
    },
    GetWeekStr1: (date, AddDayCount) => {
        var dd = new Date(date);
        dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期

        let m = dd.getMonth() + 1 + '';
        m = m.padStart(2, '0');
        let d = dd.getDate() + '';
        d = d.padStart(2, '0');
        return  m + "-" + d;
    },
    GetWeek: (date, AddDayCount) => {
        var dd = new Date(date);
        dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期

        let w = dd.getDay();
        let week = weekday[w];
        return week;
    },
    GetMDStr: (date, AddDayCount) => {
        var dd = new Date(date);
        dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期

        let m = dd.getMonth() + 1 + '';
        m = m.padStart(2, '0');
        let d = dd.getDate() + '';
        d = d.padStart(2, '0');
        return m + "月" + d + "日";
    },
    GetDate(date) {
    var year = date.getFullYear();
    var month =
        date.getMonth() + 1 < 10 ?
            "0" + (date.getMonth() + 1) :
            date.getMonth() + 1;
    var day =
        date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minutes =
        date.getMinutes() < 10 ?
            "0" + date.getMinutes() :
            date.getMinutes();
    var seconds =
        date.getSeconds() < 10 ?
            "0" + date.getSeconds() :
            date.getSeconds();
    let time =
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;
    return time
}
};