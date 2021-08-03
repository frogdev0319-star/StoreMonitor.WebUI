import { loginByUsername, logout, changeAccount, getUserAuthorities } from '@/api/login';
import { getDashServerInfo } from '@/api/device';
import { getToken, setToken, removeToken, getCookie, setCookie } from '@/common/auth';
import PermissionHelper from '@/api/PermissionHelper';
import router, { resetRouter, constantRoutes, navbarRoute } from '@/router';
import { getUserTitleList } from '@/api/title';

const user = {
  state: {
    user: '',
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
    InspectHistory: null,
    PatrolComment: '',
    videoAuthority: false
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code;
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

    SET_InspectHistory: (state, InspectHistory) => {
      state.InspectHistory = InspectHistory;
    },

    SET_PatrolComment: (state, PatrolComment) => {
      state.PatrolComment = PatrolComment;
    },

    SET_Video_Authority: (state, videoAccess) => {
      state.videoAuthority = videoAccess;
    }

  },
  actions: {
    setPatrolHistory({ commit }, PatrolHistory) {
      commit('SET_PatrolHistory', PatrolHistory);
    },

    setPatrolComment({ commit }, PatrolComment) {
      commit('SET_PatrolComment', PatrolComment);
    },

    setInspectHistory({ commit }, InspectHistory) {
      commit('SET_InspectHistory', InspectHistory);
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
        'password': userInfo.password
      };
      return new Promise((resolve, reject) => {
        loginByUsername(params).then(res => {
          console.log(res);
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
            commit('SET_AUTHORITY', res.data.authorities);
            commit('SET_ROLES', [res.data.title]);
          } else {
            commit('SET_AUTHORITY', []);
            commit('SET_ROLES', []);
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
          accessedRoutes.length === 0 ? patrolRoute.redirect = patrolRoute.children[0].path : '';
          accessedRoutes.push(patrolRoute);

          const eventRoute = navbarRoute.getEventRoute();
          accessedRoutes.push(eventRoute);

          const statisticsRoute = navbarRoute.getStatisticalRoute();
          statisticsRoute.children.length > 0 ? accessedRoutes.push(statisticsRoute) : '';

          const systemSettingRoute = navbarRoute.getSystemSettingRoute();
          systemSettingRoute.children.length > 0 ? accessedRoutes.push(systemSettingRoute) : '';
          accessedRoutes.push({
            'path': '*',
            'redirect': '/',
            'hidden': true
          });
        } else {
          const errorRoute = navbarRoute.getErrorRoute();
          accessedRoutes.push(errorRoute);
          errorRoute.redirect = errorRoute.children[0].path;
        }
        commit('SET_ROUTES', accessedRoutes);
        if (user.state.authorities.length === 6) {
          const videoAccess = !!PermissionHelper.enableVideo();
          commit('SET_Video_Authority', videoAccess);
        }
        resolve(accessedRoutes);
      });
    }
  }
};

export default user;

