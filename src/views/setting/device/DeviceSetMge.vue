<template>
  <ezviz-device-mgmt v-if="isEzviz"></ezviz-device-mgmt>
  <nvr-device-mgmt v-else></nvr-device-mgmt>
</template>
<script>
  import NvrDeviceMgmt from '@/views/setting/device/NvrDeviceMgmt.vue'
  import EzvizDeviceMgmt from '@/views/setting/device/EzvizDeviceMgmt.vue'

  export default {
      name:'DeviceSetMge',
      components:{
        NvrDeviceMgmt,
        EzvizDeviceMgmt
      },
      data(){
        return{
          isEzviz: false
        }
      },
    methods:{

    },
    computed:{
      isEzviz(){
        return this.$store.state.isEzviz;
      },
    }
  }
</script>
<style>

</style>
