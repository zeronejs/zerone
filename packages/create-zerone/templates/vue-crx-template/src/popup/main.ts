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
import Popup from '@/popup/popup.vue';
import '../style.css';

const app = createApp(Popup);
app.use(createPinia());
app.use(ElementPlus, {
  locale: zhCn,
});
app.use(Giime, { env: import.meta.env, router });
// app.use(router);
app.mount('#app');
