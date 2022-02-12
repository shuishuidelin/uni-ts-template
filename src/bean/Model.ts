export enum SortType {
    AboutStart = "即将开始",
    AlmostFull = "即将人满"
}
export interface SessionDate {
    week: string;
    date: string;
    /**页面日期转换mm-dd */
    dateMd?: string
    index?: number
}
export enum WeekText {
    "周日",
    "周一",
    "周二",
    "周三",
    "周四",
    "周五",
    "周六",
}
export interface sessionTime {
    id: number,
    text: string,
    timestamp: number
}
/** 参与男女人数 */
export interface NumOfPeople {
    male: number,
    female: number
}
/**  WebView */
export interface WebViewModel {
    link: string,
    title: string
}