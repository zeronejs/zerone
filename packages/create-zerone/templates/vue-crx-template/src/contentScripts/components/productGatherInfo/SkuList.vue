<template>
  <gm-form :model="formTableData">
    <gm-table
      ref="multipleTable"
      :data="formTableData.tableData"
      style="width: 100%"
      :height="`${formTableData.tableData.length >= 3 ? tableHeight + `px` : 100 + '%'}`"
      class="z-20"
    >
      <gm-table-column width="55">
        <template #header>
          <gm-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange" />
        </template>
        <template #default="{ row }">
          <gm-checkbox v-model="row.is_select" @change="resetEditSku" />
        </template>
      </gm-table-column>
      <gm-table-column label="sku信息" align="left">
        <template #header>
          <gm-input v-model="searchVal" clearable placeholder="输入关键字搜索" style="width: 150px" />
        </template>
        <template #default="{ row }">
          <div class="flex">
            <gm-image :src="row.sku_img_url" :preview-src-list="[row.sku_img_url]" class="mr-[12px] h-[60px] w-[60px] shrink-0 rounded" />
            <div class="">
              <div class="">
                <ContentEditInput v-model="row.name" width="200" />
              </div>
              <div class="text-gray-500">{{ row.sku_id }}</div>
            </div>
          </div>
        </template>
      </gm-table-column>
      <gm-table-column label="SKU成本价" prop="price" align="left" width="260">
        <template #header>
          <div class="flex items-center">
            <span class="mr-[8px] shrink-0">SKU成本价</span>
            <gm-tooltip class="item" effect="dark" content="批量改价" placement="top">
              <gm-icon v-show="!showBatchPrice" size="24" class="cursor-pointer" @click="showBatchPrice = true"><i-ep-Edit /></gm-icon>
            </gm-tooltip>
            <gm-input
              v-show="showBatchPrice"
              v-model="batchPriceInput"
              clearable
              size="default"
              placeholder="批量改价"
              style="width: 150px"
              @keyup.enter="handleBatchPrice"
            />
            <gm-button v-show="showBatchPrice" type="primary" size="default" class="ml-[8px]" @click="handleBatchPrice">确定</gm-button>
          </div>
        </template>
        <template #default="{ row }">
          <div>
            <!-- :prop="'tableData.' + row.$index + '.price'"
                  :rules="[{ validator: checkCharacterLen(row.price), trigger: ['blur', 'change'] }]" -->
            <gm-form-item>
              <gm-input v-model="row.price" placeholder="请输入SKU成本价" style="width: 200px">
                <template #prepend>
                  <p>￥</p>
                </template>
              </gm-input>
            </gm-form-item>
          </div>
        </template>
      </gm-table-column>

      <gm-table-column label="体积" align="left" width="290">
        <template #header>
          <div class="flex items-center">
            <span class="mr-[8px] shrink-0">体积</span>
            <gm-tooltip class="item" effect="dark" content="批量改重" placement="top">
              <gm-icon v-show="!showBatchVolume" size="24" class="cursor-pointer" @click="showBatchVolume = true"><i-ep-Edit /></gm-icon>
            </gm-tooltip>
            <gm-input
              v-show="showBatchVolume"
              v-model="batchLengthtInput"
              clearable
              size="small"
              placeholder="长"
              style="width: 150px"
              @keyup.enter="handleBatchVolume"
            />
            <gm-input
              v-show="showBatchVolume"
              v-model="batchWidthInput"
              clearable
              size="small"
              placeholder="宽"
              style="width: 150px"
              @keyup.enter="handleBatchVolume"
            />
            <gm-input
              v-show="showBatchVolume"
              v-model="batchHeightInput"
              clearable
              size="small"
              placeholder="高"
              style="width: 150px"
              @keyup.enter="handleBatchVolume"
            />
            <gm-button v-show="showBatchVolume" type="primary" size="small" class="ml-[8px]" @click="handleBatchVolume">确定</gm-button>
          </div>
        </template>

        <template #default="{ row }">
          <gm-input v-model="row.length" class="w-[150px]" size="small">
            <template #append>
              <p>cm</p>
            </template>
          </gm-input>
          <gm-input v-model="row.width" class="w-[150px]" size="small">
            <template #append>
              <p>cm</p>
            </template>
          </gm-input>
          <gm-input v-model="row.height" class="w-[150px]" size="small">
            <template #append>
              <p>cm</p>
            </template>
          </gm-input>
        </template>
      </gm-table-column>
      <gm-table-column label="重量" prop="weight" align="left" width="230">
        <template #header>
          <div class="flex items-center">
            <span class="mr-[8px] shrink-0">重量</span>
            <gm-tooltip class="item" effect="dark" content="批量改重" placement="top">
              <gm-icon v-show="!showBatchWeight" size="24" class="cursor-pointer" @click="showBatchWeight = true"><i-ep-Edit /></gm-icon>
            </gm-tooltip>
            <gm-input
              v-show="showBatchWeight"
              v-model="batchWeightInput"
              clearable
              size="default"
              placeholder="批量改重"
              style="width: 150px"
              @keyup.enter="handleBatchWeight"
            />
            <gm-button v-show="showBatchWeight" type="primary" size="default" class="ml-[8px]" @click="handleBatchWeight">确定</gm-button>
          </div>
        </template>
        <template #default="{ row }">
          <gm-input v-model="row.weight" class="w-full">
            <template #append>
              <p>g</p>
            </template>
          </gm-input>
        </template>
      </gm-table-column>
    </gm-table>
  </gm-form>
</template>

<script lang="ts" setup>
import type { HtmlDataInfo } from '../types';
import ContentEditInput from '@/components/ContentEditInput.vue';

const props = defineProps<{
  dataInfo: HtmlDataInfo;
}>();

const tableHeight = ref(450);
const searchVal = ref('');
/**选择sku */
const formTableData = computed(() => {
  return {
    tableData:
      props.dataInfo?.sku_info_list.filter(data => !searchVal.value || data.name.toLowerCase().includes(searchVal.value.toLowerCase())) || [],
  };
});
/** 全选状态*/
const checkAll = computed(() => {
  return formTableData.value.tableData.every(it => it.is_select);
});
/**半选状态*/
const isIndeterminate = computed(() => {
  return !checkAll.value && formTableData.value.tableData.some(it => it.is_select);
});

/**全选 */
const handleCheckAllChange = (val: any) => {
  formTableData.value.tableData.forEach(it => (it.is_select = val));
  resetEditSku();
};

const batchPriceInput = ref('');
//是否显示批量修改价格
const showBatchPrice = ref(false);
//是否显示批量修改重量
const showBatchWeight = ref(false);
//是否显示批量修改体积
const showBatchVolume = ref(false);
/**批量修改价格*/
const handleBatchPrice = () => {
  formTableData.value.tableData.forEach(it => (it.price = batchPriceInput.value));
  showBatchPrice.value = false;
};
const batchWeightInput = ref('');
/**批量修改重量*/
const handleBatchWeight = () => {
  formTableData.value.tableData.forEach(it => (it.weight = batchWeightInput.value));
  showBatchWeight.value = false;
};
const batchLengthtInput = ref('');
const batchWidthInput = ref('');
const batchHeightInput = ref('');
/**批量修改体积 */
const handleBatchVolume = () => {
  formTableData.value.tableData.forEach(it => {
    it.length = batchLengthtInput.value;
    it.width = batchWidthInput.value;
    it.height = batchHeightInput.value;
    return it;
  });
  showBatchVolume.value = false;
};

const resetEditSku = () => {
  const seletedSku = props.dataInfo?.sku_info_list.filter(it => it.is_select) ?? [];
  props.dataInfo.skus.forEach(skuIt => {
    skuIt.sku_property_list.forEach(skuPropertyIt => {
      skuPropertyIt.is_select = seletedSku.some(it => it.name.split(',').includes(skuPropertyIt.sku_name));
    });
  });
};
</script>
