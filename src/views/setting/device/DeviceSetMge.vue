<template>
  <div class="device-content">
    <ezviz-device-mgmt v-if="isEzviz"></ezviz-device-mgmt>
    <nvr-device-mgmt v-else></nvr-device-mgmt>
  </div>

</template>
<script>
  import NvrDeviceMgmt from '@/views/setting/device/NvrDeviceMgmt.vue'
  import EzvizDeviceMgmt from '@/views/setting/device/EzvizDeviceMgmt.vue'
  import {getCookie} from "../../../common/auth";
  import { mapMutations,mapGetters} from 'vuex'

  export default {
      name:'DeviceSetMge',
      components:{
        NvrDeviceMgmt,
        EzvizDeviceMgmt
      },
      data(){
        return{

        }
      },
    computed: {
      ...mapGetters(
        ['isEzviz']
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
