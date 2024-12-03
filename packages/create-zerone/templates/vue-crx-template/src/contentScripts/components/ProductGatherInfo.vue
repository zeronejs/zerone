<template>
  <div class="select-auto">
    <gm-dialog v-model="isVisible" title="编辑详情" width="1300" top="50px" @closed="handleSelfClose">
      <RectSelect style="z-index: 999" />

      <div v-if="!dataInfo">
        <gm-Empty />
      </div>
      <div v-else class="max-h-[80vh] space-y-[12px] overflow-y-auto">
        <section>
          <SectionTitle title="产品信息" />
          <div class="flex items-center"><span class="mr-[8px] shrink-0">产品名称：</span> <gm-input v-model="dataInfo.title" class="w-full" /></div>
        </section>
        <section>
          <SectionTitle title="修改SKU">
            <template #more>
              <span class="ml-[12px] text-[14px] font-normal text-gray-500">
                (总数：{{ skuSelectCount.total }} 已选：{{ skuSelectCount.selectedCount }})
              </span>
            </template>
          </SectionTitle>
          <SkuGroup :data-info="dataInfo" />
        </section>
        <section>
          <SectionTitle title="SKU信息">
            <template #more>
              <span class="ml-[12px] text-[14px] font-normal text-gray-500">
                (总数：{{ skuSelectCount.total }} 已选：{{ skuSelectCount.selectedCount }})
              </span>
            </template>
          </SectionTitle>
          <SkuList :data-info="dataInfo" />
        </section>
        <section>
          <SectionTitle title="轮播图" />
          <ImageList ref="imagesRef" :imgList="dataInfo.images" />
        </section>
        <section>
          <SectionTitle title="详情图" />
          <ImageList ref="detailImagesRef" :imgList="dataInfo.detail_images" />
        </section>
        <section>
          <SectionTitle title="视频" />
          <VideoList ref="videosRef" :videoList="dataInfo.videos" />
        </section>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <gm-button type="primary" :loading="gatherLoading" @click="submitForm">确 定</gm-button>
          <gm-button @click="handleSelfClose">取 消</gm-button>
        </div>
      </template>
    </gm-dialog>
  </div>
</template>
<script lang="ts" setup>
import RectSelect from 'giime/es/components/src/base/rectSelect/RectSelect.vue';
import { cloneDeep } from 'lodash-es';
import SkuGroup from './productGatherInfo/SkuGroup.vue';
import ImageList from './productGatherInfo/ImageList.vue';
import VideoList from './productGatherInfo/VideoList.vue';
import SkuList from './productGatherInfo/SkuList.vue';
import { useSubmitGather } from './hooks/useSubmitGather';
import type { HtmlDataInfo } from './types';
import type { PostGcrawlerAnalysisHtmlResultResult } from '@/api/gassApi/controller';
import SectionTitle from '@/components/SectionTitle.vue';
import { contentScriptsMessage } from '@/utils/contentScriptsMessage';

/**轮播图 */
const imagesRef = useTemplateRef('imagesRef');
/**详情图 */
const detailImagesRef = useTemplateRef('detailImagesRef');
/**视频 */
const videosRef = useTemplateRef('videosRef');

const isVisible = ref(false);

const dataInfo = ref<HtmlDataInfo>();

const skuSelectCount = computed(() => {
  const total = dataInfo.value?.sku_info_list.length;
  return {
    total,
    selectedCount: dataInfo.value?.sku_info_list.filter(it => it.is_select).length,
  };
});
const openDialog = (data: PostGcrawlerAnalysisHtmlResultResult) => {
  isVisible.value = true;
  dataInfo.value = {
    ...data,
    sku_info_list: data.sku_info_list.map(it => ({
      ...it,
      is_select: true,
      length: '',
      width: '',
      height: '',
      weight: '',
    })),
    skus: data.skus.map(it => ({
      ...it,
      sku_property_list: it.sku_property_list.map(item => ({
        ...item,
        is_select: true,
      })),
    })),
  };
};
const handleSelfClose = () => {
  isVisible.value = false;
};
const { handleDirectGather, isLoading: gatherLoading } = useSubmitGather();

const submitForm = async () => {
  if (!dataInfo.value) {
    return contentScriptsMessage('请先获取商品信息');
  }
  const params = cloneDeep(dataInfo.value);
  //过滤出选中的图
  const images = params.images.filter((it, index) => imagesRef.value?.checkedIndexsArr.includes(index));
  const detailImages = params.detail_images.filter((it, index) => detailImagesRef.value?.checkedIndexsArr.includes(index));
  const videos = params.videos.filter((it, index) => videosRef.value?.checkedIndexsArr.includes(index));
  const mergeParams = {
    ...params,
    images,
    detail_images: detailImages,
    videos,
  };
  const res = await handleDirectGather({ html_json: mergeParams });
  if (res) {
    handleSelfClose();
  }
};
defineExpose({
  openDialog,
});
</script>
