<template>
  <gm-form :model="formTableData">
    <gm-table ref="multipleTable" :data="formTableData.tableData" style="width: 100%" class="z-20">
      <gm-table-column label="规格组" align="left" width="200">
        <template #default="{ row }: { row: SkusItem }">
          <div class="flex">
            <!-- {{ row.sku_title }} -->
            <gm-input :model-value="row.sku_title" disabled />
          </div>
        </template>
      </gm-table-column>
      <gm-table-column label="规格值" align="left">
        <template #default="{ row }: { row: SkusItem }">
          <div class="mb-[8px]">
            <gm-button plain size="small" @click="handleCheckAllChange(true, row)">全选</gm-button>
            <gm-button plain size="small" @click="handleCheckAllChange(false, row)">全不选</gm-button>
          </div>

          <div class="flex flex-wrap gap-[8px]">
            <el-tag
              v-for="tag in row.sku_property_list"
              :key="tag.sku_name"
              :type="!tag.is_select ? 'info' : undefined"
              class="cursor-pointer"
              @click="handleCloseSkuName(tag)"
            >
              {{ tag.sku_name }}
            </el-tag>
          </div>
        </template>
      </gm-table-column>
    </gm-table>
  </gm-form>
</template>
<script lang="ts" setup>
import type { HtmlDataInfo, SkusItem, SkusPropertyList } from '../types';

const props = defineProps<{
  dataInfo: HtmlDataInfo;
}>();
/**修改sku */
const formTableData = computed(() => {
  return {
    tableData: props.dataInfo?.skus || [],
  };
});
const handleFilterGoods = () => {
  for (const goodItem of props.dataInfo.sku_info_list) {
    const skuNames = goodItem.name.split(',');
    for (const [index, skuName] of skuNames.entries()) {
      const findItem = props.dataInfo.skus[index].sku_property_list.find(it => it.sku_name === skuName);
      if (!findItem?.is_select) {
        goodItem.is_select = false;
        break;
      } else {
        goodItem.is_select = true;
      }
    }
    // for (const skuName of skuNames) {
    //   const skuItem = props.dataInfo.skus.find(it => it.sku_property_list.find(item => item.sku_name === skuName));
    //   console.log(skuItem);
    //   const findItem = skuItem?.sku_property_list.find(item => item.sku_name === skuName);
    //   if (findItem?.is_select) {
    //     goodItem.is_select = false;
    //     break;
    //   } else {
    //     goodItem.is_select = true;
    //   }
    // }
  }
};
/**单个取消选中 */
const handleCloseSkuName = (tag: SkusPropertyList) => {
  tag.is_select = !tag.is_select;
  // props.dataInfo.sku_info_list.forEach(it => {
  //   if (!it.name.split(',').includes(tag.sku_name)) {
  //     return;
  //   }
  //   it.is_select = tag.is_select;
  // });
  handleFilterGoods();
};

/**全选或全不选 */
const handleCheckAllChange = (val: boolean, row: SkusItem) => {
  // const skuName = row.sku_property_list.map(it => it.sku_name);
  row.sku_property_list.forEach(it => {
    it.is_select = val;
  });
  // props.dataInfo.sku_info_list.forEach(it => {
  //   if (it.name.split(',').some(item => skuName.includes(item))) {
  //     it.is_select = val;
  //   }
  // });
  handleFilterGoods();
};
</script>
