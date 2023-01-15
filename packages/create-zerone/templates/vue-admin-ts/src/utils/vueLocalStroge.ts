import { LocalStorage } from '@zeronejs/utils';
export interface LocalStorageEntities {
    // token
    vue_admin_template_token: string;
    sidebarStatus:boolean
}
// docs: https://zerone.top/zh/techniques/utils.html#localstorage
export const vueLocalStorage = new LocalStorage<LocalStorageEntities>();
