import { defineStore } from 'pinia';
import { vueLocalStorage } from '@/utils/vueLocalStroge';
const state = {
    sidebar: {
        opened: Boolean(vueLocalStorage.getItem('sidebarStatus')),
        withoutAnimation: false,
    },
    device: 'desktop',
};
export type AppState = typeof state;
export const useAppStore = defineStore({
    id: 'app',
    state: () => state,
    getters: {
        appSidebar: state => state.sidebar,
        appDevice: state => state.device,
    },
    actions: {
        toggleSideBar() {
            this.sidebar.opened = !this.sidebar.opened;
            this.sidebar.withoutAnimation = false;
            if (this.sidebar.opened) {
                vueLocalStorage.setItem('sidebarStatus', true);
            } else {
                vueLocalStorage.setItem('sidebarStatus', false);
            }
        },
        closeSideBar({ withoutAnimation }: { withoutAnimation: AppState['sidebar']['withoutAnimation'] }) {
            vueLocalStorage.setItem('sidebarStatus', false);
            this.sidebar.opened = false;
            this.sidebar.withoutAnimation = withoutAnimation;
        },
        toggleDevice(device: AppState['device']) {
            this.device = device;
        },
    },
});
