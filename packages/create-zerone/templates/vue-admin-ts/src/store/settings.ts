import defaultSettings from '@/settings';
import { defineStore } from 'pinia';

const { fixedHeader, sidebarLogo } = defaultSettings;
const state = {
    fixedHeader: fixedHeader,
    sidebarLogo: sidebarLogo,
};
type SettingState = typeof state;
type SettingChangeInput<T extends keyof SettingState = keyof SettingState> = T extends T
    ? [{ key: T; value: SettingState[T] }] extends Array<infer R>
        ? R
        : never
    : never;

export const useSettingStore = defineStore({
    id: 'settings',
    state: () => state,
    actions: {
        changeSetting(data: SettingChangeInput) {
            Reflect.set(this, data.key, data.value);
        },
    },
});
