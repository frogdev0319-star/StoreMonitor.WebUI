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

import store from './store/index.js';
import $ from 'jquery';
import jquery from 'jquery';
Vue.config.productionTip = false

process.env.MOCK && require('@/mock')

Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
