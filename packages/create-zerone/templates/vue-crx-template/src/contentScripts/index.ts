import { createApp } from 'vue';
import ElementPlus from 'element-plus';
// element
import zhCn from 'element-plus/es/locale/lang/zh-cn';
// giime
import Giime, { isString } from 'giime';

// 线性图标
import '@/assets/gfont/iconfont.css';
// import '@/contentScripts/element-plus.scss';
// import 'element-plus/dist/index.css'; // element-plus
import 'giime/theme-chalk/element/index.scss'; // element-plus
// import '@/styles/element-ui.scss'; // global css
import 'giime/theme-chalk/index.css'; // giime css变量
import 'giime/dist/index.css'; // giime组件样式

// svg图标
// import 'virtual:svg-icons-register';

import { createRouter, createWebHashHistory } from 'vue-router';
import { createPinia } from 'pinia';
import Content from '@/contentScripts/content.vue';
// svg图标
// import SvgIcon from '@/components/SvgIcon.vue';
// 复制组件
import CopyIcon from '@/components/CopyIcon.vue';
import '../style.css';
import './checkVersion';

// (() => {
console.info(`[你的插件: ${__NAME__}] 欢迎来到 content script`);

const container = document.createElement('div');
container.id = __NAME__;
export const root = document.createElement('div');
const main = () => {
  root.style.position = 'relative';
  root.style.zIndex = `99999999`;
  root.id = `${__NAME__}-app`;
  const styleEl = document.createElement('link');
  // const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container;
  const shadowDOM = container.attachShadow?.({ mode: 'open' }) || container;
  // const shadowDOM = container;
  styleEl.setAttribute('rel', 'stylesheet');
  styleEl.setAttribute('href', chrome.runtime.getURL('dist/contentScripts/style.css'));
  shadowDOM.appendChild(styleEl);
  shadowDOM.appendChild(root);
  document.body.appendChild(container);

  // console.log('root', root);
  const app = createApp(Content);
  // app.component('SvgIcon', SvgIcon);
  app.component('CopyIcon', CopyIcon);
  // 集成Element Plus
  app.use(ElementPlus, {
    locale: zhCn,
  });
  app.use(createPinia());
  app.use(Giime, { env: import.meta.env, router: createRouter({ history: createWebHashHistory(), routes: [] }) });

  app.mount(root);
};
// 是否是需要加载页面
// if (gatherList.some(it => it.case)) {
main();
// }
// })();
