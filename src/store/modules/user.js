import { loginByUsername, logout, changeAccount, getUserAuthorities } from '@/api/login';
import { getDashServerInfo } from '@/api/device';
import { getToken, setToken, removeToken, getCookie, setCookie } from '@/common/auth';
import PermissionHelper from '@/api/PermissionHelper';
import { resetRouter, constantRoutes, navbarRoute } from '@/router';
import { isMysteryMode } from '@/api/mystero';
import { getWhiteList } from '@/api/scheduleTask';
import { getInspectStatus } from '@/api/inspect';

const user = {
  state: {
    user: '',
    userId: '',
    status: '',
    code: '',
    token: getToken(),
    dashurl: sessionStorage.getItem('DASH_URL'),
    cancel: null,
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    },
    accountChanged: 0,
    accountId: '',
    cachePath: [''],
    isEzviz: getCookie('isEzviz') ? JSON.parse(getCookie('isEzviz')) : false,
    authorities: [],
    routes: [],
    addRoutes: [],
    PatrolHistory: null,
    BackPatrolParam: null,
    InspectHistory: null,
    PatrolComment: '',
    videoAuthority: false,
    roleId: 0,
    availabePathList: [],
    collapsed: false,
    templateOptions: [],
    curTemplateIndex: -1,
    storeCache: null,
    storeListCache: [],
    editCount: 0,
    editCount_storeMonitor: 0,
    favoriteList: false,
    mimicMode: false,
    isMystery: false,
    editReport: false,
    whiteList: [],
    nfc_checkin: false,

    advancedSettingMode: false,
    advancedSettingStatus: false

  },

  mutations: {
    SET_CUR_TEMPLATE_INDEX: (state, index) => {
      state.curTemplateIndex = index
    },
    SET_STORE_CACHE: (state, store) => {
      state.storeCache = store
    },
    SET_TEMPLATE_OPTIONS: (state, options) => {
      state.templateOptions = options
    },
    SET_COLLAPSED: (state, collapsed) => {
      state.collapsed = collapsed
    },
    SET_CODE: (state, code) => {
      state.code = code;
    },
    SET_USERID: (state, userId) => {
      state.userId = userId;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },

    SET_DASHURL: (state, dashurl) => {
      state.dashurl = dashurl;
    },

    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction;
    },

    SET_SETTING: (state, setting) => {
      state.setting = setting;
    },

    SET_STATUS: (state, status) => {
      state.status = status;
    },

    SET_NAME: (state, name) => {
      state.name = name;
    },

    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },

    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },

    Account_Changed: (state, accountChanged) => {
      state.accountChanged = accountChanged;
    },

    SET_ACCOUNTID: (state, accountId) => {
      state.accountId = accountId;
    },

    SET_WHITE_LIST: (state, mode) => {
      state.whiteList = mode;
      console.log('SET_WHITE_LIST', mode)
    },

    NFC_CHECKIN: (state, mode) => {
      state.nfc_checkin = mode;
    },

    newCachePath(state, msg) {
      state.cachePath = msg;
    },

    SET_ISEZVIZ: (state, isEzviz) => {
      state.isEzviz = isEzviz;
    },
    SET_AUTHORITY: (state, authorities) => {
      state.authorities = authorities;
    },

    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes;
      state.routes = constantRoutes.concat(routes);
    },

    SET_PatrolHistory: (state, PatrolHistory) => {
      state.PatrolHistory = PatrolHistory;
    },

    SET_BackPatrolParam: (state, BackPatrolParam) => {
      state.BackPatrolParam = BackPatrolParam;
    },

    SET_InspectHistory: (state, InspectHistory) => {
      state.InspectHistory = InspectHistory;
    },

    SET_PatrolComment: (state, PatrolComment) => {
      state.PatrolComment = PatrolComment;
    },

    SET_Video_Authority: (state, videoAccess) => {
      state.videoAuthority = videoAccess;
    },

    SET_ROLE_ID: (state, roleId) => {
      state.roleId = roleId;
    },

    SET_Available_Path_List: (state, pathList) => {
      state.availabePathList = pathList;
    },
    SET_STORELIST: (state, storeList) => {
      state.storeListCache = storeList
    },
    SET_EDIT_COUNT: (state, count) => {
      state.editCount = count
    },
    SET_EDIT_COUNT: (state, count) => {
      state.editCount = count
    },
    SET_EDIT_COUNT_StoreMonitor: (state, count) => {
      state.editCount = count
    },
    SET_FAVORIT_LIST: (state, favorit) => {
      state.favoriteList = favorit
    },
    SET_MIMIC_MODE: (state, mode) => {
      state.mimicMode = mode
    },
    SET_ISMYSTERY: (state, mode) => {
      state.isMystery = mode;
    },
    SET_EDIT_REPORT: (state, mode) => {
      state.editReport = mode;
    },
    SET_WHITE_LIST: (state, mode) => {
      state.whiteList = mode;
    },

    SET_ADVANCED_SETTING_MODE: (state, mode) => {
      state.advancedSettingMode = mode
    },
    SET_ADVANCED_SETTING: (state, mode) => {
      state.advancedSettingStatus = mode;
    },

  },

  actions: {
    setEditCount({ commit }, count) {
      commit('SET_EDIT_COUNT', count);
    },
    setEditCountStoreMonitor({ commit }, count) {
      commit('SET_EDIT_COUNT_StoreMonitor', count);
    },
    setFavoritList({ commit }, favorit) {
      commit('SET_FAVORIT_LIST', favorit);
    },
    setStoreList({ commit }, storeList) {
      commit('SET_STORELIST', storeList);
    },
    setPatrolHistory({ commit }, PatrolHistory) {
      commit('SET_PatrolHistory', PatrolHistory);
    },
    setBackPatrolParam({ commit }, BackPatrolParam) {
      commit('SET_BackPatrolParam', BackPatrolParam);
    },
    setPatrolComment({ commit }, PatrolComment) {
      console.log("@@setPatrolComment:", PatrolComment);
      commit('SET_PatrolComment', PatrolComment);
    },

    setInspectHistory({ commit }, InspectHistory) {
      commit('SET_InspectHistory', InspectHistory);
    },
    setCollapsed({ commit }, collapsed) {
      commit('SET_COLLAPSED', collapsed);
    },
    setTemplateOptions({ commit }, options) {
      commit('SET_TEMPLATE_OPTIONS', options);
    },
    setCurTemplateIndex({ commit }, index) {
      commit('SET_CUR_TEMPLATE_INDEX', index);
    },
    setStoreCache({ commit }, store) {
      commit('SET_STORE_CACHE', store);
    },
    setEditReport({ commit }, mode) {
      commit('SET_EDIT_REPORT', mode)
    },
    setMimicMode({ commit }, mode) {
      commit('SET_MIMIC_MODE', mode)
    },
    setAdvancedSettingMode({ commit }, mode) {
      commit('SET_ADVANCED_SETTING_MODE', mode)
    },



    GetDash({ commit }) {
      return new Promise((resolve, reject) => {
        getDashServerInfo().then(res => {
          if (res.data) {
            const dash = res.data;
            let dataPort = '';
            let url = '';
            if (dash.url.indexOf('https') != -1) {
              dataPort = dash.httpsCmdPort;
            } else {
              dataPort = dash.httpCmdPort;
            }
            url = dash.url + ':' + dataPort;
            commit('SET_DASHURL', url);
            sessionStorage.setItem('DASH_URL', url);
          }
          resolve(res);
        });
      });
    },

    changeAccount({ commit }, params) {
      return new Promise((resolve, reject) => {
        changeAccount(params).then(res => {
          if (res.errCode === 0) {
            commit('Account_Changed', ++user.state.accountChanged);
            // commit('SET_ACCOUNTID',params.)
            const accountId = params.accountId.toLowerCase();
            localStorage.setItem('oss_bucket', accountId);
            commit('SET_ACCOUNTID', accountId);
            if (res.data.ezvizProtocol) {
              commit('SET_ISEZVIZ', true);
              setCookie('isEzviz', true);
            } else {
              commit('SET_ISEZVIZ', false);
              setCookie('isEzviz', false);
            }
            setCookie('deviceAuth', res.data.deviceAuth);
          } else {
            commit('Account_Changed', 0);
          }
          resolve(res);
        });
      });
    },

    GetWhiteList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getWhiteList(params).then(res => {
          const data = res.data;
          console.log('GetWhiteList data :>> ', data);
          if (res.data) {
            commit('SET_WHITE_LIST', res.data);
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        });;
      });
    },

    GetEpaperNfcCheckin({ commit }) {
      return new Promise((resolve, reject) => {
        getInspectStatus().then(res => {
          const data = res.data
          if (res.data) {
            commit('NFC_CHECKIN', data.settingContent.general_setting.nfc_checkin);
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        });;
      });
    },

    LoginByUser({ commit }, userInfo) {
      const username = userInfo.username.trim();
      const params = {
        'email': username,
        'password': userInfo.password,
        'lang': userInfo.lang
      };
      return new Promise((resolve, reject) => {
        loginByUsername(params).then(res => {
          // console.log(res);
          const data = res.data;
          if (res.data) {

            commit('SET_TOKEN', data.token);
            setToken(data.token);
          }
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          removeToken();
          resetRouter();
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        localStorage.clear();
        removeToken();
        resetRouter();
        resolve();
      });
    },

    GetUserAuthorities({ commit }) {
      return new Promise((resolve, reject) => {
        getUserAuthorities().then((res) => {
          // console.log('res.data @@@@', res.data);
          // console.log('@@@@ accountId',res.data.accountId);

          var brandList = JSON.parse(sessionStorage.getItem("brandList"));
          // console.log('@@@@ brandList :>> ', brandList);

          var existenceBrand = brandList.some(i => i.accountId == res.data.accountId)
          // console.log('@@@@ existenceBrand :>> ', existenceBrand);

          if (res.data && (!res.data.services || res.data.services.includes('custom_iqm_inspection')) && existenceBrand) {
            commit('SET_AUTHORITY', res.data.authorities);
            commit('SET_ROLES', [res.data.title]);
            commit('SET_ROLE_ID', res.data.roleId);
            commit('SET_USERID', res.data.userId);
            commit('SET_ACCOUNTID', res.data.accountId)
            commit('SET_ADVANCED_SETTING', res.data.isSystemAdvanced)
          } else {
            commit('SET_AUTHORITY', []);
            commit('SET_ROLES', []);
            commit('SET_ROLE_ID', 0);
            commit('SET_USERID', '');
          }
          resolve(res);
        }).catch(error => {
          reject(error);
        });
      });
    },

    resetToken({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        removeToken();
        resolve();
      });
    },

    async generateRoutes({ commit, dispatch }) {
      return new Promise(async (resolve, reject) => {
        const accessedRoutes = [];
        // 確保先載入 nfc_checkin 狀態，避免非同步問題
        await dispatch('GetEpaperNfcCheckin');
        console.log("user.state.authorities:~~~>>>", user.state.authorities);
        // console.log("user.state:~~~>>>",user.state);

        if (user.state.authorities.length > 0) {


          PermissionHelper.setData(user.state.authorities);

          // 總覽
          const overviewRoute = navbarRoute.getOverviewRoute();
          if (overviewRoute.children.length > 0) {
            overviewRoute.redirect = overviewRoute.children[0].path;
            accessedRoutes.push(overviewRoute);
          }

          // 巡檢管理
          const patrolRoute = navbarRoute.getPatrolRoute();
          accessedRoutes.length === 0 ? patrolRoute.redirect = ((patrolRoute.children.length > 0) ? patrolRoute.children[0].path : '') : '';
          if (patrolRoute.children.length > 0) accessedRoutes.push(patrolRoute);

          // 事件管理
          const eventRoute = navbarRoute.getEventRoute();
          if (PermissionHelper.enableEventHandle() || PermissionHelper.enableEventClose() || PermissionHelper.enableEventAdd() || PermissionHelper.enableEventReturn()) {
            accessedRoutes.push(eventRoute);
          }


          // 統計分析
          const statisticsRoute = navbarRoute.getStatisticalRoute();
          if (statisticsRoute.children.length > 0 && !PermissionHelper.enableMimicMode) accessedRoutes.push(statisticsRoute);

          // 簽合管理
          const auditRoute = navbarRoute.getAuditRoute();
          (auditRoute.children.length > 0 && accessedRoutes.findIndex(item => item.name == auditRoute.name) == -1) ? accessedRoutes.push(auditRoute) : '';

          // 巡檢排程
          // ==== 依據白名單設定顯示&隱藏 ====
          getWhiteList().then(res => {
            const data = res.data;
            if (res.data) {
              resolve(res);
              commit('SET_WHITE_LIST', res.data);
            }
          }).catch(err => {
            reject(err);
          });
          const whiteList = user.state.whiteList
          const accountId = user.state.accountId
          // console.log('whiteList!!!!!!!!!!!!!!!!!!!!', whiteList)
          // console.log('accountId !!!!!!!!!!!!!!!!!!!!', user.state.accountId)
          var isShowing = whiteList.some(i => i == accountId)
          // console.log('isShowing !!!!!!', isShowing)
          if (isShowing) {
            const scheduleRoute = navbarRoute.getInceptionSchedule();
            (scheduleRoute.children.length > 0 && accessedRoutes.findIndex(item => item.name == scheduleRoute.name) == -1) ? accessedRoutes.push(scheduleRoute) : '';
          }


          const roleId = user.state.roleId
          // console.log('roleId !!!!!!>> ', roleId);
          // 報告與事件
          if (roleId === 1) {
            const reportAndEventRoute = navbarRoute.getReportAndEvent();
            if (reportAndEventRoute.children.length > 0 && !PermissionHelper.enableMimicMode) accessedRoutes.push(reportAndEventRoute);
          }

          // 下載管理
          const downloadManagemenRoute = navbarRoute.getDownloadManagement();
          downloadManagemenRoute.children.length > 0 ? accessedRoutes.push(downloadManagemenRoute) : '';


          // 系統設定
          const systemSettingRoute = navbarRoute.getSystemSettingRoute();
          systemSettingRoute.children.length > 0 ? accessedRoutes.push(systemSettingRoute) : '';


          // epaper
          console.log('user.state.nfc_checkin :>> ', user.state.nfc_checkin);

          // NFC 功能開啟, nfc_checkin:true
          if (user.state.nfc_checkin) {
            const epaperRoute = navbarRoute.getEpaper();
            accessedRoutes.length === 0 ? epaperRoute.redirect = ((epaperRoute.children.length > 0) ? epaperRoute.children[0].path : '') : '';
            if (epaperRoute.children.length > 0) accessedRoutes.push(epaperRoute);
          }



          // 進階設定
          const advancedSettingStatus = sessionStorage.getItem("advancedSettingStatus")
          const advancedSettingMode = sessionStorage.getItem("advancedSettingMode")
          // console.log('-------{o..o}-------', advancedSettingStatus , advancedSettingMode)

          if (advancedSettingStatus && advancedSettingMode) {

            PermissionHelper.setAdvancedModeMode(advancedSettingMode);
            const advanceSettingRoute = navbarRoute.getAdvanceSetting();
            advanceSettingRoute.children.length > 0 ? accessedRoutes.push(advanceSettingRoute) : '';

            const instantPushRoute = navbarRoute.getInstantPush();
            instantPushRoute.children.length > 0 ? accessedRoutes.push(instantPushRoute) : '';
          }

          // console.log("accessedRoutes.length !?!?!?:",accessedRoutes.length);
          // console.log('accessedRoutes :>> ', accessedRoutes)

          if (accessedRoutes.length == 0) {
            const errorRoute = navbarRoute.getErrorRoute();
            if (accessedRoutes.findIndex(item => item.name == errorRoute.name) == -1) accessedRoutes.push(errorRoute);
            console.log("errorRoute.children[0].path:", errorRoute.children[0].path);
            errorRoute.redirect = errorRoute.children[0].path;
          }

        } else {
          const errorRoute = navbarRoute.getErrorRoute();
          accessedRoutes.push(errorRoute);
          errorRoute.redirect = errorRoute.children[0].path;
        }

        commit('SET_ROUTES', accessedRoutes);
        commit('SET_Available_Path_List', navbarRoute.getAvailablePath());
        if (user.state.authorities.length >= 6) {
          const videoAccess = !!PermissionHelper.enableVideo();
          commit('SET_Video_Authority', videoAccess);
        }
        resolve(accessedRoutes);
      });

    },

    GetIsMysteryMode({ commit }) {
      return new Promise((resolve, reject) => {
        isMysteryMode().then(res => {
          // console.log("GetIsMysteryMode:", res);
          if (res.errCode == 0) {
            commit('SET_ISMYSTERY', res.data.isMysteryModeOn);
          }
        });
        resolve(res.data.isMysteryModeOn);
      }).catch(error => {
        // reject(error);
      });
    },




  }
};

export default user;
