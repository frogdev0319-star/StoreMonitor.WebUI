import axios from 'axios';
import { getDashServerInfo } from '@/api/device.js';
import store from '../store/index.js';
import { message } from '@/common/singleton-message';

axios.defaults.withCredentials = false;

export default class DashHttp {
  static setDashHost(url) {
    this.DASH_HOST = url;
  }

  static async putDash(url, data) {
    const httpUrl = this.DASH_HOST + url;
    console.log(this.DASH_HOST);
    console.log(httpUrl);
    const dashAxios = axios.create({
      baseURL: httpUrl,
      timeout: 30 * 1000
    });
    try {
      const response = await dashAxios(httpUrl, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        data
      });
      this.awaitResult = response.data.result;
      console.log(response.data.result);
      console.log(this.awaitResult);
      return !response.data.result.ErrorCode;
    } catch (error) {
      this.awaitResult = null;
      return false;
    }
  }

  static getResult() {
    console.log(this.awaitResult);
    return this.awaitResult;
  }
}
