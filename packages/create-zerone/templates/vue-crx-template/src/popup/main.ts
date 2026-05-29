// ⚠️ 必须是第一个 import，把 @giime/api factory 切成 CRX 版。
// 见 installCrxFirst.ts 的注释；ESM 会先把这个模块完整求值，再开始 import 'giime'。
import '@/installCrxFirst';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
// giime
import Giime from 'giime';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
// // element
// css
// import 'element-plus/dist/index.css'; // element-plus
import 'giime/theme-chalk/element/index.scss'; // element-plus
// import '@/styles/element-ui.scss'; // global css
import 'giime/theme-chalk/index.css'; // giime css变量
import 'giime/dist/index.css'; // giime组件样式
import router from './router';
import App from '@/popup/App.vue';
import '../style.css';

const app = createApp(App);

app.use(createPinia());
app.use(ElementPlus, {
  locale: zhCn,
});
// disabledLoginDialog: 我们用 @giime/crx 自己的登录流程（开新 tab），不用 giime 内嵌 iframe 弹窗
app.use(Giime, { env: import.meta.env, router, disabledLoginDialog: true });
// giime 内部组件依赖 vue-router 的 routeLocationKey 注入，不能删
app.use(router);
app.mount('#app');
