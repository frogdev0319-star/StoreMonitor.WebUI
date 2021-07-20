<template>
  <el-tooltip v-bind="$attrs" class="item">
    <div v-if="isCatergySetting" slot="content">
      <span>{{ $t('insSettingView.parentCatergyNameTooltip1') }} <br> {{ $t('insSettingView.parentCatergyNameTooltip2') }}</span>
    </div>
    <slot/>
  </el-tooltip>
</template>

<script>
export default {
  name: 'IconTooltip',
  props: {
    tooltipContent: {
      type: String,
      default: ''
    },
    isCatergySetting: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newLine: '<br>'
    };
  }
};
</script>

<style scoped>

  .item{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
