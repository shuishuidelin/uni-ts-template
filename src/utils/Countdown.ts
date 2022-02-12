
interface CountdownOptions {
    totalNum: number;
    run: (str: string) => void;
    finish: () => void;
    timeType: TimeStrType
}
abstract class CountdownAbs {
    protected totalNum: number = 0;
    protected timer: number = 0;
    protected abstract start(): void;
    abstract run(str: string): void;
    abstract finish(): void;
    abstract clear(): void;
}
type TimeStrType = "hh:mm:ss" | "mm:ss" | "ss"
export default class Countdown extends CountdownAbs {
    protected totalNum: number = 0;
    protected timer: number = 0;
    private timeType: TimeStrType;
    constructor(options: CountdownOptions) {
        super();
        this.totalNum = options.totalNum;
        this.timeType = options.timeType;
        this.run = options.run;
        this.finish = options.finish;
        this.start();
    }
    protected start() {
        if (this.totalNum <= 0) return this.finish();
        this.totalNum = this.totalNum * 1000;
        this.timer = setInterval(() => {
            this.run(Countdown.timeFormat(
                parseInt((this.totalNum -= 1000) / 1000 + ""), this.timeType
            ))
            if (this.totalNum <= 0) {
                clearInterval(this.timer);
                return this.finish();
            }
        }, 1000);
    }
    run: (str: string) => void;
    finish() { };
    clear() {
        clearInterval(this.timer)
        this.totalNum = 0;
    };
    private static timeFormat(time: number, type: TimeStrType) {
        function joinT(p: number) {
            return p <= 9 ? '0' + p : p + "";
        }
        var newTime = "";
        switch (type) {
            case "ss":
                newTime = joinT(time);
                break;
            case "mm:ss":
                newTime = joinT(Math.floor(time / 60)) + ":" + joinT(time % 60);
                break;
            case "hh:mm:ss": default:
                let hour: number | string = Math.floor(time / 3600);
                let min: number | string = Math.floor((time - hour * 3600) / 60);
                let sec: number | string = time % 60;
                newTime = joinT(hour) + ':' + joinT(min) + ':' + joinT(sec);
                break;
        }
        return newTime
    }
}