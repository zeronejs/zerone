import { createApp } from 'vue';
import { createPinia } from 'pinia';
// element-plus
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
// dayjs
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
// giime
import Giime from 'giime';

// svg图标
import 'virtual:svg-icons-register';
import App from './App.vue';
import router from './router';
// css
// import 'element-plus/dist/index.css'; // element-plus
import 'giime/theme-chalk/element/index.scss'; // element-plus
import '@/styles/element-ui.scss'; // global css
import 'giime/theme-chalk/index.css'; // giime css变量
import 'giime/dist/index.css'; // giime组件样式
import './style.css';
// import './assets/main.css'
// svg图标
import SvgIcon from '@/components/SvgIcon.vue';
// 分页组件
import Pagination from '@/components/Pagination.vue';
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar.vue';

dayjs.locale('zh-cn');

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
});
app.use(Giime, { env: import.meta.env, router });
app.component('SvgIcon', SvgIcon);
app.component('RightToolbar', RightToolbar);
app.component('Pagination', Pagination);

app.mount('#app');
