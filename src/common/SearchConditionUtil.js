import {getCookie} from "./auth";

export default class SaveSearchConditionUtil{

  static saveSearchCondition(searchConditionObj) {
    let accountId = localStorage.getItem('oss_bucket');
    let userId = getCookie('UserId');
    let key = searchConditionObj.path + '_' + accountId + '_' + userId;
    const parmas = searchConditionObj.params;
    localStorage.setItem(key, JSON.stringify(parmas));
  }

  static getSearchCondition(path) {
    let self = this;
    let accountId = localStorage.getItem('oss_bucket');
    let userId = getCookie('UserId');
    let key = path + '_' + accountId + '_' + userId;
    let tempParams = {};
    if ( localStorage.getItem(key) != null || localStorage.getItem(key) != undefined ) {
      tempParams = JSON.parse(localStorage.getItem(key));
    }
    return tempParams;
  }
}
