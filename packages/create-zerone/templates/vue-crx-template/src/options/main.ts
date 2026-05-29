import { createApp } from 'vue';
import App from './Options.vue';
import '../style.css';

// 简单的 vue demo 你需要各种依赖时 再自行导入
const app = createApp(App);

app.mount('#app');

// ============================================================
// 大多数插件不需要 options 页。如果要启用 options，把下面这段取消注释，
// 跟 popup 范式保持一致（pinia / element-plus / giime / crx 配置都装上）。
// 注释保留是为了控制 options 的打包体积。
// ============================================================
// import { createPinia } from 'pinia';
// import ElementPlus from 'element-plus';
// import zhCn from 'element-plus/es/locale/lang/zh-cn';
// import Giime from 'giime';
// import 'giime/theme-chalk/element/index.scss';
// import 'giime/theme-chalk/index.css';
// import 'giime/dist/index.css';
//
// app.use(createPinia());
// app.use(ElementPlus, { locale: zhCn });
// // disabledLoginDialog: 用 @giime/crx 自己的登录流程
// app.use(Giime, { env: import.meta.env, disabledLoginDialog: true });
