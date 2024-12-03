import { createChromeRuntimeSendMessage } from '../createChromeRuntime';
import { gstoreApiList } from './apiList';
export const { chromeRuntimeSendMessage: gstoreChromeRuntimeSendMessage } = createChromeRuntimeSendMessage(gstoreApiList);
