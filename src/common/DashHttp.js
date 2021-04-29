import axios from 'axios';
import { getDashServerInfo } from '@/api/device.js';
import { message } from '@/common/singleton-message';

axios.defaults.withCredentials = false;

export default class DashHttp {
  static setDashHost(url) {
    this.DASH_HOST = url;
  }

  static async putDash(url, data) {
    const httpUrl = this.DASH_HOST + url;
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
      return !response.data.result.ErrorCode;
    } catch (error) {
      this.awaitResult = null;
      return false;
    }
  }

  static getResult() {
    return this.awaitResult;
  }
}
