import { useLoading } from 'giime';
import type { HtmlDataInfo } from '../types';
import { gassChromeRuntimeSendMessage } from '@/api/gassApi/chromeRuntime';
import { contentScriptsMessage } from '@/utils/contentScriptsMessage';
import { chromeRuntimeProxy } from '@/api/chromeRuntime';

/**提交采集 */
export const useSubmitGather = () => {
  /**直接采集 */
  const handleDirectGatherBase = async (params?: { html_json?: HtmlDataInfo }) => {
    const { data } = await gassChromeRuntimeSendMessage('getTraceID');
    if (data.code !== 0) {
      return false;
    }
    const { is_contrast, is_auto_optimize, selectedLangIds } = await chrome.storage.local.get(['is_contrast', 'is_auto_optimize', 'selectedLangIds']);
    const { data: addTaskData } = await gassChromeRuntimeSendMessage('addTaskFromUrl', {
      crawl_args: {
        is_contrast,
        is_auto_optimize,
        selectedLangIds,
      },
      current_url: location.href,
      item_url: '',
      url_from: 2,
      trace_id: data.data,
      html_str: params?.html_json ? '' : document.documentElement.outerHTML,
      user_id: '',
      html_json: params?.html_json,
    });
    if (addTaskData.code !== 0) {
      return false;
    }
    contentScriptsMessage({ type: 'success', message: '采集成功' });
    return true;
  };
  const { exec: handleDirectGather, isLoading } = useLoading(handleDirectGatherBase);

  return {
    handleDirectGather,
    isLoading,
  };
};
