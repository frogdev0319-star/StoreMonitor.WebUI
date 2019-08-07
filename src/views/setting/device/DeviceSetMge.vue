<template>
  <div>
    <!--<el-button @click="updateEzviz"></el-button>-->
    <ezviz-device-mgmt v-if="isEzviz"></ezviz-device-mgmt>
    <nvr-device-mgmt v-else></nvr-device-mgmt>
  </div>

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

        }
      },
    computed: {
      isEzviz() {
        return this.$store.state.user.isEzviz
      }
    },
    watch:{
      isEzviz:function(old,newd){
        console.log(newd)
        self.$nextTick();
      }
    },
    methods:{
      updateEzviz(){
        this.$store.commit('SET_ISEZVIZ',false);
        console.log(self.$store.state.user);
      }
    },
    created(){
      let self = this;
      self.isEzviz = self.$store.state.user.isEzviz;
      console.log(self.isEzviz + 'created');
      console.log(typeof(self.isEzviz) + 'created');
    },
    mounted(){
        let self = this;
        self.isEzviz = this.$store.state.user.isEzviz;
        console.log(typeof(self.isEzviz)  + 'mounted');
    },
  }
</script>
<style>

</style>
