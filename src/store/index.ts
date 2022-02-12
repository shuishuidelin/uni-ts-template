import { createStore, Store } from 'vuex'
interface InitStoreBean {
    age: number;
    username: string;
    address: string;
    /**安全距离 */
    safetyTop: number;
    safetyBottom: number;
    /**屏幕rpx于px的宽比例 */
    screenScale: number;
}
const store: Store<InitStoreBean> = createStore({
    state: {// 存放状态
        "username": "未登录",
        "age": 18,
        "address": "哈尔滨",
        "safetyTop": 0,
        "safetyBottom": 0,
        "screenScale": 1
    },
    mutations: {
        editUsername(state: InitStoreBean, newName: string) {
            state.username = newName;
        },
        editAddress(state: InitStoreBean, newAddress: string) {
            state.address = newAddress;
        },
        editSafetyTop(state: InitStoreBean, safetyTop: number) {
            state.safetyTop = safetyTop;
        },
        editSafetyBottom(state: InitStoreBean, safetyBottom: number) {
            state.safetyBottom = safetyBottom;
        },
        editScreenScale(state: InitStoreBean, screenScale: number) {
            state.screenScale = screenScale;
        },
    },
    strict: true
})

export default store