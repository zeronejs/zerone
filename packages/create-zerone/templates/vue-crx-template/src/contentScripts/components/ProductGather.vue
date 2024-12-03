<template>
  <div v-if="showPage">
    <div class="CRX-content fixed left-[60px] top-[42%] z-[1000]">
      <gm-button :loading="getInfoLoading" type="primary" class="" @click="handleGetGoodsInfo"> 编辑详情 </gm-button>
      <gm-button :loading="gatherLoading" type="primary" class="" @click="handleDirectGather"> 直接采集 </gm-button>
    </div>
    <ProductGatherInfo ref="productGatherInfoRef" />
  </div>
</template>
<script setup lang="ts">
import { useLoading } from 'giime';
import { getPlatformsGather } from '../classes';
import ProductGatherInfo from './ProductGatherInfo.vue';
import { useSubmitGather } from './hooks/useSubmitGather';
import type { PlatformGatherInterface } from '../classes/PlatformInterface';
import { gassChromeRuntimeSendMessage } from '@/api/gassApi/chromeRuntime';

const showPage = ref(false);
const PlatformsGather = ref<PlatformGatherInterface>();
const productGatherInfoRef = ref<InstanceType<typeof ProductGatherInfo>>();
onMounted(() => {
  PlatformsGather.value = getPlatformsGather();
  if (PlatformsGather.value && PlatformsGather.value.isDetails()) {
    showPage.value = true;
  }
});

const { handleDirectGather, isLoading: gatherLoading } = useSubmitGather();

const getGoodsInfo = async () => {
  const { data } = await gassChromeRuntimeSendMessage('/gcrawler/analysis/html', {
    current_url: location.href,
    html_str: document.documentElement.outerHTML,
  });
  if (data.code !== 0) {
    return;
  }
  productGatherInfoRef.value?.openDialog(data.result);
};
const { exec: handleGetGoodsInfo, isLoading: getInfoLoading } = useLoading(getGoodsInfo);
</script>
