/* eslint-disable no-console */
import { GmMessage } from 'giime';
import { getCrxConfig } from '@giime/crx';

/**
 * 检查当前插件版本是否过低
 *
 * 流程：
 * 1. 从 __ENV__.VITE_BASE_URL 拼出 config.json 地址
 * 2. fetch 拿到线上当前发布的版本号
 * 3. 跟本地 __VERSION__ 对比
 * 4. 过低则提示用户下载新版（挂到 contentScript shadow DOM root）
 *
 * 历史：原版走 chrome.runtime.sendMessage → background apiList → getBuildConfig。
 * 现在改成 contentScript 直接 fetch，省一个 round-trip，也不依赖 apiList 那套机制。
 */
const fetchBuildConfig = async (): Promise<{ version?: string; downloadUrl?: string } | undefined> => {
  if (!__ENV__.VITE_BASE_URL) return;
  const url = new URL('dist/js/config.json', `${__ENV__.VITE_BASE_URL}/`).toString();

  try {
    const res = await fetch(url, { cache: 'no-cache' });

    return await res.json();
  } catch (e) {
    console.log('[checkVersion] fetch config.json failed', e);

    return undefined;
  }
};

const checkVersion = async () => {
  if (__DEV__) {
    console.log('开发环境 无需检查当前版本');

    return;
  }

  const data = await fetchBuildConfig();

  if (!data) {
    console.log('获取构建信息失败, 可能无需检查版本');

    return;
  }

  if (data.version && data.version > __VERSION__) {
    console.log(`请更新当前插件：${__NAME__}`);
    const appendTo = getCrxConfig().contentScriptRoot;

    GmMessage({
      appendTo: appendTo as HTMLElement | undefined,
      dangerouslyUseHTMLString: true,
      message: `<div>${__DISPLAY_NAME__} 版本过低，请安装最新版：
       <a href="${data.downloadUrl}" download="filename.txt" style="color: #0000FF;">下载文件</a>
      </div>`,
      type: 'error',
      duration: 10_000,
      showClose: true,
    });

    return;
  }
  console.log('当前插件已是最新版');
};

checkVersion();
