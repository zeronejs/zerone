import { isDate } from './is';

/**
 * 根据生日获取年龄
 * @param {Date} birthday 生日 // '2021-07-01'
 * @returns 年龄
 */
export const getAgeByBirthday = (birthday: Date) => {
    const now = new Date();
    let age = 0;
    // 年数差
    const yearDiff = (age = now.getFullYear() - birthday.getFullYear());
    // 年龄错误
    if (yearDiff < 0) return -1;
    // 月份差
    const monthDiff = now.getMonth() - birthday.getMonth();
    if (monthDiff > 0) return age;
    else if (monthDiff < 0) {
        age--;
        return age;
    }
    const dayDiff = now.getDate() - birthday.getDate();
    if (dayDiff < 0) {
        age--;
        return age;
    }
    return age;
};
/**
 * 格式化时间对象
 * ****注意
 * 1： new Date()时   内部参数不能有-
 * @example dateFormat(new Date(),'YYYY-mm-dd HH-MM-SS') => '2021-07-03 11-14-00'
 * @param {*} date Date对象实例
 * @param {*} fmt 格式化规则
 * @returns 格式化后的字符串
 */
export const dateFormat = (date: Date | number | string, fmt: string) => {
    if (!isDate(date)) {
        date = new Date(date);
    }
    let ret;
    const opt: Record<string, string> = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString(), // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (const k in opt) {
        if (Object.prototype.hasOwnProperty.call(opt, k)) {
            const ele = opt[k];
            ret = new RegExp('(' + k + ')').exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], ret[1].length === 1 ? ele : ele.padStart(ret[1].length, '0'));
            }
        }
    }

    return fmt;
};

/**
 * @param time 时间戳
 * @param fmt 格式化规则 'YYYY-mm-dd HH:MM:SS'
 */
export function formatTime(time: number, fmt = 'YYYY-mm-dd HH:MM:SS') {
    if (('' + time).length === 10) {
        time = time * 1000;
    } else {
        time = +time;
    }
    const now = Date.now();
    const diff = (now - time) / 1000;

    if (diff < 30) {
        return '刚刚';
    } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + '分钟前';
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前';
    } else if (diff < 3600 * 24 * 2) {
        return '1天前';
    }
    return dateFormat(time, fmt);
}
