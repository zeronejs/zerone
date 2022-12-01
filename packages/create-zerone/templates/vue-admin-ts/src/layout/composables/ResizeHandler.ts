import { watch, onBeforeMount, onBeforeUnmount, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore, useSettingStore } from '@/store';
const { body } = document;
const WIDTH = 992; // refer to Bootstrap's responsive design
export const useResizeHandler = () => {
    const route = useRoute();
    const appStore = useAppStore();
    const settingStore = useSettingStore();
    const sidebar = computed(() => appStore.sidebar);
    const device = computed(() => appStore.device);
    const fixedHeader = computed(() => settingStore.fixedHeader);
    const classObj = computed(() => ({
        hideSidebar: !sidebar.value.opened,
        openSidebar: sidebar.value.opened,
        withoutAnimation: sidebar.value.withoutAnimation,
        mobile: device.value === 'mobile',
    }));
    watch(route, newRoute => {
        console.log(newRoute);
        if (device.value === 'mobile' && sidebar.value.opened) {
            appStore.closeSideBar({ withoutAnimation: false });
        }
    });
    onBeforeMount(() => {
        window.addEventListener('resize', __resizeHandler);
    });
    onBeforeUnmount(() => {
        window.removeEventListener('resize', __resizeHandler);
    });
    onMounted(() => {
        const isMobile = __isMobile();
        if (isMobile) {
            appStore.toggleDevice('mobile');
            appStore.closeSideBar({ withoutAnimation: true });
        }
    });
    const handleClickOutside = () => appStore.closeSideBar({ withoutAnimation: false });
    const __isMobile = () => {
        const rect = body.getBoundingClientRect();
        return rect.width - 1 < WIDTH;
    };
    const __resizeHandler = () => {
        if (!document.hidden) {
            const isMobile = __isMobile();
            appStore.toggleDevice(isMobile ? 'mobile' : 'desktop');

            if (isMobile) {
                appStore.closeSideBar({ withoutAnimation: true });
            }
        }
    };
    return {
        sidebar,
        device,
        fixedHeader,
        classObj,
        handleClickOutside,
    };
};
