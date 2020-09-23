<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
       onLine: navigator.onLine,
    }
  },
  watch:{
      onLine:{
            handler:function(val,oldval){
                if(val!=oldval){
                  sessionStorage.setItem('onLine',this.onLine);
                  if(!this.onLine){
                     this.$message({message: this.$t('route.networkError'),type: 'error',duration:5*1000});
                  }
                }
            },
            deep:true//对象内部的属性监听，也叫深度监听
      },
    },
  mounted(){
    window.addEventListener('online',  this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);
    if(this.onLine){
      console.log('网络已连接')
    }
    sessionStorage.setItem('onLine',this.onLine);
  },
  methods:{
    updateOnlineStatus(e) {
    	const { type } = e;
        this.onLine = type === 'online';
      },
  },
  beforeDestroy(){
    window.removeEventListener('online',  this.updateOnlineStatus);
    window.removeEventListener('offline', this.updateOnlineStatus);
  }
}
</script>

<style>
#app {
  font-family: Roboto,'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
