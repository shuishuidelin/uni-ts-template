import { ResposeBaseGeneric } from "@/NetWork/ResposeBase";
import { reactive } from "vue";

export default class Pages {
    currentPage: number = 1;
    /**没有更多页了 */
    noMore: boolean = false;
    /**
     * addPage
     */
    public addPage() {
        if (this.noMore) return;
        this.currentPage++;
    }
    public curPage() {
        this.currentPage--;
    }
    public reStart() {
        this.currentPage = 1;
        this.noMore = false;
    }
}
enum PaginationState {
    QUERYING,
    FINISH,
    NOMORE
}
/**分页 */
export class Pagination<T> {
    public pages: Pages = new Pages();
    public state: PaginationState = PaginationState.FINISH;
    public dramaList = reactive<any[]>([]);
    private callback: (p: ResposeBaseGeneric<T>, type: "reStart" | "nextPage") => void;
    postCommon: (oparams?: object | undefined) => Promise<ResposeBaseGeneric<T>>;
    constructor(option: PaginationOption<T>) {
        this.postCommon = option.postCommon;
        this.callback = option.callback;
    }
    private checkOptParams(params: any): object {
        let obj: any = {};
        for (let i in params) {
            if (!params[i] || params[i] == 0) {
                continue;
            }
            obj[i] = params[i];
        }
        return obj;
    }
    private getList(type: "reStart" | "nextPage", oparams?: AnyObject) {
        if (this.pages.noMore) return;
        this.state = PaginationState.QUERYING;
        if (!oparams) oparams = {};
        if (typeof oparams == "object") {
            oparams.page = this.pages.currentPage
        }
        this.postCommon(this.checkOptParams(oparams)).then(res => {
            if (res.data.length == 0) {
                this.pages.noMore = true;
                this.state = PaginationState.NOMORE;
            }
            this.callback(res, type);
            // this.myList.push(...res.data);
        }).finally(() => {
            if (this.state != PaginationState.NOMORE)
                this.state = PaginationState.FINISH
        })
    }
    public reStart(oparams?: object) {
        this.pages.reStart()
        this.getList("reStart", oparams);
    }
    public nextPage(oparams?: object) {
        this.pages.addPage();
        this.getList("nextPage", oparams);
    }
}
interface PaginationOption<T> {
    postCommon: (oparams?: object | undefined) => Promise<ResposeBaseGeneric<T>>;
    callback: (p: ResposeBaseGeneric<T>, type: "reStart" | "nextPage") => void;
}