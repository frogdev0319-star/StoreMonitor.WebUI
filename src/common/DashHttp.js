/**
 * Fetch http component.
 */
import axios from 'axios'
import {getDashServerInfo} from '@/api/device.js'
import store from '../store/index.js';
import i18n from '@/lang'
import {message} from '@/common/singleton-message'

axios.defaults.withCredentials = false

export default class DashHttp {
  static parseVersion(url) {
    let version = url.includes('$') ? url.replace('${', '').replace('}', '') : 'v1.0/' + url;
    return Environment.onWebSite() + version;
  }

  static get(url) {
    let httpUrl = this.parseVersion(url)
    return new Promise((resolve, reject) => {
      let timer = setTimeout(function () {
        reject(new TypeError(ErrorMsgCheck));
        if (!url.includes('ezviz')) {
          store.netInfoSelector.setOffline(true);
        }
      }, 15000);
      fetch(httpUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Token': UserPojo.getToken()
        }
      })
        .then(response => response.json())
        .then(result => {
          clearTimeout(timer);
          store.netInfoSelector.setOffline(false);
          if (result.errCode === 500 && result.errMsg === 'Invalid token'
            && !url.includes('ezviz')) {
            JMessage.close();
            Actions.reset('loginScreen', {token: false});
          } else if (result.errMsg === 'Success') {
            resolve(result);
          } else {
            reject(result.errMsg);
          }
        })
        .catch(error => {
          clearTimeout(timer);
          reject(error);
          if (error.message != null && error.message == ErrorMsgCheck
            && !url.includes('ezviz')) {
            store.netInfoSelector.setOffline(true);
          }
        })
    })
  }

  static post(url, data) {
    let httpUrl = this.parseVersion(url);
    return new Promise((resolve, reject) => {
      let timer = setTimeout(function () {
        reject(new TypeError(ErrorMsgCheck));
        if (!url.includes('notify')) {
          store.netInfoSelector.setOffline(true);
        }
      }, 15000);
      fetch(httpUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Token': UserPojo.getToken()
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(result => {
          clearTimeout(timer);
          store.netInfoSelector.setOffline(false);
          if (result.errCode === 500 && result.errMsg === 'Invalid token'
            && !url.includes('notify')) {
            JMessage.close();
            Actions.reset('loginScreen', {token: false});
          } else if (result.errMsg === 'Success') {
            resolve(result);
          } else {
            reject(result.errMsg);
          }
        })
        .catch(error => {
          clearTimeout(timer);
          reject(error);
          if (error.message != null && error.message == ErrorMsgCheck
            && !url.includes('notify')) {
            store.netInfoSelector.setOffline(true);
          }
        })
    })
  }

  static async postAsync(url, data) {
    let httpUrl = this.parseVersion(url);
    return await new Promise((resolve, reject) => {
      let timer = setTimeout(function () {
        this.apiResult = null;
        resolve(false);
      }, 15000);
      fetch(httpUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Token': UserPojo.getToken()
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(result => {
          clearTimeout(timer);
          this.apiResult = result;
          if (result.errCode === 500 && result.errMsg === 'Invalid token' && !url.includes('notify')) {
            JMessage.close();
            Actions.reset('loginScreen', {token: false});
          }
          resolve(result.errMsg === 'Success');
        })
        .catch(error => {
          clearTimeout(timer);
          this.apiResult = null;
          resolve(false);
        })
    })
  }

  static async getAsync(url, data) {
    let httpUrl = this.parseVersion(url)
    return await new Promise((resolve, reject) => {
      let timer = setTimeout(function () {
        this.apiResult = null;
        resolve(false);
      }, 15000);
      fetch(httpUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Token': UserPojo.getToken()
        }
      })
        .then(response => response.json())
        .then(result => {
          clearTimeout(timer);
          this.apiResult = result;
          if (result.errCode === 500 && result.errMsg === 'Invalid token' && !url.includes('notify')) {
            JMessage.close();
            Actions.reset('loginScreen', {token: false});
          }
          resolve(result.errMsg === 'Success');
        })
        .catch(error => {
          clearTimeout(timer);
          this.apiResult = null;
          resolve(false);
        })
    })
  }

  static getApiResult() {
    return this.apiResult;
  }

  static setDashHost(url) {
    this.DASH_HOST = url;
  }

  static async putDash(url, data) {
    let httpUrl = this.DASH_HOST + url;
    console.log(this.DASH_HOST)
    console.log(httpUrl)
    let dashAxios = axios.create({
      baseURL : httpUrl,
      timeout : 30 * 1000,
    });
    try {
      let response = await dashAxios(httpUrl, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data
      });
      this.awaitResult = response.data.result;
      console.log(response.data.result)
      console.log(this.awaitResult)
      return response.data.result.ErrorCode ? false : true;
    }
    catch (error) {
      this.awaitResult = null;
      return false;
    }
  }

  static getResult() {
    console.log(this.awaitResult)
    return this.awaitResult;
  }
}
