import { getCookie } from './auth';

export default class SaveSearchConditionUtil {

  static saveSearchCondition(searchConditionObj) {
    const accountId = localStorage.getItem('oss_bucket');
    const userId = getCookie('UserId');
    const key = searchConditionObj.path + '_' + accountId + '_' + userId;
    const parmas = searchConditionObj.params;
    localStorage.setItem(key, JSON.stringify(parmas));
  }

  static clearAll(){
    localStorage.clear();
  }

  static getSearchCondition(path) {
    const accountId = localStorage.getItem('oss_bucket');
    const userId = getCookie('UserId');
    const key = path + '_' + accountId + '_' + userId;
    let tempParams = {};
    if (localStorage.getItem(key)) {
      tempParams = JSON.parse(localStorage.getItem(key));
    }
    return tempParams;
  }

  static deleteSearchCondition(searchConditionObj) {
    const accountId = localStorage.getItem('oss_bucket');
    const userId = getCookie('UserId');
    const key = searchConditionObj.path + '_' + accountId + '_' + userId;
    localStorage.removeItem(key)
  }




}
