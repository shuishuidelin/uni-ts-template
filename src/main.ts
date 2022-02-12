import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App);
// 为自定义的选项 'myOption' 注入一个处理器。
app.mixin({
    data() {
        return {
            clearMove: () => { },
            closePop() { this.$emit("closePop") }
        }
    }
})
app.mount('#app')