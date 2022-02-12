import { WebViewModel } from "@/bean/Model";

/** 请求路径 */
export interface UriInfo {
    uri: string;
    showLog?: boolean;
    /**关闭菊花图动画 */
    hiddenLoadingAnm?: boolean;
    /**超时时长 */
    timeout?: number;
}
export const Api = {
    /**店铺信息 */
    store: { uri: "/na/home/info/store", },
}
export class ConstValue {
    public static isDev(): boolean {
        if (process.env.NODE_ENV === 'development') {
            console.log('开发环境')
            return true;
        } else {
            console.log('生产环境')
            return false;
        }
    }
    public static isDebug: boolean = ConstValue.isDev();
    public static isTest: boolean = false;
    public static readonly localBaseUrl = "https://drama.yddcm.com";
    // public static readonly localBaseUrl = "http://47.112.150.18:8081";
    // public static readonly localBaseUrl = "https://drama.yddcm.com";
    public static readonly testBaseUrl = "http://192.168.2.3:8195";
    public static readonly serverBaseUrl = "https://drama.yddcm.com";
    public static readonly serverUploadUrl = "https://xcx.szlzyd.com/api/file/upload/feedback";

    public static readonly userInfo = "userInfo";
    public static readonly STOREUUID = "storeUuid";

}
export enum ListerName {
    /**支付成功刷新数据 */
    PAY_UP_CAR,
    /**支付失败 */
    PAY_FAII,
    /**车次信息修改 */
    CAR_UP,
}

export enum webLinkType {
    /** 入驻协议*/
    rzxy,
    /** 拼场协议*/
    pcxy,
}
export const webLink: { [key: number]: WebViewModel } = {
    [webLinkType.rzxy]: { link: "/html/rzxy.html", title: "零宇宙商家入驻协议" },
    [webLinkType.pcxy]: { link: "/html/pcxy.html", title: "拼场协议" }
}
