<script setup lang="ts">
// import { useCurrentUserStore } from 'giime';
import MainDialog from '@/contentScripts/components/mainDialog/MainDialog.vue';
import contentIcon from '@/contentScripts/images/content-icon.png';

// const currentUserStore = useCurrentUserStore();

// 对话框显示状态
const isShowMainDialog = ref(false);
</script>

<template>
  <div>
    <div class="CRX-content">
      <el-image class="fixed bottom-[100px] right-[60px] z-50 h-[50px] w-[50px]" :src="contentIcon" @click="isShowMainDialog = true" />
      <MainDialog
        v-if="isShowMainDialog"
        :visible="isShowMainDialog"
        @onClose="
          () => {
            isShowMainDialog = false;
          }
        "
      />
    </div>
  </div>
</template>
