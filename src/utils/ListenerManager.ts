export class Listener {
    public mListener: Function;
    public get listener(): Function {
        return this.mListener;
    }
    public mtarget: any;
    public get target() {
        return this.mtarget;
    }
    constructor(target: any, listener: Function) {
        this.mListener = listener;
        this.mtarget = target;
    }
}

export default class ListenerManager {
    private global_event_list: Array<Listener[]>;

    private static instance: ListenerManager;
    constructor() {
        this.global_event_list = new Array()
    }
    public static getInstance() {
        if (this.instance == null) {
            this.instance = new ListenerManager();
        }
        return this.instance;
    }

    public add(event_type: any, target: any, function_call_back: any) {
        if (event_type == null || function_call_back == null) {
            console.error("RegistEvent Error");
            return;
        }
        if (this.global_event_list[event_type] == null) {
            this.global_event_list[event_type] = new Array();
        }
        let listener = new Listener(target, function_call_back);
        this.global_event_list[event_type].push(listener);
    }
    public remove(event_type: any, target: any, function_call_back: any) {
        if (event_type == null || function_call_back == null) {
            return;
        };

        if (this.global_event_list[event_type] == null) {
            return;
        }

        for (var i = 0; i < this.global_event_list[event_type].length; i++) {
            if (this.global_event_list[event_type][i].listener == function_call_back
                && this.global_event_list[event_type][i].target == target) {
                this.global_event_list[event_type].splice(i, 1);
            }
        };
    }
    public removeAll() {
        this.global_event_list = new Array();
    }
    public trigger(event_type: any, parame_list?: any) {
        if (event_type == null) {
            console.error("FireEvent Error");
            return;
        }
        if (this.global_event_list.length == 0) return;
        if (this.global_event_list[event_type] == null) {
            console.error("事件列表不存在名为" + event_type + "事件");
            return;
        }
        for (var i = 0; i < this.global_event_list[event_type].length; i++) {
            var call_function = this.global_event_list[event_type][i];
            if (call_function) {
                call_function.listener.call(call_function.target, parame_list);
            }
        };
    }
}
