<template>
  <div/>
</template>

<script>

export default {
  name: 'Authorize',

  data() {
    return {
      state: '',
      code: ''
    };
  },
  mounted: function() {
    this.getQueryParams();
  },

  methods: {
    getQueryParams() {
      const queryParamsArr = Object.keys(this.$route.query);
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
    }
  }
};

</script>

<style scoped>

</style>
