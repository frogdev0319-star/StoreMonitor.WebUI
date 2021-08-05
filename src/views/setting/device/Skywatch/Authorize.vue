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
    mounted() {
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
        this.$router.push({ name: 'skywatchAccount', params: { code: this.code, state: this.state }});
      }
    }
  };

</script>

<style scoped>

</style>

