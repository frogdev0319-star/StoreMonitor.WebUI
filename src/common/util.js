import ConvertPinyin from '@/common/getpinyin';
import i18n from '@/lang/index';
import { message } from '@/common/singleton-message';
import moment from 'moment';

export default {
  getOneHourTime(para) {
    const bt = new Date(new Date().getTime() - 1 * 60 * 60 * 1000);
    const et = new Date();
    para.beginTs = new Date(+new Date(bt)).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, ''),
    para.endTs = new Date(+new Date(et)).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
    return para;
  },

  getOneDayTime(para) {
    const bt = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    const et = new Date();
    para.beginTs = new Date(+new Date(bt)).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, ''),
    para.endTs = new Date(+new Date(et)).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
    return para;
  },
  getOneMonthTime(para) {
    const bt = new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 30);
    const et = new Date();
    para.beginTs = new Date(+new Date(bt)).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, ''),
    para.endTs = new Date(+new Date(et)).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
    return para;
  },

  formatterTime(src) {
    return src.toString().length == 1 ? 0 + src.toString() : src.toString();
  },

  getdate(ts) {
    let result = '';
    const t = new Date(ts);
    const hour = this.formatterTime((t.getHours() - 8 >= 0 ? t.getHours() - 8 : 0));
    const min = this.formatterTime(t.getMinutes());
    const sec = this.formatterTime(t.getSeconds());
    result = hour + ':' + min + ':' + sec;
    return result;
  },

  getDateTime(ts) {
    let result = '';
    const t = new Date(ts);
    const years = t.getFullYear();
    const month = t.getMonth() + 1;
    const day = t.getDate();
    const hour = t.getHours() < 10 ? '0' + t.getHours() : t.getHours();
    const min = t.getMinutes() < 10 ? '0' + t.getMinutes() : t.getMinutes();
    result = years + '/' + month + '/' + day + ' ' + hour + ':' + min;
    return result;
  },

  getDates(ts) {
    let result = '';
    const t = new Date(ts);
    const years = t.getFullYear();
    const month = t.getMonth() + 1;
    const day = t.getDate();
    result = years + '/' + month + '/' + day;
    return result;
  },

  getThreeMonths(e) {
    const timeOne = new Date(e);
    let year = timeOne.getFullYear();
    const month = timeOne.getMonth() + 1;
    let day = timeOne.getDate();
    const hours = timeOne.getHours();
    const minutes = timeOne.getMinutes();
    const seconds = timeOne.getSeconds();
    console.log(`now:${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
    // three month ago
    let ThreeMonths = month - 3;
    if (ThreeMonths <= 0) { year = year - 1; }
    if (ThreeMonths === -2) { ThreeMonths = 10; }
    if (ThreeMonths === -1) { ThreeMonths = 11; }
    if (ThreeMonths === 0) { ThreeMonths = 12; }
    const timeTow = new Date(year, ThreeMonths, 0, hours, minutes, seconds);
    const ThreeMonthsDay = timeTow.getDate();
    if (day > ThreeMonthsDay) { day = ThreeMonthsDay; }
    day = day < 10 ? '0' + day : day;
    console.log(`three month ago:${year}-${ThreeMonths}-${day} 00:00:00`);
    const THREE_MONTHS_AGO = `${year}/${ThreeMonths}/${day} 00:00:00`;
    const THREE_STAMP = new Date(THREE_MONTHS_AGO).getTime();
    return THREE_STAMP;
  },

  getDaysCount() {
    let date = new Date();
    let month = date.getMonth();
    date.setMonth(month + 1);
    date.setDate(0);
    return date.getDate();
  },

  getDaysArry() {
    let day = this.getDaysCount();
    let arr = [];
    for (let i = 1; i <= day; i++) {
      arr.push(i);
    }
    return arr;
  },

  getInitDay() {
    let day = this.getDaysCount();
    let arr = [];
    for (let i = 1; i <= day; i++) {
      arr.push(0);
    }
    return arr;
  },

  getDaysRandom() {
    let day = this.getDaysCount();
    let arr = [];
    for (let i = 1; i <= day; i++) {
      arr.push(Math.round(Math.random() * 100));
    }
    return arr;
  },

  getTheStartDate(num) {
    const date = new Date();
    const StartDate = new Date(date);
    StartDate.setDate(date.getDate() - 30 * num);
    const dateStr = StartDate.getFullYear() + '-' + (StartDate.getMonth() + 1) + '-' + StartDate.getDate();
    return dateStr;
  },

  getRandom1(start, end) {
    let length = end - start;
    let num = (Math.random() * (length) + start);
    return num;
  },

  getRouteByTag(curTag, data) {
    console.log(data);
    const temp = [];
    if (data.length != 0) {
      data.forEach(item => {
        if (item.tag == curTag) {
          temp.push(item);
        }
      });
    }
    return temp;
  },

  getCityList(storeList) {
    const cityList = [];
    storeList.forEach(item => {
      const province = item.province;
      if (cityList.indexOf(province) == -1) {
        cityList.push(province);
      }
    });
  },

  getDateCurMonth(year, month) {
    const nowdate = new Date('' + year + ',' + month + ',01');
    const weekday = nowdate.getDay();
    return weekday;
  },

  getDayNum(year, month) {
    const nowdate = new Date('' + year + ',' + month + ',01');
    month = nowdate.getMonth() + 1;
    nowdate.setMonth(month);
    nowdate.setDate(0);
    const dayNum = nowdate.getDate();
    return dayNum;
  },

  getCurDateStr() {
    const date = new Date();
    const formatDate = function(datetype) {
      return datetype < 10 ? ('0' + datetype) : datetype;
    };
    const year = date.getFullYear();
    const month = formatDate(date.getMonth() + 1);
    const day = formatDate(date.getDate());
    const hours = formatDate(date.getHours());
    const minutes = formatDate(date.getMinutes());
    const second = formatDate(date.getSeconds());
    return `${year}${month}${day}-${hours}${minutes}${second}`;
  },

  getPinyinList(str) {
    const temp = [];
    temp.push(ConvertPinyin(str));
    temp.push(str);
    return temp;
  },

  random_string(len) {
    len = len || 32;
    let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    let maxPos = chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  },

  getYearStr(ts) {
    let dateStr = '';
    const t = new Date(ts);
    const years = t.getFullYear();
    const month = t.getMonth() + 1;
    const day = t.getDate();
    dateStr = years + '-' + month + '-' + day;
    return dateStr;
  },

  getDayStr(ts) {
    let dateStr = '';
    const t = new Date(ts);
    const hour = t.getHours() < 10 ? '0' + t.getHours() : t.getHours();
    const min = t.getMinutes() < 10 ? '0' + t.getMinutes() : t.getMinutes();
    const second = t.getSeconds() < 10 ? '0' + t.getSeconds() : t.getSeconds();
    dateStr = hour + ':' + min + ':' + second;
    return dateStr;
  },

  getDateStr(ts) {
    let dateStr = '';
    const t = new Date(ts);
    const years = t.getFullYear();
    const month = t.getMonth() + 1;
    const day = t.getDate();
    const hour = t.getHours() < 10 ? '0' + t.getHours() : t.getHours();
    const min = t.getMinutes() < 10 ? '0' + t.getMinutes() : t.getMinutes();
    const second = t.getSeconds() < 10 ? '0' + t.getSeconds() : t.getSeconds();
    dateStr = years + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + second;
    return dateStr;
  },

  getDateStr1(ts) {
    let dateStr = '';
    const t = new Date(ts);
    const years = t.getFullYear();
    const month = (t.getMonth() + 1) < 10 ? '0' + (t.getMonth() + 1) : (t.getMonth() + 1);
    const day = t.getDate() < 10 ? '0' + t.getDate() : t.getDate();
    const hour = t.getHours() < 10 ? '0' + t.getHours() : t.getHours();
    const min = t.getMinutes() < 10 ? '0' + t.getMinutes() : t.getMinutes();
    const second = t.getSeconds() < 10 ? '0' + t.getSeconds() : t.getSeconds();
    dateStr = years + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + second;
    return dateStr;
  },

  getErrorText(errorCode) {
    const lang = i18n.locale;
    let msg = '';
    switch (errorCode) {
      case 1: {
        if (lang == 'zh') {
          msg = 'XML/JSON 参数不正确';
        } else if (lang == 'en') {
          msg = 'Incorrect parameters of XML/JSON';
        } else if (lang == 'zhtw') {
          msg = 'XML/JSON 參數不正確';
        } else {
          msg = 'XML/JSON 参数不正确';
        }
        break;
      }
      case 2: {
        if (lang == 'zh') {
          msg = '用户名或密码错误';
        } else if (lang == 'en') {
          msg = 'Wrong user name or password';
        } else if (lang == 'zhtw') {
          msg = '用戶名或密碼錯誤';
        } else {
          msg = '用户名或密码错误';
        }
        break;
      }
      case 3: {
        if (lang == 'zh') {
          msg = '用户不在线';
        } else if (lang == 'en') {
          msg = 'User offline';
        } else if (lang == 'zhtw') {
          msg = '用戶不在線';
        } else {
          msg = '用户不在线';
        }
        break;
      }
      case 4: {
        if (lang == 'zh') {
          msg = '连接 PV6SvrRemote COM 接口出错';
        } else if (lang == 'en') {
          msg = 'Connection to PV6SvrRemote COM interface error';
        } else if (lang == 'zhtw') {
          msg = '連接 PV6SvrRemote COM 接口出錯';
        } else {
          msg = '连接 PV6SvrRemote COM 接口出错';
        }
        break;
      }
      case 5: {
        if (lang == 'zh') {
          msg = '请求的 IVS 数据库中不存在';
        } else if (lang == 'en') {
          msg = 'The requested IVS does not exist in  database';
        } else if (lang == 'zhtw') {
          msg = '請求的 IVS 數據庫中不存在';
        } else {
          msg = '请求的 IVS 数据库中不存在';
        }
        break;
      }
      case 7: {
        if (lang == 'zh') {
          msg = '视频请求 DASH 服务器网络出错';
        } else if (lang == 'en') {
          msg = 'Video request DASH server network error';
        } else if (lang == 'zhtw') {
          msg = '視頻請求 DASH 伺服器網絡出錯';
        } else {
          msg = '视频请求 DASH 服务器网络出错';
        }
        break;
      }
      case 8: {
        if (lang == 'zh') {
          msg = '用户下线出错';
        } else if (lang == 'en') {
          msg = 'Error appears in user go offline';
        } else if (lang == 'zhtw') {
          msg = '用戶下線出錯';
        } else {
          msg = '用户下线出错';
        }
        break;
      }
      case 9: {
        if (lang == 'zh') {
          msg = 'IVS 不支持的参数';
        } else if (lang == 'en') {
          msg = 'Parameters not supported by IVS';
        } else if (lang == 'zhtw') {
          msg = 'IVS 不支持的參數';
        } else {
          msg = 'IVS 不支持的参数';
        }
        break;
      }
      case 10: {
        if (lang == 'zh') {
          msg = '非法的 URL 地址';
        } else if (lang == 'en') {
          msg = 'Illegal URL address';
        } else if (lang == 'zhtw') {
          msg = '非法的 URL 地址';
        } else {
          msg = '非法的 URL 地址';
        }
        break;
      }
      case 11: {
        if (lang == 'zh') {
          msg = '超过 License 授权最大使用数量';
        } else if (lang == 'en') {
          msg = 'Exceeding the maximum user number of licenses';
        } else if (lang == 'zhtw') {
          msg = '超過 License 授權最大使用數量';
        } else {
          msg = '超过 License 授权最大使用数量';
        }
        break;
      }
      case 12: {
        if (lang == 'zh') {
          msg = 'License 不可用';
        } else if (lang == 'en') {
          msg = 'License is not available';
        } else if (lang == 'zhtw') {
          msg = 'License 不可用';
        } else {
          msg = 'License 不可用';
        }
        break;
      }
      case 13: {
        if (lang == 'zh') {
          msg = '视频停止错误';
        } else if (lang == 'en') {
          msg = 'Video stop error';
        } else if (lang == 'zhtw') {
          msg = '視頻停止錯誤';
        } else {
          msg = '视频停止错误';
        }
        break;
      }
      case 15: {
        if (lang == 'zh') {
          msg = 'SDK 打开视频错误';
        } else if (lang == 'en') {
          msg = 'SDK open video error';
        } else if (lang == 'zhtw') {
          msg = 'SDK 打開視頻錯誤';
        } else {
          msg = 'SDK 打开视频错误';
        }
        break;
      }
      case 16: {
        if (lang == 'zh') {
          msg = 'SDK 没有返回数据';
        } else if (lang == 'en') {
          msg = 'SDK does not have return data';
        } else if (lang == 'zhtw') {
          msg = 'SDK 沒有返回數據';
        } else {
          msg = 'SDK 没有返回数据';
        }
        break;
      }
      case 17: {
        if (lang == 'zh') {
          msg = '视频播放端连接数量超过 DASH 服务的最大连接数';
        } else if (lang == 'en') {
          msg = 'The number of video player connections exceeds the maximum number of connections for the DASH service';
        } else if (lang == 'zhtw') {
          msg = '視頻播放端連接數量超過 DASH 服務的最大連接數';
        } else {
          msg = '视频播放端连接数量超过 DASH 服务的最大连接数';
        }
        break;
      }
      case 18: {
        if (lang == 'zh') {
          msg = 'SessionID 已过期';
        } else if (lang == 'en') {
          msg = 'SessionID has expired';
        } else if (lang == 'zhtw') {
          msg = 'SessionID 已過期';
        } else {
          msg = 'SessionID 已过期';
        }
        break;
      }
      case 19: {
        if (lang == 'zh') {
          msg = '内存不足';
        } else if (lang == 'en') {
          msg = 'Not enough storage';
        } else if (lang == 'zhtw') {
          msg = '內存不足';
        } else {
          msg = '内存不足';
        }
        break;
      }
      case 20: {
        if (lang == 'zh') {
          msg = '不支持此功能';
        } else if (lang == 'en') {
          msg = 'The feature is not supported';
        } else if (lang == 'zhtw') {
          msg = '不支持此功能';
        } else {
          msg = '不支持此功能';
        }
        break;
      }
      case 21: {
        if (lang == 'zh') {
          msg = '内部web服务器不能正常工作';
        } else if (lang == 'en') {
          msg = 'Internal web server is not working properly';
        } else if (lang == 'zhtw') {
          msg = '內部web伺服器不能正常工作';
        } else {
          msg = '内部web服务器不能正常工作';
        }
        break;
      }
      case 22: {
        if (lang == 'zh') {
          msg = '缺少必要参数';
        } else if (lang == 'en') {
          msg = 'Lack of necessary parameters';
        } else if (lang == 'zhtw') {
          msg = '缺少必要參數';
        } else {
          msg = '缺少必要参数';
        }
        break;
      }
      case 23: {
        if (lang == 'zh') {
          msg = '视频已经打开';
        } else if (lang == 'en') {
          msg = 'The video is already open';
        } else if (lang == 'zhtw') {
          msg = '視頻已經打開';
        } else {
          msg = '视频已经打开';
        }
        break;
      }
      case 24: {
        if (lang == 'zh') {
          msg = '视频未打开';
        } else if (lang == 'en') {
          msg = 'Video not open';
        } else if (lang == 'zhtw') {
          msg = '視頻未打開';
        } else {
          msg = '视频未打开';
        }
        break;
      }
      case 25: {
        if (lang == 'zh') {
          msg = 'SessionID被占用';
        } else if (lang == 'en') {
          msg = 'SessionID is occupied';
        } else if (lang == 'zhtw') {
          msg = 'SessionID被占用';
        } else {
          msg = 'SessionID被占用';
        }
        break;
      }
      default: {
        if (lang == 'zh') {
          msg = '未知的错误';
        } else if (lang == 'en') {
          msg = 'Unknown error';
        } else if (lang == 'zhtw') {
          msg = '未知的錯誤';
        } else {
          msg = '未知的错误';
        }
        break;
      }
    }
    return msg;
  },

  getCurDate2Str() {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    const str = `${year}${month}${day}`;
    return str;
  },

  getCurDate2StrBySign(sign) {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    let str = '';
    str = `${year}${sign}${month}${sign}${day}`;
    return str;
  },

  getCurTimeStr() {
    const date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    hour = hour < 10 ? '0' + hour : hour;
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;
    const str = `${hour}${minute}${second}`;
    return str;
  },

  base64ToBlob(urlData) {
    let arr = urlData.split(',');
    let mime = arr[0].match(/:(.*?);/)[1] || 'image/jpeg';
    let bytes = window.atob(arr[1]);
    let ab = new ArrayBuffer(bytes.length);
    let ia = new Uint8Array(ab);

    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }

    return new Blob([ab], {
      type: mime
    });
  },

  piPx() {
    return new Promise(function(resolve, reject) {
      window.onload = function() {
        resolve(BMap);
      };
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.7.1/pixi.min.js';
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },

  init() {
    const self = this;
    const req = window.indexedDB.open('store_db');
    req.onupgradeneeded = e => {
      const db = req.result;
      const obStore = db.createObjectStore('recentstore', { keyPath: 'id' });
      obStore.createIndex('storeId', 'storeId', { unique: false });
      req.result.close();
    };
  },

  add(payload) {
    return new Promise((resolve, reject) => {
      let db = window.indexedDB.open('store_db');
      db.onsuccess = () => {
        db.result.transaction('recentstore', 'readwrite')
          .objectStore('recentstore')
          .add(payload);
      };
      db = e => {
        reject(e);
      };
    });
  },

  get(key) {
    return new Promise((resolve, reject) => {
      let db = window.indexedDB.open('store_db');
      db.onsuccess = () => {
        let req = db.result.transaction('recentstore', 'readonly')
          .objectStore('recentstore').get(key);
        db.result.close();
        req.onsuccess = e => {
          resolve(e.target.result);
        };
        req = err => {
          reject(err);
        };
      };
      db = e => {
        reject(e);
      };
    });
  },

  /**
     * get all month between two date
     * @param start
     * @param end
     * @returns {Array}
     */

  getMonthBetween(start, end) {
    let result = [];
    let s = start.split('-');
    let e = end.split('-');
    let min = new Date();
    let max = new Date();
    min.setFullYear(s[0], s[1]);
    max.setFullYear(e[0], e[1]);
    let curr = min;
    while (curr <= max) {
      let month = curr.getMonth();
      let str = curr.getFullYear() + '-' + (month);
      let s = curr.getFullYear() + '-0';
      if (str == s) {
        str = curr.getFullYear() + '-12';
      }
      result.push(str);
      curr.setMonth(month + 1);
    }
    let arr = [];
    let newArr = [];
    for (let i = 0; i < result.length; i++) {
      arr.push(result[i].split('-'));
    }
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][1] === '12') {
        arr[i][0] = arr[i][0] - 1;
      }
    }
    for (let i = 0; i < arr.length; i++) {
      newArr.push(arr[i][0] + '/' + arr[i][1]);
    }

    for (let i = 0; i < newArr.length; i++) {
      if (newArr[i].length === 6) {
        newArr[i] = newArr[i].slice(0, 5) + '0' + newArr[i].slice(5);
      }
    }
    return newArr;
  },

  /**
     * get the start and end of week between two date
     * @param time
     * @param end
     * @returns {any[]}
     */
  getWeek(time, end) {
    let begin = '';
    begin += time.getFullYear() + '-';
    begin += (time.getMonth() + 1) + '-';
    begin += time.getDate();
    Date.prototype.format = function() {
      const yyyy = this.getFullYear();
      let MM = (this.getMonth() + 1);
      let dd = this.getDate();
      if (MM < 10) {
        MM = '0' + MM;
      }
      if (dd < 10) {
        dd = '0' + dd;
      }
      const s = MM + '/' + dd;
      return (s);
    };
    let dateAllArr = new Array();
    let ab = begin.split('-');
    let ae = end.split('-');
    let db = new Date();
    db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
    let de = new Date();
    de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
    let unixDb = db.getTime();
    let unixDe = de.getTime();
    for (let k = unixDb; k <= unixDe;) {
      dateAllArr.push((new Date(parseInt(k))).format().toString() + '-' + (new Date(parseInt(k + 6 * 24 * 60 * 60 * 1000))).format().toString());
      k = k + 7 * 24 * 60 * 60 * 1000;
    }
    return dateAllArr;
  },

  judgeStart(start) {
    let startTime = new Date(start);
    let oweek = startTime.getDay();
    let mSeconds = startTime.getTime();
    switch (oweek) {
      case 0:
        return mSeconds - 6 * 24 * 60 * 60 * 1000;
        break;
      case 1:
        return mSeconds;
        break;
      case 2:
        return mSeconds - 1 * 24 * 60 * 60 * 1000;
        break;
      case 3:
        return mSeconds - 2 * 24 * 60 * 60 * 1000;
        break;
      case 4:
        return mSeconds - 3 * 24 * 60 * 60 * 1000;
        break;
      case 5:
        return mSeconds - 4 * 24 * 60 * 60 * 1000;
        break;
      case 6:
        return mSeconds - 5 * 24 * 60 * 60 * 1000;
        break;
    }
  },

  isDot(num) {
    let result = (num.toString()).indexOf('.');
    return result !== -1;
  },
  /**
   * The Echarts maximum balance method takes out a set of decimals and sums to 100%
   * @param valueList
   * @param idx
   * @param precision
   * @returns {number}
   */
  getPercentValue(valueList, idx, precision) {
    if (!valueList[idx]) {
      return 0;
    }
    let sum = valueList.reduce(function(acc, val) {
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
    if (sum === 0) {
      return 0;
    }
    let digits = Math.pow(10, precision);
    let votesPerQuota = valueList.map(function(val) {
      return (isNaN(val) ? 0 : val) / sum * digits * 100;
    });
    let targetSeats = digits * 100;
    let seats = votesPerQuota.map(function(votes) {
      return Math.floor(votes);
    });
    let currentSum = seats.reduce(function(acc, val) {
      return acc + val;
    }, 0);
    let remainder = votesPerQuota.map(function(votes, idx) {
      return votes - seats[idx];
    });
    while (currentSum < targetSeats) {
      let max = Number.NEGATIVE_INFINITY;
      let maxId = null;
      for (let i = 0, len = remainder.length; i < len; ++i) {
        if (remainder[i] > max) {
          max = remainder[i];
          maxId = i;
        }
      }
      ++seats[maxId];
      remainder[maxId] = 0;
      ++currentSum;
    }
    return seats[idx] / digits;
  },

  groupArrayOnSize(array, size) {
    const length = array.length;
    if (!length || !size || size < 1) {
      return [];
    }
    let index = 0;
    let resIndex = 0;

    const result = new Array(Math.ceil(length / size));
    while (index < length) {
      result[resIndex++] = array.slice(index, (index += size));
    }
    console.log(result);
    return result;
  },

  notify(msg, type, time) {
    message({
      message: msg,
      type: type,
      duration: time
    });
  },

  getDaysRangeList(startTime, endTime, timeMode){
    console.log(timeMode)
    const startDay = moment(startTime).format('YYYY-MM-DD');
    const endDay = moment(endTime).format('YYYY-MM-DD');
    const startDayWithoutYear = moment(startTime).format('MM/DD');
    const endDayWithoutYear = moment(endTime).format('MM/DD');
    let daysRangeList = [];
    if (timeMode === 1) {
      const beginDay = new Date(this.judgeStart(startDay));
      const weekList = this.getWeek(beginDay, endDay);
      const arrLength = weekList.length;
      const firstEndTime = weekList[0].split('-')[1];
      const firstWeekStr = startDayWithoutYear + '-' + firstEndTime;
      const lastStartTime = weekList[arrLength - 1].split('-')[0];
      const lastWeekStr = lastStartTime + '-' + endDayWithoutYear;
      weekList.splice(0, 1, firstWeekStr);
      weekList.splice(arrLength - 1, 1, lastWeekStr);
      daysRangeList = weekList;
    } else if (timeMode === 2) {
      const monthArray = this.getMonthBetween(startDay, endDay);
      daysRangeList = monthArray;
    }
    return daysRangeList;
  },

  getDiffBetweenArrays(arr1, arr2){
    let result = arr2.filter(number => !arr1.includes(number))
    return result;
  },

  sortArrayByKeyAsc(sortedArray, key){
    sortedArray.sort((a, b) => { return a[key] - b[key]; })
  },

};
class indexedDB {
  init() {
    const self = this;
    const req = window.indexedDB.open('store_db');
    req.onupgradeneeded = e => {
      const db = req.result;
      const obStore = db.createObjectStore('recentstore', { keyPath: 'id' });
      obStore.createIndex('storeId', 'storeId', { unique: false });
      req.result.close();
    };
  }

  add(payload) {
    return new Promise((resolve, reject) => {
      let db = window.indexedDB.open('store_db');
      db.onsuccess = () => {
        db.result.transaction('recentstore', 'readwrite')
          .objectStore('recentstore')
          .add(payload);
      };
      db = e => {
        reject(e);
      };
    });
  }

  get(key) {
    return new Promise((resolve, reject) => {
      let db = window.indexedDB.open('store_db');
      db.onsuccess = () => {
        let req = db.result.transaction('recentstore', 'readonly')
          .objectStore('recentstore').get(key);
        db.result.close();
        req.onsuccess = e => {
          resolve(e.target.result);
        };
        req = err => {
          reject(err);
        };
      };
      db = e => {
        reject(e);
      };
    });
  }
}
export { indexedDB };
