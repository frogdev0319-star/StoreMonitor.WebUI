<template>
  <div class="account-title-btn">
    <div class="operation-title flex-center">
      <div v-show="authorizedDevicesNum < addedDeviceNumber" class="prompt-info">
        <img :src="errorImgSource" class="error-img">
        <span class="error-msg">
          {{ $t('deviceView.deviceLimitation') }}
        </span>
      </div>
      <div class="device-num-btn spacer">
        <div>
          {{ $t('deviceView.authorizedDevicesNum') }} {{ authorizedDevicesNum }}
        </div>
        <div class="available-device">
          {{ $t('deviceView.addedDeviceNumber') }} {{ addedDeviceNumber }}
        </div>
        <div class="spacer"></div>
        <delay-button
          :disabled="authorizedDevicesNum === 0"
          @click="onClick">
          <slot class="button"/>
        </delay-button>
      </div>
    </div>
  </div>
</template>

<script>

import DelayButton from '@/components/DelayButton';
export default {
  name: 'AccountHeader',
  components: { DelayButton },
  props: {
    authorizedDevicesNum: {
      type: Number,
      default: 0
    },
    addedDeviceNumber: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      errorImgSource: require('../../../../static/img/icon_error.png')
    };
  },
  methods: {
    onClick() {
      this.$emit('click');
    }
  }
};
</script>

<style lang="scss" scoped>
.error-img{
  height: calc(24/1920*100vw);
  width: calc(24/1920*100vw);
  margin-right: calc(8/1920*100vw);
  padding-right: 0;
}
</style>
