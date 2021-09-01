import ConvertPinyin from '@/common/getpinyin';
import i18n from '@/lang/index';
import { message } from '@/common/singleton-message';
import moment from 'moment';
import { getCookie } from './auth';

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

  getVideoAuthority(num){
    const auth = parseInt(getCookie('deviceAuth'));
    if(num === 0) return 0;
    return ((auth & (1 << num -1)) >> (num-1)) === 1 ? 1 : 0;
  },

  getIntersectionOfArrs(arr1, arr2) {
    const arr2Set = new Set(arr2);
    const intersection = arr1.filter(item => arr2Set.has(item));
    return intersection;
  },

  formDatetime(cellValue) {
    if (cellValue === undefined) {
      return '';
    }
    return moment(cellValue).format('HH:mm:ss');
  },

  validateLicense(status) {
    if (![20, 21, 60].includes(status)) {
      this.notify(i18n.t('deviceView.licenseOverdue'), 'warning', 3000);
      return false;
    } else {
      return true;
    }
  },

  setErrorMsg(msg, addOrUpdateFlag) {
    let displayedMsg = '';
    const msgMap = [
      { ret: 'moreThanAuthorizedDevices', match: ['exceeds the limit'] },
      { ret: 'deviceExist', match: ['Device already existed'] },
      { ret: 'multipleAccOnSameStore', match: ['Multiple accounts'] },
      { ret: 'getAccessTokenError', match: ['Ezviz access token'] },
      { ret: 'duplicateSeriNum', match: ['Duplicate device serial'] },
      { ret: 'storeNotExist', match: ['Store does not exist'] },
      { ret: 'noAuthorityForStore', match: ['No authority'] },
      { ret: 'illegalSeriNum', match: ['deviceSerial']},
      { ret: 'videoLicenseOverdue', match: ['Device License overdue']},
      { ret: 'hasBoundItem', match: ['binding to item']},
      { ret: 'hasAdded', match: ['设备已被别人添加']}
    ];
    const result = msgMap.find(item => item.match.some(matchItem => msg.indexOf(matchItem) > -1));
    if (!result) {
      displayedMsg = addOrUpdateFlag ? i18n.t('deviceView.addFailed') : i18n.t('deviceView.editFail');
    } else {
      displayedMsg = i18n.t(`deviceView.${result.ret}`);
    }
    this.notify(displayedMsg, 'warning', 3000);
    return displayedMsg;
  },

  isDouble(num, n = 1) {
    const y = String(num).indexOf('.') + 1;
    return y > 0 ? parseFloat(parseFloat(num).toFixed(n)) : parseInt(num);
  }

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
