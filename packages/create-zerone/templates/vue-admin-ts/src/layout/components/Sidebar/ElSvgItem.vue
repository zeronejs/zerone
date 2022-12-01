<script setup lang="ts">
defineProps({
    elSvgName: {
        require: true,
        default: 'Fold',
        type: String,
    },
});
</script>
<template>
    <el-icon class="el-svg-icon">
        <component :is="elSvgName" />
    </el-icon>
</template>

<style scoped lang="scss">
.el-svg-icon {
    width: 16px !important;
    height: 16px !important;
    text-align: left !important;
    margin-right: 14px !important;
}
</style>
