<script setup lang="ts">
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage

import { isExternal as imIsExternal } from '@/utils/validate';
import { computed } from 'vue';

const props = defineProps({
    iconClass: {
        type: String,
        required: true,
    },
    className: {
        type: String,
        default: '',
    },
});
const isExternal = computed(() => imIsExternal(props.iconClass));
const iconName = computed(() => `#icon-${props.iconClass}`);
const svgClass = computed(() => {
    if (props.className) {
        return 'svg-icon ' + props.className;
    } else {
        return 'svg-icon';
    }
});
const styleExternalIcon = computed(() => ({
    mask: `url(${props.iconClass}) no-repeat 50% 50%`,
    '-webkit-mask': `url(${props.iconClass}) no-repeat 50% 50%`,
}));
</script>
<template>
    <!-- <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$listeners" />
    <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners"> -->
    <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" />
    <i v-else>
        <svg :class="svgClass" aria-hidden="true">
            <use :xlink:href="iconName" />
        </svg>
    </i>
</template>

<style scoped lang="scss">
.svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}

.svg-external-icon {
    background-color: currentColor;
    mask-size: cover !important;
    display: inline-block;
}
</style>
