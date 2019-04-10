
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/font/iconfont.css'
import ElementUI from 'element-ui';
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
import $ from 'jquery';
import jquery from 'jquery';
Vue.config.productionTip = false

// import VueI18n from 'vue-i18n'
// Vue.use(VueI18n)

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
    // else{
    //   next({
    //     path:'/login',
    //     query:{redirect:to.fullPath}
    //   })
    // }
  }
  else{
    next();
  }
})
