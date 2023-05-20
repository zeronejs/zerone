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
// svg图标
import 'virtual:svg-icons-register';
import App from './App.vue';
import router from './router';
import './style.css';
// import './assets/main.css'
// svg图标
import SvgIcon from '@/components/SvgIcon.vue';
// 分页组件
import Pagination from '@/components/Pagination.vue';
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar.vue';
import '@/styles/element-ui.scss'; // global css

const app = createApp(App);
app.use(ElementPlus, {
  locale: zhCn,
});
app.use(createPinia());
app.component('svg-icon', SvgIcon);
app.component('RightToolbar', RightToolbar);
app.component('Pagination', Pagination);
app.use(router);

app.mount('#app');
