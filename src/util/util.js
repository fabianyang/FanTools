function isdate(intYear, intMonth, intDay) {

    if (isNaN(intYear) || isNaN(intMonth) || isNaN(intDay)) return false;

    if (intMonth > 12 || intMonth < 1) return false;

    if (intDay < 1 || intDay > 31) return false;

    if ((intMonth == 4 || intMonth == 6 || intMonth == 9 || intMonth == 11) && (intDay > 30)) return false;

    if (intMonth == 2) {

        if (intDay > 29) return false;

        if ((((intYear % 100 == 0) && (intYear % 400 != 0)) || (intYear % 4 != 0)) && (intDay > 28)) return false;

    }

    return true;
};

class DateUtil {
    constructor() {}

    // http://www.cnblogs.com/shaunZh/p/5585477.html
    check(date) {
        return new Date(date).getDate() === parseInt(date.substr(-2));
    }

    getTypeString(value) {
        return Object.prototype.toString.call(value).slice(8, -1);
    }

    // https://www.cnblogs.com/zhangpengshou/archive/2012/07/19/2599053.html
    format(date, sfmt) {
        let fmt = sfmt;
        const o = {
            // 月份
            'M+': date.getMonth() + 1,
            // 日
            'd+': date.getDate(),
            // 小时
            'h+': date.getHours(),
            // 分
            'm+': date.getMinutes(),
            // 秒
            's+': date.getSeconds(),
            // 季度
            'q+': Math.floor((date.getMonth() + 3) / 3),
            // 毫秒
            S: date.getMilliseconds()
        };

        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
        return fmt;
    }
}

export default new DateUtil();
