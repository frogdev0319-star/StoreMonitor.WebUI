// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/font/iconfont.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import Blob from './excel/Blob.js'
// import Export2Excel from './excel/Export2Excel.js'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import 'videojs-flash'
// import 'videojs-contrib-hls/dist/videojs-contrib-hls'
require('@/assets/css/myVideoCss.css');
import store from './store/index.js';
import $ from 'jquery';
import jquery from 'jquery';
Vue.config.productionTip = false

import VideoPlayer from 'vue-video-player'
Vue.use(VideoPlayer);
//定义一个VUE内全局用到的名称（标题）
Vue.prototype.appName = '看门店管理系统';
process.env.MOCK && require('@/mock')

Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
