// ⚠️ 必须是第一个 import，把 @giime/api factory 切成 CRX 版。
// 见 installCrxFirst.ts 的注释；ESM 会先把这个模块完整求值，再开始 import 'giime'。
import '@/installCrxFirst';
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
// element
import zhCn from 'element-plus/es/locale/lang/zh-cn';
// giime
import Giime from 'giime';

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

import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia } from 'pinia';
import { configureCrx } from '@giime/crx';
import App from '@/contentScripts/App.vue';
// svg图标
// import SvgIcon from '@/components/SvgIcon.vue';
import '../style.css';
import './checkVersion';

// (() => {
// eslint-disable-next-line no-console
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

  // crxAxios 唯一必须的配置：把 shadow DOM root 告诉 notify 模块，
  // 让 GmMessage 挂到这个 root 而不是宿主页面的 body。
  // cookieDomain 默认随 VITE_GIIME_MODE 自动匹配（见 envMode.ts），tokenCookieName 默认 'dk_plugin_auth_token'，不用传。
  configureCrx({ contentScriptRoot: root });

  // console.log('root', root);
  const app = createApp(App);

  // app.component('SvgIcon', SvgIcon);
  // 集成Element Plus
  app.use(ElementPlus, {
    locale: zhCn,
  });
  app.use(createPinia());
  // GmButton 等组件内部依赖 vue-router 的 routeLocationKey 注入，宿主必须 app.use(router)，
  // 否则会报 injection "Symbol(route location)" not found。
  // catch-all 兜底是为了消除 giime 内部组件 resolve "/" 时的 "No match found" warn —— 永远不会真展示。
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', name: 'crx-noop', component: { render: () => null } }],
  });

  // disabledLoginDialog: 我们用 @giime/crx 自己的登录流程（开新 tab），不用 giime 内嵌 iframe 弹窗
  // disabledVersionAttr: content script 里的 document.body 是宿主页 body，
  //   不关掉 giime 会写 `data-giime-version` 进去，跟宿主页（如果也是 giime 项目）来回打架
  app.use(Giime, {
    env: import.meta.env,
    router,
    disabledLoginDialog: true,
    disabledRectSelect: true,
    disabledVersionAttr: true,
  });
  app.use(router);

  app.mount(root);
};

// 是否是需要加载页面
// if (gatherList.some(it => it.case)) {
main();
// }
// })();
