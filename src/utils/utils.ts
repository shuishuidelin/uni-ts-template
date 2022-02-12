import store from "@/store";

// };
export default class Utils {
    /**
     * run
     */
    public static run<T>(promise: Promise<T>): [any, any] | Promise<any> {
        if (!promise || !Promise.prototype.isPrototypeOf(promise)) {
            return new Promise<T>((resolve, reject) => {
                reject(new Error("requires promises as the param"));
            }).catch((err) => {
                return [err, null];
            });
        }
        return promise.then(function () {
            return [null, ...arguments];
        }).catch(err => {
            return [err, null];
        });
    }
    /**获取实时时间
     * @param {string} type - 如需返(s)为单位 请传's'.
     */
    public static getRealTime(type?: string): number {
        if (type == 's') {
            return Math.floor(new Date().getTime() / 1000);
        }
        return new Date().getTime();
    }

    /**时间戳转秒 */
    public static getTimeByHour(second_num: number): string {
        let Hours = Math.floor(second_num / 60 / 60);
        let Min = Math.floor(second_num / 60);
        let second = second_num
        if (Hours < 1) {
            return Min + "分"
        }
        if (Min < 1) {
            return second + "秒"
        }
        let HoursStr = Math.floor(Hours / 10) + "" + Hours % 10;
        if (HoursStr.length > 1) {
            if (HoursStr.indexOf("0") == 0) {
                return HoursStr.replace("0", "")
            }
        }

        return HoursStr + "时"
    }
    /**大于或者等于指定的时间 */
    public static isThan(hour: number, minutes: number): boolean {
        let src = new Date(Utils.getRealTime())
        let hours = src.getHours()
        let min = src.getMinutes();

        if (hours >= hour) {
            if (min >= minutes) {
                return true;
            }
        }
        return false;
    }

    // 比较时间是否为当天			
    public static compare_time(time: number): boolean {
        let src = new Date(time)
        let src_year = src.getFullYear()
        let src_mo = src.getMonth()
        let src_day = src.getDay()
        let cur = new Date(this.getRealTime())
        let cur_year = cur.getFullYear()
        let cur_mo = cur.getMonth()
        let cur_day = cur.getDay()
        if (src_year == cur_year && src_mo == cur_mo && src_day == cur_day) {
            return true;
        }
        return false;
    }
    /**
     * 获取明日00：00：00时间戳
     * @param offset 可获取昨日或今日0点时间戳;格式(昨日:-1; 今日:0;明日:1;)默认 offset=1;
     * @returns 时间戳
     */
    public static getTodayEndTime(offset?: number): number {
        if (offset == null) offset = 1;
        let d = new Date();
        let tomorrow = new Date(d.getFullYear(), d.getMonth(), d.getDate() + offset, 0, 0, 0, 0).getTime();
        return tomorrow
    }
    public static get_endtime() {
        var time_end = new Date(new Date(this.getRealTime() + 24 * 60 * 60 * 1000 - 1));
        var time_format = this.format_date(time_end)
        return time_format;
    }
    public static formatNumTime(time: number) {
        let data = new Date(time)
        return data.getFullYear() + ":" + data.getMonth() + ":" + data.getHours() + ":" + data.getMinutes();
    }
    // 获取当前时间的  年月日时分秒  的时间格式化 20191220100246			
    public static format_date(now: Date) {
        var year = now.getFullYear(); //年			  
        var month = now.getMonth() + 1; //月			  
        var day = now.getDate(); //日			  
        var hh = now.getHours(); //时			  
        var mm = now.getMinutes(); //分			  
        var ss = now.getSeconds(); //秒						  
        var clock = year + "";
        if (month < 10) {
            clock += "0";
        }
        clock += month + "";
        if (day < 10) {
            clock += "0";
        }
        clock += day + "";
        if (hh < 10) {
            clock += "0";
        }
        clock += hh + "";
        if (mm < 10) {
            clock += '0'
        }
        clock += mm;
        if (ss < 10) {
            clock += '0'
        }
        clock += ss;
        return clock;
    }
    public static UpxToPx(p: number): number {
        return p * store.state.screenScale
    }
    /**时间戳转日期 */
    public static TimestampToDate(stamp: string | number | Date, type: "yyyy-mm-dd" | "mm-dd" | "mm.dd" | "yyyy-mm-dd hh:mm:ss" | "yyyy-mm-dd hh:mm" | "mm月dd日" | "hh:mm"): string {
        const date = new Date(stamp);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        let str = ""
        switch (type) {
            case "yyyy-mm-dd":
                str = `${year}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day}`
                break;
            case "mm-dd":
                str = `${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day}`
                break;
            case "mm.dd":
                str = `${month > 9 ? month : '0' + month}.${day > 9 ? day : '0' + day}`
                break;
            case "yyyy-mm-dd hh:mm:ss":
                str = `${year}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day} ${hours > 9 ? hours : '0' + hours}:${minute > 9 ? minute : '0' + minute}:${second > 9 ? second : '0' + second}`
                break;
            case "yyyy-mm-dd hh:mm":
                str = `${year}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day} ${hours > 9 ? hours : '0' + hours}:${minute > 9 ? minute : '0' + minute}`
                break;
            case "mm月dd日":
                str = `${month > 9 ? month : '0' + month}月${day > 9 ? day : '0' + day}日`
                break;
            case "hh:mm":
                str = `${hours > 9 ? hours : '0' + hours}:${minute > 9 ? minute : '0' + minute}`
                break;
            default:
                str = `${year}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day} ${hours > 9 ? hours : '0' + hours}:${minute > 9 ? minute : '0' + minute}:${second > 9 ? second : '0' + second}`
                break;
        }
        return str
    }
    /**时间戳转周几 */
    public static TimestampToWeek(stamp: number): number
    public static TimestampToWeek(stamp: number, isStr: boolean): string
    public static TimestampToWeek(stamp: number, isStr?: boolean): number | string {
        if (!isStr) {
            return new Date(stamp).getDay();
        }
        enum WeekText {
            "周日",
            "周一",
            "周二",
            "周三",
            "周四",
            "周五",
            "周六",
        }
        return WeekText[new Date(stamp).getDay()]
    }
    public static showToast(title: string) {
        uni.showToast({
            title,
            icon: "none"
        })
    }
    //判断是否为手机号的正则表达式
    public static phoneFun(phones: string) {
        var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        if (!myreg.test(phones)) {
            return false;
        } else {
            return true;
        }
    }
    // 转换时间格式
    public static timeFormat(time: number) {
        let hour: number | string = Math.floor(time / 3600);
        let min: number | string = Math.floor((time - hour * 3600) / 60);
        let sec: number | string = time % 60;
        if (hour <= 9) hour = '0' + hour;
        if (min <= 9) min = '0' + min;
        if (sec <= 9) sec = '0' + sec;
        var newTime = hour + ':' + min + ':' + sec;
        return newTime
    }

    public static countdown(totalNum: number, finish: () => void) {
        let timer: number;
        if (totalNum <= 0) return finish();
        totalNum = totalNum * 1000;
        console.log(totalNum);
        timer = setInterval(() => {
            if (totalNum <= 0) {
                clearInterval(timer);
                return finish();
            }

            Utils.timeFormat(
                parseInt((totalNum -= 1000) / 1000 + "")
            );
        }, 1000);
    }
    public static queryURLParameter(url: string) {
        const obj: { [key: string]: string } = {}
        if (url.indexOf('?') < 0) return obj
        url = url.split('?')[1]
        let urlArr = url.split('&')
        urlArr.forEach(function (item) {
            let newArr = item.split('=')
            obj[newArr[0]] = newArr[1]
        })
        return obj
    }
}