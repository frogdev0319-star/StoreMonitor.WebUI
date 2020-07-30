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
  mounted(){
    window.addEventListener('online',  this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);
    if(this.onLine){
      console.log('网络已连接')
    }else{
      console.log('已断网')
      this.$message({
          message: this.$t('route.networkError'),
          type: 'error',
          duration:5*1000
      });
    }
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
