import { type AppContext, isVNode } from 'vue';
import { GmMessage, isString } from 'giime';
import { isFunction } from 'lodash-es';
import type { MessageOptions, MessageParams } from 'element-plus';
import { root } from '@/contentScripts';

export const contentScriptsMessage = (options: MessageParams, appContext?: null | AppContext) => {
  const inputMessage = !options || isString(options) || isVNode(options) || isFunction(options) ? { message: options } : options;
  const message = `<strong style="font-size:30px;"> ${inputMessage.message} </strong>`;
  GmMessage({ appendTo: root as HTMLElement, dangerouslyUseHTMLString: true, ...(options as any), message }, appContext);
};
