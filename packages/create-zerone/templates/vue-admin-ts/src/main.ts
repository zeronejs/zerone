import { createApp } from 'vue';
import { createPinia } from 'pinia';
// css
import 'normalize.css/normalize.css'; // A modern alternative to CSS resets
// import 'element-plus/dist/index.css';
import '@/styles/index.scss'; // global css

// icons
import SvgIcon from '@/components/SvgIcon/index.vue'; // svg component
import elementIcons from './icons/elementIcons';

// element
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import 'element-plus/theme-chalk/el-loading.css';
import 'element-plus/theme-chalk/el-message.css';
import App from './App.vue';
import router from './router';
import '@/permission'; // permission control
import './index.css';

const app = createApp(App);

app.config.globalProperties.productionTip = false;
// svg
import 'virtual:svg-icons-register';
app.component('SvgIcon', SvgIcon);

elementIcons.forEach(it => app.component(it.name, it));

app.use(ElementPlus, {
    locale: zhCn,
});
app.use(createPinia());
app.use(router);
app.mount('#app');
