// import { getFamilyListApi } from '@/api/staff';
import { defineStore } from 'pinia';

export const useAppStore = defineStore({
  id: 'app',
  state: () => {
    return {
      // 登录弹窗
      showLogin: false,
    };
  },
});
