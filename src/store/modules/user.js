import { loginByUsername, logout, changeAccount, getUserAuthorities } from '@/api/login';
import { getDashServerInfo } from '@/api/device';
import { getToken, setToken, removeToken, getCookie, setCookie } from '@/common/auth';
import PermissionHelper from '@/api/PermissionHelper';
import { resetRouter, constantRoutes, navbarRoute } from '@/router';
import {isMysteryMode} from  '@/api/mystero'

const user = {
  state: {
    user: '',
    userId:'',
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
    BackPatrolParam:null,
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
    editCount_storeMonitor:0,
    favoriteList:false,
    mimicMode:false,
    isMystery:false,
    editReport:false,
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
    SET_FAVORIT_LIST:(state,favorit)=>{
      state.favoriteList = favorit
    },
    SET_MIMIC_MODE:(state,mode)=>{
      state.mimicMode = mode
    },
    SET_ISMYSTERY:(state,mode)=>{
      console.log("SET_ISMYSTERY:",mode);
      state.isMystery = mode;
    },
    SET_EDIT_REPORT:(state,mode)=>{
      state.editReport = mode;
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
    setMimicMode({ commit }, mode){
      commit('SET_MIMIC_MODE',mode)
    },
    setEditReport({ commit }, mode){
      commit('SET_EDIT_REPORT',mode)
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
        removeToken();
        resetRouter();
        resolve();
      });
    },

    GetUserAuthorities({ commit }) {
      return new Promise((resolve, reject) => {
        getUserAuthorities().then((res) => {
          if (res.data && (!res.data.services || res.data.services.includes('Custom_Inspection'))) {
            console.log('@@@@',res.data.userId);
            commit('SET_AUTHORITY', res.data.authorities);
            commit('SET_ROLES', [res.data.title]);
            commit('SET_ROLE_ID', res.data.roleId);
            commit('SET_USERID',res.data.userId);
          } else {
            commit('SET_AUTHORITY', []);
            commit('SET_ROLES', []);
            commit('SET_ROLE_ID', 0);
            commit('SET_USERID','');
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

    generateRoutes({ commit }) {
      return new Promise(resolve => {
        const accessedRoutes = [];
        if (user.state.authorities.length > 0) {
          PermissionHelper.setData(user.state.authorities);

          const overviewRoute = navbarRoute.getOverviewRoute();
          if (overviewRoute.children.length > 0) {
            overviewRoute.redirect = overviewRoute.children[0].path;
            accessedRoutes.push(overviewRoute);
          }

          const patrolRoute = navbarRoute.getPatrolRoute();
          accessedRoutes.length === 0 ? patrolRoute.redirect = ((patrolRoute.children.length>0)?patrolRoute.children[0].path:'') : '';
          if (patrolRoute.children.length > 0) accessedRoutes.push(patrolRoute);

          const eventRoute = navbarRoute.getEventRoute();
          if (PermissionHelper.enableEventHandle() || PermissionHelper.enableEventClose() || PermissionHelper.enableEventAdd() || PermissionHelper.enableEventReturn()) {
            accessedRoutes.push(eventRoute);
          }

          const statisticsRoute = navbarRoute.getStatisticalRoute();
          if(statisticsRoute.children.length > 0 && !PermissionHelper.enableMimicMode) accessedRoutes.push(statisticsRoute);

          const auditRoute = navbarRoute.getAuditRoute();
          auditRoute.children.length >0 ? accessedRoutes.push(auditRoute):'';

          const systemSettingRoute = navbarRoute.getSystemSettingRoute();
          systemSettingRoute.children.length > 0 ? accessedRoutes.push(systemSettingRoute) : '';
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
    GetIsMysteryMode({ commit }){
      console.log("GetIsMysteryMode");
      return new Promise((resolve, reject) => {
        isMysteryMode().then(res=>{
          console.log("GetIsMysteryMode:",res);
          if(res.errCode==0){
            commit('SET_ISMYSTERY',res.data.isMysteryModeOn);
          }
        });
        resolve(res.data.isMysteryModeOn);
      }).catch(error => {
        reject(error);
      });
    },

  }
};

export default user;

