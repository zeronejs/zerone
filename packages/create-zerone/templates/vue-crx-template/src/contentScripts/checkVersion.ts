/* eslint-disable no-console */
import { chromeRuntimeProxy } from '@/api/chromeRuntime';
import { contentScriptsMessage } from '@/utils/contentScriptsMessage';
/**
 * 检查当前版本
 */
const checkVersion = async () => {
  if (__DEV__) {
    console.log('开发环境 无需检查当前版本');
    return;
  }
  const data = await chrome.runtime.sendMessage({
    type: 'getBuildConfig',
  });

  if (data.version > __VERSION__) {
    console.log(`请更新当前插件：${__NAME__}`);
    return contentScriptsMessage({
      dangerouslyUseHTMLString: true,
      message: `<div>${__DISPLAY_NAME__} 版本过低，请安装最新版：
       <a href="${data.downloadUrl}" download="filename.txt" style="color: #0000FF;" >下载文件</a>
      </div>`,
      type: 'error',
      duration: 10_000,
      showClose: true,
    });
  }
  console.log('当前插件已是最新版');
};
checkVersion();
