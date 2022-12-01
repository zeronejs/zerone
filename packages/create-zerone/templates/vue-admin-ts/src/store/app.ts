import Cookies from 'js-cookie';
import { defineStore } from 'pinia';
const state = {
    sidebar: {
        opened: Boolean(Cookies.get('sidebarStatus')),
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
                Cookies.set('sidebarStatus', '1');
            } else {
                Cookies.set('sidebarStatus', '0');
            }
        },
        closeSideBar({ withoutAnimation }: { withoutAnimation: AppState['sidebar']['withoutAnimation'] }) {
            Cookies.set('sidebarStatus', '0');
            this.sidebar.opened = false;
            this.sidebar.withoutAnimation = withoutAnimation;
        },
        toggleDevice(device: AppState['device']) {
            this.device = device;
        },
    },
});
