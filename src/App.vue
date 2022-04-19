<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import util from '@/common/util';
export default {
  name: 'App',
  data() {
    return {
      onLine: navigator.onLine
    };
  },
  watch: {
    onLine: {
      handler: function(val, oldval) {
        if (val != oldval) {
          sessionStorage.setItem('onLine', this.onLine);
          if (!this.onLine) {
            // util.notify(this.$t('route.networkError'), 'error', 5 * 1000 );
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);
    sessionStorage.setItem('onLine', this.onLine);
  },
  beforeDestroy() {
    window.removeEventListener('online', this.updateOnlineStatus);
    window.removeEventListener('offline', this.updateOnlineStatus);
  },
  methods: {
    updateOnlineStatus(e) {
    	const { type } = e;
      this.onLine = type === 'online';
    }
  }
};
</script>

<style>
#app {
  font-family: 'NotoSansCJKtc','Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
