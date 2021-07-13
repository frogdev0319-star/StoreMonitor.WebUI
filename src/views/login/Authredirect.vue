<template/>
<script>
import { mapMutations } from 'vuex';
import { setCookie } from '@/common/auth';
import router from '../../router';

export default{
  name: 'AuthRedirect',
  created() {
    this.routerPage();
  },
  methods: {
    async routerPage() {
      const self = this;
      const TokenKey = 'Admin-Token';
      const hash = window.location.search.substr(1) || window.location.hash.split('?')[1];
      if (hash != undefined && hash.length !== 0) {
        const paramsArray = hash.split('&');
        if (paramsArray.toString().length !== 0) {
          const obj = self.queryURL(hash);
          console.log(obj);
          this.$store.commit('SET_TOKEN', obj.token);
          if (obj.ezvizProtocol === 'true') {
            this.$store.commit('SET_ISEZVIZ', true);
            setCookie('isEzviz', true);
          } else {
            this.$store.commit('SET_ISEZVIZ', false);
            setCookie('isEzviz', false);
          }
          setCookie(TokenKey, obj.token);
          setCookie('UserId', obj.userId);
          let lang = 'en';
          if (obj.lang === 'zh-CN') {
            lang = 'zh';
          } else if (obj.lang === 'en-US') {
            lang = 'en';
          } else if (obj.lang === 'zh-TW') {
            lang = 'zhtw';
          } else {
            lang = obj.lang;
          }
          setCookie('lang', lang);
        }
      }
      //self.$router.push('home');
      window.location.href = window.location.origin + window.location.pathname + 'home';
    },

    queryURL(hashValue) {
      const params = hashValue.split('&');
      const obj = {};
      for (var i = 0; i < params.length; i++) {
        var param = params[i].split('=');
        obj[param[0]] = param[1];
      }
      return obj;
    }

  }
};
</script>
