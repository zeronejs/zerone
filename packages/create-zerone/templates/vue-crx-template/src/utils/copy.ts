import useClipboard from 'vue-clipboard3';
import { GmMessage } from 'giime';
import { getCrxConfig } from '@giime/crx';

/**
 * 复制到剪贴板，并按当前环境（contentScript shadow DOM / 普通页面）弹消息
 */
export const handleCopy = async (str: string) => {
  const { toClipboard } = useClipboard();
  const appendTo = getCrxConfig().contentScriptRoot;

  try {
    await toClipboard(str);
    GmMessage({
      appendTo: appendTo as HTMLElement | undefined,
      type: 'success',
      message: '复制成功',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('[handleCopy] error', error);
    GmMessage({
      appendTo: appendTo as HTMLElement | undefined,
      type: 'error',
      message: '复制失败',
    });
  }
};
