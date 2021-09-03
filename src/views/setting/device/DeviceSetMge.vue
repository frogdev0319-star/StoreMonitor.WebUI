<template>
  <div class="device-content">
    <ezviz-device-mgmt v-if="isEzviz"/>
    <nvr-device-mgmt v-else/>
  </div>

</template>
<script>
import NvrDeviceMgmt from '@/views/setting/device/NvrDeviceMgmt.vue';
import EzvizDeviceMgmt from '@/views/setting/device/EzvizDeviceMgmt.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'DeviceSetMge',
  components: {
    NvrDeviceMgmt,
    EzvizDeviceMgmt
  },

  computed: {
    ...mapGetters(
      ['isEzviz']
    )
  }
};
</script>
<style lang="scss" scoped>
  $border:#e3e9f4;
</style>
