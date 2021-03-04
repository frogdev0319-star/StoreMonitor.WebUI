<template>
  <div/>
</template>

<script>
import enviroment, { _Environments } from '@/common/environment';
export default {
  name: 'Authorize',

  data() {
    return {
      state: '',
      code: ''
    };
  },
  mounted: function() {
    console.log(this.$route.query);
    this.getQueryParams();
  },

  methods: {
    getQueryParams() {
      const queryParamsArr = Object.keys(this.$route.query);
      console.log(queryParamsArr);
      if (queryParamsArr.includes('code')) {
        this.code = this.$route.query.code;
        this.state = this.$route.query.state;
      } else {
        this.code = 'error';
        this.state = '';
      }
      this.$router.push({ name: 'beseyeAccount', params: { code: this.code, state: this.state }});
    },

    base64ToStr(base64Str) {
      const decodeStr = atob(base64Str);
      const str = decodeURI(decodeStr);
      return str;
    },

    getSiteFromState() {
      const stateStr = this.base64ToStr(this.state);
      return stateStr.split('-');
    },

    setRedirectUrl(stateArray) {
      let redirectUrl = '';
      if (stateArray[0] === 'Debug_XA') {
        const splitLength = _Environments.Debug_XA.CHINA_WEBSITE.indexOf('storemonitor');
        const site = _Environments.Debug_XA.CHINA_WEBSITE.substr(0, splitLength);
        redirectUrl = `${site}beseye/authorize?code=${this.code}&state=${this.state}`;
      } else if (stateArray[0] === 'QA') {
        const splitLength = _Environments.QA.CHINA_WEBSITE.indexOf('storemonitor');
        const site = _Environments.QA.CHINA_WEBSITE.substr(0, splitLength);
        redirectUrl = `${site}beseye/authorize?code=${this.code}&state=${this.state}`;
      } else if (stateArray[0] === 'Preview') {
        const splitLength = _Environments.Preview.CHINA_WEBSITE.indexOf('storemonitor');
        const site = _Environments.Preview.CHINA_WEBSITE.substr(0, splitLength);
        redirectUrl = `${site}beseye/authorize?code=${this.code}&state=${this.state}`;
      }
      return redirectUrl;
    }
  }
};

</script>

<style scoped>

</style>
