import axios from 'axios';
import { Message, MessageBox } from 'element-ui';
import store from '@/store';
import router from '@/router';
import i18n from '@/lang';
import { getToken } from '@/common/auth.js';
import Environment from './environment.js';
import { message } from '@/common/singleton-message';

const baseUrl = Environment.BASE_URL;
// create an axios instance

const itempath = '/storemonitor/api/';

axios.defaults.withCredentials = true;
const service = axios.create({
  baseURL: baseUrl,
  timeout: 30000
});
// download file axios
const serviceAxios = axios.create({
  baseURL: baseUrl,
  timeout: 5000
});

const serviceLogout = axios.create({
  baseURL: baseUrl,
  timeout: 10000
});

serviceLogout.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers = {
        'token': getToken(),
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      };
    }
    return config;
  },
  error => {
    console.log(error);
    Promise.reject(error);
  }
);

serviceLogout.interceptors.response.use(
  response => {
    return response.data;
  },
  err => {
    return Promise.reject(err);
  }
);

serviceAxios.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.responseType = 'blob';
      config.headers = {
        'token': getToken()
      };
    }
    return config;
  },
  error => {
    console.log(error);
    Promise.reject(error);
  }
);

serviceAxios.interceptors.response.use(
  response => {
    const res = response.data;
    return res;
  }, err => {
    console.log(err);
    const errCode = err.response.data.errCode;
    const errMsg = err.response.data.errMsg;
    if (errCode === 500 && errMsg == 'Invalid token') {
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录！', '确认登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          // router.push('/login');
          const url = sessionStorage.getItem('LoginURL');
          window.location.href = url;
          message({
            message: err.response.data.errMsg,
            type: 'error',
            duration: 5 * 1000
          });
        });
      });
    } else if (errCode === 500 && errMsg == 'No authority') {
      router.push('/home');
      message({
        message: i18n.t('route.noAuthority'),
        type: 'error',
        duration: 5 * 1000
      });
    }
  }
);

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers = {
        'token': getToken(),
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'

      };
    }
    return config;
  },
  error => {
    console.log(error);
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    console.log(response)
    return response.data;
  }, err => {
    if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
      message({
        message: i18n.t('route.networkError'),
        type: 'error',
        duration: 5 * 1000
      });
    }
    if (err.response) {
      const errCode = err.response.data.errCode;
      const errMsg = err.response.data.errMsg;
      if (errCode === 500 && (errMsg == 'Invalid token' ||
                errMsg == 'Failed to verify token' || errMsg == 'User does not exist')) {
        // router.push('/login');
        const url = sessionStorage.getItem('LoginURL');
        window.location.href = url;
        message({
          message: i18n.t('route.loginAbnormal'),
          type: 'error',
          duration: 5 * 1000
        });
      } else if (errCode === 500 && errMsg == 'Token does not exist') {
        // router.push('/login');
        const url = sessionStorage.getItem('LoginURL');
        window.location.href = url;
      } else if (errCode === 500 && errMsg == 'No authority') {
        router.push('/home');
        message({
          message: i18n.t('route.noAuthority'),
          type: 'error',
          duration: 5 * 1000
        });
      }
      if (err.response.status != undefined && err.response.status == 404) {
        message({
          message: i18n.t('route.serverException'),
          type: 'error',
          duration: 5 * 1000
        });
      }
    }
    return Promise.reject(err);
  }
);

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers = {
        'token': getToken(),
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'

      };
    }
    return config;
  },
  error => {
    console.log(error);
    Promise.reject(error);
  }
);

export default service;
export { serviceAxios, serviceLogout };
