import { createApp } from 'vue';
import ElementPlus from 'element-plus';
// import '@/content/element-plus.scss'
import 'element-plus/dist/index.css';
// element
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import Content from '@/content/content.vue';
import '../style.css';
let crxApp = document.querySelector('#CRX-container');

// 创建id为CRX-container的div
if (!crxApp) {
  const crxApp = document.createElement('div');
  crxApp.id = 'CRX-container';
  // 将刚创建的div插入body最后
  document.body.appendChild(crxApp);
}

// 创建Vue APP
const app = createApp(Content);
// 集成Element Plus
app.use(ElementPlus, {
  locale: zhCn,
});
// setTimeout(() => {
app.mount('#CRX-container');
// }, 10);
// 将Vue APP插入刚创建的div
console.log('content');
// 向目标页面驻入js
try {
  let insertScript = document.createElement('script');
  insertScript.setAttribute('type', 'text/javascript');
  insertScript.src = window.chrome.runtime.getURL('insert.js');
  document.body.appendChild(insertScript);
} catch (err) {}
