<template>
  <el-dialog v-model="appStore.showLogin" width="80%" append-to-body>
    <iframe v-if="appStore.showLogin" class="h-[600px] w-full" :src="loginUrl" />
  </el-dialog>
</template>
<script setup lang="ts">
import Cookies from 'js-cookie';
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();
const loginUrl = ref('');
const url = 'https://gsso.giikin.com/admin/login/index?_system=18&_url=';
const login = () => {
  const protocol = window.location.protocol;
  const host = window.location.host;
  const myPath = window.location.pathname;
  loginUrl.value = `${url + protocol}//${host}${myPath}`;
  // console.log(loginUrl.value);
};
watch(
  () => appStore.showLogin,
  value => {
    if (value) {
      login();
    }
  }
);
onMounted(() => {
  if (appStore.showLogin) {
    login();
  }
  // iframe事件监听
  window.addEventListener('message', e => {
    // 刷新登陆状态
    if (e.data.type == 'giikin-Logged') {
      if (!import.meta.env.PROD && e.data?.data?.token) {
        // 设置 Cookie 过期时间为 2 小时
        const now = new Date();
        let time = now.getTime();
        time += 7200 * 1000; // 2 小时之后的时间（单位：毫秒）
        now.setTime(time);
        Cookies.set('token', e.data.data.token, { expires: now });
      }
      // ElMessage.success('登录成功，请关闭弹窗');
      appStore.showLogin = false;
    }
  });
});
</script>
