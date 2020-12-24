import Vue from 'vue';
import App from './App';
import './assets/font/iconfont.css';
import '../static/Roboto/css.css';
import ElementUI from 'element-ui';
import '../theme/index.css';
import 'video.js/dist/video-js.css';
import 'vue-video-player/src/custom-theme.css';
import 'videojs-flash';
import router from './router';
import axios from 'axios';
import { getToken } from '@/common/auth';
import { message } from '@/common/singleton-message';
import Print from '@/plugins/print';
import { ProgressPlugin } from 'bootstrap-vue';
import store from './store/index.js';
import i18n from './lang';
import moment from 'moment';
import elCascaderMulti from 'el-cascader-multi';
import htmlToPdf from '@/plugins/htmlToPdf';
import './assets/sass/index.scss';

Vue.use(ProgressPlugin);
Vue.use(elCascaderMulti);
Vue.use(htmlToPdf);
Vue.use(Print);
Vue.use(ElementUI, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
});

Vue.prototype.$moment = moment;
Vue.config.productionTip = false;
Vue.prototype.appName = '看门店管理系统';
Vue.prototype.$message = message;

process.env.MOCK && require('@/mock');

function getLoginURL() {
  return new Promise((resolve, reject) => {
    axios.get('serverconfig.json').then(res => {
      console.log(res.data.loginURL);
      const url = res.data.loginURL;
      resolve(url);
    }).catch(err => {
      reject(err);
    });
  });
}

async function setURL() {
  const url = await getLoginURL();
  if (url != undefined && url.length !== 0) {
    sessionStorage.setItem('LoginURL', url);
  }
}
setURL();

router.beforeEach(async(to, from, next) => {
  console.log(to.name);
  // determine whether the user has logged in
  if (!to.name) {
    // generate accessible routes map based on roles
    const { roles } = await store.dispatch('GetUserAuthorities');
    console.log(roles);
    // generate accessible routes map based on roles
    const accessRoutes = await store.dispatch('generateRoutes');
    // dynamically add accessible routes
    router.addRoutes(accessRoutes);
    // hack method to ensure that addRoutes is complete
    // set the replace: true, so the navigation will not leave a history record
    next({ ...to, replace: true });
  } else {
    // if (to.matched.some(r => r.meta.requireAuth)) {
    //   if (getToken()) {
    //     next();
    //   } else {
    //     // const url = sessionStorage.getItem('LoginURL');
    //     // window.location.href = url;
    //   }
    // } else {
    //   next();
    // }
    next();
  }
  // if (to.matched.some(r => r.meta.requireAuth)) {
  //   if (getToken()) {
  //     next();
  //   } else {
  //     const url = sessionStorage.getItem('LoginURL');
  //     window.location.href = url;
  //   }
  // } else {
  //   next();
  // }
});

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
});
