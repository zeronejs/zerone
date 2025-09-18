import { createChromeRuntimeSendMessage } from '../createChromeRuntime';
import { gsyncApiList } from './apiList';

// content script页面使用此方法调用接口
export const { chromeRuntimeSendMessage: gsyncChromeRuntimeSendMessage } = createChromeRuntimeSendMessage(gsyncApiList);
