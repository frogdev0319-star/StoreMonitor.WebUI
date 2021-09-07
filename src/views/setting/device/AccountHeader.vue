<template>
  <div class="account-title-btn">
    <div class="operation-title">
      <div>
        <div v-show="authorizedDevicesNum < addedDeviceNumber" class="prompt-info">
          <img :src="errorImgSource" class="error-img">
          <span class="error-msg">
            {{ $t('deviceView.deviceLimitation') }}
          </span>
        </div>
      </div>
      <div class="device-num-btn">
        <div>
          {{ $t('deviceView.authorizedDevicesNum') }} {{ authorizedDevicesNum }}
        </div>
        <div class="available-device">
          {{ $t('deviceView.addedDeviceNumber') }} {{ addedDeviceNumber }}
        </div>
        <delay-button
          :disabled="authorizedDevicesNum === 0"
          class="inspction-btn"
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

<style scoped>

</style>
