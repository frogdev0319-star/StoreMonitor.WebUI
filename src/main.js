
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/font/iconfont.css'
import ElementUI from 'element-ui';
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import '../theme/index.css'
import Cookies from 'js-cookie'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import 'videojs-flash'
import rem from '@/common/rem'
//const ElementUI=require('element-ui');
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

import store from './store/index.js';
import i18n from './lang'
// import './permission' // permission control
import $ from 'jquery';
import jquery from 'jquery';
import moment from 'moment';
import elCascaderMulti from 'el-cascader-multi';
Vue.use(elCascaderMulti)
Vue.prototype.$moment = moment;//赋值使用
Vue.config.productionTip = false

// import i18n from 'vue-i18n'
// Vue.use(VueI18n)
// Vue.use(ElementUI, { locale })

Vue.use(ElementUI, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
Vue.prototype.appName = '看门店管理系统'; //定义一个VUE内全局用到的名称（标题）
process.env.MOCK && require('@/mock')

function getLoginURL(){
  return new Promise((resolve,reject)=>{
    axios.get('serverconfig.json?r=' + (new Date().getTime())).then(res=>{
      console.log(res.data.loginURL);
      let url=res.data.loginURL;
      resolve(url);
    })
  })
}
async function setURL(){
  let url=await getLoginURL();
  if(url!=undefined&&url.length!=0){
    sessionStorage.setItem('LoginURL',url);
  }
}

setURL();

Vue.use(ElementUI);
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
import {getToken} from '@/common/auth'
import { resolve } from 'url';
router.beforeEach((to,from,next)=>{
  if(to.matched.some(r => r.meta.requireAuth)){ //要跳转的页面需要登陆权限
    if(getToken()){  //通过vuex state 获取当前的token信息
      next();
    }
    else{
      let url=sessionStorage.getItem('LoginURL');
      window.location.href=url;
    }
  }
  else{
    next();
  }
})

// Vue.mixin({
//   beforeRouteLeave (to, from, next) {
//     if(from.name=='事件管理'&&to.name=='事件详情'){ //从事件管理页面进入详情页面
//       this.$store.commit('newCachePath',from.path.split('/'));
//     }
//     else if(from.name=='事件详情'&&to.name=='事件管理'){
//       this.$store.commit('newCachePath',to.path.split('/'));
//     }
//     else if(from.name=='事件管理'&&to.name!='事件详情'){
//       this.$destroy();
//       //this.$store.commit('newCachePath',from.path.split('/'));
//     }
//     next();
//   }
// })
