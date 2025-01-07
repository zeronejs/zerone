<template>
  <main class="text-center">
    <!-- tailwindcss -->
    <h1 class="text-3xl font-bold underline">Hello world!</h1>
    构建时间 {{ appBuildTime }}
    <!-- svg icon -->
    <div>
      svg icon <gm-icon><SvgIcon icon-class="jump" /></gm-icon> iconfont <i class="gfont icon-yonghu1" />
    </div>
    <!-- element icon -->
    <div>
      element icon <gm-icon><CirclePlus /></gm-icon>
    </div>
    <!-- element-plus -->
    <gm-table-ctx table-id="UniqueID">
      <gm-table style="width: 100%" :data="tableData">
        <gm-table-column a b prop="date" label="Date" width="180" />
        <gm-table-column prop="name" label="Name" width="180" />

        <gm-table-column prop="address" label="Address" />
      </gm-table>
    </gm-table-ctx>
    <gm-row class="mb-4">
      <gm-button>Default</gm-button>
      <gm-button type="primary">Primary</gm-button>
      <gm-button type="success" @click="handleMessage">Success</gm-button>
      <gm-button type="info">Info</gm-button>
      <gm-button type="warning">Warning</gm-button>
      <gm-button type="danger">Danger</gm-button>
    </gm-row>
    <ul class="flex flex-wrap p-9">
      <li v-for="(item, index) in routes" :key="index" class="mb-3 ml-3">
        <gm-button type="primary" @click="$router.push(item.path)">
          {{ item.path }} <span v-if="item.meta?.title">（{{ item.meta?.title }}）</span>
        </gm-button>
      </li>
    </ul>
  </main>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import { CirclePlus } from '@element-plus/icons-vue';
import { routes } from '@/router';

const appBuildTime = dayjs(__APP_BUILD_TIME__).format('YYYY-MM-DD HH:mm:ss');
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
];
const handleMessage = () => {
  GmMessage('test');
  GmMessageBox({});
};
</script>
