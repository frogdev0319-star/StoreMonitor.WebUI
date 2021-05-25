<template>
  <el-tooltip class="item" v-bind="$attrs">
    <div slot="content" v-if="isCatergySetting">
      <span>{{ $t('insSettingView.parentCatergyNameTooltip1')}} <br/> {{ $t('insSettingView.parentCatergyNameTooltip2')}}</span>
    </div>
    <slot></slot>
  </el-tooltip>
</template>

<script>
    export default {
      name: "IconTooltip",
      props:{
        tooltipContent: {
          type: String,
          default: ''
        },
        isCatergySetting: {
          type: Boolean,
          default: false
        }
      },
      data(){
          return {
            newLine:'<br>'
          }
      },
    }
</script>

<style scoped>

</style>
