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
// element css
import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/message-box/style/css';
import 'element-plus/es/components/notification/style/css';
import 'element-plus/es/components/loading/style/css';
import App from './App.vue';
import router from './router';
import '@/permission'; // permission control
import './index.css';
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar/index.vue';
// 分页组件
import Pagination from '@/components/Pagination/index.vue';

const app = createApp(App);

app.config.globalProperties.productionTip = false;
// svg
import 'virtual:svg-icons-register';
app.component('SvgIcon', SvgIcon);
app.component('RightToolbar', RightToolbar);
app.component('Pagination', Pagination);

elementIcons.forEach(it => app.component(it.name, it));

app.use(ElementPlus, {
    locale: zhCn,
});
app.use(createPinia());
app.use(router);
app.mount('#app');
