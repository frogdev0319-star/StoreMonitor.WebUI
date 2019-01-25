
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/font/iconfont.css'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Cookies from 'js-cookie'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import 'videojs-flash'

import rem from '@/common/rem'

require('@/assets/css/myVideoCss.css');

import store from './store/index.js';
import $ from 'jquery';
import jquery from 'jquery';
Vue.config.productionTip = false
import VideoPlayer from 'vue-video-player'
Vue.use(VideoPlayer);

Vue.prototype.appName = '看门店管理系统'; //定义一个VUE内全局用到的名称（标题）
process.env.MOCK && require('@/mock')

Vue.use(ElementUI);

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
import {getToken} from '@/common/auth'
router.beforeEach((to,from,next)=>{
  if(to.matched.some(r => r.meta.requireAuth)){ //要跳转的页面需要登陆权限
    if(getToken()){  //通过vuex state 获取当前的token信息
      next();
    }
    else{
      next({
        path:'/login',
        query:{redirect:to.fullPath}
      })
    }
  }
  else{
    next();
  }
})