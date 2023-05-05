import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
// element css； 其他组件会自动导入，无需再导入css
import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/message-box/style/css';
import 'element-plus/es/components/notification/style/css';
import 'element-plus/es/components/loading/style/css';
import 'element-plus/es/components/tree/style/css';
// element
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import App from './App.vue';
import router from './router';
import './style.css';

// import './assets/main.css'

const app = createApp(App);
app.use(ElementPlus, {
  locale: zhCn,
});
app.use(createPinia());
app.use(router);

app.mount('#app');
