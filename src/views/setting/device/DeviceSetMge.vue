<template>
  <div class="device-content">
    <ezviz-device-mgmt v-if="videoPlatform == 1"></ezviz-device-mgmt>
    <nvr-device-mgmt v-else-if="videoPlatform == 0"></nvr-device-mgmt>
    <beseye-device-mgmt v-else></beseye-device-mgmt>
  </div>

</template>
<script>
  import NvrDeviceMgmt from '@/views/setting/device/NvrDeviceMgmt.vue'
  import EzvizDeviceMgmt from '@/views/setting/device/EzvizDeviceMgmt.vue'
  import BeseyeDeviceMgmt from '@/views/setting/device/BeseyeDeviceMgmt.vue'
  import {getCookie} from "../../../common/auth";
  import { mapMutations,mapGetters} from 'vuex'

  export default {
      name:'DeviceSetMge',
      components:{
        NvrDeviceMgmt,
        EzvizDeviceMgmt,
        BeseyeDeviceMgmt
      },
      data(){
        return{

        }
      },
    computed: {
      ...mapGetters(
        ['videoPlatform']
      ),
    },
    watch:{
      isEzviz:function(newd,old){
        console.log(newd)
      },
    },
    methods:{

    },
    created(){
      let self = this;
      console.log(this.$store.state.user.isEzviz);
      console.log(getCookie('isEzviz'));
      console.log(self.isEzviz + 'created');
    },
    mounted(){
        let self = this;
        console.log(this.$store.state.user);
        console.log(getCookie('isEzviz'));
        console.log(self.isEzviz  + 'mounted');
    },
  }
</script>
<style lang="scss" scoped>
  $border:#e3e9f4;
</style>
